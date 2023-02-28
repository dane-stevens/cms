import { z } from "zod";

export type ParagraphProps = z.infer<typeof ParagraphProps>;
export const ParagraphProps = z.object({
  children: z.string().default("Lorem ipsum dolor sit amet..."),
});

export default function Paragraph({ children }: ParagraphProps) {
  return <p className="">{children}</p>;
}
