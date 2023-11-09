import { useRef, useState } from "react";
import { checkIsInside, checkIsNear } from "../utils/functions";
import { DRAGGING, DROPPED, MessageEvent_Dragging, MessageEvent_Dropped } from "../zodTypes";
import { z } from "zod";
import { useListener } from "../hooks/useListener";
import { postMessage, postMessageSelf } from "../utils/postMessage";
import { createId } from "@paralleldrive/cuid2";

export function DropZone({ isParentHovered, onDrop, parentId, pageId, sort }: any) {
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  useListener(
    getMessage,
    [DRAGGING, DROPPED],
    z.discriminatedUnion("_action", [MessageEvent_Dragging, MessageEvent_Dropped])
  );

  function getMessage(event: MessageEvent) {
    if (event.data._action === DRAGGING) {
      const bounds: any = dropzoneRef?.current?.getBoundingClientRect();
      const isNear = checkIsNear(bounds, {
        x: event.data.x,
        y: event.data.y,
      });
      const isInside = checkIsInside(bounds, {
        x: event.data.x,
        y: event.data.y,
      });
      setIsDragging(true);
      if (isNear) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
      if (isInside) {
        setIsSelected(true);
      } else {
        setIsSelected(false);
      }
    }
    if (event.data._action === DROPPED) {
      const bounds: any = dropzoneRef?.current?.getBoundingClientRect();
      const isInside = checkIsInside(bounds, {
        x: event.data.x,
        y: event.data.y,
      });
      setIsHovered(false);
      setIsDragging(false);
      if (isInside) {
        onDrop && onDrop({ ...event.data.component, parentId, sort });

        return postMessage({
          _action: "DROPPED",
          page: window.location.pathname,
          component: event.data.component,
          parentId,
          pageId,
          sort,
        });
      }
    }
  }

  const dropzoneId = `contented-dropzone`;

  return (
    <>
      <div
        className={`contented-dropzone ${dropzoneId} parent-${parentId}`}
        ref={dropzoneRef}
        style={{
          // minHeight: isHovered ? "40px" : "0px",
          height: isHovered ? "20px" : "0px",
          display: isDragging ? "flex" : "none",
          background: isSelected ? "#3b82f6" : "#dbeafe",
          border: isSelected ? "1px solid #3b82f6" : isHovered ? "1px dashed #3b82f6" : "",
          color: isSelected ? "white" : "#1e40af",
          alignItems: "center",
          justifyContent: "center",
          // margin: "5px",
          margin: "2px 0",
          borderRadius: "4px",
          overflow: "hidden",
          transition: "height, display",
          transitionDuration: "100ms",
          // position: "absolute",
          width: "100%",
          zIndex: "10",
        }}
      >
        {parentId}
        {/* <style type="text/css">{`.${dropzoneId} + .contented-dropzone { border: 1px solid red; height: 0px !important; minHeight: 0px !important; display:none !important; }`}</style> */}
      </div>
    </>
  );
}
