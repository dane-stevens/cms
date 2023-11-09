import { z } from "zod";

export const GridProps = z.object({
  children: z.any(),
});
export type GridProps = z.infer<typeof GridProps>;

export default function Grid({ children }: GridProps) {
  return (
    <div className="grid md:grid-cols-3 gap-8 min-h-[40px] py-8">
      {children}
    </div>
  );
}
