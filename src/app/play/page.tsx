"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { useCareerStore } from "@/store/careerStore";

export default function PlayPage() {
  const router = useRouter();

  useEffect(() => {
    const career = useCareerStore.getState();
    const game = useGameStore.getState();

    // 1) Çıraklık başlamadı → vardiya (ad / memleket)
    if (!career.careerStarted) {
      router.replace("/shift");
      return;
    }

    // 2) Hâlâ peronda (bağımsız olmadı) → vardiya
    if (!career.careerDone) {
      router.replace("/shift");
      return;
    }

    // 3) Bağımsız ama terminal yok → belediye setup
    if (!game.setupDone) {
      router.replace("/setup");
      return;
    }

    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500 text-sm">
      Perona bağlanıyor…
    </div>
  );
}