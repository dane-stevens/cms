import { DataFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";

import { db } from "~/utils/drizzle.server";

const Params = z.object({
  componentId: z.string().cuid2(),
});

export const loader = async ({ request, params }: DataFunctionArgs) => {
  const parsedParams = Params.parse(params);

  const data = await db.query.blocks.findFirst({
    where: (blocks, { eq }) => eq(blocks.id, parsedParams.componentId),
    columns: { data: true },
  });

  return json(data?.data);
};
