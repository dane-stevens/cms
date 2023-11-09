import * as zod from 'zod';
import { z, ZodSchema } from 'zod';
export { default as loadable } from '@loadable/component';
export { Page } from './components/Page.js';
export { default as ContentedProvider, useContented } from './components/Contented.js';
import 'react/jsx-runtime';
import 'react';

interface DefinitionOptions<TData> {
    name: string;
    schema: z.Schema<TData>;
    /**
     * Optionally: specify alternate input fields to be used in the visual editor.
     *
     * @see {@link https://docs.contented.design/custom-components/#schemas Schema docs}
     *
     * @example
     *
     * ```js
     * schema: {
     *   z.object({
     *     state: z.string().length(2),
     *     ...
     *   })
     * },
     * extend: {
     *    state: {
     *      // Use a select box
     *      input: 'select',
     *      // With these options: [[value, text]]
     *      options: [
     *        ["NY", "New York"],
     *        ["TX", "Texas"],
     *        ...
     *      ]
     *    }
     * }
     * ```
     */
    extend?: Extend;
    /**
     * An Iconify icon string.
     * Browse icons: https://icon-sets.iconify.design/
     * @example "mdi:account" | "ic:round-facebook"
     */
    icon?: string;
    deprecated?: boolean;
    group?: string;
}
interface Extend {
    [key: string]: ExtendedTextarea | ExtendedFile | ExtendedSelect;
}
interface ExtendedTextarea {
    input: "textarea";
}
interface ExtendedFile {
    input: "file";
}
interface ExtendedSelect {
    input: "select";
    /**
     * @example
     * ```js
     * [["NY", "New York"], ["TX", "Texas"]]
     * ```
     * @example
     * ```js
     * ["New York", "Texas"]
     * ```
     */
    selectOptions: [string, string][] | string[];
}
interface Components {
    [key: string]: Component;
}
interface Component {
    component: any;
}

