// import Card from "~/cms/Card";
// import CardSection from "~/cms/CardSection";

import { json, LoaderArgs } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";
import Card from "~/components/Card";
import CardSection from "~/components/CardSection";
import CustomCard from "~/components/CustomCard";
import Link from "~/components/Link";
import { Page } from "cms-client";
import { cms } from "~/utils/cms";

export const loader = async ({ request }: LoaderArgs) => {
  try {
    const pageData = await cms.getPageData(request);
    return json({ pageData });
  } catch (err) {
    return new Error("Error");
  }
};

// import { cms } from "~/cms";
export default function Index() {
  // console.log(cms.definitions);
  const { pageData } = useLoaderData<typeof loader>();
  console.log({ pageData });
  return (
    <div className="p-8">
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
      <Page data={pageData} />
    </div>
  );
}
