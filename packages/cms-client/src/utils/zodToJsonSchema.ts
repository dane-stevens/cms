import { parseType } from "./parseType";

export function zodToJsonSchema(zodSchema: any, extend?: any) {
  let schema: { type: string; properties: any } = {
    type: "",
    properties: {},
  };
  if (typeof zodSchema === "object") {
    schema.type = "object";
    // console.log("TOJSON-------------", zodSchema.shape.favoriteFoods);
    const shape = zodSchema.shape;
    Object.keys(shape).map((key) => {
      const def = shape[key]._def;
      if (def.errorMap) {
        console.log(def.errorMap);
      }
      let property = parseType(def);
      schema.properties[key] = property;
      if (extend && extend[key]) {
        schema.properties[key].extend = extend[key];
      }
      if (def.values) {
        schema.properties[key].values = def.values;
      }
    });
  }
  return schema;
}
