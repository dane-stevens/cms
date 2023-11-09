import { z } from "zod";

export default function Heading({ children, variant }: HeadingProps) {
  const H = variant;
  const VARIANT_STYLES = {
    h1: "text-4xl",
    h2: "text-3xl",
    h3: "text-xl",
    h4: "text-lg",
    h5: "text-base",
    h6: "text-base",
  };
  return <H className={VARIANT_STYLES[variant]}>{children}</H>;
}

export const HeadingProps = z.object({
  children: z.string().default("Heading"),
  variant: z.enum(["h1", "h2", "h3", "h4", "h5", "h6"]).default("h1"),
});
export type HeadingProps = z.infer<typeof HeadingProps>;
