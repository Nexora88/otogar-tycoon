"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";

export default function PlayPage() {
  const router = useRouter();

  useEffect(() => {
    const s = useGameStore.getState();
    if (!s.setupDone && s.balance === 75000 && s.expeditions.length === 0) {
      // ilk giriş — sıfırla ve kurulum
      s.startAsGuest();
      router.replace("/setup");
      return;
    }
    if (!s.setupDone) {
      router.replace("/setup");
      return;
    }
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500 text-sm">
      Yükleniyor…
    </div>
  );
}