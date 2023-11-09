import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import tailwind from "./tailwind.css";
import { DefaultLayout } from "./layouts/default";

// export const meta: MetaFunction = () => ({
//   charset: "utf-8",
//   title: "New Remix App",
//   viewport: "width=device-width,initial-scale=1",
// });

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <DefaultLayout>
          <Outlet />
        </DefaultLayout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
