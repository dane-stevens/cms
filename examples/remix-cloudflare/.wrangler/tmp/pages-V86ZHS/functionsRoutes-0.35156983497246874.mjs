import { onRequest as ____path___js_onRequest } from "/home/skyf4ll/Documents/Websites/CMS/cms/examples/remix-cloudflare/functions/[[path]].js"

export const routes = [
    {
      routePath: "/:path*",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [____path___js_onRequest],
    },
  ]