import { DataFunctionArgs } from "@remix-run/node";
import { json } from "drizzle-orm/mysql-core";
import { client } from "~/utils/clickhouse.server";

export const loader = async ({ request }: DataFunctionArgs) => {
  const date = new Date();

  // await client.insert({
  //   table: "cms.views",
  //   values: [
  //     {
  //       id: 23,
  //       url: "https://dsmedia.ca",
  //       timestamp: date.toISOString().substring(0, 19),
  //     },
  //   ],
  //   format: "JSONEachRow",
  // });

  await client.command({
    query: `
   CREATE TABLE IF NOT EXISTS views (
     id FixedString(128),
     date DateTime('UTC'),
     event String,
     url String,
     domain String,
     referrer String,
     width UInt16
   ) Engine = MergeTree
   ORDER BY (date)
  `,
  });

  const response = await client.query({
    query: `SELECT * FROM views`,
    // format: "JSON",
    format: "JSONEachRow",
  });
  return json({ response: await response.json() });
};
