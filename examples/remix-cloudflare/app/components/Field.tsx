import { z } from "zod";

export default function Field({ type = "text", name, label }: FieldProps) {
  return (
    <div>
      <label htmlFor={`f_${name}`}>{label}</label>
      <div className="border rounded">
        <input type={type} name={name} id={`f_${name}`} className="w-full" />
      </div>
    </div>
  );
}

export const FieldProps = z.object({
  type: z.enum(["text", "number", "email", "tel"]),
  name: z.string(),
  label: z.string(),
});

export type FieldProps = z.infer<typeof FieldProps>;
