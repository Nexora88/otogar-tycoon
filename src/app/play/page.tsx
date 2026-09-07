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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const g = useGameStore.getState();
    const c = useCareerStore.getState();

    // Misafir süresi doldu → ekranda kal
    if (g.isGuest && g.forceRegister) {
      setReady(true);
      return;
    }

    if (c.careerStarted && !c.careerDone) {
      router.replace("/shift");
      return;
    }

    if (!c.careerStarted) {
      router.replace("/shift");
      return;
    }

    if (!g.setupDone) {
      router.replace("/setup");
      return;
    }

    router.replace("/dashboard");
  }, [router]);

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
      {ready ? "Yönlendiriliyor…" : "Yükleniyor…"}
    </div>
  );
}
