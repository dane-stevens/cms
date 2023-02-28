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

  const tenent = await authenticateApiKey(request, "secret");

  const data = await request.json();

  await client.set(
    `tenent:${tenent}:component:${data.name}`,
    JSON.stringify(data)
  );
  await client.sAdd(
    `tenent:${tenent}:components`,
    `tenent:${tenent}:component:${data.name}`
  );

  return json({ test: "" });
};

export const loader = async () => {
  return null;
};
