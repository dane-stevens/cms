import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { ContentedProvider } from "cms-client";
import tailwind from "./tailwind.css";
import { cms } from "./utils/cms";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <script
          defer
          data-domain="twomomsandamop.ca"
          data-api="/events/api/event"
          src="/tracker.js"
        ></script>
      </head>
      <body>
        <ContentedProvider cms={cms}>
          <Outlet />
        </ContentedProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
