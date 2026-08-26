"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { Bus } from "lucide-react";

export default function PlayPage() {
  const router = useRouter();
  const startAsGuest = useGameStore((s) => s.startAsGuest);

  useEffect(() => {
    startAsGuest();
    router.replace("/dashboard");
  }, [startAsGuest, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0b]">
      <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center mb-6 animate-pulse">
        <Bus className="w-8 h-8 text-black" />
      </div>
      <p className="text-zinc-400">Garaja giriliyor...</p>
    </div>
  );
}