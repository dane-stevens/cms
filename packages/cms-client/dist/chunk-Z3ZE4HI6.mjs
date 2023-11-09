import { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { jsx } from 'react/jsx-runtime';

var i=createContext({cms:void 0,isEditable:!1});function x({cms:e,editorOrigin:d="http://localhost:5909",children:s}){let[t,a]=useState(!1);useEffect(()=>{var n,o;window.self!==window.top&&((o=(n=document==null?void 0:document.location)==null?void 0:n.ancestorOrigins)!=null&&o.contains(d))&&a(!0);},[]);let r=useMemo(()=>({isEditable:t,cms:e}),[e,t]);return jsx(i.Provider,{value:r,children:s})}var E=()=>useContext(i);

export { x as a, E as b };
