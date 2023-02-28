import { C, loadable } from "cms-client";
import { CardProps } from "~/components/Card";
import { CardSectionProps } from "~/components/CardSection";
import { UserProps } from "~/components/User";
import { UserProfileProps } from "~/components/UserProfile";
import { ParagraphProps } from "~/components/Paragraph";
import { CurrencyProps } from "~/components/Currency";

import { z } from "zod";
import { LinkProps } from "~/components/Link";
import { CustomCardProps } from "~/components/CustomCard";

export const cms = new C();

cms.define(
  loadable(() => import(`~/components/Card`)),
  {
    name: "Card",
    icon: `mdi:card-outline`,
    schema: CardProps,
  }
);

cms.define(
  loadable(() => import(`~/components/CardSection`)),
  {
    name: "CardSection",
    icon: `material-symbols:short-text-rounded`,
    schema: CardSectionProps,
  }
);

cms.define(
  loadable(() => import(`~/components/User`)),
  {
    name: "User",
    icon: "mdi:user",
    schema: UserProps,
  }
);

cms.define(
  loadable(() => import(`~/components/UserProfile`)),
  {
    name: "UserProfile",
    icon: `healthicons:ui-user-profile`,
    schema: UserProfileProps,
    extend: {
      image: {
        input: "file",
      },
    },
  }
);

cms.define(
  loadable(() => import(`~/components/Paragraph`)),
  {
    name: "Paragraph",
    icon: `system-uicons:paragraph-end`,
    schema: ParagraphProps,
  }
);

cms.define(
  loadable(() => import(`~/components/Currency`)),
  {
    name: "Currency",
    icon: `mdi:currency-usd`,
    schema: CurrencyProps,
  }
);

cms.define(
  loadable(() => import(`~/components/Link`)),
  {
    name: "Link",
    icon: `mdi:link`,
    schema: LinkProps,
  }
);

cms.define(
  loadable(() => import(`~/components/CustomCard`)),
  {
    name: "CustomCard",
    schema: CustomCardProps,
  }
);

cms.sync();
