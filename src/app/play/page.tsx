"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { useCareerStore } from "@/store/careerStore";
import Link from "next/link";

export default function PlayPage() {
  const router = useRouter();
  const params = useSearchParams();
  const forceRegister = useGameStore((s) => s.forceRegister);
  const isGuest = useGameStore((s) => s.isGuest);

  useEffect(() => {
    const guest = params.get("guest") === "1";
    if (guest) {
      useGameStore.setState({ isGuest: true });
    }

    const g = useGameStore.getState();
    const c = useCareerStore.getState();

    // Misafir 5 gün doldu
    if (g.isGuest && g.forceRegister) {
      return;
    }

    // Kariyer bitmemiş → vardiya
    if (c.careerStarted && !c.careerDone) {
      router.replace("/shift");
      return;
    }

    // Kariyer hiç başlamadı
    if (!c.careerStarted) {
      router.replace("/shift");
      return;
    }

    // Bağımsız ama setup yok
    if (!g.setupDone) {
      router.replace("/setup");
      return;
    }

    router.replace("/dashboard");
  }, [router, params]);

  if (isGuest && forceRegister) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="max-w-sm w-full border border-amber-900/50 rounded-2xl p-6 bg-zinc-900 text-center">
          <div className="text-[10px] tracking-widest text-amber-500 font-bold">
            MİSAFİR SÜRESİ
          </div>
          <h1 className="text-lg font-bold mt-2">5 oyun günü doldu</h1>
          <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
            Devam için hesap oluştur. Kayıt ücretsiz; gerçek para yok.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-block w-full py-3 rounded-xl bg-amber-500 text-black font-bold text-sm"
          >
            Hesap oluştur
          </Link>
          <Link
            href="/login"
            className="mt-3 inline-block text-xs text-cyan-400"
          >
            Zaten hesabım var
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500 text-sm">
      Yükleniyor…
    </div>
  );
}
