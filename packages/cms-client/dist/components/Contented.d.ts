import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import { ReactNode } from 'react';

declare function ContentedProvider({ cms, editorOrigin, children, }: {
    cms: any;
    editorOrigin?: string;
    children: ReactNode;
}): react_jsx_runtime.JSX.Element;
declare const ContentedContext: react.Context<ContentedContext>;
interface ContentedContext {
    cms: any | undefined;
    isEditable: boolean;
}
declare const useContented: () => ContentedContext;

export { ContentedProvider as default, useContented };
