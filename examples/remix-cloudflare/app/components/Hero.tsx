import { Link } from "@remix-run/react";
import { z } from "zod";
import { Gradient, Gradient1 } from "./Gradients";

export const HeroProps = z.object({
  title: z.string().default("An awesome title"),
  subtitle: z.string().default("Reinforcing subtitle"),
  ctaTitle: z.string().default("Click me"),
  ctaUrl: z.string().default("/"),
});

export type HeroProps = z.infer<typeof HeroProps>;

export default function Hero({ title, ctaUrl, ctaTitle, subtitle }: HeroProps) {
  return (
    <div className="h-[50vh] flex items-center justify-center relative z-0">
      <div className="absolute z-0 overflow-hidden">
        <div className="rotate-45 opacity-20  absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <Gradient />
        </div>
        <div className="-rotate-45 opacity-20  absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <Gradient1 />
        </div>
      </div>
      <div className="flex flex-col gap-8 relative z-10">
        <div className="text-4xl sm:text-5xl md:text-7xl uppercase text-pink-200 text-center">
          {title}
        </div>
        <div className="text-md md:text-xl text-center text-purple-400">
          {subtitle}
        </div>
        <div className="flex justify-center">
          <Link
            to={ctaUrl}
            className="rounded bg-pink-600 px-4 py-2 hover:bg-pink-700"
          >
            {ctaTitle}
          </Link>
        </div>
      </div>
    </div>
  );
}
