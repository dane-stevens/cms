import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";

import {
  varchar,
  mysqlTable,
  json,
  AnyMySqlColumn,
  int,
  boolean,
  index,
  uniqueIndex,
  datetime,
  timestamp,
  unique,
  text,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const tenants = mysqlTable("tenants", {
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  name: varchar("name", { length: 255 }),
  isActive: boolean("isActive").notNull().default(true),
});

export const apiKeys = mysqlTable(
  "apiKeys",
  {
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey(),
    key: varchar("key", { length: 131 }),
    isActive: boolean("isActive").notNull().default(true),
    type: mysqlEnum("type", ["public", "secret"]),
    createdAt: datetime("createdAt")
      .notNull()
      .default(sql`now()`),
    tenantId: varchar("tenantId", { length: 128 }),
  },
  (apiKeys) => ({
    keyIdx: unique("key").on(apiKeys.key),
    tenantIdIndex: index("tenantIdIndex").on(apiKeys.tenantId),
  })
);

export const domains = mysqlTable(
  "domains",
  {
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey(),
    domain: varchar("domain", { length: 255 }).notNull(),
    verificationCode: varchar("verificationCode", { length: 131 }).notNull(),
    isVerified: boolean("isVerified").notNull().default(false),
    createdAt: datetime("createdAt")
      .notNull()
      .default(sql`now()`),
    tenantId: varchar("tenantId", { length: 128 }),
  },
  (domains) => ({
    domainIdx: uniqueIndex("domainIdx").on(domains.domain),
    tenantIdIndex: index("tenantIdIndex").on(domains.tenantId),
  })
);

export const pages = mysqlTable(
  "pages",
  {
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey(),
    url: varchar("url", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: datetime("createdAt")
      .notNull()
      .default(sql`now()`),
    updatedAt: datetime("updatedAt")
      .notNull()
      .default(sql`now()`),
    tenantId: varchar("tenantId", { length: 128 }),
  },
  (pages) => ({
    urlIdx: uniqueIndex("urlIdx").on(pages.url),
    tenantIdIndex: index("tenantIdIndex").on(pages.tenantId),
  })
);

export const blocks = mysqlTable(
  "blocks",
  {
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey(),
    name: varchar("name", { length: 255 }),
    data: json("data"),
    component: varchar("component", { length: 255 }),
    pageId: varchar("pageId", { length: 128 }),
    parentId: varchar("parentId", { length: 128 }),
    blockId: varchar("blockId", { length: 128 }),
    tenantId: varchar("tenantId", { length: 128 }),
    sort: int("sort").default(0),
    createdAt: datetime("createdAt")
      .notNull()
      .default(sql`now()`),
    updatedAt: datetime("updatedAt")
      .notNull()
      .default(sql`now()`),
  },
  (blocks) => ({
    pageIdIdx: index("pageIdIdx").on(blocks.pageId),
    parentIdIdx: index("parentIdIdx").on(blocks.parentId),
    blockIdIdx: index("blockIdIdx").on(blocks.parentId),
    sortIdx: index("sortIdx").on(blocks.sort),
  })
);

export const components = mysqlTable(
  "components",
  {
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    icon: varchar("icon", { length: 255 }).notNull(),

    schema: json("schema").notNull(),
    groupName: varchar("groupName", { length: 255 }),
    tenantId: varchar("tenantId", { length: 128 }).notNull(),
  },
  (components) => ({
    nameTentantIdIdx: unique("nameTentantIdIdx").on(
      components.name,
      components.tenantId
    ),
    nameIdx: index("nameIdx").on(components.name),
    groupNameIdx: index("groupNameIdx").on(components.groupName),
    tenantIdIdx: index("tenantIdIdx").on(components.tenantId),
  })
);

export const localizations = mysqlTable(
  "localizations",
  {
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey(),
    locale: varchar("locale", { length: 5 }),
    data: json("data"),
    blockId: varchar("blockId", { length: 128 }),
  },
  (localizations) => ({
    localeIndex: index("localeIndex").on(localizations.locale),
    blockIdIndex: index("blockIdIndex").on(localizations.blockId),
  })
);

export const tenantRelations = relations(tenants, ({ many }) => ({
  pages: many(pages),
}));

export const pagesRelations = relations(pages, ({ many, one }) => ({
  blocks: many(blocks),
  tenant: one(tenants, {
    fields: [pages.tenantId],
    references: [tenants.id],
  }),
}));

export const blocksRelations = relations(blocks, ({ one, many }) => ({
  page: one(pages, {
    fields: [blocks.pageId],
    references: [pages.id],
  }),
  parent: one(blocks, {
    fields: [blocks.parentId],
    references: [blocks.id],
    relationName: "children",
  }),
  customBlock: one(blocks, {
    fields: [blocks.blockId],
    references: [blocks.id],
    relationName: "customBlock",
  }),
  children: many(blocks, { relationName: "children" }),
  localizations: many(localizations),
}));

export const localizationsRelations = relations(localizations, ({ one }) => ({
  block: one(blocks, {
    fields: [localizations.blockId],
    references: [blocks.id],
  }),
}));
