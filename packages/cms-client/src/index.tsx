import { Components, DefinitionOptions } from "./types";
import loadable from "@loadable/component";
import { zodToJsonSchema } from "./utils/zodToJsonSchema";
export { Page, ContentedProvider, useContented } from "./components";
export { loadable };
export { useListener } from "./hooks/useListener";
export { postMessage } from "./utils/postMessage";
export * from "./zodTypes";

const CONTENTED_SECRET_KEY = "sk_skr5pte9guegsgk2u7bw92uq";

const CONTENTED_URL = `http://localhost:5009`;

export class C {
  secretApiKey = "";
  components: Components = {};
  constructor() {
    if (!CONTENTED_SECRET_KEY)
      throw new Error("[CONTENTED] Missing environment variable: CONTENTED_SECRET_KEY");
    this.secretApiKey = CONTENTED_SECRET_KEY + "";
  }

  /**
   * @param component
   * @param options - {@link https://docs.contented.design/custom-components/definition/#options Component definition options}
   * @returns ZodSchema
   */
  define<TData>(component: any, options: DefinitionOptions<TData>) {
    const { name, deprecated = false, ...definitionOptions } = options;
    // this.components.add({ component, ...options });
    this.components[name] = { component, ...definitionOptions };
    return options.schema;
  }

  sync() {
    Object.keys(this.components)?.map((componentKey) => {
      const component: any = this.components[componentKey];

      fetch(`${CONTENTED_URL}/api/sync`, {
        method: "POST",
        body: JSON.stringify({
          name: componentKey,
          icon: component?.icon,
          // type: definitions[name].type,
          schema: zodToJsonSchema(component.schema, component.extend),
          // zod: options?.type ? JSON.stringify(options.type) : null,
        }),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${this.secretApiKey}`,
        },
      });
    });
  }

  getPageData = async (request: Request) => {
    const url = new URL(request.url).pathname;

    const { pageData } = await fetch(`${CONTENTED_URL}/api/page?page=${encodeURIComponent(url)}`, {
      headers: {
        authorization: `Bearer ${this.secretApiKey}`,
      },
    })
      .then((res) => res.json())
      .then((res) => (res.pageData ? res : { pageData: { title: "404", children: [] } }));
    // .then((res) =>
    //   !res.title ? { title: "", description: "", children: [] } : res
    // );
    console.log({ pageData });
    return pageData;
  };
}
