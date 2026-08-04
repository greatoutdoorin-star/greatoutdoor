"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SECONDARY_NAV, SISTER_SITE, SITE } from "@/lib/site";

export type NavCollection = { name: string; slug: string };

type SidebarProps = {
  /** Collections rendered into the primary nav, ordered by sort_order. */
  collections: NavCollection[];
  /** Shifts the fixed mobile header down to clear the announcement bar. */
  hasAnnouncement?: boolean;
};

export default function Sidebar({
  collections,
  hasAnnouncement = false,
}: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer on navigation — otherwise it stays open over the new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const primary = [
    { label: "All", href: "/collections/all" },
    ...collections.map((c) => ({ label: c.name, href: `/collections/${c.slug}` })),
    { label: "About GO.in", href: "/pages/about" },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const nav = (
    <nav className="site-nav flex flex-col">
      {/* Sizes below come from the measured theme scale, not visual guesswork. */}
      <ul className="flex flex-col gap-[26px]">
        {primary.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              style={{ fontSize: "var(--text-nav-primary)" }}
              className={`font-display font-semibold leading-none transition-colors ${
                isActive(item.href)
                  ? "text-accent underline underline-offset-[6px]"
                  : "text-ink hover:text-accent"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <ul className="mt-12 flex flex-col gap-[18px]">
        {SECONDARY_NAV.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              style={{ fontSize: "var(--text-nav-secondary)" }}
              className={`font-body leading-none transition-colors ${
                isActive(item.href)
                  ? "text-accent"
                  : "text-ink hover:text-accent"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Mobile top bar — only rendered below lg */}
      {/*
        `top` is set by the .site-header / .has-announcement rules in
        globals.css rather than a Tailwind arbitrary value: Tailwind v4 does
        not emit a class for top-[var(--announcement-h)], which left the header
        with no top offset at all.
      */}
      {/*
        Three equal columns rather than justify-between: with the sister-brand
        button on one side and the menu on the other, space-between would centre
        the logo only if both flanks happened to be the same width. Equal
        columns keep it centred regardless.
      */}
      <header
        className={`site-header fixed inset-x-0 top-0 z-40 grid h-16 grid-cols-[1fr_auto_1fr] items-center border-b border-hairline bg-canvas px-4 lg:hidden ${
          hasAnnouncement ? "site-header--offset" : ""
        }`}
      >
        {/* Switch to the sister brand. Outbound to a separate site, hence the
            plain anchor rather than next/link. */}
        <a
          href={SISTER_SITE.url}
          className="justify-self-start rounded-full border border-hairline px-3 py-1.5 font-display font-semibold leading-none text-ink transition-colors hover:border-accent hover:text-accent"
          style={{ fontSize: "11px" }}
        >
          {SISTER_SITE.shortLabel}
          <span aria-hidden="true"> ↗</span>
        </a>

        {/*
          logo-stack.webp is the centred-lockup variant, used only here.

          Two problems had to be fixed to make this read as centred. First the
          source file carries uneven padding (36px left, 109px right of a
          1008px canvas), so centring the image box left the mark 37px off.
          Second — and the reason it still looked wrong after cropping — the
          wordmark is a LEFT-ALIGNED two-line lockup: "great" is 288px narrower
          than "outdoor" and starts at the same x, putting its optical centre
          145px to the left. Centring the box centres the bounding rectangle,
          which the eye does not read as centred.

          This variant re-centres the two words on a shared axis. Verified:
          both sit within 0.5px of the canvas centre. The desktop rail keeps
          the original left-aligned lockup, where left alignment is correct.
        */}
        <Link href="/" aria-label={SITE.name} className="justify-self-center">
          <Image
            src="/logo-stack.webp"
            alt={SITE.name}
            width={879}
            height={378}
            priority
            className="h-9 w-auto"
          />
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="justify-self-end p-2"
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 block h-0.5 w-6 bg-ink transition-transform ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-0.5 w-6 bg-ink transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-6 bg-ink transition-transform ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </header>

      {/*
        Mobile drawer.

        `invisible` matters as much as the opacity: hidden with opacity alone the
        panel stays in layout, and `fixed inset-0` + `overflow-y-auto` let it
        stretch to the widest element on the page. That inflated the document's
        scrollWidth to ~750px at a 375px viewport, so every page scrolled
        sideways — measured, not guessed. `invisible` also takes it out of the
        tab order, which `opacity-0` does not.
      */}
      <div
        className={`no-scrollbar fixed inset-0 z-30 w-full max-w-full overflow-y-auto overflow-x-hidden bg-canvas px-5 pb-10 transition-opacity lg:hidden ${
          hasAnnouncement ? "pt-32" : "pt-24"
        } ${
          open
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      >
        {nav}
      </div>

      {/* Desktop fixed sidebar */}
      {/* Reference theme pads the rail by a percentage (14%), not fixed px,
          so the inner gutter scales with the fluid width. */}
      <aside className="site-sidebar no-scrollbar fixed inset-y-0 left-0 z-40 hidden flex-col overflow-y-auto border-r border-hairline bg-canvas py-10 lg:flex">
        <Link
          href="/"
          aria-label={SITE.name}
          className="block w-[170px] max-w-full"
        >
          <Image
            src="/logo.webp"
            alt={SITE.name}
            width={1008}
            height={472}
            priority
            className="h-auto w-full"
          />
        </Link>

        {/*
          Sister-brand switch, directly under the wordmark so the two brands
          read as a pair. Same pill as the mobile header, so the affordance is
          identical on both breakpoints.
        */}
        <a
          href={SISTER_SITE.url}
          className="mb-14 mt-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 font-display font-semibold leading-none text-ink transition-colors hover:border-accent hover:text-accent"
          style={{ fontSize: "11px" }}
        >
          {SISTER_SITE.name}
          <span aria-hidden="true">↗</span>
        </a>

        {nav}
      </aside>
    </>
  );
}
