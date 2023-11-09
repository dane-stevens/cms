import { Components, DefinitionOptions } from "./types";
import loadable from "@loadable/component";
import { zodToJsonSchema } from "./utils/zodToJsonSchema";
export { Page, ContentedProvider, useContented } from "./components";
export { loadable };
export { useListener } from "./hooks/useListener";
export { postMessage } from "./utils/postMessage";
export * from "./zodTypes";

const CONTENTED_SECRET_KEY = "sk_skr5pte9guegsgk2u7bw92uq";

const CONTENTED_URL = `http://localhost:5909`;

const PUBLIC_API_KEY = process.env.PUBLIC_API_KEY;

interface PageDataResult {
  id: string;
  title: string;
  description?: string;
  children: any[];
}
export class C {
  secretApiKey = "";
  publicApiKey = "";
  components: Components = {};
  constructor() {
    if (!CONTENTED_SECRET_KEY)
      throw new Error("[CONTENTED] Missing environment variable: CONTENTED_SECRET_KEY");
    if (!PUBLIC_API_KEY)
      throw new Error("[CONTENTED] Missing environment variable: PUBLIC_API_KEY");
    this.secretApiKey = CONTENTED_SECRET_KEY + "";
    this.publicApiKey = PUBLIC_API_KEY + "";
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
    // if (process.env.NODE_ENV === "development") {

    const componentsToSync: any = [];

    Object.keys(this.components)?.map((componentKey) => {
      const component: any = this.components[componentKey];
      componentsToSync.push({
        name: componentKey,
        icon: component?.icon,
        schema: zodToJsonSchema(component.schema, component.extend),
        group: component.group,
      });
    });

    // fetch(`${CONTENTED_URL}/api/sync`, {
    //   method: "POST",
    //   body: JSON.stringify(componentsToSync),
    //   headers: {
    //     "Content-Type": "application/json",
    //     authorization: `Bearer ${this.secretApiKey}`,
    //   },
    // });

    // }
  }

  getPageData = async (request: Request): Promise<PageDataResult> => {
    const url = new URL(request.url).pathname;

    const response = await fetch(
      `https://worker.ds-media.workers.dev/?url=${encodeURIComponent(url)}`,
      {
        // const response = await fetch(`${CONTENTED_URL}/api/page?url=${encodeURIComponent(url)}`, {
        headers: {
          authorization: `Bearer ${this.publicApiKey}`,
        },
      }
    ).then((res) => {
      if (res.status === 200) {
        return res.json();
      }
      return new Response(null, {
        status: res.status,
        statusText: res.statusText,
      });
    });
    if (response.status === 404)
      throw new Response(null, {
        status: response.status,
        statusText: response.statusText,
      });
    return response.pageData;
  };
}