declare const ALLOW_NAVIGATE = "ALLOW_NAVIGATE";
declare const DRAGGING = "DRAGGING";
declare const DROPPED = "DROPPED";
declare const DELETE = "DELETE";
declare const EDIT = "EDIT";
declare const HANDSHAKE = "HANDSHAKE";
declare const COMPONENT_SELECTED = "COMPONENT_SELECTED";
type EventActions = z.infer<typeof EventActions>[];
declare const EventActions: z.ZodEnum<["HANDSHAKE", "COMPONENT_SELECTED", "ALLOW_NAVIGATE", "DRAGGING", "DROPPED", "DELETE", "EDIT"]>;
declare const MessageEvent_AllowNavigate: z.ZodObject<{
    _action: z.ZodLiteral<"ALLOW_NAVIGATE">;
    isNavigateEnabled: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    _action: "ALLOW_NAVIGATE";
    isNavigateEnabled: boolean;
}, {
    _action: "ALLOW_NAVIGATE";
    isNavigateEnabled: boolean;
}>;
type MessageEvent_AllowNavigate = z.infer<typeof MessageEvent_AllowNavigate>;
declare const MessageEvent_Dragging: z.ZodObject<{
    _action: z.ZodLiteral<"DRAGGING">;
    x: z.ZodNumber;
    y: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    _action: "DRAGGING";
    x: number;
    y: number;
}, {
    _action: "DRAGGING";
    x: number;
    y: number;
}>;
type MessageEvent_Dragging = z.infer<typeof MessageEvent_Dragging>;
declare const MessageEvent_Dropped: z.ZodObject<{
    _action: z.ZodLiteral<"DROPPED">;
    x: z.ZodNumber;
    y: z.ZodNumber;
    component: z.ZodObject<{
        id: z.ZodString;
        component: z.ZodString;
        data: z.ZodAny;
    }, "strip", z.ZodTypeAny, {
        component: string;
        id: string;
        data?: any;
    }, {
        component: string;
        id: string;
        data?: any;
    }>;
}, "strip", z.ZodTypeAny, {
    _action: "DROPPED";
    x: number;
    y: number;
    component: {
        component: string;
        id: string;
        data?: any;
    };
}, {
    _action: "DROPPED";
    x: number;
    y: number;
    component: {
        component: string;
        id: string;
        data?: any;
    };
}>;
type MessageEvent_Dropped = z.infer<typeof MessageEvent_Dropped>;
declare const MessageEvent_Delete: z.ZodObject<{
    _action: z.ZodLiteral<"DELETE">;
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    _action: "DELETE";
    id: string;
}, {
    _action: "DELETE";
    id: string;
}>;
type MessageEvent_Delete = z.infer<typeof MessageEvent_Delete>;
declare const MessageEvent_Edit: z.ZodObject<{
    _action: z.ZodLiteral<"EDIT">;
    id: z.ZodString;
    field: z.ZodString;
    value: z.ZodAny;
}, "strip", z.ZodTypeAny, {
    _action: "EDIT";
    id: string;
    field: string;
    value?: any;
}, {
    _action: "EDIT";
    id: string;
    field: string;
    value?: any;
}>;
type MessageEvent_Edit = z.infer<typeof MessageEvent_Edit>;
declare const PostMessage_Handshake: z.ZodObject<{
    _action: z.ZodLiteral<"HANDSHAKE">;
    location: z.ZodObject<{
        href: z.ZodString;
        pathname: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        href: string;
        pathname: string;
    }, {
        href: string;
        pathname: string;
    }>;
}, "strip", z.ZodTypeAny, {
    _action: "HANDSHAKE";
    location: {
        href: string;
        pathname: string;
    };
}, {
    _action: "HANDSHAKE";
    location: {
        href: string;
        pathname: string;
    };
}>;
type PostMessage_Handshake = z.infer<typeof PostMessage_Handshake>;
declare const PostMessage_ComponentSelected: z.ZodObject<{
    _action: z.ZodLiteral<"COMPONENT_SELECTED">;
    id: z.ZodString;
    page: z.ZodString;
    component: z.ZodString;
    data: z.ZodAny;
}, "strip", z.ZodTypeAny, {
    _action: "COMPONENT_SELECTED";
    component: string;
    id: string;
    page: string;
    data?: any;
}, {
    _action: "COMPONENT_SELECTED";
    component: string;
    id: string;
    page: string;
    data?: any;
}>;
type PostMessage_ComponentSelected = z.infer<typeof PostMessage_ComponentSelected>;
declare const PostMessage_Dragging: z.ZodObject<{
    _action: z.ZodLiteral<"DRAGGING">;
    x: z.ZodNumber;
    y: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    _action: "DRAGGING";
    x: number;
    y: number;
}, {
    _action: "DRAGGING";
    x: number;
    y: number;
}>;
type PostMessage_Dragging = z.infer<typeof PostMessage_Dragging>;
declare const PostMessage_Dropped: z.ZodObject<{
    _action: z.ZodLiteral<"DROPPED">;
    page: z.ZodString;
    component: z.ZodObject<{
        id: z.ZodString;
        component: z.ZodString;
        data: z.ZodAny;
    }, "strip", z.ZodTypeAny, {
        component: string;
        id: string;
        data?: any;
    }, {
        component: string;
        id: string;
        data?: any;
    }>;
    parentId: z.ZodUnion<[z.ZodString, z.ZodNull]>;
    pageId: z.ZodString;
    sort: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    sort: number;
    _action: "DROPPED";
    component: {
        component: string;
        id: string;
        data?: any;
    };
    page: string;
    parentId: string | null;
    pageId: string;
}, {
    sort: number;
    _action: "DROPPED";
    component: {
        component: string;
        id: string;
        data?: any;
    };
    page: string;
    parentId: string | null;
    pageId: string;
}>;
type PostMessage_Dropped = z.infer<typeof PostMessage_Dropped>;
type PostMessageSchema = z.infer<typeof PostMessageSchema>;
declare const PostMessageSchema: z.ZodDiscriminatedUnion<"_action", [z.ZodObject<{
    _action: z.ZodLiteral<"HANDSHAKE">;
    location: z.ZodObject<{
        href: z.ZodString;
        pathname: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        href: string;
        pathname: string;
    }, {
        href: string;
        pathname: string;
    }>;
}, "strip", z.ZodTypeAny, {
    _action: "HANDSHAKE";
    location: {
        href: string;
        pathname: string;
    };
}, {
    _action: "HANDSHAKE";
    location: {
        href: string;
        pathname: string;
    };
}>, z.ZodObject<{
    _action: z.ZodLiteral<"COMPONENT_SELECTED">;
    id: z.ZodString;
    page: z.ZodString;
    component: z.ZodString;
    data: z.ZodAny;
}, "strip", z.ZodTypeAny, {
    _action: "COMPONENT_SELECTED";
    component: string;
    id: string;
    page: string;
    data?: any;
}, {
    _action: "COMPONENT_SELECTED";
    component: string;
    id: string;
    page: string;
    data?: any;
}>, z.ZodObject<{
    _action: z.ZodLiteral<"DROPPED">;
    page: z.ZodString;
    component: z.ZodObject<{
        id: z.ZodString;
        component: z.ZodString;
        data: z.ZodAny;
    }, "strip", z.ZodTypeAny, {
        component: string;
        id: string;
        data?: any;
    }, {
        component: string;
        id: string;
        data?: any;
    }>;
    parentId: z.ZodUnion<[z.ZodString, z.ZodNull]>;
    pageId: z.ZodString;
    sort: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    sort: number;
    _action: "DROPPED";
    component: {
        component: string;
        id: string;
        data?: any;
    };
    page: string;
    parentId: string | null;
    pageId: string;
}, {
    sort: number;
    _action: "DROPPED";
    component: {
        component: string;
        id: string;
        data?: any;
    };
    page: string;
    parentId: string | null;
    pageId: string;
}>]>;
type PostMessageSchema_Self = z.infer<typeof PostMessageSchema_Self>;
declare const PostMessageSchema_Self: z.ZodDiscriminatedUnion<"_action", [z.ZodObject<{
    _action: z.ZodLiteral<"DRAGGING">;
    x: z.ZodNumber;
    y: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    _action: "DRAGGING";
    x: number;
    y: number;
}, {
    _action: "DRAGGING";
    x: number;
    y: number;
}>, z.ZodObject<{
    _action: z.ZodLiteral<"DROPPED">;
    page: z.ZodString;
    component: z.ZodObject<{
        id: z.ZodString;
        component: z.ZodString;
        data: z.ZodAny;
    }, "strip", z.ZodTypeAny, {
        component: string;
        id: string;
        data?: any;
    }, {
        component: string;
        id: string;
        data?: any;
    }>;
    parentId: z.ZodUnion<[z.ZodString, z.ZodNull]>;
    pageId: z.ZodString;
    sort: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    sort: number;
    _action: "DROPPED";
    component: {
        component: string;
        id: string;
        data?: any;
    };
    page: string;
    parentId: string | null;
    pageId: string;
}, {
    sort: number;
    _action: "DROPPED";
    component: {
        component: string;
        id: string;
        data?: any;
    };
    page: string;
    parentId: string | null;
    pageId: string;
}>]>;

