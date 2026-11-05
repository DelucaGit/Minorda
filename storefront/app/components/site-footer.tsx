import Link from "next/link";

import { brandLogo } from "@/app/lib/home-design";

const columns = [
  {
    title: "Skor och tävling",
    links: ["Brottarskor", "Mattskor", "Tävlingstrikåer", "Greppstrumpor"],
  },
  {
    title: "Kläder",
    links: ["Rashguards", "Brottarshorts", "Träningströjor", "Trikåset"],
  },
  {
    title: "Tillbehör",
    links: ["Väskor", "Knäskydd", "Handdukar", "Ledstöd"],
  },
  {
    title: "Kollektioner",
    links: ["Apex Combat Drop 04", "Vanguard Series", "Svart kapsel", "Electric Volt"],
  },
];

export function SiteFooter() {
  return (
    <footer>
      <section className="border-t border-[#e5e5e5] bg-white py-12">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="font-display mb-4 text-[14px] font-bold uppercase">
                {column.title}
              </h2>
              <ul className="space-y-2.5 text-[13px] text-[#707072]">
                {column.links.map((label) => (
                  <li key={label}>
                    <Link href="/collections" className="hover:text-[#111111]">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-[#111111] pt-12 pb-8 text-white">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 border-b border-[#2b2b2b] px-6 pb-12 md:grid-cols-4">
          <div>
            <h2 className="font-display mb-4 text-[13px] font-bold tracking-wider uppercase">
              Resurser
            </h2>
            <ul className="space-y-3 text-[13px] text-[#8d8d8d]">
              <li>
                <Link href="/collections" className="hover:text-white">
                  Handla
                </Link>
              </li>
              <li>Nyhetsbrev kommer senare</li>
            </ul>
          </div>
          <div>
            <h2 className="font-display mb-4 text-[13px] font-bold tracking-wider uppercase">
              Hjälp
            </h2>
            <ul className="space-y-3 text-[13px] text-[#8d8d8d]">
              <li>Frakt och returer</li>
              <li>Storleksguide</li>
              <li>
                <a className="hover:text-white" href="mailto:ops@minorda.com">
                  ops@minorda.com
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-display mb-4 text-[13px] font-bold tracking-wider uppercase">
              Företaget
            </h2>
            <ul className="space-y-3 text-[13px] text-[#8d8d8d]">
              <li>Om Minorda</li>
              <li>Certifieringar</li>
            </ul>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={brandLogo.src} alt="" className="h-6 w-auto" />
              <span className="font-display text-lg font-bold tracking-tight uppercase">
                Minorda
              </span>
            </div>
            <p className="font-display text-[12px] font-bold tracking-wider text-[#c1f100] uppercase">
              Progress isn&apos;t linear. Rise is never flat.
            </p>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-6 pt-8 text-[12px] text-[#8d8d8d] md:flex-row md:items-center md:justify-between">
          <p>© 2026 Minorda. Alla rättigheter förbehållna.</p>
          <p>Priserna kommer från demokatalogen och visas i katalogens valuta.</p>
        </div>
      </div>
    </footer>
  );
}
