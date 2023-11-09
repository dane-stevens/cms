import { ReactNode } from "react";

export function H1({ children }: { children: ReactNode }) {
  return <h1 className="app-text-3xl">{children}</h1>;
}
