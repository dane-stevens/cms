import { DataFunctionArgs } from "@remix-run/cloudflare";

export const action = async ({ request }: DataFunctionArgs) => {
  const nextRequest = new Request(request);
  request.headers.delete("cookie");
  await fetch("http://localhost:5909/api/event", new Request(request));
  return new Response("OK");
};
