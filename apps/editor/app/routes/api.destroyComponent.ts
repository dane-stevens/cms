import { DataFunctionArgs, json } from "@remix-run/node";
import { and, eq } from "drizzle-orm";
import { blocks } from "database";
import { db } from "~/utils/drizzle.server";
import { client } from "~/utils/redis.server";

export const action = async ({ request }: DataFunctionArgs) => {
  try {
    const tenant = "skr5pte9guegsgk2u7bw92uq";
    const formData = await request.formData();
    const data = JSON.parse(formData.get("data") + "");

    // const pageId = `tenent:${tenent}:page:${data.page}`;

    // const redisDataPath = `$.${data.dataPath}`;

    // const [checkId] = await client.json.get(pageId, {
    //   path: `${redisDataPath}.id`,
    // });

    // if (checkId === data.id) {
    //   await client.json.forget(pageId, redisDataPath);
    //   return json({ success: true });

    // }
    console.log("DESTROY COMPONENT", data);
    await db
      .delete(blocks)
      .where(and(eq(blocks.tenantId, tenant), eq(blocks.id, data.id)));

    return json({ success: false });
  } catch (err) {
    console.log(err);
    return null;
  }
};
