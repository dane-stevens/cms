import { z } from 'zod';
import { jsx } from 'react/jsx-runtime';

function t({to:o,children:n}){return jsx("a",{href:o,children:n})}var e=z.object({to:z.string().url(),children:z.string()});

export { e as LinkProps, t as default };
