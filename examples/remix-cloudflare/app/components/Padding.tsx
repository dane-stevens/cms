import { z } from "zod";

export const PaddingProps = z.object({ children: z.any() });
export type PaddingProps = z.infer<typeof PaddingProps>;
export default function Padding({ children }: PaddingProps) {
  return <div>{children}</div>;
}
