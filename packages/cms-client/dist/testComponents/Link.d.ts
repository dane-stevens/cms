import * as react_jsx_runtime from 'react/jsx-runtime';
import { z } from 'zod';

declare function Link({ to, children }: LinkProps): react_jsx_runtime.JSX.Element;
type LinkProps = z.infer<typeof LinkProps>;
declare const LinkProps: z.ZodObject<{
    to: z.ZodString;
    children: z.ZodString;
}, "strip", z.ZodTypeAny, {
    to: string;
    children: string;
}, {
    to: string;
    children: string;
}>;

export { LinkProps, Link as default };
