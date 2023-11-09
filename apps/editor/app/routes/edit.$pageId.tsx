import { json, LoaderArgs } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";

// import { capital } from "case";
import { useEffect, useRef, useState } from "react";
// import {
//   AiOutlineDesktop,
//   AiOutlineTablet,
//   AiOutlineMobile,
// } from "react-icons/ai";
// import { MdKeyboardArrowRight } from "react-icons/md";
import { client } from "~/utils/redis.server";
import { Icon } from "@iconify-icon/react";
import { createId } from "@paralleldrive/cuid2";

import {
  PostMessage_ComponentSelected,
  PostMessage_Dropped,
  PostMessage_Handshake,
  useListener,
} from "cms-client";
import { jsonSchemaToZod } from "~/utils/jsonSchemaToZod";
import { z } from "zod";
import { db } from "~/utils/drizzle.server";
import { and, eq } from "drizzle-orm";
import { components, pages } from "database";

let iframeUrl = `http://localhost:5910`;

const DESKTOP = "DESKTOP";
const TABLET = "TABLET";
const MOBILE = "MOBILE";

export const loader = async ({ request, params }: LoaderArgs) => {
  const pageData = await db.query.pages.findFirst({
    where: and(
      eq(components.tenantId, "skr5pte9guegsgk2u7bw92uq"),
      eq(pages.id, params.pageId)
    ),
  });

  const componentList = await db.query.components.findMany({
    where: eq(components.tenantId, "skr5pte9guegsgk2u7bw92uq"),
  });

  const componentGroups = new Set<string>();
  componentList?.map(
    (component) =>
      component.groupName && componentGroups.add(component.groupName)
  );

  return json({
    editUrl: new URL(pageData?.url, iframeUrl),
    componentGroups: Array.from(componentGroups),
    components: componentList,
  });
};

