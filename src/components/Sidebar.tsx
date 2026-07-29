"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SECONDARY_NAV, SITE } from "@/lib/site";

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
      <header
        className={`fixed inset-x-0 z-40 flex h-16 items-center justify-between border-b border-hairline bg-canvas px-5 lg:hidden ${
          hasAnnouncement ? "top-[var(--announcement-h)]" : "top-0"
        }`}
      >
        <Link href="/" aria-label={SITE.name}>
          <Image
            src="/logo.webp"
            alt={SITE.name}
            width={1008}
            height={472}
            priority
            className="h-9 w-auto"
          />
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="-mr-2 p-2"
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

      {/* Mobile drawer */}
      <div
        className={`no-scrollbar fixed inset-0 z-30 overflow-y-auto bg-canvas px-5 pb-10 transition-opacity lg:hidden ${
          hasAnnouncement ? "pt-32" : "pt-24"
        } ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
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
          className="mb-16 block w-[170px] max-w-full"
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
        {nav}
      </aside>
    </>
  );
}
