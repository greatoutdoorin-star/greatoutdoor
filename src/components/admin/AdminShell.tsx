"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Collections", href: "/admin/collections" },
  { label: "Hero slides", href: "/admin/hero" },
  { label: "Blog posts", href: "/admin/posts" },
  { label: "Settings", href: "/admin/settings" },
];

export default function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen lg:flex">
      <aside className="border-b border-hairline bg-surface px-6 py-6 lg:min-h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
        <Link href="/admin" className="block">
          <Image
            src="/logo.webp"
            alt="Great Outdoor"
            width={1008}
            height={472}
            className="h-auto w-[130px]"
          />
        </Link>

        <nav className="mt-8 lg:mt-12">
          <ul className="flex flex-wrap gap-x-5 gap-y-3 lg:flex-col lg:gap-3">
            {NAV.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`font-display font-semibold transition-colors ${
                      active ? "text-accent" : "text-ink hover:text-accent"
                    }`}
                    style={{ fontSize: "var(--text-body-hd)" }}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-8 lg:mt-16">
          <p
            className="font-body text-ink-muted"
            style={{ fontSize: "var(--text-body-sm)" }}
          >
            {email}
          </p>
          <button
            type="button"
            onClick={signOut}
            className="mt-2 font-body underline underline-offset-4 hover:text-accent"
            style={{ fontSize: "var(--text-body-sm)" }}
          >
            Sign out
          </button>
          <Link
            href="/"
            className="mt-4 block font-body underline underline-offset-4 hover:text-accent"
            style={{ fontSize: "var(--text-body-sm)" }}
          >
            View site →
          </Link>
        </div>
      </aside>

      <main className="flex-1 px-6 py-8 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
