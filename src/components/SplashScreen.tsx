"use client";

import { useEffect, useState } from "react";

type Phase = "black" | "flash1" | "flash2" | "logo" | "done";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("black");

  useEffect(() => {
    // Korna (Web Audio — kısa bip, dosya gerekmez)
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(180, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.35);
      g.gain.setValueAtTime(0.15, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.42);
      setTimeout(() => {
        const o2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        o2.type = "square";
        o2.frequency.value = 120;
        g2.gain.value = 0.08;
        o2.connect(g2);
        g2.connect(ctx.destination);
        o2.start();
        o2.stop(ctx.currentTime + 0.12);
      }, 380);
    } catch {
      /* sessiz */
    }

    const t1 = setTimeout(() => setPhase("flash1"), 400);
    const t2 = setTimeout(() => setPhase("black"), 700);
    const t3 = setTimeout(() => setPhase("flash2"), 1100);
    const t4 = setTimeout(() => setPhase("black"), 1450);
    const t5 = setTimeout(() => setPhase("logo"), 1900);
    const t6 = setTimeout(() => {
      setPhase("done");
      onDone();
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [onDone]);

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0D0D1A] overflow-hidden">
      {/* Kiremit / sıva doku — flash1 */}
      {(phase === "flash1" || phase === "flash2") && (
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              phase === "flash1"
                ? `repeating-linear-gradient(
                    0deg,
                    #5c3d2e 0px,
                    #5c3d2e 12px,
                    #4a3226 12px,
                    #4a3226 14px
                  ),
                  repeating-linear-gradient(
                    90deg,
                    #6b4a38 0px,
                    #6b4a38 28px,
                    #3d291f 28px,
                    #3d291f 30px
                  )`
                : "radial-gradient(circle at 50% 40%, #007BFF33, transparent 60%)",
          }}
        />
      )}

      {/* Selektör farları */}
      {(phase === "flash1" || phase === "flash2") && (
        <div className="absolute inset-0 flex items-center justify-center gap-16 pointer-events-none">
          <div
            className="w-16 h-16 sm:w-24 sm:h-24 rounded-full"
            style={{
              background:
                "radial-gradient(circle, #fff9e6 0%, #f5d76e 35%, transparent 70%)",
              boxShadow: "0 0 60px 20px rgba(245,215,110,0.6)",
            }}
          />
          <div
            className="w-16 h-16 sm:w-24 sm:h-24 rounded-full"
            style={{
              background:
                "radial-gradient(circle, #fff9e6 0%, #f5d76e 35%, transparent 70%)",
              boxShadow: "0 0 60px 20px rgba(245,215,110,0.6)",
            }}
          />
        </div>
      )}

      {/* Nexora N — ikinci selektörde */}
      {phase === "flash2" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 animate-pulse">
          <svg width="80" height="80" viewBox="0 0 100 100" className="mb-2">
            <defs>
              <linearGradient id="ng" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7B2CFF" />
                <stop offset="50%" stopColor="#007BFF" />
                <stop offset="100%" stopColor="#00F0FF" />
              </linearGradient>
            </defs>
            <path
              d="M18 78 L18 22 L42 22 L62 55 L62 22 L82 22 L82 78 L58 78 L38 42 L38 78 Z"
              fill="url(#ng)"
            />
            <circle cx="78" cy="18" r="6" fill="#00F0FF" />
            <circle cx="78" cy="18" r="2" fill="#fff" />
          </svg>
          <div className="text-white text-lg font-bold tracking-widest">
            NEXORA <span style={{ color: "#00F0FF" }}>AI</span>
          </div>
          <div className="text-[10px] tracking-[0.35em] text-zinc-400 mt-1">
            VERİ · ZEKÂ · GELECEK
          </div>
        </div>
      )}

      {/* Ana logo */}
      {phase === "logo" && (
        <div className="relative z-20 text-center px-6 animate-[fadeUp_0.8s_ease-out]">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
            style={{
              background: "linear-gradient(135deg,#7B2CFF,#007BFF,#00F0FF)",
              boxShadow: "0 0 40px rgba(0,240,255,0.35)",
            }}
          >
            <svg width="36" height="36" viewBox="0 0 100 100">
              <path
                d="M18 78 L18 22 L42 22 L62 55 L62 22 L82 22 L82 78 L58 78 L38 42 L38 78 Z"
                fill="#0D0D1A"
              />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Otogar{" "}
            <span
              style={{
                background: "linear-gradient(90deg,#00F0FF,#007BFF)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Tycoon
            </span>
          </h1>
          <p className="text-amber-400/90 text-sm sm:text-base mt-2 tracking-[0.2em] uppercase font-semibold">
            Peron Savaşları
          </p>
          <div
            className="mt-8 h-px w-40 mx-auto"
            style={{
              background: "linear-gradient(90deg,transparent,#00F0FF,transparent)",
            }}
          />
          <p className="mt-4 text-xs sm:text-sm text-zinc-400">
            Geliştirici:{" "}
            <span className="text-white font-medium">Ahmet Eymen Bakraç</span>
          </p>
          <p className="text-[10px] text-zinc-600 mt-1">Nexora Labs · 1987 ruhu</p>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}