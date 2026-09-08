"use client";

import { useEffect, useState } from "react";
import {
  pickMafiaBoss,
  fillTemplate,
  HARASS_LINES,
  RACON_DELIKANLI,
  RACON_ESNAF,
  type MafiaBoss,
} from "@/data/mafia";
import { useGameStore, CITIES } from "@/store/gameStore";

type Phase = "closed" | "knock" | "talk" | "result";

export default function MafiaModal() {
  const [phase, setPhase] = useState<Phase>("closed");
  const [boss, setBoss] = useState<MafiaBoss | null>(null);
  const [known, setKnown] = useState(false);
  const [result, setResult] = useState("");

  const playerName = useGameStore((s) => s.playerName);
  const homeCityId = useGameStore((s) => s.homeCityId);
  const mafiaDebtDue = useGameStore((s) => s.mafiaDebtDue);
  const activeBoss = useGameStore((s) => s.activeBoss);
  const setupDone = useGameStore((s) => s.setupDone);
  const balance = useGameStore((s) => s.balance);
  const payMafia = useGameStore((s) => s.payMafia);
  const refuseMafia = useGameStore((s) => s.refuseMafia);
  const mafiaVisit = useGameStore((s) => s.mafiaVisit);
  const spendMoney = useGameStore((s) => s.spendMoney);
  const addLedger = useGameStore((s) => s.addLedger);

  const cityName =
    CITIES.find((c) => c.id === homeCityId)?.name || "İstanbul";

  const assignActiveBoss = (nextBoss: MafiaBoss | null, due = true) => {
    useGameStore.setState({
      activeBoss: nextBoss as any,
      mafiaDebtDue: due,
    });
  };

  const clearActiveBoss = () => {
    useGameStore.setState({
      activeBoss: null as any,
      mafiaDebtDue: false,
    });
  };

  // Store’dan aidat geldiyse modal aç
  useEffect(() => {
    if (mafiaDebtDue && activeBoss && phase === "closed") {
      const selectedBoss = activeBoss as any;

      setBoss({
        ...selectedBoss,
        kind: selectedBoss.type ?? selectedBoss.kind ?? "sahte",
        cost: selectedBoss.weeklyFee ?? selectedBoss.cost ?? 0,
        messageTemplate: selectedBoss.message ?? "",
        payLine: selectedBoss.payLine ?? "",
        refuseLine: selectedBoss.refuseLine ?? "",
        type: selectedBoss.type ?? selectedBoss.kind ?? "sahte",
      } as MafiaBoss);

      setKnown(false);
      setPhase("knock");
    }
  }, [mafiaDebtDue, activeBoss, phase]);

  // Demo / seyrek rastgele (setup sonrası)
  useEffect(() => {
    if (!setupDone) return;
    const t = setInterval(() => {
      if (phase !== "closed" || mafiaDebtDue) return;
      if (Math.random() > 0.94) {
        mafiaVisit();
      }
    }, 60000);
    return () => clearInterval(t);
  }, [phase, setupDone, mafiaDebtDue, mafiaVisit]);

  if (phase === "closed" || !boss) return null;

  const msg = fillTemplate(boss.messageTemplate, playerName || "Ağa", boss.cost);

  const intel = () => {
    if (!spendMoney(500)) {
      setResult("İstihbarat için 500 ₺ yok.");
      return;
    }
    addLedger("İstihbarat", -500);
    setKnown(true);
    setResult(
      boss.kind === "hakiki"
        ? "İstihbarat: Bu iş ciddi. Boş lafa gelmezler."
        : "İstihbarat: Peron faresi. Raconla korkutulabilir."
    );
  };

  const pay = () => {
    // Store’a boss yazılı değilse yaz
    if (!activeBoss) {
      assignActiveBoss(boss);
    }

    if (balance < boss.cost) {
      setResult(`Kasa yetmedi (${boss.cost} ₺). Bakiye: ${balance} ₺`);
      setPhase("result");
      return;
    }

    payMafia();
    setResult(`${boss.bossName}: “${boss.payLine}”`);
    setPhase("result");
  };

  const raconHard = () => {
    if (boss.kind === "sahte") {
      clearActiveBoss();
      setResult(
        `${RACON_DELIKANLI}\n\n${boss.bossName}: “T-tamam ağa… yanlış anlama… biz de şaka… gideriz.”\n\nBedava kurtuldun.`
      );
    } else {
      if (!activeBoss) {
        assignActiveBoss(boss);
      }
      refuseMafia();
      setResult(
        `${RACON_DELIKANLI}\n\n${boss.bossName}: “Racon senin olsun ${playerName || "Ağa"}. Biz de raconumuzu gece yazarız.”\n\n${boss.refuseLine}`
      );
    }
    setPhase("result");
  };

  const raconSoft = () => {
    const fee = Math.min(boss.cost, Math.max(800, Math.floor(boss.cost * 0.4)));
    if (!spendMoney(fee)) {
      setResult("Çorba parası için kasa yetmedi.");
      setPhase("result");
      return;
    }
    addLedger("Çorba parası", -fee);
    clearActiveBoss();
    setResult(
      `${RACON_ESNAF}\n\n${boss.bossName}: “Anlaştık kaptan. ${fee} ₺ ile defter kapandı. Yolun açık.”`
    );
    setPhase("result");
  };

  const ignore = () => {
    const line = HARASS_LINES[
      Math.floor(Math.random() * HARASS_LINES.length)
    ]!.replace(/\{name\}/g, playerName || "Ağa");
    if (boss.kind === "hakiki") {
      if (!activeBoss) {
        assignActiveBoss(boss);
      }
      refuseMafia();
      setResult(
        `${boss.bossName}: “${line}”\n\nKapıyı kapattın. ${boss.refuseLine}`
      );
    } else {
      clearActiveBoss();
      setResult(
        `${boss.bossName}: “${line}”\n\nBlöf. Bir süre taciz mesajı gelebilir.`
      );
    }
    setPhase("result");
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4">
      <div className="bg-zinc-900 border border-amber-900/50 rounded-2xl max-w-md w-full p-5 shadow-2xl">
        {phase === "knock" && (
          <>
            <div className="text-[10px] tracking-widest text-amber-500 font-bold">
              TAK TAK TAK · {cityName}
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
              {boss.region.toUpperCase()} ·{" "}
              {boss.kind === "hakiki" ? "AĞIR" : "ŞÜPHELİ"}
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
                İstihbarat al (₺500)
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
                setKnown(false);
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