import './chunk-N6TORIR4.mjs';
export { d as Page } from './chunk-JE7FAOUE.mjs';
export { a as ContentedProvider, b as useContented } from './chunk-Z3ZE4HI6.mjs';
export { c as ALLOW_NAVIGATE, i as COMPONENT_SELECTED, f as DELETE, d as DRAGGING, e as DROPPED, g as EDIT, j as EventActions, h as HANDSHAKE, k as MessageEvent_AllowNavigate, n as MessageEvent_Delete, l as MessageEvent_Dragging, m as MessageEvent_Dropped, o as MessageEvent_Edit, t as PostMessageSchema, u as PostMessageSchema_Self, q as PostMessage_ComponentSelected, r as PostMessage_Dragging, s as PostMessage_Dropped, p as PostMessage_Handshake, w as postMessage, v as useListener } from './chunk-V4AK5RMP.mjs';
export { default as loadable } from '@loadable/component';

function i(t){switch(t){case"ZodString":return "string";case"ZodNumber":return "number";case"ZodBoolean":return "boolean";case"ZodDate":return "date";case"ZodNaN":return "nan";case"ZodLiteral":return "literal";case"ZodEnum":return "enum";case"ZodUnion":return "union";case"ZodAny":return "any";default:return "unknown"}}function a(t,o){var r;if(t.innerType){let e={...o};return t.typeName==="ZodOptional"&&(e.optional=!0),t.typeName==="ZodDefault"&&(e.defaultValue=t.defaultValue()),a(t.innerType._def,e)}if(t.typeName==="ZodArray")return a(t.type._def,{isArray:!0,...t.minLength&&{minLength:t.minLength},...t.maxLength&&{maxLength:t.maxLength},...t.exactLength&&{exactLength:t.exactLength}});let n=[];return (r=t.checks)==null||r.map(e=>(e.regex&&console.log("REGEX",e.regex.source,e.regex.toString(),new RegExp(String(e.regex))),n.push({...e,...e.regex&&{regex:e.regex.source,flags:`${e.regex.global?"g":""}${e.regex.ignoreCase?"i":""}${e.regex.multiline?"m":""}`}}))),{...o,type:i(t.typeName),...(n==null?void 0:n.length)>0&&{checks:n},...t.typeName==="ZodLiteral"&&{value:t.value},...t.typeName==="ZodEnum"&&{values:t.values}}}function p(t,o){let n={type:"",properties:{}};if(typeof t=="object"){n.type="object";let r=t.shape;Object.keys(r).map(e=>{let s=r[e]._def;s.errorMap&&console.log(s.errorMap);let g=a(s);n.properties[e]=g,o&&o[e]&&(n.properties[e].extend=o[e]),s.values&&(n.properties[e].values=s.values);});}return n}var u="sk_skr5pte9guegsgk2u7bw92uq";var l=process.env.PUBLIC_API_KEY,m=class{constructor(){this.secretApiKey="";this.publicApiKey="";this.components={};this.getPageData=async o=>{let n=new URL(o.url).pathname,r=await fetch(`https://worker.ds-media.workers.dev/?url=${encodeURIComponent(n)}`,{headers:{authorization:`Bearer ${this.publicApiKey}`}}).then(e=>e.status===200?e.json():new Response(null,{status:e.status,statusText:e.statusText}));if(r.status===404)throw new Response(null,{status:r.status,statusText:r.statusText});return r.pageData};if(!l)throw new Error("[CONTENTED] Missing environment variable: PUBLIC_API_KEY");this.secretApiKey=u+"",this.publicApiKey=l+"";}define(o,n){let{name:r,deprecated:e=!1,...s}=n;return this.components[r]={component:o,...s},n.schema}sync(){var n;let o=[];(n=Object.keys(this.components))==null||n.map(r=>{let e=this.components[r];o.push({name:r,icon:e==null?void 0:e.icon,schema:p(e.schema,e.extend),group:e.group});});}};

export { m as C };
