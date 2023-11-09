import { z } from "zod";

export default function Card({ children }: CardProps) {
  return (
    <div className="shadow rounded border border-slate-800 p-8 bg-black/20">
      {children}
    </div>
  );
}

export const CardProps = z.object({
  children: z.any(),
});
export type CardProps = z.infer<typeof CardProps>;
