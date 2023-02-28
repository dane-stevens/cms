import { CMSPARENT } from "src/hooks/useListener";
import { PostMessageSchema } from "src/zodTypes";

export function postMessage(event: PostMessageSchema) {
  const targetWindow = window.parent;

  const data = PostMessageSchema.parse(event);

  return targetWindow.postMessage(data, CMSPARENT);
}
