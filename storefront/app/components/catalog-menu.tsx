import Link from "next/link";

import { drops, shopNav } from "@/app/lib/catalog-nav";

export function CatalogMenu({ current }: { current?: string }) {
  const links = [
    { href: "/collections", label: "Alla", handle: "" },
    ...shopNav
      .filter((item) => item.href.startsWith("/collections/"))
      .map((item) => ({
        href: item.href,
        label: item.label,
        handle: item.href.replace("/collections/", ""),
      })),
    ...drops.map((drop) => ({
      href: `/collections/${drop.handle}`,
      label: drop.title,
      handle: drop.handle,
    })),
  ];

  return (
    <nav className="mt-6 flex flex-wrap gap-2" aria-label="Kollektioner">
      {links.map((link) => {
        const active = link.handle === (current ?? "");
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              active ? "bg-[#111] text-white" : "bg-[#f5f5f5] hover:bg-[#e5e5e5]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
