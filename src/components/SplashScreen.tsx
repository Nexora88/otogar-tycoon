"use client";

import { useCallback, useEffect, useState } from "react";

type Props = { onDone: () => void };

export function SplashScreen({ onDone }: Props) {
  // 0: siyah · 1: far+kiremit · 2: far+Nexora · 3: logo
  const [step, setStep] = useState(0);

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem("ot-splash-seen", "1");
    } catch {
      /* ignore */
    }
    onDone();
  }, [onDone]);

  useEffect(() => {
    const timers: number[] = [];
    const beep = () => {
      try {
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (!AC) return;
        const ctx = new AC();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "square";
        o.frequency.value = 180;
        g.gain.value = 0.04;
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        o.stop(ctx.currentTime + 0.16);
      } catch {
        /* sessiz */
      }
    };

    timers.push(
      window.setTimeout(() => {
        beep();
        setStep(1);
      }, 350)
    );
    timers.push(
      window.setTimeout(() => {
        beep();
        setStep(2);
      }, 1100)
    );
    timers.push(window.setTimeout(() => setStep(3), 1900));
    timers.push(window.setTimeout(() => finish(), 4800));

    return () => timers.forEach(clearTimeout);
  }, [finish]);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Kiremit duvar */}
      <div
        className={`absolute inset-0 transition-opacity duration-150 ${
          step === 1 ? "opacity-50" : "opacity-0"
        }`}
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,#4a2c22 0 14px,#2e1a14 14px 16px), repeating-linear-gradient(90deg,#4a2c22 0 32px,#2e1a14 32px 34px)",
        }}
      />

      {/* Nexora flash */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
          step === 2 ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="text-center">
          <div className="text-5xl sm:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">
            NEXORA
          </div>
          <div className="text-[11px] tracking-[0.5em] text-zinc-400 mt-2">
            LABS
          </div>
        </div>
      </div>

      {/* Çift far */}
      <div
        className={`absolute flex gap-20 sm:gap-28 transition-all duration-100 ${
          step === 1 || step === 2
            ? "opacity-100 scale-100"
            : "opacity-0 scale-90"
        }`}
      >
        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-amber-100 shadow-[0_0_80px_30px_rgba(253,224,71,0.55)]" />
        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-amber-100 shadow-[0_0_80px_30px_rgba(253,224,71,0.55)]" />
      </div>

      {/* Logo sahnesi */}
      <div
        className={`relative z-10 text-center px-6 transition-all duration-700 ease-out ${
          step >= 3
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        <div className="text-[11px] tracking-[0.45em] text-amber-500 font-bold mb-3">
          PERON SAVAŞLARI
        </div>
        <h1 className="text-5xl sm:text-7xl font-black leading-[0.9]">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-400 to-red-500">
            OTOGAR
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-600">
            TYCOON
          </span>
        </h1>
        <p className="mt-8 text-sm text-zinc-500">
          Geliştirici:{" "}
          <span className="text-zinc-200 font-medium">
            Ahmet Eymen Bakraç
          </span>
        </p>
        <p className="mt-1 text-[10px] tracking-widest text-zinc-600">
          NEXORA · 1987
        </p>
        <button
          type="button"
          onClick={finish}
          className="mt-10 text-xs text-zinc-600 hover:text-zinc-400 transition"
        >
          Atla →
        </button>
      </div>
    </div>
  );
}

export default SplashScreen;