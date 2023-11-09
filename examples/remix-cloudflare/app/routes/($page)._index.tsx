// import Card from "~/cms/Card";
// import CardSection from "~/cms/CardSection";

import { DataFunctionArgs, json, MetaFunction } from "@remix-run/cloudflare";
import { NavLink, useLoaderData } from "@remix-run/react";

import { Page } from "cms-client";
import { cms } from "~/utils/cms";

export const loader = async ({ request }: DataFunctionArgs) => {
  const pageData = await cms.getPageData(request);

  if (!pageData)
    throw new Response(null, { status: 404, statusText: "Not found" });
  return json({ pageData });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.pageData?.title },
    { property: "og:title", content: data?.pageData?.title },
    { name: "description", content: data?.pageData?.description },
  ];
};

// import { cms } from "~/cms";
export default function Index() {
  const { pageData } = useLoaderData<typeof loader>();

  return <Page key={pageData?.id} data={pageData} />;
}
