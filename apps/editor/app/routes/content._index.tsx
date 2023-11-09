import { Icon } from "@iconify-icon/react";
import { DataFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { intlFormatDistance } from "date-fns";
import { and, eq } from "drizzle-orm";
import { pages } from "database";
import { Copy } from "~/components/Clipboard";
import { H1 } from "~/components/Headings";
import { Pill } from "~/components/Pill";
import { TBody, TD, TH, THead, TR, Table } from "~/components/Table";
import Syntax from "~/components/syntax";
import { db } from "~/utils/drizzle.server";

export const loader = async ({ request }: DataFunctionArgs) => {
  const content = await db.query.pages.findMany({
    where: eq(pages.tenantId, "skr5pte9guegsgk2u7bw92uq"),
  });
  return json({ content });
};

export default function ContentIndexPage() {
  const { content } = useLoaderData<typeof loader>();
  return (
    <div>
      <H1>Pages</H1>

      <Table>
        <THead>
          <TR>
            <TH>URL</TH>
            <TH>Title</TH>
            <TH>Status</TH>
            <TH>Created</TH>
            <TH>Updated</TH>
          </TR>
        </THead>
        <TBody>
          {content?.map((page, i) => {
            return (
              <TR key={i}>
                <TD>
                  <Link
                    to={`/edit/${page.id}`}
                    className="app-text-blue-600 app-underline hover:app-text-blue-800"
                  >
                    {page.url}
                  </Link>
                </TD>
                <TD>
                  <Link
                    to={`/edit/${page.id}`}
                    className="app-text-blue-600 app-underline hover:app-text-blue-800"
                  >
                    {page.title}
                  </Link>
                </TD>
                <TD>
                  <Pill status={page.isActive ? "active" : "inactive"}>
                    {page.isActive ? "active" : "inactive"}
                  </Pill>
                </TD>
                <TD>
                  {intlFormatDistance(new Date(page.createdAt), new Date())}
                </TD>
                <TD>
                  {intlFormatDistance(new Date(page.updatedAt), new Date())}
                </TD>
              </TR>
            );
          })}
        </TBody>
      </Table>

      <Syntax>{content}</Syntax>
    </div>
  );
}
