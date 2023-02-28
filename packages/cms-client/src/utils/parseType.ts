import { parseZodType } from "./parseZodType";

export function parseType(def: any, options?: any): any {
  if (def.innerType) {
    // console.log("INNERTYPE-------------------", def.innerType);
    const nextOptions = { ...options };
    if (def.typeName === "ZodOptional") nextOptions.optional = true;
    if (def.typeName === "ZodDefault") nextOptions.defaultValue = def.defaultValue();
    return parseType(def.innerType._def, nextOptions);
  }

  if (def.typeName === "ZodArray") {
    // console.log("DEF----", def);
    return parseType(def.type._def, {
      isArray: true,
      ...(def.minLength && { minLength: def.minLength }),
      ...(def.maxLength && { maxLength: def.maxLength }),
      ...(def.exactLength && { exactLength: def.exactLength }),
    });
  }

  // console.log(def.checks);
  let checks: any = [];
  def.checks?.map((check: any) => {
    if (check.regex) {
      console.log(def);
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
  };
}
