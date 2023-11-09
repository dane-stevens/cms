import React, { useEffect, useState } from "react";
import { DELETE, MessageEvent_Delete } from "../zodTypes";
import { useListener } from "../hooks/useListener";
import { Editable } from "./Editable";
import { DropZone } from "./DropZone";
function sortChildren(children: any) {
  return children.sort((a: any, b: any) => (a.sort > b.sort ? 1 : -1));
}
export function ParseChildBlocks({
  data,
  isParentHovered,
  // dataPath,
  // valuePath,
  pageId,
  parentId,
}: any) {
  const [children, setChildren] = useState(sortChildren(data));

  useListener(getMessage, [DELETE], MessageEvent_Delete, { deps: [children] });

  function getMessage(event: MessageEvent) {
    if (event.data._action === DELETE) {
      console.log(event.data, children);
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
      {Array.isArray(children) && children?.length > 0 ? (
        // Render children
        children.map((child: any, i: number) => {
          const previousSortKey = children[i - 1]?.sort || child.sort - 1000;
          const nextSortKey = children[i + 1]?.sort || child.sort + 1000;
          return (
            <React.Fragment key={child.id}>
              <Editable
                index={i}
                content={child}
                isParentHovered={isParentHovered}
                previousSortKey={previousSortKey}
                nextSortKey={nextSortKey}
                // dataPath={dataPath}
                // valuePath={`${valuePath}[${i}]`}
                pageId={pageId}
                parentId={parentId}
                onDrop={(child: any, index: any) =>
                  setChildren((children: any) => {
                    console.log(child);
                    const nextChildren = sortChildren([...children, child]);
                    return [...nextChildren];
                  })
                }
              />
            </React.Fragment>
          );
        })
      ) : children?.length > 0 ? (
        children
      ) : (
        // Block has no children, render dropzone
        <DropZone
          isParentHovered={isParentHovered}
          pageId={pageId}
          parentId={parentId}
          sort={0}
          onDrop={(child: any) => {
            console.log(child);
            return setChildren([child]);
          }}
        />
      )}
    </>
  );
}
