import { useEffect, useRef, useState } from "react";

import { DropZone } from "./DropZone";
import { checkIsInside } from "../utils/functions";
import { ParseContent } from "./ParseContent";
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

export const editColor = "dodgerblue";

export const CMSPARENT = "http://localhost:5009";

export function Page({ data }: { data: any }) {
  const [children, setChildren] = useState(data.children);
  const [allowNavigate, setAllowNavigate] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  let dataPath = `children`;
  let valuePath = "children";

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

  return (
    <div
      ref={pageRef}
      className={`contented:page border ${isHovered ? "border-purple-600" : "border-transparent"}`}
      data-testid="page"
    >
      {children && (
        <ParseContent
          data={children}
          isParentHovered={true}
          dataPath={dataPath}
          valuePath={valuePath}
        />
      )}
      {children?.length < 1 && (
        <DropZone
          index={0}
          isParentHovered={true}
          // onDrop={(child) => setChildren([...children, child])}
          onDrop={() => console.log("hjid")}
          dataPath={dataPath}
        />
      )}
      <div className="flex justify-center gap-4"></div>
      {/* <pre>{JSON.stringify(cms, null, 2)}</pre> */}
      <style type="text/css">
        {allowNavigate
          ? ""
          : `
            .contented a {
              pointer-events:none;
            }
          `}
      </style>
    </div>
  );
}
