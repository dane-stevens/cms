// import { seed } from "~/utils/seed.server";

import { createId } from "@paralleldrive/cuid2";
import { blocks, localizations, pages, tenants } from "database";
import { db } from "~/utils/drizzle.server";

let sortOrder = 0;
function getSortOrder() {
  return (sortOrder = sortOrder + 1000);
}

export const loader = async () => {
  // await seed();

  const tenantIds = ["skr5pte9guegsgk2u7bw92uq"];
  const pageIds = ["r4a7bvshfuwyzjf0cxer5g3d", "d2f0v8sy5nra0s9wlbkbsb9l"];
  const blockIds = [createId(), createId(), createId()];
  const localizationIds = [createId()];

  await Promise.all([
    db.delete(localizations),
    db.delete(blocks),
    db.delete(pages),
    db.delete(tenants),
  ]);

  const insertBlocks = [
    {
      id: blockIds[0],
      name: "block 1",
      data: { gridCols: 1, mdGridCols: 3 },
      pageId: pageIds[0],
      component: "Card",
      sort: getSortOrder(),
    },
    {
      id: blockIds[1],
      name: "BLOCK 2",
      pageId: pageIds[1],
      component: "Card",
      sort: getSortOrder(),
    },
    {
      name: "block 2",
      parentId: blockIds[0],
      pageId: pageIds[0],
      component: "Paragraph",
      data: { children: "Hey world!" },
      sort: getSortOrder(),
    },
    {
      name: "BLOCK 3",
      parentId: blockIds[1],
      pageId: pageIds[1],
      component: "Paragraph",
      data: { children: "who dat" },
      sort: getSortOrder(),
    },
    {
      id: blockIds[2],
      name: "BLOCK 4",
      parentId: blockIds[1],
      pageId: pageIds[1],
      component: "Card",
      sort: getSortOrder(),
    },
    {
      name: "BLOCK 5",
      parentId: blockIds[2],
      pageId: pageIds[1],
      component: "Paragraph",
      data: { children: "hey man" },
      sort: getSortOrder(),
    },
  ];

  await db.insert(tenants).values({ id: tenantIds[0], name: "Teen Ranch" });

  await db.insert(pages).values([
    { id: pageIds[0], url: "/test", tenantId: tenantIds[0] },
    { id: pageIds[1], url: "/test2", tenantId: tenantIds[0] },
  ]);
  await db.insert(blocks).values(insertBlocks);
  await db
    .insert(localizations)
    .values({ blockId: blockIds[1], data: { hello: "monde" }, locale: "fr" });

  return new Response("OK");
};
