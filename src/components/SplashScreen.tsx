"use client";

import { useEffect, useState } from "react";
import { Bus } from "lucide-react";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2400);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3100);

    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0b] transition-opacity duration-700 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-6">
          <Bus className="w-10 h-10 text-black" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Otogar <span className="text-amber-500">Tycoon</span>
        </h1>

        <p className="mt-3 text-zinc-400 text-sm tracking-widest uppercase">
          Peron Savaşları
        </p>
      </div>

      <div className="absolute bottom-12 text-center">
        <p className="text-zinc-500 text-sm">Geliştirici</p>
        <p className="text-zinc-300 font-medium mt-1">Ahmet Eymen Bakraç</p>
      </div>
    </div>
  );
}