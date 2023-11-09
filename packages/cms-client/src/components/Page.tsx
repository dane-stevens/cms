import { Suspense, useEffect, useRef, useState } from "react";

import { DropZone } from "./DropZone";
import { checkIsInside } from "../utils/functions";
import { ParseChildBlocks } from "./ParseChildBlocks";
import { useListener } from "../hooks/useListener";
import {
  ALLOW_NAVIGATE,
  DRAGGING,
  DROPPED,
  MessageEvent_AllowNavigate,
  MessageEvent_Dragging,
  MessageEvent_Dropped,
} from "../zodTypes";
import { z } from "zod";
import { postMessage } from "../utils/postMessage";
import { useContented } from "./Contented";

export const editColor = "dodgerblue";

export function Page({ data }: { data: any }) {
  // const [children, setChildren] = useState(data?.children);
  const { isEditable } = useContented();
  const children = data.children;
  const [allowNavigate, setAllowNavigate] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return postMessage({
      _action: "HANDSHAKE",
      location: {
        href: window.location.href,
        pathname: window.location.pathname,
      },
    });
  }, []);

  useListener(
    getMessage,
    [ALLOW_NAVIGATE, DRAGGING, DROPPED],
    z.discriminatedUnion("_action", [
      MessageEvent_AllowNavigate,
      MessageEvent_Dragging,
      MessageEvent_Dropped,
    ])
  );

  function getMessage(event: MessageEvent) {
    if (event.data._action === ALLOW_NAVIGATE) {
      setAllowNavigate(event.data.isNavigateEnabled);
    }

    if (event.data._action === DRAGGING) {
      const bounds: any = pageRef?.current?.getBoundingClientRect();
      setIsHovered(checkIsInside(bounds, { x: event.data.x, y: event.data.y }));
    }
    if (event.data._action === DROPPED) {
      setIsHovered(false);
    }
  }
  console.log(data);
  // return null;

  return (
    <Suspense fallback={"Loading..."}>
      <div ref={pageRef} className={`__adaptivecms__`} data-adaptivecms="page">
        {/* CHECK IF CHILDREN ALLOWED */}
        {children && <ParseChildBlocks data={children} pageId={data.id} parentId={null} />}

        <style type="text/css">
          {allowNavigate || !isEditable
            ? ""
            : `
            .__adaptivecms__ a {
              pointer-events:none;
            }
          `}
        </style>
      </div>
    </Suspense>
  );
}
