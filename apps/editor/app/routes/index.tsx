import { json, LoaderArgs } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { capital } from "case";
import { useEffect, useRef, useState } from "react";
import {
  AiOutlineDesktop,
  AiOutlineTablet,
  AiOutlineMobile,
} from "react-icons/ai";
import { MdKeyboardArrowRight } from "react-icons/md";
import { client } from "~/utils/redis.server";
import { Icon } from "@iconify-icon/react";
import { createId } from "@paralleldrive/cuid2";
import { Button } from "ui";

import {
  PostMessage_ComponentSelected,
  PostMessage_Dropped,
  PostMessage_Handshake,
  useListener,
} from "cms-client";
import { jsonSchemaToZod } from "~/utils/jsonSchemaToZod";
import { z } from "zod";

const iframeUrl = `http://localhost:5010`;

const DESKTOP = "DESKTOP";
const TABLET = "TABLET";
const MOBILE = "MOBILE";

export const loader = async ({ request }: LoaderArgs) => {
  const componentList = await client.sMembers(
    `tenent:skr5pte9guegsgk2u7bw92uq:components`
  );
  console.log(componentList);
  const components = [];
  const componentPromises = [];

  componentList?.map((compomentKey) =>
    componentPromises.push(
      client.get(compomentKey).then((res) => {
        const component = JSON.parse(res);
        if (component.schema) {
          jsonSchemaToZod(component.schema);
        }
        components.push(component);
      })
    )
  );
  await Promise.all(componentPromises);
  return json({ components });
};

