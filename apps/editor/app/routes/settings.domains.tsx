import { Icon } from "@iconify-icon/react";
import { createId } from "@paralleldrive/cuid2";
import { DataFunctionArgs, json } from "@remix-run/node";
import { intlFormat, intlFormatDistance } from "date-fns";
import { ReactNode } from "react";
import { useFetcher } from "react-router-dom";

import { Copy } from "~/components/Clipboard";
import { H1 } from "~/components/Headings";
import { Pill } from "~/components/Pill";
import { Table, THead, TBody, TFoot, TH, TR, TD } from "~/components/Table";
import { mask } from "~/components/mask";
import { Outlet } from "@remix-run/react";

export default function SettingsBranchesPage() {
  const publicKey = `pk_${createId()}`;

  return (
    <div>
      <H1>Domains</H1>

      <Outlet />
    </div>
  );
}
