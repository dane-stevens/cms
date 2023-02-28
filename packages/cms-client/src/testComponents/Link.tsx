import { z } from "zod";

export default function Link({ to, children }: LinkProps) {
  return <a href={to}>{children}</a>;
}

export type LinkProps = z.infer<typeof LinkProps>;
export const LinkProps = z.object({
  to: z.string().url(),
  children: z.string(),
});
