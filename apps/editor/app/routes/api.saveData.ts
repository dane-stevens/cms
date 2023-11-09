import { DataFunctionArgs, json } from "@remix-run/node";
import { eq } from "drizzle-orm";
import { blocks } from "database";
import { ZodSchema, z } from "zod";
import { authenticateApiKey } from "~/utils/authenticate.server";
import { db } from "~/utils/drizzle.server";
import { formDataToObject } from "~/utils/functions";
import { jsonSchemaToZod } from "~/utils/jsonSchemaToZod";
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

  // const tenent = await authenticateApiKey(request, "secret");

  try {
    const tenent = "skr5pte9guegsgk2u7bw92uq";

    // const data = Object.fromEntries(formData);
    const data = await formDataToObject(request);

    const componentKey = `tenent:${tenent}:component:${data.component}`;

    const component = JSON.parse(await client.get(componentKey));

    const schema = component.schema;
    if (schema.properties?.children?.type === "unknown") {
      delete schema.properties.children;
    }

    const Schema: ZodSchema = jsonSchemaToZod(component.schema);

    const parseResult = Schema.safeParse(data.values);

    if (!parseResult.success) return json(parseResult);
    const parsedData = parseResult.data;

    await db
      .update(blocks)
      .set({ data: parsedData, sort: data.sort })
      .where(eq(blocks.id, data.id));

    return json({ success: true });
  } catch (err) {
    console.log(err);
    return null;
  }
};
