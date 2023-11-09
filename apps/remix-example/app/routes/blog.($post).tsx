import { createId } from "@paralleldrive/cuid2";
import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";
import { Page } from "cms-client";
import { cms } from "~/utils/cms";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const pageData = await cms.getPageData(request);
    return json({ pageData });
  } catch (err) {
    return json({ pageData: null });
  }
};

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  if (!data) {
    return [
      { title: "Missing Shake" },
      {
        name: "description",
        content: `There is no shake with the ID of ${params.shakeId}. 😢`,
      },
    ];
  }

  const { pageData } = data;
  return [
    { title: `${pageData.title} | DS Media` },
    { name: "description", content: pageData.description },
  ];
};

export default function Index() {
  const { pageData } = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex gap-4  underline bg-slate-900 h-20 items-center px-16">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${isActive ? "text-purple-600" : "text-blue-600"}`
          }
          end
          // prefetch="intent"
        >
          Home
        </NavLink>
        <NavLink
          to="/blog"
          className={({ isActive }) =>
            `${isActive ? "text-purple-600" : "text-blue-600"}`
          }
          end
          // prefetch="intent"
        >
          Blog
        </NavLink>
        <NavLink
          to="/blog/post1"
          className={({ isActive }) =>
            `${isActive ? "text-purple-600" : "text-blue-600"}`
          }
          // prefetch="intent"
        >
          Post 1
        </NavLink>
      </div>
      <div className="px-16 py-8">
        <Page key={pageData.title} data={pageData} />
      </div>
    </div>
  );
}
