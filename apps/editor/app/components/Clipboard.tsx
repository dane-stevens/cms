import { Icon } from "@iconify-icon/react";
import { useEffect, useState } from "react";

export function Copy({ children, text }: { children: string; text?: string }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isCopied) {
      let timeout = setTimeout(() => {
        setIsCopied(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isCopied]);

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
  }

  function clearIsCopied() {
    setIsCopied(false);
  }

  if (!isHydrated) return null;

  return (
    <span className="app-flex app-gap-2 app-items-center">
      <span className="app-font-mono">{children}</span>
      <button
        type="button"
        onClick={() => (text ? copyText(text) : copyText(children))}
        className="app-text-zinc-400 app-relative"
      >
        <Icon icon="mdi:content-copy" />
        {isCopied && (
          <div className="app-absolute app-text-xs app-bg-green-900 app-text-green-400 app-left-0 app-top-0 app-whitespace-nowrap app-border app-px-2 app-py1-1 app-border-green-700 app-rounded">
            Copied to clipboard!
          </div>
        )}
      </button>
    </span>
  );
}
