import { useEffect } from "react";
import { EventActions } from "src/zodTypes";
import { ZodSchema } from "zod";

export const PARENT_ORIGIN =
  process.env.NODE_ENV === "development" ? "http://localhost:5909" : "https://adaptive.io";

interface ListenerOptions {
  origin?: string;
  deps?: any[];
}
export function useListener(
  func: (event: MessageEvent) => void,
  actions: EventActions,
  schema: ZodSchema,
  options?: ListenerOptions
) {
  useEffect(
    () => {
      window.addEventListener("message", messageEventHandler);
      return () => window.removeEventListener("message", messageEventHandler);
    },
    options?.deps || []
  );

  function messageEventHandler(event: MessageEvent) {
    return handleMessage(event, func, actions, schema);
  }

  function handleMessage(
    event: MessageEvent,
    func: (event: MessageEvent) => void,
    actions: EventActions,
    schema: ZodSchema
  ) {
    if (
      event.origin !== PARENT_ORIGIN &&
      event.origin !== location?.origin &&
      event.origin !== options?.origin
    )
      return;
    if (!actions.includes(event.data._action)) return;
    schema.parse(event.data);
    return func(event);
  }
  return;
}
