import { Icon } from "@iconify-icon/react";
import { createId } from "@paralleldrive/cuid2";
import { intlFormat, intlFormatDistance } from "date-fns";
import { ReactNode } from "react";
import { Copy } from "~/components/Clipboard";
import { H1 } from "~/components/Headings";
import { Pill } from "~/components/Pill";
import { Progress } from "~/components/Progress";
import { Table, THead, TBody, TFoot, TH, TR, TD } from "~/components/Table";
import { mask } from "~/components/mask";

export default function SettingsBranchesPage() {
  const publicKey = `pk_${createId()}`;

  return (
    <div>
      <H1>Localization</H1>

      <Table
        footer={
          <div className="app-flex app-justify-center app-items-center app-w-full app-p-16  app-border-t app-border-zinc-700">
            Upgrade to enterprize
          </div>
        }
      >
        <THead>
          <TR>
            <TH roundFirst>Locale</TH>
            <TH roundLast>Coverage</TH>
          </TR>
        </THead>
        <TBody>
          <TR>
            <TD>
              <span className="app-flex app-items-center app-gap-1">
                <Icon icon="mdi:translate" />
                <span>en_US</span> <Pill>default</Pill>
              </span>
            </TD>
            <TD>
              <Progress percentage={100} />
            </TD>
          </TR>
        </TBody>
      </Table>
    </div>
  );
}
