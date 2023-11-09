import type { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import { ContentedProvider } from "cms-client";
import tailwind from "./tailwind.css";
import { cms } from "./utils/cms";
import Layout from "./layouts/default";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          defer
          data-domain="dsmedia.ca"
          data-api="/api/event"
          src="/tracker.js"
        ></script>
      </head>
      <body className="bg-slate-900 text-slate-200">
        <ContentedProvider cms={cms}>
          <Layout>
            <Outlet />
          </Layout>
        </ContentedProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>
          {isRouteErrorResponse(error)
            ? `${error.status} ${error.statusText}`
            : error instanceof Error
            ? error.message
            : "Unknown Error"}
        </h1>
        <Scripts />
      </body>
    </html>
  );
}
