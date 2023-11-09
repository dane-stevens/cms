import { z } from "zod";

export default function CardSection({ title, children }: CardSectionProps) {
  return (
    <div>
      <div className="text-pink-400 uppercase tracking-wide">{title}</div>
      <div className="text-slate-300">{children}</div>
    </div>
  );
}

export type CardSectionProps = z.infer<typeof CardSectionProps>;
export const CardSectionProps = z.object({
  title: z.string({ required_error: "this is not a string" }).default("Title"),
  children: z.string().default("Some texts"),
});
