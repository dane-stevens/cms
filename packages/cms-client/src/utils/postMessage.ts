import { PARENT_ORIGIN } from "src/hooks/useListener";
import { PostMessageSchema, PostMessageSchema_Self } from "src/zodTypes";

export function postMessage(event: PostMessageSchema) {
  const targetWindow = window.parent;

  const data = PostMessageSchema.parse(event);

  return targetWindow.postMessage(data, PARENT_ORIGIN);
}

export function postMessageSelf(event: PostMessageSchema_Self) {
  const targetWindow = window;
  const data = PostMessageSchema_Self.parse(event);
  return targetWindow.postMessage(data, location?.origin);
}
