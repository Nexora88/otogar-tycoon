"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";

export default function PlayPage() {
  const router = useRouter();
  const startAsGuest = useGameStore((s) => s.startAsGuest);

  useEffect(() => {
    startAsGuest();
    router.replace("/dashboard");
  }, [startAsGuest, router]);

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center text-zinc-400 text-sm">
      Garaj açılıyor...
    </div>
  );
}