import { z } from "zod";

export function jsonSchemaToZod(schema: any) {
  let parser: any = {};

  if (schema.type === "object") {
    Object.keys(schema.properties).map((key) => {
      const property = schema.properties[key];
      parser[key] = getZodType(
        property.type,
        property.values || property.value
      );
      property.checks?.map(({ kind, ...rest }) => {
        if (kind === "email") parser[key] = parser[key].email();
        if (kind === "uri") parser[key] = parser[key].url();
        if (kind === "uuid") parser[key] = parser[key].uuid();
        if (kind === "cuid") parser[key] = parser[key].cuid();
        if (kind === "cuid2") parser[key] = parser[key].cuid2();
        if (kind === "regex")
          parser[key] = parser[key].regex(new RegExp(rest.regex, rest.flags));
        if (kind === "datetime") parser[key] = parser[key].datetime(rest);
        if (kind === "min") parser[key] = parser[key].min(rest.value);
        if (kind === "max") parser[key] = parser[key].min(rest.value);
        if (kind === "startsWith") parser[key] = parser[key].min(rest.value);
        if (kind === "endsWith") parser[key] = parser[key].min(rest.value);
        if (kind === "length") parser[key] = parser[key].min(rest.value);
      });
    });

    parser = z.object(parser);
  }

  return parser;
}

function getZodType(type: string, value?: any) {
  switch (type) {
    case "string":
      return z.string();
    case "number":
      return z.coerce.number();
    case "boolean":
      return z.coerce.boolean();
    case "date":
      return z.coerce.date();
    case "nan":
      return z.nan();
    case "literal":
      return z.literal(value);
    case "enum":
      return z.enum(value);
    default:
      return null;
  }
}
