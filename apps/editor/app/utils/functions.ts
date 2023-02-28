import unflatten from "unflatten";

export async function formDataToObject(request: Request) {
  const form = await request.formData();
  let formDataObject: any = {};
  for (let pair of form.entries()) {
    const split = pair[0].split(".");
    const unflattened = unflatten({ [pair[0]]: pair[1] });
    formDataObject = Object_assign(formDataObject, unflattened);
  }
  return formDataObject;
}

function Object_assign(target: any, ...sources: any) {
  sources.forEach((source: any) => {
    Object.keys(source).forEach((key) => {
      const s_val = source[key];
      const t_val = target[key];
      target[key] =
        t_val && s_val && typeof t_val === "object" && typeof s_val === "object"
          ? Object_assign(t_val, s_val)
          : s_val;
    });
  });
  return target;
}
