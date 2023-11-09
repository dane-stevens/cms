				import worker, * as OTHER_EXPORTS from "/home/skyf4ll/Documents/Websites/CMS/cms/examples/remix-cloudflare/.wrangler/tmp/pages-ZmqfK3/cafbrg24jpq.js";
				import * as __MIDDLEWARE_0__ from "/home/skyf4ll/Documents/Websites/CMS/cms/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts";
				const envWrappers = [__MIDDLEWARE_0__.wrap].filter(Boolean);
				const facade = {
					...worker,
					envWrappers,
					middleware: [
						__MIDDLEWARE_0__.default,
            ...(worker.middleware ? worker.middleware : []),
					].filter(Boolean)
				}
				export * from "/home/skyf4ll/Documents/Websites/CMS/cms/examples/remix-cloudflare/.wrangler/tmp/pages-ZmqfK3/cafbrg24jpq.js";

				const maskDurableObjectDefinition = (cls) =>
					class extends cls {
						constructor(state, env) {
							let wrappedEnv = env
							for (const wrapFn of envWrappers) {
								wrappedEnv = wrapFn(wrappedEnv)
							}
							super(state, wrappedEnv);
						}
					};
				

				export default facade;