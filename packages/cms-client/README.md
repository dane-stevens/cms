# `cms-client`

Visually edit your react components with end-to-end type safe schemas.

## Installation

`pnpm add cms-client-dane`

`npm i cms-client-dane`

`yarn add cms-client-dane`

## Usage

### Build a component

```ts
import { z } from "zod";

export default function Button({ children }: ButtonProps) {
  return <button type="button">{children}</button>;
}

export type ButtonProps = z.infer<typeof ButtonProps>;
export const ButtonProps = z.object({
  children: z.string().default("Click me!"),
});
```

### Define your CMS

```ts
import { C, loadable } from "cms-client-dane";

export const cms = new C();

// Link your component
cms.define(
  loadable(() => import(`~/components/Button`)),
  {
    name: "Button",
    icon: `mdi:button`,
    schema: ButtonProps,
  }
);
```

### Render a page with remix.run

```ts
import { json, LoaderArgs } from "@remix-run/node";
import Button from "~/components/Button";
import { Page } from "cms-client-dane";

export const loader = async ({ request }: LoaderArgs) => {
  const pageData = await cms.getPageData(request);
  return json({ pageData });
};

export default function Index() {
  const { pageData } = useLoaderData<typeof loader>();
  return <Page data={pageData} />;
}
```
