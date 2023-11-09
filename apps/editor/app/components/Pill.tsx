import { ReactNode } from "react";

export function Pill({
  status,
  children,
}: {
  status: "verified" | "unverified" | "active" | "inactive";
  children: ReactNode;
}) {
  const getClassName = (status: string) => {
    switch (status) {
      case "verified":
      case "active":
        return "app-bg-green-600/20 app-text-green-500";
      case "unverified":
        return "app-bg-amber-600/20 app-text-amber-500";
      case "inactive":
        return "app-red-600/20 app-text-red-500";
      default:
        return "app-bg-blue-600/20 app-text-blue-500";
    }
  };

  const className = getClassName(status);

  return (
    <span
      className={`${className} app-px-1 app-py-[2px]  app-rounded app-text-xs app-tracking-wide`}
    >
      {children}
    </span>
  );
}
