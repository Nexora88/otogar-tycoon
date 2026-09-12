"use client";

import { useEffect, useMemo, useState } from "react";
import { BusFront, Coffee, MapPin, MessageCircle, Ticket, UserRound, X } from "lucide-react";

export type TerminalNpc = {
  id: number;
  name: string;
  role: "yolcu" | "şoför" | "esnaf" | "memur" | "öğrenci";
  destination: string;
  mood: "mutlu" | "normal" | "aceleci";
  line: string;
  color: string;
};

const NPC_POOL: TerminalNpc[] = [
  { id: 1, name: "Ayşe Hanım", role: "yolcu", destination: "İstanbul", mood: "aceleci", line: "İstanbul otobüsü ne zaman kalkıyor?", color: "from-rose-500/30 to-rose-950/20" },
  { id: 2, name: "Mehmet Usta", role: "esnaf", destination: "Edirne", mood: "normal", line: "Büfeye biraz daha simit getireyim mi?", color: "from-amber-500/30 to-amber-950/20" },
  { id: 3, name: "Hasan", role: "şoför", destination: "Ankara", mood: "normal", line: "Ankara seferi için hazırız patron.", color: "from-cyan-500/30 to-cyan-950/20" },
  { id: 4, name: "Zeynep", role: "öğrenci", destination: "İzmir", mood: "mutlu", line: "Öğrenci indirimi var mı?", color: "from-violet-500/30 to-violet-950/20" },
  { id: 5, name: "Kemal Bey", role: "memur", destination: "Bursa", mood: "normal", line: "Peronların düzeni bugün iyi görünüyor.", color: "from-slate-500/30 to-slate-950/20" },
  { id: 6, name: "Fatma Teyze", role: "yolcu", destination: "Çanakkale", mood: "mutlu", line: "Bir çay alıp otobüsü bekleyeyim.", color: "from-emerald-500/30 to-emerald-950/20" },
  { id: 7, name: "İsmail", role: "yolcu", destination: "Tekirdağ", mood: "aceleci", line: "Valizimi emanete bırakabilir miyim?", color: "from-orange-500/30 to-orange-950/20" },
  { id: 8, name: "Nermin", role: "esnaf", destination: "Keşan", mood: "mutlu", line: "Çaylar benden, bugün terminal kalabalık.", color: "from-yellow-500/30 to-yellow-950/20" },
];

function roleIcon(role: TerminalNpc["role"]) {
  if (role === "şoför") return <BusFront className="h-4 w-4" />;
  if (role === "esnaf") return <Coffee className="h-4 w-4" />;
  if (role === "memur") return <Ticket className="h-4 w-4" />;
  return <UserRound className="h-4 w-4" />;
}

export default function TerminalNPCs() {
  const [visible, setVisible] = useState<TerminalNpc[]>(NPC_POOL.slice(0, 2));
  const [selected, setSelected] = useState<TerminalNpc | null>(null);
  const [arrivals, setArrivals] = useState(12);
  const [satisfaction, setSatisfaction] = useState(74);

  useEffect(() => {
    let index = 2;
    const timer = window.setInterval(() => {
      const npc = NPC_POOL[index % NPC_POOL.length];
      index += 1;
      setVisible((current) => [...current.slice(-3), { ...npc, id: Date.now() }]);
      setArrivals((value) => value + 1);
      setSatisfaction((value) => Math.max(55, Math.min(98, value + (Math.random() > 0.45 ? 1 : -1))));
    }, 7000);

    return () => window.clearInterval(timer);
  }, []);

  const crowdText = useMemo(() => {
    if (visible.length >= 4) return "Yoğunluk yüksek";
    if (visible.length === 3) return "Terminal hareketli";
    return "Sakin vardiya";
  }, [visible.length]);

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900/80 px-4 py-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            Terminal canlılığı
          </div>
          <p className="mt-0.5 text-[11px] text-zinc-500">NPC'ler terminale geliyor, bekliyor ve tepki veriyor.</p>
        </div>
        <div className="flex gap-2 text-[10px]">
          <span className="rounded-full border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-zinc-400">{crowdText}</span>
          <span className="rounded-full border border-emerald-900/50 bg-emerald-950/30 px-2.5 py-1 text-emerald-300">{arrivals} geliş</span>
          <span className="rounded-full border border-amber-900/50 bg-amber-950/30 px-2.5 py-1 text-amber-300">Memnuniyet %{satisfaction}</span>
        </div>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((npc) => (
          <button
            key={npc.id}
            type="button"
            onClick={() => setSelected(npc)}
            className={`group relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-br ${npc.color} p-3 text-left transition duration-200 hover:-translate-y-1 hover:border-cyan-700 hover:shadow-lg hover:shadow-cyan-950/30`}
          >
            <div className="absolute right-2 top-2 rounded-full bg-zinc-950/60 p-1.5 text-zinc-400 group-hover:text-cyan-300">
              {roleIcon(npc.role)}
            </div>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-zinc-950/70 text-sm font-bold text-zinc-200">
              {npc.name.slice(0, 1)}
            </div>
            <div className="text-sm font-semibold text-zinc-100">{npc.name}</div>
            <div className="mt-0.5 text-[10px] uppercase tracking-wider text-zinc-500">{npc.role}</div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-300">
              <MapPin className="h-3 w-3 text-cyan-400" />
              {npc.destination}
            </div>
            <div className="mt-2 line-clamp-2 text-[11px] leading-4 text-zinc-500">“{npc.line}”</div>
          </button>
        ))}
      </div>

      <div className="border-t border-zinc-800 bg-zinc-900/40 px-4 py-2 text-[10px] text-zinc-600">
        İpucu: Bir NPC'ye tıklayarak onunla konuş. Doğru kararlar terminal memnuniyetini ve günlük geliri etkiler.
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-950 p-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 font-bold text-zinc-200">
                  {selected.name.slice(0, 1)}
                </div>
                <div>
                  <div className="font-semibold text-zinc-100">{selected.name}</div>
                  <div className="text-xs text-zinc-500">{selected.role} · {selected.destination}</div>
                </div>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 text-sm leading-6 text-zinc-300">
              <MessageCircle className="mb-2 h-4 w-4 text-cyan-400" />
              {selected.line}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSatisfaction((value) => Math.min(100, value + 4));
                  setSelected(null);
                }}
                className="rounded-xl border border-emerald-800/60 bg-emerald-950/30 px-3 py-2.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-950/50"
              >
                Yardım et
              </button>
              <button
                type="button"
                onClick={() => {
                  setSatisfaction((value) => Math.max(45, value - 3));
                  setSelected(null);
                }}
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
              >
                Sonra ilgilen
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
