import { C } from "cms-client";
import { CardProps } from "~/components/Card";
import { CardSectionProps } from "~/components/CardSection";
import { ParagraphProps } from "~/components/Paragraph";

import { LinkProps } from "~/components/Link";
import { HeadingProps } from "~/components/Heading";
import { lazy } from "react";
import { FieldProps } from "~/components/Field";
import { HeroProps } from "~/components/Hero";
import { GridProps } from "~/components/Grid";
import { PaddingProps } from "~/components/Padding";

const Card = lazy(() => import("~/components/Card"));
const CardSection = lazy(() => import("~/components/CardSection"));
const Paragraph = lazy(() => import("~/components/Paragraph"));
const Link = lazy(() => import("~/components/Link"));
const Heading = lazy(() => import("~/components/Heading"));
const Field = lazy(() => import("~/components/Field"));
const Hero = lazy(() => import("~/components/Hero"));
const Grid = lazy(() => import("~/components/Grid"));
const Padding = lazy(() => import("~/components/Padding"));

export const cms = new C("pk_vpwgo6fp9vittk4zoeizwy5h");

const GROUPS = {
  LAYOUT: "Layout",
  TEXT: "Text",
  DESIGN: "Design",
  FORMS: "Forms",
};

cms.define(Card, {
  name: "Card",
  icon: `mdi:card-outline`,
  schema: CardProps,
  group: GROUPS.DESIGN,
});

cms.define(CardSection, {
  name: "CardSection",
  icon: `material-symbols:short-text-rounded`,
  schema: CardSectionProps,
  group: GROUPS.TEXT,
});

cms.define(Paragraph, {
  name: "Paragraph",
  icon: `system-uicons:paragraph-end`,
  schema: ParagraphProps,
  group: GROUPS.TEXT,
});

cms.define(Link, {
  name: "Link",
  icon: `mdi:link`,
  schema: LinkProps,
  group: GROUPS.TEXT,
});

cms.define(Heading, {
  name: "Heading",
  schema: HeadingProps,
  icon: "mdi:format-heading-hash",
  group: GROUPS.TEXT,
});

cms.define(Field, {
  name: "Field",
  schema: FieldProps,
  icon: "mdi:form-textbox",
  group: GROUPS.FORMS,
});

cms.define(Hero, {
  name: "Hero",
  schema: HeroProps,
  icon: "fluent:image-alt-text-24-filled",
  group: GROUPS.DESIGN,
});
cms.define(Grid, {
  name: "Grid",
  schema: GridProps,
  icon: "vaadin:grid",
  group: GROUPS.LAYOUT,
});
cms.define(Padding, {
  name: "Padding",
  schema: PaddingProps,
  icon: "radix-icons:padding",
  group: GROUPS.LAYOUT,
});

cms.sync();
