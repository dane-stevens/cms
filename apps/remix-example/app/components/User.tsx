import { ReactNode } from "react";
import { z } from "zod";

export default function User({ firstName, lastName, children }: UserProps) {
  return (
    <div className="bg-blue-600">
      {firstName} {lastName} {children}
    </div>
  );
}

export const UserProps = z.object({
  firstName: z.string(),
  lastName: z.string(),
  children: z.any(),
});
export type UserProps = z.infer<typeof UserProps>;