export default function Index() {
  const { components } = useLoaderData<typeof loader>();
  const dropzoneRef = useRef(null);
  const iframeRef = useRef(null);
  const [device, setDevice] = useState(DESKTOP);
  const [editData, setEditData] = useState();
  const [currentUrl, setCurrentURL] = useState(iframeUrl);
  const [currentPathname, setCurrentPathname] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const content = useFetcher();
  const contentRef = useRef(null);
  const destroyFormRef = useRef(null);

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
    ])
  );

  function getMessage(event) {
    console.log(event);
    if (event.origin !== iframeUrl) return;
    if (event.data._action === "HANDSHAKE") {
      setCurrentURL(event.data.location.href);
      setCurrentPathname(event.data.location.pathname);
    }
    if (event.data._action === "COMPONENT_SELECTED") setEditData(event.data);
    if (event.data._action === "DROPPED") {
      console.log(event.data);
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

  return (
    <>
      <div
        className="w-screen h-screen grid text-slate-100 bg-zinc-900"
        style={{
          grid: `
          "header header header" auto
          "left body right" 1fr
          "left footer right" auto
          / auto 1fr auto
        `,
        }}
      >
        <div
          className="bg-zinc-900 border-b border-white/10 text-xl p-4"
          style={{ gridArea: "header" }}
        >
          <span className="text-cyan-500 uppercase">Content</span>
          <span className="text-pink-600 uppercase">ed</span>
          <span className="text-xs text-slate-500">.design</span>
          <Button>test</Button>
        </div>
        <div
          className="bg-zinc-900 border-r border-white/10 w-80 p-4"
          style={{ gridArea: "left" }}
        >
          <div className="grid grid-cols-3 gap-2">
            {components?.map((component, i) => {
              const componentDefaults = {
                component: component.name,
                data: {},
              };

              const schema = component.schema;

              Object.keys(schema.properties)?.map((propertyKey) => {
                const property = schema.properties[propertyKey];
                if (property.defaultValue) {
                  componentDefaults.data[propertyKey] = property.defaultValue;
                }
              });

              // if (component.zod) {
              //   console.log(component.zod.shape);
              // }
              // if (schema) {
              //   const validator = ajv.compile(component.schema);
              //   console.log(validator({ amount: 1000 }));
              // }
              // component.zodSchema = parseSchema(schema);

              // if (schema) {
              //   Object.keys(schema.properties).map((property) => {
              //     if (schema.properties[property]?.default)
              //       componentDefaults.data[property] =
              //         schema.properties[property].default;
              //     return;
              //   });
              // }

              return (
                <div
                  key={i}
                  className="w-full h-20 flex items-center justify-center rounded border bg-zinc-800 border-zinc-700 hover:bg-zinc-900 cursor-grab"
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
                    <div className="flex justify-center mb-2">
                      <Icon
                        icon={component.icon || "mdi:code"}
                        className="text-zinc-500 text-[24px]"
                      />
                    </div>

                    <div className="text-xs text-center">{component.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ gridArea: "body" }} className="grid grid-rows-[40px_1fr]">
          <div className="bg-zinc-900 border-b border-white/10 grid grid-cols-3">
            <div></div>
            <div className="flex items-center justify-center gap-2">
              <button type="button" onClick={() => setDevice(DESKTOP)}>
                <AiOutlineDesktop
                  size={24}
                  className={`${device === DESKTOP ? "fill-blue-500" : ""}`}
                />
              </button>
              <button type="button" onClick={() => setDevice(TABLET)}>
                <AiOutlineTablet
                  size={24}
                  className={`${device === TABLET ? "fill-blue-500" : ""}`}
                />
              </button>
              <button type="button" onClick={() => setDevice(MOBILE)}>
                <AiOutlineMobile
                  size={19}
                  className={`${device === MOBILE ? "fill-blue-500" : ""}`}
                />
              </button>
            </div>
            <div className="flex items-center justify-end px-4 text-zinc-500 group">
              <div className="flex w-full justify-end">
                <div className="max-w-0 group-hover:max-w-full transition-all duration-200 overflow-hidden">
                  {currentUrlParts[0]}://
                </div>
                <div className="group-hover:text-zinc-300 text-ellipsis">
                  {currentUrlParts[1]}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div
              className={`w-full h-full mx-auto transition-all duration-500 relative ${
                device === MOBILE
                  ? "max-w-[320px]"
                  : device === TABLET
                  ? "max-w-[640px]"
                  : "max-w-full"
              }`}
            >
              <iframe
                ref={iframeRef}
                src={iframeUrl}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
                className="w-full h-full bg-white"
                onLoad={(e) => console.log(e)}
              />
              {isDragging && (
                <div
                  ref={dropzoneRef}
                  className="bg-transparent w-full h-full absolute top-0 left-0 right-0 bottom-0"
                  onDragStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Drag start---------");
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Drag enter---------");
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const element =
                      dropzoneRef?.current.getBoundingClientRect();
                    const coordinates = {
                      x: e.pageX - element.x,
                      y: e.pageY - element.y,
                    };
                    console.log({ coordinates });
                    targetWindow?.contentWindow.postMessage(
                      { _action: "DRAGGING", ...coordinates },
                      iframeUrl
                    );
                    console.log("Drag over---------");
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Drag leave---------");
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("DROPEED", e);
                    const element =
                      dropzoneRef?.current.getBoundingClientRect();
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
          className="bg-zinc-900 border-l border-white/10  w-80 p-4"
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
                <input
                  type="hidden"
                  name="dataPath"
                  value={editData.dataPath}
                />
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
                      : "text";

                  property.checks?.map((check) => {
                    if (check.kind === "email") type = "email";
                    if (check.kind === "url") type = "url";
                    if (check.kind === "datetime") type = "datetime-local";
                    if (check.kind === "min") min = check.value;
                    if (check.kind === "max") max = check.value;
                  });

                  return (
                    <>
                      <Field
                        key={i}
                        label={capital(dataKey)}
                        name={`values.${dataKey}`}
                        defaultValue={property.defaultValue || ""}
                        type={type}
                        min={min}
                        max={max}
                        autoFocus={i === 0}
                        onChange={(e) => {
                          if (property.extend) {
                            console.log("EXTEND-------------", property.extend);
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
                <button type="submit" className="bg-red-600 w-full p-2 rounded">
                  Destroy
                </button>
              </content.Form>
            </Collapsable>
          ) : (
            <>
              <div className="text-center text-xs py-8 rounded border border-dashed border-zinc-700 text-zinc-300 bg-zinc-800">
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
          className="bg-zinc-900 border-t border-white/10 text-xs px-4 py-2 text-zinc-300"
        >
          footer
        </div>
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
        className={`flex gap-1 items-center`}
      >
        <MdKeyboardArrowRight
          size={20}
          className={`transition-all duration-200 fill-zinc-500 ${
            isOpen ? "rotate-90" : "rotate-0"
          }`}
        />
        {title}
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 mt-4 ${
          isOpen ? "max-h-[1000px]" : "max-h-0"
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
  onChange,
  autoFocus = false,
  min,
  max,
}) {
  const id = `f_${name}`;
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm text-zinc-300 tracking-wide">
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        min={min}
        max={max}
        defaultValue={defaultValue}
        className="bg-zinc-800 indent-2 rounded w-full py-2 outline-none"
        placeholder={placeholder}
        onChange={onChange}
        autoFocus={autoFocus}
      />
      <div className="text-xs text-zinc-400 tracking-wide">{helper}</div>
    </div>
  );
}
