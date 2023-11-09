import { json, LoaderArgs } from "@remix-run/node";
import { authenticateApiKey } from "~/utils/authenticate.server";
import { client } from "~/utils/redis.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const tenent = await authenticateApiKey(request, "secret");
  const page = url.searchParams.get("page");

  if (!page) return json({ error: "Invalid page request", code: 404 });
  const pageData = await client.json.get(`tenent:${tenent}:page:${page}`);

  return json({ pageData });
};
