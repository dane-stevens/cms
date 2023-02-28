import { z } from "zod";
import Card from "./Card";
import CardSection from "./CardSection";

export default function CustomCard({ gridCols, gridColsMd }: CustomCardProps) {
  const GRID_COLS = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
  };
  const GRID_COLS_MD = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
  };

  const gridColsClass = GRID_COLS[gridCols];
  const gridColsMdClass = GRID_COLS_MD[gridColsMd];
  return (
    <Card>
      <div className={`grid ${gridColsClass} ${gridColsMdClass} gap-4`}>
        <CardSection title="Section 1">The First Section</CardSection>
        <CardSection title="Section 2">The Second Section</CardSection>
        <CardSection title="Section 3">The Third Section</CardSection>
      </div>
    </Card>
  );
}

export const CustomCardProps = z.object({
  gridCols: z.number().min(1).max(3).default(1),
  gridColsMd: z.number().min(1).max(3).default(3),
  email: z.string().email(),
  publishDate: z.string().datetime(),
});
export type CustomCardProps = z.infer<typeof CustomCardProps>;
