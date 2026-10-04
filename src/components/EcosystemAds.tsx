"use client";

import { usePathname } from "next/navigation";

const ADS = [
  { brand: "BAKRAÇ TİCARET", line: "Perondan piyasaya.", detail: "1987'den beri esnafa.", href: "/capital" },
  { brand: "NEXORA TEKNOLOJİ", line: "Yolun verisini gör.", detail: "Yeni nesil yazıhane teknolojisi.", href: "/capital" },
  { brand: "BAKRAÇ HOLDİNG", line: "Büyüyen şirketler için.", detail: "Sermaye. Marka. Gelecek.", href: "/capital" },
  { brand: "NEXORA ELEKTRONİK", line: "Peronun sesi burada.", detail: "1987 radyo serisi.", href: "/garage" },
];

export default function EcosystemAds() {
  const pathname = usePathname();
  if (pathname === "/shift" || pathname === "/story") return null;

  const seed = pathname.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const ad = ADS[seed % ADS.length];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-8 pb-2">
      <a
        href={ad.href}
        className="group block rounded-xl border border-zinc-800/70 bg-zinc-950/70 px-3 py-2 transition hover:border-amber-900/60"
      >
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[8px] font-black text-amber-500">N</div>
          <div className="min-w-0 flex-1">
            <div className="text-[9px] tracking-[0.18em] text-zinc-500">{ad.brand}</div>
            <div className="text-[11px] text-zinc-300 truncate">
              {ad.line} <span className="text-zinc-600">· {ad.detail}</span>
            </div>
          </div>
          <span className="text-[9px] text-zinc-600 group-hover:text-amber-500">detay →</span>
        </div>
      </a>

      <div className="mt-1.5 flex justify-center">
        <a
          href="https://buymeacoffee.com/nexora88"
          target="_blank"
          rel="noreferrer"
          className="text-[9px] text-zinc-600 hover:text-amber-400 transition"
          aria-label="Oyunun gelişimine destek ol"
        >
          Oyunun gelişimine destek olmak istersen · kahve  ☕
        </a>
      </div>
    </div>
  );
}
