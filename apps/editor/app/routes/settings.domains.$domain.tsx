import { Icon } from "@iconify-icon/react";
import { DataFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { intlFormat, intlFormatDistance } from "date-fns";
import { and, eq } from "drizzle-orm";
import { domains } from "database";
import { z } from "zod";
import { Copy } from "~/components/Clipboard";
import { Pill } from "~/components/Pill";
import { TBody, TD, TH, THead, TR, Table } from "~/components/Table";
import { db } from "~/utils/drizzle.server";
import { resolveTxt } from "node:dns/promises";
import { Submit } from "~/components/Form";

const domainPrefix = "_cms";

const Params = z.object({
  domain: z.string(),
});

export const loader = async ({ request, params }: DataFunctionArgs) => {
  const parsedParams = Params.parse(params);

  const domainLookup = decodeURIComponent(parsedParams.domain);

  const domain = await db.query.domains.findFirst({
    where: and(
      eq(domains.domain, domainLookup),
      eq(domains.tenantId, "skr5pte9guegsgk2u7bw92uq")
    ),
  });

  if (!domain) throw new Error("Unable to find that domain.");

  return json({ domain });
};

export default function Page() {
  const { domain } = useLoaderData<typeof loader>();

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
          <TR>
            <TD>
              <span className="app-flex app-items-center app-gap-1">
                <Icon icon="gridicons:domains" />
                <span>{domain.domain}</span>
              </span>
            </TD>
            <TD>
              <Pill status={domain.isVerified ? "verified" : "unverified"}>
                {domain.isVerified ? "verified" : "unverified"}
              </Pill>
              {/* <VerifyDomain /> */}
            </TD>
            <TD>
              {intlFormatDistance(new Date(domain.createdAt), new Date())}
            </TD>
          </TR>
        </TBody>
      </Table>
      <Table>
        <THead>
          <TR>
            <TH colspan={2}>
              Add this TXT record to verify ownership of this domain.
            </TH>
          </TR>
        </THead>
        <TBody>
          <TR>
            <TD>Type</TD>
            <TD>TXT</TD>
          </TR>
          <TR>
            <TD>Hostname </TD>
            <TD>
              <Copy>{`${domainPrefix}.${String(domain.domain)}`}</Copy>
            </TD>
          </TR>
          <TR>
            <TD>Value </TD>
            <TD>
              <Copy>{String(domain.verificationCode)}</Copy>
            </TD>
          </TR>
        </TBody>
      </Table>
      {!domain.isVerified && (
        <Form method="post">
          <input type="hidden" name="domain" value={String(domain.domain)} />
          <Submit>Verify domain</Submit>
        </Form>
      )}
    </div>
  );
}

export const action = async ({ request, params }: DataFunctionArgs) => {
  const parsedParams = Params.parse(params);

  const domainLookup = decodeURIComponent(parsedParams.domain);

  const domain = await db.query.domains.findFirst({
    where: and(
      eq(domains.domain, domainLookup),
      eq(domains.tenantId, "skr5pte9guegsgk2u7bw92uq")
    ),
  });

  if (!domain) throw new Error("Unable to find that domain.");

  const res = await resolveTxt(`${domainPrefix}.${domainLookup}`);
  if (!res) throw new Error("Unable to verify domain");
  const verificationCode = res[0][0];
  if (domain.verificationCode === verificationCode) {
    await db
      .update(domains)
      .set({ isVerified: true })
      .where(
        and(
          eq(domains.domain, domainLookup),
          eq(domains.tenantId, "skr5pte9guegsgk2u7bw92uq")
        )
      );
  }
  return json({ domain });
};