export default function Index() {
  const { editUrl, componentGroups, components } =
    useLoaderData<typeof loader>();
  const dropzoneRef = useRef(null);
  const iframeRef = useRef(null);
  const [device, setDevice] = useState(DESKTOP);
  const [editData, setEditData] = useState();
  const [currentUrl, setCurrentURL] = useState(new URL(editUrl).href);
  const [currentPathname, setCurrentPathname] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const content = useFetcher();
  const contentRef = useRef(null);
  const destroyFormRef = useRef(null);

  const componentDataFetcher = useFetcher();

  // useEffect(() => {
  //   window.addEventListener("message", getMessage, false);
  //   return () => window.removeEventListener("message", getMessage);
  // }, []);

  useListener(
    getMessage,
    ["HANDSHAKE", "COMPONENT_SELECTED", "DROPPED"],
    z.discriminatedUnion("_action", [
      PostMessage_Handshake,
      PostMessage_ComponentSelected,
      PostMessage_Dropped,
    ]),
    {
      // Validate child origin
      origin: new URL(editUrl).origin,
    }
  );

  function getMessage(event: MessageEvent) {
    console.log(event);
    if (event.origin !== new URL(editUrl).origin) return;
    if (event.data._action === "HANDSHAKE") {
      setCurrentURL(event.data.location.href);
      setCurrentPathname(event.data.location.pathname);
    }
    if (event.data._action === "COMPONENT_SELECTED") {
      setEditData(event.data);
      componentDataFetcher.load(`/api/getComponentData/${event.data.id}`);
    }
    if (event.data._action === "DROPPED") {
      fetch("/api/save", {
        method: "post",
        body: JSON.stringify({
          ...event.data,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }

  const targetWindow = iframeRef?.current;
  const currentUrlParts = currentUrl.split("://");

  let saveDataTimeout;

  let component = editData
    ? components.find((component) => component.name === editData.component)
    : null;

  console.log({ currentUrl });
  return (
    <>
      <div
        className="app-bg-zinc-900 app-border-r app-border-white/10 app-w-80 app-p-4 app-flex app-flex-col app-gap-4"
        style={{ gridArea: "left" }}
      >
        {componentGroups?.map((componentGroup, groupIndex) => {
          return (
            <div key={groupIndex}>
              <h2 className="app-uppercase app-text-xs app-text-zinc-400">
                {componentGroup}
              </h2>
              <div className="app-grid app-grid-cols-3 app-gap-2">
                {components
                  ?.filter(
                    (component) => component.groupName === componentGroup
                  )
                  .map((component, i) => {
                    const componentDefaults = {
                      component: component.name,
                      data: {},
                    };

                    const schema = component.schema;

                    Object.keys(schema.properties)?.map((propertyKey) => {
                      const property = schema.properties[propertyKey];
                      if (property.defaultValue) {
                        componentDefaults.data[propertyKey] =
                          property.defaultValue;
                      }
                    });

                    return (
                      <div
                        key={i}
                        className="app-w-full app-h-20 app-flex app-items-center app-justify-center app-rounded app-border app-bg-zinc-800 app-border-zinc-700 hover:app-bg-zinc-900 app-cursor-grab"
                        draggable
                        onDrag={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          return setIsDragging(componentDefaults);
                        }}
                        onDragEnd={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          return setIsDragging(false);
                        }}
                      >
                        <div>
                          <div className="app-flex app-justify-center app-mb-2">
                            <Icon
                              icon={component.icon || "radix-icons:component-1"} // mdi-code
                              className="app-text-zinc-500 app-text-[24px]"
                            />
                          </div>

                          <div className="app-text-xs app-text-center">
                            {component.name}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{ gridArea: "body" }}
        className="app-grid app-grid-rows-[40px_1fr]"
      >
        <div className="app-bg-zinc-900 app-border-b app-border-white/10 app-grid app-grid-cols-3">
          <div></div>
          <div className="app-flex app-items-center app-justify-center app-gap-2">
            <button type="button" onClick={() => setDevice(DESKTOP)}>
              <Icon
                icon="ic:round-desktop-mac"
                style={{ fontSize: 24 }}
                className={`${device === DESKTOP ? "app-text-blue-500" : ""}`}
              />
            </button>
            <button type="button" onClick={() => setDevice(TABLET)}>
              <Icon
                icon="ic:round-tablet-mac"
                style={{ fontSize: 24 }}
                className={`${device === TABLET ? "app-text-blue-500" : ""}`}
              />
            </button>
            <button type="button" onClick={() => setDevice(MOBILE)}>
              <Icon
                icon="ic:round-phone-iphone"
                style={{ fontSize: 24 }}
                className={`${device === MOBILE ? "app-text-blue-500" : ""}`}
              />
            </button>
          </div>
          <div className="app-flex app-items-center app-justify-end app-px-4 app-text-zinc-500 app-group">
            <div className="app-flex app-w-full app-justify-end">
              <div className="app-max-w-0 app-group-hover:max-w-full app-transition-all app-duration-200 app-overflow-hidden">
                {currentUrlParts[0]}://
              </div>
              <div className="app-group-hover:text-zinc-300 app-text-ellipsis">
                {currentUrlParts[1]}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div
            className={`app-w-full app-h-full app-mx-auto app-transition-all app-duration-500 app-relative ${
              device === MOBILE
                ? "app-max-w-[320px]"
                : device === TABLET
                ? "app-max-w-[640px]"
                : "app-max-w-full"
            }`}
          >
            <iframe
              ref={iframeRef}
              src={currentUrl}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
              className="app-w-full app-h-full app-bg-white"
              onLoad={(e) => console.log(e)}
            />
            {isDragging && (
              <div
                ref={dropzoneRef}
                className="app-bg-transparent app-w-full app-h-full app-absolute app-top-0 app-left-0 app-right-0 app-bottom-0"
                onDragStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const element = dropzoneRef?.current.getBoundingClientRect();
                  const coordinates = {
                    x: e.pageX - element.x,
                    y: e.pageY - element.y,
                  };
                  targetWindow?.contentWindow.postMessage(
                    { _action: "DRAGGING", ...coordinates },
                    iframeUrl
                  );
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const element = dropzoneRef?.current.getBoundingClientRect();
                  const coordinates = {
                    x: e.pageX - element.x,
                    y: e.pageY - element.y,
                  };
                  targetWindow?.contentWindow.postMessage(
                    {
                      _action: "DROPPED",
                      ...coordinates,
                      component: {
                        id: createId(),
                        ...isDragging,
                      },
                    },
                    iframeUrl
                  );
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div
        key={editData?.id}
        className="app-bg-zinc-900 app-border-l app-border-white/10  app-w-80 app-p-4"
        style={{ gridArea: "right" }}
      >
        <label>
          <input
            type="checkbox"
            onChange={(e) => {
              return targetWindow?.contentWindow.postMessage(
                {
                  _action: "ALLOW_NAVIGATE",
                  isNavigateEnabled: e.target.checked,
                },
                iframeUrl
              );
            }}
          />
          Allow navigation
        </label>
        {/* {JSON.stringify(component)} */}
        {editData ? (
          <Collapsable title={editData.component} isDefaultOpen>
            <content.Form ref={contentRef}>
              <input type="hidden" name="id" value={editData.id} />
              <input
                type="hidden"
                name="component"
                value={editData.component}
              />
              <input type="hidden" name="dataPath" value={editData.dataPath} />
              <input type="hidden" name="page" value={currentPathname} />
              {Object.keys(component.schema.properties)?.map((dataKey, i) => {
                const property = component.schema.properties[dataKey];
                let min = null;
                let max = null;
                let type =
                  property.type === "number"
                    ? "number"
                    : property.type === "date"
                    ? "datetime-local"
                    : property.type === "enum"
                    ? "select"
                    : "text";

                property.checks?.map((check) => {
                  if (check.kind === "email") type = "email";
                  if (check.kind === "url") type = "url";
                  if (check.kind === "datetime") type = "datetime-local";
                  if (check.kind === "min") min = check.value;
                  if (check.kind === "max") max = check.value;
                });

                if (componentDataFetcher.state !== "idle") return null;

                if (dataKey === "children" && property.type === "unknown")
                  return null;

                return (
                  <>
                    <Field
                      key={i}
                      // label={capital(dataKey)}
                      label={dataKey}
                      name={`values.${dataKey}`}
                      defaultValue={
                        (componentDataFetcher?.data &&
                          componentDataFetcher.data[dataKey]) ||
                        property.defaultValue ||
                        ""
                      }
                      type={type}
                      min={min}
                      max={max}
                      autoFocus={i === 0}
                      options={property.values}
                      onChange={(e) => {
                        if (property.extend) {
                          content.load(`/api/getUploadUrl`);
                        }
                        targetWindow?.contentWindow.postMessage(
                          {
                            _action: "EDIT",
                            id: editData.id,
                            field: dataKey,
                            value: e.target.value,
                          },
                          iframeUrl
                        );

                        clearTimeout(saveDataTimeout);
                        return (saveDataTimeout = setTimeout(() => {
                          return content.submit(contentRef.current, {
                            method: "post",
                            action: "/api/saveData",
                          });

                          // content.submit(
                          //   {
                          //     data: JSON.stringify({
                          //       page: currentPathname,
                          //       id: editData.id,
                          //       field: dataKey,
                          //       value: e.target.value,
                          //       dataPath: editData.dataPath,
                          //     }),
                          //   },
                          //   {
                          //     method: "post",
                          //     action: "/api/saveData",
                          //   }
                          // );
                        }, 500));
                      }}
                    />
                  </>
                );
              })}
              {content?.data && <div>{JSON.stringify(content.data)}</div>}
            </content.Form>
            <content.Form
              ref={destroyFormRef}
              method="post"
              action="/api/destroyComponent"
              onSubmit={(e) => {
                targetWindow?.contentWindow.postMessage(
                  {
                    _action: "DELETE",
                    id: editData.id,
                  },
                  iframeUrl
                );
              }}
            >
              <input
                type="hidden"
                name="data"
                value={JSON.stringify({
                  id: editData.id,
                  dataPath: editData.dataPath,
                  page: currentPathname,
                })}
              />
              <button
                type="submit"
                className="app-bg-red-600 app-w-full app-p-2 app-rounded"
              >
                Destroy
              </button>
            </content.Form>
          </Collapsable>
        ) : (
          <>
            <div className="app-text-center app-text-xs app-py-8 app-rounded app-border app-border-dashed app-border-zinc-700 app-text-zinc-300 app-bg-zinc-800">
              Select a component to edit
            </div>

            <Collapsable title="Page details" isDefaultOpen>
              <Field
                label="Title"
                name="title"
                defaultValue=""
                helper="SEO page title"
              />
              <Field
                label="Description"
                name="description"
                defaultValue=""
                helper="SEO page description"
                // placeholder="Describe the content of your page"
              />
            </Collapsable>
          </>
        )}

        {/* <pre>{JSON.stringify(editData, null, 2)}</pre> */}
      </div>
      <div
        style={{ gridArea: "footer" }}
        className="app-bg-zinc-900 app-border-t app-border-white/10 app-text-xs app-px-4 app-py-2 app-text-zinc-300"
      >
        footer
      </div>
    </>
  );
}

function Collapsable({ title, children, isDefaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(isDefaultOpen);
  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`app-flex app-gap-1 app-items-center`}
      >
        {/* <MdKeyboardArrowRight
          size={20}
          className={`transition-all duration-200 fill-zinc-500 ${
            isOpen ? "rotate-90" : "rotate-0"
          }`}
        /> */}
        {title}
      </button>
      <div
        className={`app-overflow-hidden app-transition-all app-duration-500 app-mt-4 ${
          isOpen ? "app-max-h-[1000px]" : "app-max-h-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  helper = "",
  type = "text",
  placeholder = "",
  defaultValue = "",
  options = [],
  onChange,
  autoFocus = false,
  min,
  max,
}) {
  const id = `f_${name}`;
  return (
    <div className="app-mb-4">
      <label
        htmlFor={id}
        className="app-block app-text-sm app-text-zinc-300 app-tracking-wide"
      >
        {label}
      </label>
      {type === "select" ? (
        <select
          id={id}
          name={name}
          defaultValue={defaultValue}
          className="app-bg-zinc-800 app-indent-2 app-rounded app-w-full app-py-2 app-outline-none"
          placeholder={placeholder}
          onChange={onChange}
          autoFocus={autoFocus}
        >
          {options?.map((option, i) => {
            return (
              <option key={i} value={option}>
                {option}
              </option>
            );
          })}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          min={min}
          max={max}
          defaultValue={defaultValue}
          className="app-bg-zinc-800 app-indent-2 app-rounded app-w-full app-py-2 app-outline-none"
          placeholder={placeholder}
          onChange={onChange}
          autoFocus={autoFocus}
        />
      )}
      <div className="app-text-xs app-text-zinc-400 app-tracking-wide">
        {helper}
      </div>
    </div>
  );
}
