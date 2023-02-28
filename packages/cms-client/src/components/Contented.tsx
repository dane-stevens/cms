import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

const ContentedContext = createContext<ContentedContext>({
  cms: undefined,
  isEditable: false,
});

export default function ContentedProvider({
  cms,
  editorOrigin = `http://localhost:5009`,
  children,
}: {
  cms: any;
  editorOrigin?: string;
  children: ReactNode;
}) {
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    if (window.self !== window.top && document?.location?.ancestorOrigins?.contains(editorOrigin)) {
      setIsEditable(true);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      isEditable,
      cms,
    }),
    [cms, isEditable]
  );

  return <ContentedContext.Provider value={contextValue}>{children}</ContentedContext.Provider>;
}

interface ContentedContext {
  cms: any | undefined;
  isEditable: boolean;
}

export const useContented = () => useContext(ContentedContext);