interface ListenerOptions {
    origin?: string;
    deps?: any[];
}
declare function useListener(func: (event: MessageEvent) => void, actions: EventActions, schema: ZodSchema, options?: ListenerOptions): void;

declare function postMessage(event: PostMessageSchema): void;

interface PageDataResult {
    id: string;
    title: string;
    description?: string;
    children: any[];
}
declare class C {
    secretApiKey: string;
    publicApiKey: string;
    components: Components;
    constructor();
    /**
     * @param component
     * @param options - {@link https://docs.contented.design/custom-components/definition/#options Component definition options}
     * @returns ZodSchema
     */
    define<TData>(component: any, options: DefinitionOptions<TData>): zod.ZodType<TData, zod.ZodTypeDef, TData>;
    sync(): void;
    getPageData: (request: Request) => Promise<PageDataResult>;
}

export { ALLOW_NAVIGATE, C, COMPONENT_SELECTED, DELETE, DRAGGING, DROPPED, EDIT, EventActions, HANDSHAKE, MessageEvent_AllowNavigate, MessageEvent_Delete, MessageEvent_Dragging, MessageEvent_Dropped, MessageEvent_Edit, PostMessageSchema, PostMessageSchema_Self, PostMessage_ComponentSelected, PostMessage_Dragging, PostMessage_Dropped, PostMessage_Handshake, postMessage, useListener };
