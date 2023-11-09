import { Children, ReactNode, useState } from "react";
import { Logo } from "~/components/Logo";
import { NavLink as RemixNavLink, Link } from "@remix-run/react";
import {
  RemixLinkProps,
  RemixNavLinkProps,
} from "@remix-run/react/dist/components";
import { Icon } from "@iconify/react";

export default function Layout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div>
      <div className="bg-black/20 relative z-20">
        <Wrapper>
          <div className="flex justify-between items-center gap-2 py-4">
            <Link
              to="/"
              className="flex items-center gap-4 text-fuchsia-400 tracking-wide"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Logo isHovered={isHovered} /> adaptive.io
            </Link>
            <div className="">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="block md:hidden"
              >
                <Icon icon="mdi:menu" style={{ fontSize: 24 }} />
              </button>
              <div
                className={`${
                  menuOpen
                    ? "flex flex-col left-0 right-0 top-[56px] bottom-0 p-8"
                    : "hidden"
                } transition-all duration-250 fixed w-full bg-slate-900/90 md:bg-transparent backdrop-blur-md md:relative md:justify-end gap-8 items-center md:flex`}
              >
                <NavLink to="/product">Product</NavLink>
                <NavLink to="/solutions">Solutions</NavLink>
                <NavLink to="/developers">Developers</NavLink>
                <NavLink to="/pricing">Pricing</NavLink>
                <Button to="/app">Go to App</Button>
              </div>
            </div>
          </div>
        </Wrapper>
      </div>
      <Wrapper>{children}</Wrapper>
    </div>
  );
}

function Wrapper({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-screen-xl px-8">{children}</div>;
}

function NavLink(props: RemixNavLinkProps) {
  return <RemixNavLink {...props}>{props.children}</RemixNavLink>;
}

function Button(props) {
  return (
    <a {...props} className="rounded px-4 py-2 bg-pink-600 hover:bg-pink-700">
      {props.children}
    </a>
  );
}
