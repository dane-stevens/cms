import { ActionArgs, json } from "@remix-run/node";
import { client } from "~/utils/redis.server";

export const action = async ({ request }: ActionArgs) => {
  try {
    const tenent = "skr5pte9guegsgk2u7bw92uq";
    const formData = await request.formData();
    const data = JSON.parse(formData.get("data") + "");

    const pageId = `tenent:${tenent}:page:${data.page}`;

    const redisDataPath = `$.${data.dataPath}`;

    const [checkId] = await client.json.get(pageId, {
      path: `${redisDataPath}.id`,
    });

    if (checkId === data.id) {
      await client.json.forget(pageId, redisDataPath);
      return json({ success: true });
    }
    return json({ success: false });
  } catch (err) {
    console.log(err);
    return null;
  }
};
