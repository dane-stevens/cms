import { parseZodType } from "./parseZodType";

export function parseType(def: any, options?: any): any {
  if (def.innerType) {
    const nextOptions = { ...options };
    if (def.typeName === "ZodOptional") nextOptions.optional = true;
    if (def.typeName === "ZodDefault") nextOptions.defaultValue = def.defaultValue();
    return parseType(def.innerType._def, nextOptions);
  }

  if (def.typeName === "ZodArray") {
    return parseType(def.type._def, {
      isArray: true,
      ...(def.minLength && { minLength: def.minLength }),
      ...(def.maxLength && { maxLength: def.maxLength }),
      ...(def.exactLength && { exactLength: def.exactLength }),
    });
  }

  let checks: any = [];
  def.checks?.map((check: any) => {
    if (check.regex) {
      console.log(
        "REGEX",
        check.regex.source,
        check.regex.toString(),
        new RegExp(String(check.regex))
      );
    }
    return checks.push({
      ...check,
      ...(check.regex && {
        regex: check.regex.source,
        flags: `${check.regex.global ? "g" : ""}${check.regex.ignoreCase ? "i" : ""}${
          check.regex.multiline ? "m" : ""
        }`,
      }),
    });
  });
  return {
    ...options,
    type: parseZodType(def.typeName),
    ...(checks?.length > 0 && { checks }),
    ...(def.typeName === "ZodLiteral" && { value: def.value }),
    ...(def.typeName === "ZodEnum" && { values: def.values }),
    // ...(def.typeName === "ZodUnion" && { values: def.values }), // [TODO]: Values is missing in union
  };
}
