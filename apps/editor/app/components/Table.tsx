import { ReactNode } from "react";

export function Table({
  children,
  footer,
}: {
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className=" app-rounded app-overflow-hidden app-border app-border-zinc-700">
      <table
        className="app-w-full app-border-collapse"
        style={{ borderRadius: "4px" }}
      >
        {children}
      </table>
      {footer}
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="app-border-b app-border-zinc-700 app-bg-white/5">
      {children}
    </thead>
  );
}
export function TBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TR({ children }: { children: ReactNode }) {
  return <tr>{children}</tr>;
}

export function TH({
  children,
  roundFirst,
  roundLast,
  colspan,
}: {
  children: ReactNode;
  roundFirst?: boolean;
  roundLast?: boolean;
  colspan?: number;
}) {
  return (
    <th
      colSpan={colspan}
      className={`app-text-left app-py-3 app-px-4 app-font-normal  app-text-zinc-400 app-text-sm app-tracking-wide`}
    >
      {children}
    </th>
  );
}

export function TD({ children }: { children: ReactNode }) {
  return (
    <td
      className={`app-text-left app-py-3 app-px-4 app-border-t app-border-zinc-700`}
    >
      {children}
    </td>
  );
}

export function TFoot({ children }: { children: ReactNode }) {
  return <tfoot>{children}</tfoot>;
}
