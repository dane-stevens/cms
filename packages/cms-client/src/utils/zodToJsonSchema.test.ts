import { describe, expect, it } from "vitest";
import { z } from "zod";
import { zodToJsonSchema } from "./zodToJsonSchema";

describe("Test zodToJsonSchema", () => {
  it("Should transform a zod object to JSON schema", () => {
    expect(
      zodToJsonSchema(
        z.object({
          id: z.string().startsWith("id:"),
          firstName: z.string(),
          lastName: z.string(),
          email: z.string().email().default("name@example.com"),
          password: z.string().regex(/^[0-9a-zA-Z]/g),
          comments: z.string().trim(),
          website: z.string().url().startsWith("https://").optional(),
          uuid: z.string().uuid({ message: "Must be a UUID" }),
          cuid: z.string().cuid(),
          cuid2: z.string().cuid2(),
          endsWith: z.string().endsWith("-suffix"),
          createdAt: z.string().datetime(),
          confirmationNumber: z.string().length(7),
          phoneNumber: z.string().min(10).max(13),
          age: z.number().min(18).max(99),
          isAdmin: z.boolean().default(true),
          profilePic: z.string().url(),
          now: z.date(),
          tags: z.enum(["TS", "JS", "TSX", "JSX"]),
          version: z.literal("DELTA").optional(),
          favoriteLetter: z.nan(),
          favoriteFoods: z.string().array().max(5),
          ageRange: z.number().min(18).max(99).array().length(2),
        }),
        {
          profilePic: { input: "file" },
        }
      )
    ).toEqual({
      type: "object",
      properties: {
        id: {
          type: "string",
          checks: [{ kind: "startsWith", value: "id:" }],
        },
        firstName: {
          type: "string",
        },
        lastName: {
          type: "string",
        },
        email: {
          type: "string",
          defaultValue: "name@example.com",
          checks: [{ kind: "email" }],
        },
        password: {
          type: "string",
          checks: [{ flags: "g", kind: "regex", regex: "^[0-9a-zA-Z]" }],
        },
        comments: {
          type: "string",
          checks: [{ kind: "trim" }],
        },
        website: {
          type: "string",
          optional: true,
          checks: [{ kind: "url" }, { kind: "startsWith", value: "https://" }],
        },
        uuid: {
          type: "string",
          checks: [{ kind: "uuid", message: "Must be a UUID" }],
        },
        cuid: {
          type: "string",
          checks: [{ kind: "cuid" }],
        },
        cuid2: {
          type: "string",
          checks: [{ kind: "cuid2" }],
        },
        endsWith: {
          type: "string",
          checks: [{ kind: "endsWith", value: "-suffix" }],
        },
        createdAt: {
          type: "string",
          checks: [{ kind: "datetime", offset: false, precision: null }],
        },
        confirmationNumber: {
          type: "string",
          checks: [{ kind: "length", value: 7 }],
        },
        phoneNumber: {
          type: "string",
          checks: [
            { kind: "min", value: 10 },
            { kind: "max", value: 13 },
          ],
        },
        age: {
          type: "number",
          checks: [
            { kind: "min", inclusive: true, value: 18 },
            { kind: "max", inclusive: true, value: 99 },
          ],
        },
        isAdmin: {
          type: "boolean",
          defaultValue: true,
        },
        profilePic: {
          type: "string",
          extend: {
            input: "file",
          },
          checks: [{ kind: "url" }],
        },
        now: {
          type: "date",
        },
        tags: {
          type: "enum",
          values: ["TS", "JS", "TSX", "JSX"],
        },
        version: {
          type: "literal",
          value: "DELTA",
          optional: true,
        },
        favoriteLetter: {
          type: "nan",
        },
        favoriteFoods: {
          type: "string",
          isArray: true,
          maxLength: {
            value: 5,
          },
        },
        ageRange: {
          type: "number",
          isArray: true,
          exactLength: {
            value: 2,
          },
          checks: [
            { kind: "min", value: 18, inclusive: true },
            { kind: "max", value: 99, inclusive: true },
          ],
        },
      },
    });
  });
});
