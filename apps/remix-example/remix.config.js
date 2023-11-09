/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  tailwind: true,
  serverModuleFormat: "esm",
  dev: {
    port: 8003,
  },
  watchPaths: ["../../packages/cms-client"],
  serverDependenciesToBundle: ["cms-client"],
};
