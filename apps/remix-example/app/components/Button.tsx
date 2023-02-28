import { z } from "zod";

export default function Button({ children }: ButtonProps) {
  return <button type="button">{children}</button>;
}

export type ButtonProps = z.infer<typeof ButtonProps>;
export const ButtonProps = z.object({
  children: z.string().default("Click me!"),
});
