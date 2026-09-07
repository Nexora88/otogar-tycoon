"use client";

import { useEffect, useState } from "react";
import { playHorn, playClick } from "@/lib/audio";

type Props = {
  onDone: () => void;
};

export function SplashScreen({ onDone }: Props) {
  const [step, setStep] = useState(0);
  // 0 siyah, 1 far1, 2 far2, 3 logo

  useEffect(() => {
    const timers: number[] = [];
    timers.push(
      window.setTimeout(() => {
        playHorn();
        playClick();
        setStep(1);
      }, 400)
    );
    timers.push(
      window.setTimeout(() => {
        playClick();
        setStep(2);
      }, 1100)
    );
    timers.push(
      window.setTimeout(() => {
        setStep(3);
      }, 1800)
    );
    timers.push(
      window.setTimeout(() => {
        onDone();
      }, 4200)
    );
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Kiremit duvar flash */}
      <div
        className={`absolute inset-0 transition-opacity duration-200 ${
          step === 1 ? "opacity-40" : "opacity-0"
        }`}
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,#3f2a22 0 12px,#2a1c17 12px 14px), repeating-linear-gradient(90deg,#3f2a22 0 28px,#2a1c17 28px 30px)",
        }}
      />
      {/* Nexora duvar flash */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
          step === 2 ? "opacity-50" : "opacity-0"
        }`}
      >
        <div className="text-center">
          <div className="text-4xl font-black text-cyan-400/90 tracking-tight">
            NEXORA
          </div>
          <div className="text-[10px] tracking-[0.35em] text-zinc-400 mt-1">
            LABS
          </div>
        </div>
      </div>

      {/* Farlar */}
      <div
        className={`absolute flex gap-16 transition-opacity duration-100 ${
          step === 1 || step === 2 ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="w-16 h-16 rounded-full bg-amber-200 shadow-[0_0_60px_20px_rgba(253,224,71,0.7)]" />
        <div className="w-16 h-16 rounded-full bg-amber-200 shadow-[0_0_60px_20px_rgba(253,224,71,0.7)]" />
      </div>

      {/* Logo */}
      <div
        className={`relative z-10 text-center transition-all duration-700 ${
          step >= 3
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        }`}
      >
        <div className="text-[10px] tracking-[0.4em] text-amber-600 font-bold mb-2">
          PERON SAVAŞLARI
        </div>
        <h1 className="text-4xl sm:text-6xl font-black leading-none">
          OTOGAR
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-amber-300 to-orange-500">
            TYCOON
          </span>
        </h1>
        <p className="mt-6 text-xs text-zinc-500 tracking-wide">
          Geliştirici:{" "}
          <span className="text-zinc-300">Ahmet Eymen Bakraç</span>
        </p>
        <button
          type="button"
          onClick={onDone}
          className="mt-8 text-[10px] text-zinc-600 hover:text-zinc-400"
        >
          Atla →
        </button>
      </div>
    </div>
  );
}