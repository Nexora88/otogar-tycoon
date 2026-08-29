"use client";

import { useEffect, useState } from "react";
import {
  pickBossForCity,
  fillTemplate,
  HARASS_LINES,
  RACON_DELIKANLI,
  RACON_ESNAF,
  type MafiaBoss,
} from "@/data/mafia";

type Phase = "closed" | "knock" | "talk" | "result";

export default function MafiaModal() {
  const [phase, setPhase] = useState<Phase>("closed");
  const [boss, setBoss] = useState<MafiaBoss | null>(null);
  const [known, setKnown] = useState(false);
  const [result, setResult] = useState("");
  const [playerName] = useState("Ağa");

  // Periyodik kapı çalma (demo — store bağlanınca oradan da tetiklenir)
  useEffect(() => {
    const t = setInterval(() => {
      if (phase !== "closed") return;
      if (Math.random() > 0.92) {
        const b = pickBossForCity(null);
        setBoss(b);
        setKnown(false);
        setPhase("knock");
      }
    }, 45000);
    return () => clearInterval(t);
  }, [phase]);

  if (phase === "closed" || !boss) return null;

  const msg = fillTemplate(boss.messageTemplate, playerName, boss.cost);

  const intel = () => {
    setKnown(true);
    setResult(
      boss.kind === "hakiki"
        ? "İstihbarat: Bu iş ciddi. Boş lafa gelmezler."
        : "İstihbarat: Peron faresi. Raconla korkutulabilir."
    );
  };

  const pay = () => {
    setResult(
      `${boss.bossName}: “Akıllı esnaf. Bu hafta yazıhanen sakin. Çayın benden.”`
    );
    setPhase("result");
  };

  const raconHard = () => {
    if (boss.kind === "sahte") {
      setResult(
        `${RACON_DELIKANLI}\n\n${boss.bossName}: “T-tamam ağa… yanlış anlama… biz de şaka… gideriz.”\n\nBedava kurtuldun.`
      );
    } else {
      setResult(
        `${RACON_DELIKANLI}\n\n${boss.bossName}: “Racon senin olsun ${playerName}. Biz de raconumuzu gece yazarız.”\n\nRisk: otopark / kundak tehdidi aktif.`
      );
    }
    setPhase("result");
  };

  const raconSoft = () => {
    setResult(
      `${RACON_ESNAF}\n\n${boss.bossName}: “Anlaştık kaptan. Çorba parası hesabı kapatır. Yolun açık.”`
    );
    setPhase("result");
  };

  const ignore = () => {
    const line = HARASS_LINES[
      Math.floor(Math.random() * HARASS_LINES.length)
    ].replace(/\{name\}/g, playerName);
    setResult(`${boss.bossName}: “${line}”\n\nKapıyı kapattın. Taciz sürebilir.`);
    setPhase("result");
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4">
      <div className="bg-zinc-900 border border-amber-900/50 rounded-2xl max-w-md w-full p-5 shadow-2xl">
        {phase === "knock" && (
          <>
            <div className="text-[10px] tracking-widest text-amber-500 font-bold">
              TAK TAK TAK
            </div>
            <h2 className="text-lg font-bold text-white mt-2">
              Yazıhane kapısı çalındı
            </h2>
            <p className="text-sm text-zinc-400 mt-2">
              Camda siluet. Muavin fısıldıyor: “Ağa… yine onlar.”
            </p>
            <button
              type="button"
              onClick={() => setPhase("talk")}
              className="mt-5 w-full py-2.5 rounded-xl bg-amber-600 text-black font-semibold text-sm"
            >
              Kapıyı aç
            </button>
            <button
              type="button"
              onClick={ignore}
              className="mt-2 w-full py-2 text-xs text-zinc-500"
            >
              Açma
            </button>
          </>
        )}

        {phase === "talk" && (
          <>
            <div className="text-[10px] tracking-widest text-red-400 font-bold">
              YAZIHANE KAPISI
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              {boss.bossName}
            </h2>
            <p className="text-sm text-zinc-300 mt-3 leading-relaxed border-l-2 border-amber-800 pl-3">
              “{msg}”
            </p>
            {known && (
              <p
                className={`text-xs mt-3 font-semibold ${
                  boss.kind === "hakiki" ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {boss.kind === "hakiki"
                  ? "İstihbarat: HAKİKİ — reddetmek tehlikeli"
                  : "İstihbarat: SAHTE — racon işe yarayabilir"}
              </p>
            )}
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                disabled={known}
                onClick={intel}
                className="w-full py-2 text-xs rounded-lg border border-amber-800 text-amber-200 disabled:opacity-40"
              >
                İstihbarat al (₺500 — demo)
              </button>
              <button
                type="button"
                onClick={pay}
                className="w-full py-2.5 text-sm rounded-lg bg-zinc-100 text-black font-semibold"
              >
                Aidat öde (₺{boss.cost})
              </button>
              <button
                type="button"
                onClick={raconHard}
                className="w-full py-2.5 text-sm rounded-lg border border-red-800 text-red-300"
              >
                Racon — delikanlı (“Hadi naş!”)
              </button>
              <button
                type="button"
                onClick={raconSoft}
                className="w-full py-2.5 text-sm rounded-lg border border-zinc-600 text-zinc-300"
              >
                Racon — esnaf (çorba parası)
              </button>
              <button
                type="button"
                onClick={ignore}
                className="w-full py-2 text-xs text-zinc-500"
              >
                Kapıyı kapat
              </button>
            </div>
          </>
        )}

        {phase === "result" && (
          <>
            <div className="text-[10px] tracking-widest text-zinc-500 font-bold">
              SONUÇ
            </div>
            <p className="text-sm text-zinc-300 mt-3 whitespace-pre-line leading-relaxed">
              {result}
            </p>
            <button
              type="button"
              onClick={() => {
                setPhase("closed");
                setBoss(null);
                setResult("");
              }}
              className="mt-5 w-full py-2.5 rounded-xl bg-cyan-500 text-black font-semibold text-sm"
            >
              Tamam
            </button>
          </>
        )}
      </div>
    </div>
  );
                }
