import { createId } from "@paralleldrive/cuid2";
import { DataFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { client } from "~/utils/clickhouse.server";
import crypto from "crypto";
import { UAParser } from "ua-parser-js";

const schema = z.object({
  n: z.string(),
  u: z.string().url(),
  d: z.string(),
  r: z.string().nullable(),
  w: z.number(),
});

const searchParamsSchema = z.object({
  ref: z.string().optional(),
  source: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
});

function hash(string: string) {
  let algorithm = "sha256";
  let key = string;
  return crypto.createHash(algorithm).update(key).digest("hex");
}

export const action = async ({ request }: DataFunctionArgs) => {
  const post = await request.text();
  const headers = request.headers;

  const data = schema.parse(JSON.parse(post));

  const url = new URL(data.u);
  const searchParams = searchParamsSchema.parse(
    Object.fromEntries(url.searchParams)
  );

  hash(
    `${data.d}${headers.get("CF-Connecting-IP")}${headers.get("user-agent")}`
  );

  const userAgentParser = new UAParser(headers.get("user-agent") + "");

  const userAgent = userAgentParser.getResult();

  const response = await client.insert({
    table: "views",
    values: [
      {
        id: createId(),
        event: data.n,
        url: data.u,
        domain: data.d,
        referrer: data.r,
        width: data.w,
        date: new Date().toISOString().substring(0, 19),
      },
    ],
    format: "JSONEachRow",
  });

  return new Response("OK");
};
