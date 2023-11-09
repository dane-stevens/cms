import { NavLink as RemixNavLink, NavLinkProps } from "@remix-run/react";

export function DefaultLayout({ children }) {
  return (
    <div
      className="app-w-screen app-h-screen app-grid app-text-slate-100 app-bg-zinc-900"
      style={{
        grid: `
          "header header header" auto
          "left body right" 1fr
          "left footer right" auto
          / auto 1fr auto
        `,
      }}
    >
      <div
        className="app-bg-zinc-900 app-border-b app-border-white/10 app-p-4"
        style={{ gridArea: "header" }}
      >
        <div className="app-flex app-justify-between">
          <div className=" app-text-xl">
            <span className="app-text-cyan-500 app-uppercase">Content</span>
            <span className="app-text-pink-600 app-uppercase">ed</span>
            <span className="app-text-xs app-text-slate-500">.design</span>
          </div>
          <div className="app-flex app-gap-4">
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/analytics">Analytics</NavLink>
            <NavLink to="/content">Content</NavLink>
            <NavLink to="/settings">Settings</NavLink>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

function NavLink(props: NavLinkProps) {
  return (
    <RemixNavLink
      {...props}
      className={({ isActive }) =>
        (isActive ? `app-bg-zinc-600` : "") + ` app-rounded app-px-2 app-py-1`
      }
    >
      {props.children}
    </RemixNavLink>
  );
}
