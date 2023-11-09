import { Link } from "@remix-run/react";
import { ReactNode } from "react";

export function Button({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="app-rounded app-bg-primary app-px-4 app-py-2 hover:app-bg-primaryDark app-inline-block"
    >
      {children}
    </Link>
  );
}
