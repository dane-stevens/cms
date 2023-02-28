import { describe, expect, it } from "vitest";
import { z } from "zod";
import { parseZodType } from "./parseZodType";

describe("Test zod type parser", () => {
  it("Should parse ZodString to string", () => {
    expect(parseZodType(z.string()._def.typeName)).toBe("string");
  });
  it("Should parse ZodNumber to number", () => {
    expect(parseZodType(z.number()._def.typeName)).toBe("number");
  });
  it("Should parse ZodBoolean to boolean", () => {
    expect(parseZodType(z.boolean()._def.typeName)).toBe("boolean");
  });
  it("Should parse ZodDate to date", () => {
    expect(parseZodType(z.date()._def.typeName)).toBe("date");
  });
  it("Should parse ZodNaN to nan", () => {
    expect(parseZodType(z.nan()._def.typeName)).toBe("nan");
  });
  it("Should parse ZodLiteral to literal", () => {
    expect(parseZodType(z.literal("test")._def.typeName)).toBe("literal");
  });
  it("Should parse ZodEnum to enum", () => {
    expect(parseZodType(z.enum(["test"])._def.typeName)).toBe("enum");
  });
  it("Should parse anything to unknown", () => {
    expect(parseZodType("anything")).toBe("unknown");
  });
});
