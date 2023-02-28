import currency from "currency.js";
import { z } from "zod";

export default function Currency({ amount }: CurrencyProps) {
  return (
    <div className="text-4xl">
      {currency(amount).format({
        // separator: " ",
        // decimal: ",",
        // pattern: "# !",
      })}
    </div>
  );
}

export type CurrencyProps = z.infer<typeof CurrencyProps>;
export const CurrencyProps = z.object({
  amount: z.number().min(0).max(99).default(10),
});
