"use client";

import Link from "next/link";
import { useCareerStore } from "@/store/careerStore";
import { useGameStore } from "@/store/gameStore";
import { canUnlock, type UnlockKey } from "@/lib/progression";

export default function ProgressGate({
  unlock,
  children,
}: {
  unlock: UnlockKey;
  children: React.ReactNode;
}) {
  const careerStarted = useCareerStore((s) => s.careerStarted);
  const careerDone = useCareerStore((s) => s.careerDone);
  const rank = useCareerStore((s) => s.rank);
  const setupDone = useGameStore((s) => s.setupDone);

  const gate = canUnlock(unlock, {
    careerStarted,
    careerDone,
    rank,
    setupDone,
  });

  if (gate.ok) return <>{children}</>;

  return (
    <div className="p-8 max-w-md mx-auto text-center">
      <div className="text-amber-500 text-xs tracking-widest font-bold mb-2">
        KİLİTLİ
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed">{gate.reason}</p>
      <div className="mt-6 flex flex-col gap-2">
        <Link
          href="/shift"
          className="py-2.5 rounded-xl bg-amber-500 text-black text-sm font-bold"
        >
          Vardiyaya dön
        </Link>
        {(careerDone || rank === "bagimsiz") && !setupDone && (
          <Link
            href="/setup"
            className="py-2.5 rounded-xl border border-cyan-700 text-cyan-300 text-sm"
          >
            Terminal kurulum
          </Link>
        )}
      </div>
    </div>
  );
}