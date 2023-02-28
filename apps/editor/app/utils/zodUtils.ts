import { z } from "zod";

export function generateZodObject(schema) {
  const params = {};
  Object.keys(schema.properties)?.map((key) => {
    // console.log(schema.properties[key]);
    const property = schema.properties[key];
    params[key] = z[property.type]();
    if (property.minimum) params[key] = params[key].min(property.minimum);
  });
  // console.log(z.object(params));
}
