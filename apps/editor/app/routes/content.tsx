import { Icon, IconifyIcon } from "@iconify-icon/react";
import { NavLink as RemixNavLink, Outlet } from "@remix-run/react";
import { RemixNavLinkProps } from "@remix-run/react/dist/components";

export default function ContentPage() {
  return (
    <>
      <div
        className="app-bg-zinc-900 app-border-r app-border-white/10 app-w-80 app-p-4 app-flex app-flex-col app-gap-2"
        style={{ gridArea: "left" }}
      >
        <NavLink icon="icon-park-outline:page" to="/pages">
          Pages
        </NavLink>
      </div>
      <div
        style={{ gridArea: "body" }}
        className="app-grid app-grid-rows-[40px_1fr]"
      >
        <div className="app-p-8">
          <Outlet />
        </div>
      </div>
    </>
  );
}

interface NavLinkProps extends RemixNavLinkProps {
  icon: IconifyIcon;
}

function NavLink(props: NavLinkProps) {
  return (
    <RemixNavLink
      {...props}
      className="app-flex app-gap-2 app-items-center app-py-2 hover:app-bg-zinc-800 app-rounded  app-px-2"
      prefetch="intent"
    >
      <Icon icon={props.icon} className="app-text-[24px] app-text-zinc-600" />
      {props.children}
    </RemixNavLink>
  );
}
