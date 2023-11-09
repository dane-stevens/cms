import { createClient } from "redis";
import type { RedisClientOptions } from "redis";
import { SchemaFieldTypes } from "@node-redis/search";

// import { redisKeyGenerator } from "./redisKeyGenerator.server";
// import { getQuestions } from "./installers.server";
// import { DateTime } from "luxon";

const {
  REDIS_HOST = "",
  REDIS_PORT = 6379,
  REDIS_USER = "default",
  REDIS_PASS = "",
} = process.env;

const getRedisConfig = (env: string | undefined) => {
  switch (env) {
    case "development":
      if (!REDIS_HOST)
        throw new Error('[ENV]: Missing environment variable "REDIS_HOST"');

      return {
        socket: {
          host: REDIS_HOST,
          port: Number(REDIS_PORT),
        },
        username: REDIS_USER,
        password: REDIS_PASS,
        name: "node_redis",
      };
    case "production":
      if (!REDIS_HOST)
        throw new Error('[ENV]: Missing environment variable "REDIS_HOST"');

      return {
        socket: {
          host: REDIS_HOST,
          port: Number(REDIS_PORT),
        },
        username: REDIS_USER,
        password: REDIS_PASS,
        name: "node_redis",
      };
    case "test":
    default:
      return {
        socket: {
          host: "localhost",
          port: 6379,
        },
        name: "node_redis",
      };
  }
};

// interface RedisConnectionOptions {
//     host: string
//     port: number
//     username?: string
//     password?: string
// }
const config: RedisClientOptions = getRedisConfig(process.env.NODE_ENV);

let client: any;

declare global {
  var __client: any;
}

if (process.env.NODE_ENV === "production") {
  client = createClient(config);
  client.connect();
} else {
  if (!global.__client) {
    console.log("RECONNECTING_--------------------------");
    global.__client = createClient(config);
    global.__client.connect();
  }
  client = global.__client;
}

// const client = createClient(config)
// client.connect()

export { client };

export type RedisClientType = typeof client;

process.on("SIGINT", (signal) => {
  console.log(`Process ${process.pid} received a SIGINT signal`);
  process.exit(0);
});

process.on("SIGTERM", (signal) => {
  console.log(`Process ${process.pid} received a SIGTERM signal`);
  process.exit(0);
});

process.on("beforeExit", async (code) => {
  console.log(`[REDIS]: Closing connection`);
  await client.quit();
  console.log(`Process will exit with code: ${code}`);
  process.exit(code);
});

async function createIndices() {
  try {
    const indices = await client.ft._list();

    if (!indices.includes("idx:warranties")) {
      await client.ft.create(
        "idx:warranties",
        {
          "$.id": {
            type: SchemaFieldTypes.TAG,
            AS: "id",
          },
          "$.installerNavisionId": {
            type: SchemaFieldTypes.TAG,
            AS: "installerNavisionId",
          },
          "$.firstName": {
            type: SchemaFieldTypes.TEXT,
            sortable: true,
            AS: "firstName",
          },
          "$.lastName": {
            type: SchemaFieldTypes.TEXT,
            sortable: true,
            AS: "lastName",
          },
          "$.email": {
            type: SchemaFieldTypes.TEXT,
            sortable: true,
            AS: "email",
          },
          "$.phone": {
            type: SchemaFieldTypes.TEXT,
            sortable: true,
            AS: "phone",
          },
          "$.address": {
            type: SchemaFieldTypes.TEXT,
            sortable: true,
            AS: "address",
          },
          "$.city": {
            type: SchemaFieldTypes.TEXT,
            sortable: true,
            AS: "city",
          },
          "$.province": {
            type: SchemaFieldTypes.TAG,
            sortable: true,
            AS: "province",
          },
          "$.postal": {
            type: SchemaFieldTypes.TEXT,
            sortable: true,
            AS: "postal",
          },
          "$.vehicleYear": {
            type: SchemaFieldTypes.NUMERIC,
            sortable: true,
            AS: "vehicleYear",
          },
          "$.vehicleMake": {
            type: SchemaFieldTypes.TEXT,
            sortable: true,
            AS: "vehicleMake",
          },
          "$.vehicleModel": {
            type: SchemaFieldTypes.TEXT,
            sortable: true,
            AS: "vehicleModel",
          },
          "$.vehicleString": {
            type: SchemaFieldTypes.TEXT,
            sortable: true,
            AS: "vehicleString",
          },
          "$.licensePlate": {
            type: SchemaFieldTypes.TEXT,
            sortable: true,
            AS: "licensePlate",
          },
          "$.licensePlateStripped": {
            type: SchemaFieldTypes.TEXT,
            sortable: true,
            AS: "licensePlateStripped",
          },
          "$.mileage": {
            type: SchemaFieldTypes.NUMERIC,
            sortable: true,
            AS: "mileage",
          },
          "$.vehicleRegisteredTo": {
            type: SchemaFieldTypes.TEXT,
            sortable: true,
            AS: "vehicleRegisteredTo",
          },
          "$.registeredAt": {
            type: SchemaFieldTypes.NUMERIC,
            sortable: true,
            AS: "registeredAt",
          },
        },
        {
          ON: "JSON",
          PREFIX: "warranty",
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
}

// createIndices();

export function redisEscape(value: string) {
  const replacements: any = {
    ",": "\\,",
    ".": "\\.",
    "<": "\\<",
    ">": "\\>",
    "{": "\\{",
    "}": "\\}",
    "[": "\\[",
    "]": "\\]",
    '"': '\\"',
    "'": "\\'",
    ":": "\\:",
    ";": "\\;",
    "!": "\\!",
    "@": "\\@",
    "#": "\\#",
    $: "\\$",
    "%": "\\%",
    "^": "\\^",
    "&": "\\&",
    "*": "\\*",
    "(": "\\(",
    ")": "\\)",
    "-": "\\-",
    "+": "\\+",
    "=": "\\=",
    "~": "\\~",
  };

  const newValue = value.replace(
    /,|\.|<|>|\{|\}|\[|\]|"|'|:|;|!|@|#|\$|%|\^|&|\*|\(|\)|-|\+|=|~/g,
    function (x) {
      return replacements[x];
    }
  );
  return newValue;
}

export function redisSearchEscape(value: string) {
  const newValue = value.replace(
    /,|\.|<|>|\{|\}|\[|\]|"|'|:|;|!|@|#|\$|%|\^|&|\*|\(|\)|-|\+|=|~/g,
    " "
  );
  return newValue;
}
