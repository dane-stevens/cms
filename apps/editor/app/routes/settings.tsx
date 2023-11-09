import { RemixNavLinkProps } from "@remix-run/react/dist/components";
import { Outlet, NavLink as RemixNavLink } from "@remix-run/react";
import { Icon, IconifyIcon } from "@iconify-icon/react";

export default function SettingsPage() {
  return (
    <>
      <div
        className="app-bg-zinc-900 app-border-r app-border-white/10 app-w-80 app-p-4 app-flex app-flex-col app-gap-2"
        style={{ gridArea: "left" }}
      >
        <NavLink icon="mdi:account" to="/settings">
          Profile
        </NavLink>
        <NavLink icon="mdi:key" to="/settings/apiKeys">
          API Keys
        </NavLink>
        <NavLink icon="mdi:translate" to="/settings/localization">
          Localization
        </NavLink>
        <NavLink icon="mdi:source-branch" to="/settings/branches">
          Branches
        </NavLink>
        <NavLink icon="mdi:account-group" to="/settings/team">
          Team
        </NavLink>
        <NavLink icon="gridicons:domains" to="/settings/domains">
          Domains
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
