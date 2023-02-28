import { ActionArgs, json } from "@remix-run/node";
import { z } from "zod";
import { authenticateApiKey } from "~/utils/authenticate.server";
import { formDataToObject } from "~/utils/functions";
import { jsonSchemaToZod } from "~/utils/jsonSchemaToZod";
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

  try {
    const tenent = "skr5pte9guegsgk2u7bw92uq";

    // const data = Object.fromEntries(formData);
    const data = await formDataToObject(request);
    console.log({ data });

    const componentKey = `tenent:${tenent}:component:${data.component}`;

    const component = JSON.parse(await client.get(componentKey));
    console.log({ component });

    const parser = jsonSchemaToZod(component.schema);
    console.log(parser.parse(data.values));
    // console.log({ parser });

    // const test = z.object({
    //   amount: z.coerce.number(),
    // });

    // console.log(test.parse(data.values));

    // console.log(`tenent:${tenent}:page:${data.page}`);

    // const redisDataPath = `$.${data.dataPath}.data.${data.field}`;
    // console.log({ redisDataPath });

    // await client.json.set(
    //   `tenent:${tenent}:page:${data.page}`,
    //   redisDataPath,
    //   data.value
    // );

    return json({ test: "" });
  } catch (err) {
    console.log(err);
    return null;
  }
};
