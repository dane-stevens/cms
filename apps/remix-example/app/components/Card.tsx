import { z } from "zod";

export default function Card({ gridCols, mdGridCols, children }: CardProps) {
  const sizes = {
    "md-5": `md:grid-cols-5`,
    "md-4": "md:grid-cols-4",
    "md-3": "md:grid-cols-3",
    "md-2": "md:grid-cols-2",
    "3": "grid-cols-3",
    "2": "grid-cols-2",
  };

  const grid: string[] = [];
  if (gridCols) grid.push(sizes[gridCols + ""]);
  if (mdGridCols) grid.push(sizes[`md-${mdGridCols}`]);

  return (
    <div className="shadow rounded border p-4 my-4">
      <div className={`grid ${grid.join(" ")}`}>{children}</div>
    </div>
  );
}

export const CardProps = z
  .object({
    children: z.union([z.any(), z.any().array().max(5)]),
    mdGridCols: z
      .number()
      .optional()
      .describe("Number of grid columns at medium screen size"),
    gridCols: z.number().optional().describe("Number of grid columns - base"),
  })
  .describe("Card component allows children");
export type CardProps = z.infer<typeof CardProps>;
