import jsonSchemaToZod from "json-schema-to-zod";

export function parseSchema(schema) {
  return jsonSchemaToZod(schema);
}
