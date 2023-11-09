import { DataFunctionArgs, json } from "@remix-run/node";
import { and, eq } from "drizzle-orm";
import { MySqlInsert, MySqlUpdate } from "drizzle-orm/mysql-core";
import { components } from "database";
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

  const tenant = await authenticateApiKey(request, "secret");

  const componentsToSync = await request.json();

  // const promises = [];
  // components?.map((data) => {
  //   promises.push(
  //     client.set(
  //       `tenent:${tenant}:component:${data.name}`,
  //       JSON.stringify(data)
  //     )
  //   );
  //   return promises.push(
  //     client.sAdd(
  //       `tenent:${tenant}:components`,
  //       `tenent:${tenant}:component:${data.name}`
  //     )
  //   );
  // });

  const existingComponents = await db.query.components.findMany({
    where: eq(components.tenantId, tenant),
  });

  const dbInsertPromises: Promise<any>[] = [];
  componentsToSync.map((data) => {
    const existingComponent = existingComponents.find(
      (component) => component.name === data.name
    );
    if (existingComponent) {
      return dbInsertPromises.push(
        db
          .update(components)
          .set({ schema: data.schema, icon: data.icon, groupName: data.group })
          .where(
            and(eq(components.tenantId, tenant), eq(components.name, data.name))
          )
      );
    }
    return dbInsertPromises.push(
      db.insert(components).values({
        name: data.name,
        schema: data.schema,
        icon: data.icon,
        groupName: data.group,
        tenantId: tenant,
      })
    );
  });
  await Promise.all(dbInsertPromises);

  return json({ test: "" });
};

export const loader = async () => {
  return null;
};
