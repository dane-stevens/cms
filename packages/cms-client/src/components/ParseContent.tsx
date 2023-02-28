import React, { useState } from "react";
import { DELETE, MessageEvent_Delete } from "../zodTypes";
import { useListener } from "../hooks/useListener";
import { Editable } from "./Editable";

export function ParseContent({ data, isParentHovered, dataPath, valuePath }: any) {
  const [children, setChildren] = useState(data);

  useListener(getMessage, [DELETE], MessageEvent_Delete);

  function getMessage(event: MessageEvent) {
    if (event.data._action === DELETE) {
      const isInIndex = children.findIndex((child: any) => child.id === event.data.id);
      if (isInIndex !== -1) {
        return setChildren((children: any) => {
          const nextChildren = children.filter((child: any) => child.id !== event.data.id);
          return [...nextChildren];
        });
      }
    }
  }

  return (
    <>
      {Array.isArray(children) ? (
        children.map((content, i) => {
          return (
            <React.Fragment key={content.id}>
              <Editable
                index={i}
                content={content}
                isParentHovered={isParentHovered}
                dataPath={dataPath}
                valuePath={`${valuePath}[${i}]`}
                onDrop={(child: any, index: any) =>
                  setChildren((children: any) => {
                    const nextChildren = [
                      ...children.slice(0, index),
                      child,
                      ...children.slice(index),
                    ];
                    console.log(children, index, child, nextChildren);
                    return [...nextChildren];
                  })
                }
              />
            </React.Fragment>
          );
        })
      ) : (
        <>
          <Editable
            content={data}
            isParentHovered={isParentHovered}
            dataPath={dataPath}
            valuePath={`${valuePath}`}
          />
        </>
      )}
    </>
  );
}
