import { z } from "zod";

export interface DefinitionOptions<TData> {
  name: string;
  schema: z.Schema<TData>;
  /**
   * Optionally: specify alternate input fields to be used in the visual editor.
   *
   * @see {@link https://docs.contented.design/custom-components/#schemas Schema docs}
   *
   * @example
   *
   * ```js
   * schema: {
   *   z.object({
   *     state: z.string().length(2),
   *     ...
   *   })
   * },
   * extend: {
   *    state: {
   *      // Use a select box
   *      input: 'select',
   *      // With these options: [[value, text]]
   *      options: [
   *        ["NY", "New York"],
   *        ["TX", "Texas"],
   *        ...
   *      ]
   *    }
   * }
   * ```
   */
  extend?: Extend;
  /**
   * An Iconify icon string.
   * Browse icons: https://icon-sets.iconify.design/
   * @example "mdi:account" | "ic:round-facebook"
   */
  icon?: string;
  deprecated?: boolean;
}
interface Extend {
  [key: string]: ExtendedTextarea | ExtendedFile | ExtendedSelect;
}
// interface ExtendOptions {
//   input: "textarea" | "select" | "file";
//   /**
//    * @example
//    * ```js
//    * [["NY", "New York"], ["TX", "Texas"]]
//    * ```
//    * @example
//    * ```js
//    * ["New York", "Texas"]
//    * ```
//    */
//   selectOptions?: [string, string][] | string[];
// }

interface ExtendedTextarea {
  input: "textarea";
}

interface ExtendedFile {
  input: "file";
}

interface ExtendedSelect {
  input: "select";
  /**
   * @example
   * ```js
   * [["NY", "New York"], ["TX", "Texas"]]
   * ```
   * @example
   * ```js
   * ["New York", "Texas"]
   * ```
   */
  selectOptions: [string, string][] | string[];
}

export interface Components {
  [key: string]: Component;
}
interface Component {
  component: any;
}
