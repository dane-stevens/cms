import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useContented } from "./Contented";
import { DropZone } from "./DropZone";
import { checkIsInside, checkIsNear } from "../utils/functions";
import { editColor } from "./Page";
import { ParseChildBlocks } from "./ParseChildBlocks";
import { useListener } from "../hooks/useListener";
import {
  COMPONENT_SELECTED,
  DRAGGING,
  EDIT,
  MessageEvent_Dragging,
  MessageEvent_Edit,
} from "../zodTypes";
import { z } from "zod";
import { postMessage, postMessageSelf } from "../utils/postMessage";
import { DROPPED } from "../zodTypes";

export function Editable({
  index,
  content,
  isParentHovered,
  previousSortKey,
  nextSortKey,
  // dataPath,
  // valuePath,
  onDrop,
  pageId, // parentId,
  parentId,
}: any) {
  const { cms, isEditable } = useContented();
  const ref = useRef<HTMLDivElement>(null);
  const components = cms.components;
  const [isHovered, setIsHovered] = useState(false);
  const [isNear, setIsNear] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const { component, data, children = [], id } = content;
  const [componentData, setComponentData] = useState(data);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsSelected(false);
        setIsEditing(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  // Listen for postMessage events
  useListener(
    getMessage,
    [DRAGGING, EDIT],
    z.discriminatedUnion("_action", [MessageEvent_Dragging, MessageEvent_Edit])
  );

  function getMessage(event: MessageEvent) {
    if (event.data._action === DRAGGING) {
      const bounds: any = ref?.current?.getBoundingClientRect();
      setIsHovered(checkIsInside(bounds, { x: event.data.x, y: event.data.y }));
      setIsNear(checkIsNear(bounds, { x: event.data.x, y: event.data.y }, 60));
    }

    if (event.data.id === id && event.data._action === EDIT) {
      setComponentData((data: any) => {
        return {
          ...data,
          [event.data.field]: event.data.value,
        };
      });
    }
  }

  const componentDefinition = components[component];

  const Component = componentDefinition.component;

  // if (!components[component].type) {
  if (!isEditable) {
    return (
      <Component {...componentData}>
        {componentData?.children}
        {children && (
          <ParseChildBlocks
            data={children}
            isParentHovered={isHovered}
            // dataPath={`${dataPath}.${id}.children`}
            pageId={pageId}
            parentId={content.id}
          />
        )}
      </Component>
    );
  }

  function setParentEditing() {
    return postMessage({
      _action: COMPONENT_SELECTED,
      page: window.location.href,
      id,
      component: content.component,
      data: content.data,
      // dataPath: valuePath,
    });
  }

  const sortBefore = content.sort - (content.sort - previousSortKey) / 2;
  const sortAfter = content.sort + (nextSortKey - content.sort) / 2;

  return (
    <div
      style={{ position: "relative" }}
      draggable
      onDrag={(e) => {
        const coordinates = {
          x: e.pageX,
          y: e.pageY,
        };
        return postMessageSelf({ _action: DRAGGING, ...coordinates });
        // getMessage(e)
      }}
      // onDrop={(e) => {
      //   const coordinates = {
      //     x: e.pageX,
      //     y: e.pageY,
      //   };
      //   // return postMessageSelf({ _action: DROPPED, ...coordinates });
      // }}
    >
      {
        // Only display dropzone if not the first child
        index === 0 && (
          <DropZone
            isParentHovered={isParentHovered}
            onDrop={(child: any) => onDrop && onDrop(child, index)}
            parentId={parentId || content.id}
            pageId={pageId}
            sort={sortBefore}
          />
        )
      }
      <div
        ref={ref}
        onMouseOver={(e) => {
          e.stopPropagation();
          return setIsHovered(true);
        }}
        onMouseOut={(e) => {
          e.stopPropagation();
          setIsNear(false);
          return setIsHovered(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          setIsSelected(true);
          return setParentEditing();
        }}
        style={{
          position: "relative",
          userSelect: "none",
          border: `1px ${isNear ? "dashed" : "solid"} ${
            (isHovered || isSelected) && !isEditing
              ? editColor
              : isNear
              ? "rgba(255,255,255,0.2)"
              : "rgb(0,0,0,0)"
          }`,
          transition: "all",
          transitionDuration: (isHovered || isSelected) && !isEditing ? "150ms" : "250ms",
        }}
      >
        {(isHovered || isSelected) && !isEditing && (
          <div
            style={{
              position: "absolute",
              top: "-25px",
              left: "5px",
              borderRadius: "4px",
              background: editColor,
              color: "white",
              padding: "1px 4px",
              fontSize: "9pt",
              fontFamily: "sans-serif",
              display: "flex",
              gap: "1rem",
            }}
          >
            <div style={{ color: "rgba(255,255,255,0.9)" }}>{component}</div>
            {isSelected && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  return setIsEditing(true);
                }}
              >
                Edit
              </button>
            )}
          </div>
        )}
        <div>
          <Component {...componentData}>
            {children && typeof componentData?.children !== "string" ? (
              <>
                {componentData?.children}
                <ParseChildBlocks
                  data={children}
                  isParentHovered={isHovered}
                  pageId={pageId}
                  parentId={content.id}
                />
              </>
            ) : (
              componentData?.children
            )}
          </Component>
        </div>
        {isSelected && !isEditing && (
          <button
            type="button"
            style={{
              background: editColor,
              borderRadius: "50%",
              padding: "4px",
              position: "absolute",
              bottom: "-15px",
              right: "10px",
            }}
            onClick={() => {
              console.log("add sibling");
            }}
          >
            <Icon icon="md:add" />
          </button>
        )}
      </div>
      <DropZone
        isParentHovered={isParentHovered}
        onDrop={(child: any) => onDrop && onDrop(child)}
        parentId={parentId || content.id}
        pageId={pageId}
        sort={sortAfter}
      />
    </div>
  );
}
