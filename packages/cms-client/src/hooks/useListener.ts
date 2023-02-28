import { useEffect } from "react";
import { EventActions } from "src/zodTypes";
import { ZodSchema } from "zod";

export const CMSPARENT = "http://localhost:5009";
export const CMSCHILD = "http://localhost:5010";

export function useListener(
  func: (event: MessageEvent) => void,
  actions: EventActions,
  schema: ZodSchema
) {
  useEffect(() => {
    window.addEventListener("message", messageEventHandler);
    return () => window.removeEventListener("message", messageEventHandler);
  }, []);

  function messageEventHandler(event: MessageEvent) {
    return handleMessage(event, func, actions, schema);
  }

  function handleMessage(
    event: MessageEvent,
    func: (event: MessageEvent) => void,
    actions: EventActions,
    schema: ZodSchema
  ) {
    if (event.origin !== CMSPARENT && event.origin !== CMSCHILD) return;
    if (!actions.includes(event.data._action)) return;
    schema.parse(event.data);
    return func(event);
  }
  return;
}
