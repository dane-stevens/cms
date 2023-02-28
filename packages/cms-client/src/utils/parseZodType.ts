export function parseZodType(zodType: string) {
  switch (zodType) {
    case "ZodString":
      return "string";
    case "ZodNumber":
      return "number";
    case "ZodBoolean":
      return "boolean";
    case "ZodDate":
      return "date";
    case "ZodNaN":
      return "nan";
    case "ZodLiteral":
      return "literal";
    case "ZodEnum":
      return "enum";
    default:
      return "unknown";
  }
}
