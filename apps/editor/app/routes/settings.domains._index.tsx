import { Icon } from "@iconify-icon/react";
import { DataFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { intlFormat, intlFormatDistance } from "date-fns";
import { eq } from "drizzle-orm";
import { domains } from "database";
import { Button } from "~/components/Button";
import { Pill } from "~/components/Pill";
import { TBody, TD, TH, THead, TR, Table } from "~/components/Table";
import { db } from "~/utils/drizzle.server";

export const loader = async ({ request }: DataFunctionArgs) => {
  const domainList = await db.query.domains.findMany({
    where: eq(domains.tenantId, "skr5pte9guegsgk2u7bw92uq"),
  });
  return json({ domainList });
};

export default function Page() {
  const { domainList } = useLoaderData<typeof loader>();

  return (
    <div className="app-flex app-flex-col app-gap-4">
      <Table>
        <THead>
          <TR>
            <TH>Domain</TH>
            <TH>Status</TH>
            <TH>Added</TH>
          </TR>
        </THead>
        <TBody>
          {domainList?.map((domain, i) => {
            return (
              <TR key={i}>
                <TD>
                  <span className="app-flex app-items-center app-gap-1">
                    <Icon icon="gridicons:domains" />
                    <Link
                      to={`/settings/domains/${encodeURIComponent(
                        domain.domain
                      )}`}
                      prefetch="intent"
                      className="app-underline app-text-blue-600 hover:app-text-blue-400"
                    >
                      {domain.domain}
                    </Link>
                  </span>
                </TD>
                <TD>
                  <Pill status={domain?.isVerified ? "verified" : "unverified"}>
                    {domain?.isVerified ? "verified" : "unverified"}
                  </Pill>
                  {/* <VerifyDomain /> */}
                </TD>
                <TD>
                  {intlFormatDistance(new Date(domain.createdAt), new Date())}
                </TD>
              </TR>
            );
          })}
        </TBody>
      </Table>
      <div>
        <Button to="/settings/domains/add">Add a domain</Button>
      </div>
    </div>
  );
}
