import { ActionArgs, json } from "@remix-run/node";
import { authenticateApiKey } from "~/utils/authenticate.server";
import { client } from "~/utils/redis.server";

export const action = async ({ request }: ActionArgs) => {
  // await client.set(
  //   "apiKey:pk_skr5pte9guegsgk2u7bw92uq",
  //   "skr5pte9guegsgk2u7bw92uq"
  // );
  // await client.set(
  //   "apiKey:sk_skr5pte9guegsgk2u7bw92uq",
  //   "skr5pte9guegsgk2u7bw92uq"
  // );

  // const tenent = await authenticateApiKey(request, "secret");

  const tenent = "skr5pte9guegsgk2u7bw92uq";
  const data = await request.json();

  const pageData = await client.json.get(`tenent:${tenent}:page:${data.page}`);
  console.log(pageData);

  // const dataPathParts = data.dataPath.split(".");
  // console.log(dataPathParts);
  // dataPathParts?.map((part,i) => {
  //   let path =
  // })

  const redisDataPath = `$.${data.dataPath}`;
  console.log({ redisDataPath });
  // if (data.mergeType === "PREPEND") {
  await client.json.arrInsert(
    `tenent:${tenent}:page:${data.page}`,
    redisDataPath,
    data.index,
    data.component
  );
  // }

  // const formData = await request.formData();

  // const data = Object.entries(formData);
  console.log("DATASAVE", data);

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
