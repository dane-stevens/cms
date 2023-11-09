/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import * as schema from 'database';

import { connect } from '@planetscale/database';

import { blocks, localizations, pages, tenants, apiKeys } from 'database';

import { and, eq, inArray, isNull, or } from 'drizzle-orm';

export interface Env {
	DATABASE_HOST: string;
	DATABASE_USERNAME: string;
	DATABASE_PASSWORD: string;
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		// create the connection
		const connection = connect({
			host: env.DATABASE_HOST,
			username: env.DATABASE_USERNAME,
			password: env.DATABASE_PASSWORD,
			fetch: (opts, init) => {
				if (init) delete init['cache'];
				return fetch(new Request(opts, init));
			},
		});

		const db = drizzle(connection, { schema });

		const url = new URL(request.url);
		const searchParams = url.searchParams;

		const publicApiKey = request.headers.get('authorization')?.replace('Bearer ', '');

		const { tenantId } =
			(await db.query.apiKeys.findFirst({ where: and(eq(apiKeys.key, String(publicApiKey)), eq(apiKeys.type, 'public')) })) || {};

		if (!tenantId)
			throw new Response(null, {
				status: 401,
				statusText: 'Unauthorized',
			});

		const res = await db.query.tenants.findFirst({
			with: {
				pages: {
					where: eq(pages.url, String(searchParams.get('url'))),
					with: {
						blocks: {
							with: {
								localizations: {
									where: eq(localizations.locale, 'fr'),
								},
							},
							orderBy: (blocks, { asc }) => [asc(blocks.sort)],
						},
					},
				},
			},
			where: eq(tenants.id, tenantId),
		});

		if (!res?.isActive)
			throw new Response(null, {
				status: 404,
				statusText: 'Not Found',
			});
		if (!res?.pages || res.pages.length < 1) {
			throw new Response(null, {
				status: 404,
				statusText: 'Not Found',
			});
		}

		const page = res.pages[0];

		const baseBlocks = page.blocks;

		const customBlocks = new Set<string>();
		baseBlocks.map((block) => block.blockId && customBlocks.add(block.blockId));

		const customBlocksRes = customBlocks.values.length
			? await db.query.blocks.findMany({
					with: {
						localizations: {
							where: eq(localizations.locale, 'fr'),
						},
					},
					where: and(
						or(inArray(blocks.id, Array.from(customBlocks)), inArray(blocks.blockId, Array.from(customBlocks))),
						isNull(blocks.pageId),
					),
			  })
			: null;

		const allBlocks = baseBlocks;

		const parents: any = [];
		const customBlockParents: any = [];
		// Get parents
		const blocksToRemove: number[] = [];
		allBlocks.map((block, i) => {
			if (!block.parentId) {
				blocksToRemove.push(i);
				const { parentId, pageId, ...rest } = block;
				return parents.push(rest);
			}
			return;
		});

		blocksToRemove?.reverse()?.map((blockIndex) => allBlocks.splice(blockIndex, 1));

		const customBlocksToRemove: number[] = [];
		customBlocksRes?.map((block, i) => {
			if (!block.parentId) {
				customBlocksToRemove.push(i);
				const { parentId, pageId, ...rest } = block;
				return customBlockParents.push(rest);
			}
		});
		customBlocksToRemove?.reverse()?.map((blockIndex) => customBlocksRes?.splice(blockIndex, 1));

		function parseCustomBlocks(parents: any[]) {
			parents.map((block, i) => {
				const children = getChildrenCustom(block.id);
				if (children?.length > 0) {
					block.children = children;
					return parseCustomBlocks(block.children);
				}
				return null;
			});
		}

		parseCustomBlocks(customBlockParents);

		parseParents(parents);

		function parseParents(parents: any[]) {
			parents.map((block, i) => {
				const customBlock = block.blockId && customBlockParents.find((customBlock: any) => customBlock.id === block.blockId);
				if (customBlock) block.custom = customBlock;
				const children = getChildren(block.id);

				if (children?.length > 0) {
					block.children = children;
					return parseParents(block.children);
				}
				return null;
			});
		}

		// parents.map((block, i) => {
		//   const children = getChildren(block.id);
		//   if (children) {
		//     parents[i].children = children;
		//   }
		// });

		function getChildrenCustom(parentId: string) {
			const children: any = [];
			const indexesToRemove: number[] = [];
			customBlocksRes?.map((child, i) => {
				if (child.parentId === parentId) {
					const { parentId, pageId, ...rest } = child;
					children.push(rest);
					indexesToRemove.push(i);
				}
			});

			indexesToRemove?.reverse()?.map((blockIndex) => customBlocksRes?.splice(blockIndex, 1));

			return children;
		}

		function getChildren(parentId: string) {
			const children: any = [];
			const indexesToRemove: number[] = [];
			allBlocks.map((child, i) => {
				if (child.parentId === parentId) {
					const { parentId, pageId, ...rest } = child;
					children.push(rest);
					indexesToRemove.push(i);
				}
			});

			indexesToRemove?.reverse()?.map((blockIndex) => allBlocks.splice(blockIndex, 1));

			return children;
		}
		return new Response(
			JSON.stringify({
				pageData: {
					id: page.id,
					title: page.title,
					description: page.description,
					children: parents,
				},
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
	},
};
