import { z } from "zod";

export const ALLOW_NAVIGATE = "ALLOW_NAVIGATE";
export const DRAGGING = "DRAGGING";
export const DROPPED = "DROPPED";
export const DELETE = "DELETE";
export const EDIT = "EDIT";
export const HANDSHAKE = "HANDSHAKE";
export const COMPONENT_SELECTED = "COMPONENT_SELECTED";

export type EventActions = z.infer<typeof EventActions>[];
export const EventActions = z.enum([
  HANDSHAKE,
  COMPONENT_SELECTED,
  ALLOW_NAVIGATE,
  DRAGGING,
  DROPPED,
  DELETE,
  EDIT,
]);

export const MessageEvent_AllowNavigate = z.object({
  _action: z.literal(ALLOW_NAVIGATE),
  isNavigateEnabled: z.boolean(),
});
export type MessageEvent_AllowNavigate = z.infer<typeof MessageEvent_AllowNavigate>;

export const MessageEvent_Dragging = z.object({
  _action: z.literal(DRAGGING),
  x: z.number(),
  y: z.number(),
});
export type MessageEvent_Dragging = z.infer<typeof MessageEvent_Dragging>;

export const MessageEvent_Dropped = z.object({
  _action: z.literal(DROPPED),
  x: z.number(),
  y: z.number(),
  component: z.object({
    id: z.string().cuid2(),
    component: z.string(),
    data: z.any(),
  }),
});
export type MessageEvent_Dropped = z.infer<typeof MessageEvent_Dropped>;

export const MessageEvent_Delete = z.object({
  _action: z.literal(DELETE),
  id: z.string().cuid2(),
});
export type MessageEvent_Delete = z.infer<typeof MessageEvent_Delete>;

export const MessageEvent_Edit = z.object({
  _action: z.literal(EDIT),
  id: z.string().cuid2(),
  field: z.string(),
  value: z.any(),
});
export type MessageEvent_Edit = z.infer<typeof MessageEvent_Edit>;

export const PostMessage_Handshake = z.object({
  _action: z.literal(HANDSHAKE),
  location: z.object({
    href: z.string(),
    pathname: z.string(),
  }),
});
export type PostMessage_Handshake = z.infer<typeof PostMessage_Handshake>;

export const PostMessage_ComponentSelected = z.object({
  _action: z.literal(COMPONENT_SELECTED),
  id: z.string().cuid2(),
  page: z.string(),
  component: z.string(),
  data: z.any(),
  // dataPath: z.string(),
});
export type PostMessage_ComponentSelected = z.infer<typeof PostMessage_ComponentSelected>;

export const PostMessage_Dragging = z.object({
  _action: z.literal(DRAGGING),
  x: z.number(),
  y: z.number(),
});
export type PostMessage_Dragging = z.infer<typeof PostMessage_Dragging>;

export const PostMessage_Dropped = z.object({
  _action: z.literal(DROPPED),
  page: z.string(),
  component: z.object({
    id: z.string().cuid2(),
    component: z.string(),
    data: z.any(),
  }),
  // dataPath: z.string(),
  // index: z.number(),
  parentId: z.union([z.string().cuid2(), z.null()]),
  pageId: z.string().cuid2(),
  sort: z.number(),
});
export type PostMessage_Dropped = z.infer<typeof PostMessage_Dropped>;

export type PostMessageSchema = z.infer<typeof PostMessageSchema>;
export const PostMessageSchema = z.discriminatedUnion("_action", [
  PostMessage_Handshake,
  PostMessage_ComponentSelected,
  PostMessage_Dropped,
]);

export type PostMessageSchema_Self = z.infer<typeof PostMessageSchema_Self>;
export const PostMessageSchema_Self = z.discriminatedUnion("_action", [
  PostMessage_Dragging,
  PostMessage_Dropped,
]);
