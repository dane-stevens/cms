import { z } from "zod";

import { Link as RemixLink } from "@remix-run/react";

export default function Link({ to, children }: LinkProps) {
  return (
    <RemixLink to={to} className="underline text-blue-600">
      {children}
    </RemixLink>
  );
}

export type LinkProps = z.infer<typeof LinkProps>;
export const LinkProps = z.object({
  to: z.string().default("/"),
  children: z.string().default("Click me!"),
});
