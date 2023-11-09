// import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { drizzle } from "drizzle-orm/planetscale-serverless";
// import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "database";
import Database from "better-sqlite3";

import { connect } from "@planetscale/database";
import { MySqlDatabase } from "drizzle-orm/mysql-core";

// create the connection
const connection = connect({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});

// const sqlite = new Database("sqlite.db");
// export const db: BetterSQLite3Database<typeof schema> = drizzle(sqlite, {
//   schema,
// });

export const db = drizzle(connection, { schema });

// await migrate(db, { migrationsFolder: "drizzle" });
