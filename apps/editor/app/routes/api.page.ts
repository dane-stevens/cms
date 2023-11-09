import { DataFunctionArgs, json } from "@remix-run/node";
import { and, eq, inArray, isNull, or } from "drizzle-orm";
import { blocks, localizations, pages, tenants } from "database";

import { db } from "~/utils/drizzle.server";

export const loader = async ({ request }: DataFunctionArgs) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  // const [page] = await db.select().from(pages).where(eq(pages.url, "/test"));
  // const allBlocks = await db
  //   .select()
  //   .from(blocks)
  //   .where(eq(blocks.pageId, page.id));

  const res = await db.query.tenants.findFirst({
    with: {
      pages: {
        where: eq(pages.url, searchParams.get("url")),
        with: {
          blocks: {
            with: {
              localizations: {
                where: eq(localizations.locale, "fr"),
              },
            },
            orderBy: (blocks, { asc }) => [asc(blocks.sort)],
          },
        },
      },
    },
    where: eq(tenants.id, "skr5pte9guegsgk2u7bw92uq"),
  });

  if (!res?.isActive)
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  if (!res?.pages || res.pages.length < 1) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
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
            where: eq(localizations.locale, "fr"),
          },
        },
        where: and(
          or(
            inArray(blocks.id, Array.from(customBlocks)),
            inArray(blocks.blockId, Array.from(customBlocks))
          ),
          isNull(blocks.pageId)
        ),
      })
    : null;

  const allBlocks = baseBlocks;

  const parents = [];
  const customBlockParents = [];
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

  blocksToRemove
    ?.reverse()
    ?.map((blockIndex) => allBlocks.splice(blockIndex, 1));

  const customBlocksToRemove: number[] = [];
  customBlocksRes?.map((block, i) => {
    if (!block.parentId) {
      customBlocksToRemove.push(i);
      const { parentId, pageId, ...rest } = block;
      return customBlockParents.push(rest);
    }
  });
  customBlocksToRemove
    ?.reverse()
    ?.map((blockIndex) => customBlocksRes?.splice(blockIndex, 1));

  function parseCustomBlocks(parents) {
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

  function parseParents(parents) {
    parents.map((block, i) => {
      const customBlock =
        block.blockId &&
        customBlockParents.find(
          (customBlock) => customBlock.id === block.blockId
        );
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

  function getChildrenCustom(parentId) {
    const children = [];
    const indexesToRemove: number[] = [];
    customBlocksRes.map((child, i) => {
      if (child.parentId === parentId) {
        const { parentId, pageId, ...rest } = child;
        children.push(rest);
        indexesToRemove.push(i);
      }
    });

    indexesToRemove
      ?.reverse()
      ?.map((blockIndex) => customBlocksRes?.splice(blockIndex, 1));

    return children;
  }

  function getChildren(parentId) {
    const children = [];
    const indexesToRemove: number[] = [];
    allBlocks.map((child, i) => {
      if (child.parentId === parentId) {
        const { parentId, pageId, ...rest } = child;
        children.push(rest);
        indexesToRemove.push(i);
      }
    });

    indexesToRemove
      ?.reverse()
      ?.map((blockIndex) => allBlocks.splice(blockIndex, 1));

    return children;
  }
  return json({
    pageData: {
      id: page.id,
      title: page.title,
      description: page.description,
      children: parents,
    },
  });
};

// export default function TestPage() {
//   const data = useLoaderData<typeof loader>();
//   return (
//     <div>
//       <Syntax>{data}</Syntax>
//     </div>
//   );
// }
