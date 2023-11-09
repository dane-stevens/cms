import { createClient } from "@clickhouse/client"; // or '@clickhouse/client-web'

export const client = createClient({
  /* configuration */
  // host: "https://clickhouse-production-affb.up.railway.app:8123",
  // username: process.env.CLICKHOUSE_USER,
  // password: process.env.CLICKHOUSE_PASS,

  host: "http://localhost:8123",
});
