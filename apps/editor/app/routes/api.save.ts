import { DataFunctionArgs, json } from "@remix-run/node";
import { blocks } from "database";
import { authenticateApiKey } from "~/utils/authenticate.server";
import { db } from "~/utils/drizzle.server";
import { client } from "~/utils/redis.server";

export const action = async ({ request }: DataFunctionArgs) => {
  // await client.set(
  //   "apiKey:pk_skr5pte9guegsgk2u7bw92uq",
  //   "skr5pte9guegsgk2u7bw92uq"
  // );
  // await client.set(
  //   "apiKey:sk_skr5pte9guegsgk2u7bw92uq",
  //   "skr5pte9guegsgk2u7bw92uq"
  // );

  // const tenant = await authenticateApiKey(request, "secret");
  const tenant = "skr5pte9guegsgk2u7bw92uq";

  const data = await request.json();

  await db.insert(blocks).values({
    id: data.component.id,
    data: data.component.data,
    parentId: data.parentId,
    pageId: data.pageId,
    component: data.component.component,
    sort: data.sort,
    tenantId: tenant,
  });

  // await client.set(
  //   `tenent:${tenent}:component:${data.name}`,
  //   JSON.stringify(data)
  // );
  // await client.sAdd(
  //   `tenent:${tenent}:components`,
  //   `tenent:${tenent}:component:${data.name}`
  // );

  return json({ test: "" });
};
