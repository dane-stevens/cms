import { Icon } from "@iconify-icon/react";
import { createId } from "@paralleldrive/cuid2";
import { intlFormat, intlFormatDistance } from "date-fns";
import { Copy } from "~/components/Clipboard";
import { H1 } from "~/components/Headings";
import { Pill } from "~/components/Pill";
import { TBody, TD, TH, THead, TR, Table } from "~/components/Table";
import { mask } from "~/components/mask";

export default function SettingsApiKeysPage() {
  const apiKey = `sk_${createId()}`;

  return (
    <>
      <div>
        <H1>API Keys</H1>

        <Table>
          <THead>
            <TR>
              <TH>Key</TH>
              <TH>Description</TH>
              <TH>Last used</TH>
              <TH>Created </TH>
            </TR>
          </THead>
          <TBody>
            <TR>
              <TD>
                <Copy text={apiKey}>{mask(apiKey)}</Copy>
              </TD>
              <TD>
                <span className="app-flex app-items-center app-gap-1">
                  default key
                </span>
              </TD>
              <TD>{intlFormatDistance(new Date(), new Date())}</TD>
              <TD>{intlFormat(new Date())}</TD>
            </TR>
          </TBody>
        </Table>
      </div>
    </>
  );
}
