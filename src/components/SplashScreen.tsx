"use client";

import { useEffect, useState } from "react";
import { Bus } from "lucide-react";

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
  const [phase, setPhase] = useState<"black" | "flash" | "logo" | "out">("black");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("flash"), 500);
    const t2 = setTimeout(() => setPhase("logo"), 1400);
    const t3 = setTimeout(() => setPhase("out"), 3200);
    const t4 = setTimeout(() => onFinish(), 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-700 ${
        phase === "out" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Far flaş */}
      {phase === "flash" && (
        <div className="absolute inset-0 bg-amber-100/90 animate-pulse pointer-events-none" />
      )}

      {(phase === "logo" || phase === "out" || phase === "flash") && (
        <div
          className={`flex flex-col items-center transition-all duration-700 ${
            phase === "logo" || phase === "out"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/40 mb-6">
            <Bus className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Otogar <span className="text-amber-500">Tycoon</span>
          </h1>
          <p className="mt-2 text-zinc-400 text-sm tracking-[0.35em] uppercase">
            Peron Savaşları
          </p>
        </div>
      )}

      <div className="absolute bottom-12 text-center">
        <p className="text-zinc-600 text-xs">Geliştirici</p>
        <p className="text-zinc-300 font-medium">Ahmet Eymen Bakraç</p>
      </div>
    </div>
  );
}