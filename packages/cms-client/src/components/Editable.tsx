import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useContented } from "./Contented";
import { DropZone } from "./DropZone";
import { checkIsInside } from "../utils/functions";
import { CMSPARENT, editColor } from "./Page";
import { ParseContent } from "./ParseContent";
import { useListener } from "../hooks/useListener";
import { DRAGGING, EDIT, MessageEvent_Dragging, MessageEvent_Edit } from "../zodTypes";
import { z } from "zod";
import { postMessage } from "../utils/postMessage";

export function Editable({ index, content, isParentHovered, dataPath, valuePath, onDrop }: any) {
  const { cms, isEditable } = useContented();
  const ref = useRef<HTMLDivElement>(null);
  const components = cms.components;
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const { component, data, children: componentChildren = [], id } = content;
  const [componentData, setComponentData] = useState(data);
  const [isEditing, setIsEditing] = useState(false);
  const [children, setChildren] = useState(componentChildren);

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
          <ParseContent
            data={children}
            isParentHovered={isHovered}
            dataPath={`${dataPath}.${id}.children`}
          />
        )}
      </Component>
    );
  }

  function setParentEditing() {
    // setIsEditing(true);
    console.log(componentDefinition.type);

    return postMessage({
      _action: "COMPONENT_SELECTED",
      page: window.location.href,
      id,
      component: content.component,
      data: content.data,
      dataPath: valuePath,
    });
  }

  return (
    <div style={{ position: "relative" }} draggable>
      {
        // Only display dropzone if not the first child
        index === 0 && (
          <DropZone
            index={index}
            isParentHovered={isParentHovered}
            onDrop={(child: any) => onDrop && onDrop(child, index)}
            dataPath={dataPath}
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
          ...((isHovered || isSelected) &&
            !isEditing && {
              border: `1px solid ${editColor}`,
              margin: "-1px",
            }),
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
            {componentData?.children}
            {children && (
              <ParseContent
                data={children}
                isParentHovered={isHovered}
                dataPath={`${dataPath}.${id}.children`}
                valuePath={`${valuePath}.${id}.children`}
              />
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
        index={index + 1}
        isParentHovered={isParentHovered}
        onDrop={(child: any) => onDrop && onDrop(child, index + 1)}
        dataPath={dataPath}
        // onDrop={(child) => onDrop && onDrop('after', child)
      />
    </div>
  );
}
