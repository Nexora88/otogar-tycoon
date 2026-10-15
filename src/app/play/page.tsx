"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import { useCareerStore } from "@/store/careerStore";

export default function PlayPage() {
  const router = useRouter();
  const forceRegister = useGameStore((s) => s.forceRegister);
  const isGuest = useGameStore((s) => s.isGuest);
  const [hint, setHint] = useState("Peron hazırlanıyor…");

  useEffect(() => {
    const g = useGameStore.getState();
    const c = useCareerStore.getState();

    if (g.isGuest && g.forceRegister) {
      setHint("Misafir süresi doldu");
      return;
    }

    if (c.careerStarted && !c.careerDone) {
      setHint("Vardiyaya gidiliyor…");
      router.replace("/shift");
      return;
    }

    if (!c.careerStarted) {
      setHint("Hikâye açılıyor…");
      router.replace("/opening");
      return;
    }

    if (!g.setupDone) {
      setHint("Terminal kurulumu…");
      router.replace("/setup");
      return;
    }

    setHint("Yazıhaneye giriliyor…");
    router.replace("/dashboard");
  }, [router]);

  if (isGuest && forceRegister) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0908] px-4">
        <div className="w-full max-w-sm rounded-2xl border border-amber-900/50 bg-zinc-950 p-6 text-center shadow-xl">
          <div className="text-[10px] font-bold tracking-[0.3em] text-amber-500">
            MİSAFİR SÜRESİ
          </div>
          <h1 className="mt-2 text-lg font-black text-stone-100">
            5 oyun günü doldu
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-stone-400">
            İlerlemeyi kaybetmemek için hesap oluştur. Kayıt ücretsiz — gerçek para
            yok.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-block w-full rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 py-3 text-sm font-bold text-stone-950"
          >
            Hesap oluştur
          </Link>
          <Link href="/login" className="mt-3 inline-block text-xs text-cyan-400">
            Zaten hesabım var
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#0a0908] px-4">
      <div className="h-10 w-10 animate-pulse rounded-xl bg-gradient-to-br from-amber-400 to-orange-600" />
      <p className="text-sm text-stone-500">{hint}</p>
      <p className="text-[11px] text-stone-700">Otogar Tycoon · 1987</p>
    </div>
  );
}
