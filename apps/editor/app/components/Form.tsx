import { HTMLInputTypeAttribute, ReactNode } from "react";

interface FieldProps {
  name: string;
  label: ReactNode;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  error?: any;
}

export function Field({
  name,
  label,
  type = "text",
  error,
  placeholder,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={`f_${name}`}>{label}</label>
      <div className="app-border app-rounded app-border-zinc-700">
        <input
          type={type}
          name={name}
          id={`f_${name}`}
          className="app-bg-transparent app-indent-2 app-py-2 app-w-full"
          placeholder={placeholder}
        />
      </div>
      {error && <div>{JSON.stringify(error)}</div>}
    </div>
  );
}

export function Submit({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="app-px-4 app-py-2 app-bg-primary hover:app-bg-primaryDark app-rounded"
    >
      {children}
    </button>
  );
}
