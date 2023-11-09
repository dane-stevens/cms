import { and, eq, isNull, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { blocks, pages } from "database";
import { db } from "~/utils/drizzle.server";

export const loader = async () => {
  const child = alias(blocks, "child");
  const sq = await db.$with(`sq`).as(
    db
      .select()
      .from(pages)
      .innerJoin(blocks, and(eq(blocks.pageId, pages.id)))
      .where(eq(pages.url, "/test"))
      .orderBy(blocks.parentId)
  );
  const pageRows = await db.with(sq).select().from(sq);

  return null;
};
