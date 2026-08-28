"use client";

import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";
import { Users, DoorOpen, Coffee, Search } from "lucide-react";

const QUESTIONS = [
  "Kaç yıldır direksiyon / muavinlik?",
  "Takograf ve dinlenme kuralları?",
  "Gece seferi olur mu?",
  "Son iş yerinden neden ayrıldınız?",
  "Maaş beklentin nedir?",
];

export default function StaffPage() {
  const {
    drivers,
    balance,
    pendingInterview,
    spawnInterview,
    finishInterview,
    checkBackground,
    restDriver,
    officeTheme,
    setOfficeTheme,
    openMeeting,
    crierLevel,
    upgradeCrier,
  } = useGameStore();

  const [qIndex, setQIndex] = useState(0);
  const [doorKnock, setDoorKnock] = useState(false);

  const startHire = (role: "driver" | "muavin") => {
    setQIndex(0);
    setDoorKnock(true);
    setTimeout(() => {
      setDoorKnock(false);
      spawnInterview(role);
    }, 800);
  };

  const crierCost = 3000 + crierLevel * 4000;

  return (
    <div
      className={`min-h-full p-4 sm:p-8 ${
        officeTheme === "school"
          ? "bg-[#2a2418]"
          : officeTheme === "modern"
          ? "bg-zinc-950"
          : "bg-[#1a1410]"
      }`}
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-1 text-amber-100">
          <Users className="w-6 h-6 text-amber-400" />
          Kadro · Çığırtkan · Mülakat
        </h1>
        <p className="text-stone-500 text-sm mb-4">Kasa: {formatMoney(balance)}</p>

        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          {(["classic", "school", "modern"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setOfficeTheme(t)}
              className={`px-3 py-1.5 rounded border ${
                officeTheme === t
                  ? "border-amber-500 text-amber-400"
                  : "border-stone-600 text-stone-400"
              }`}
            >
              {t === "classic" ? "Klasik" : t === "school" ? "Resmi" : "Modern"}
            </button>
          ))}
          <button
            type="button"
            onClick={() => openMeeting()}
            className="px-3 py-1.5 rounded border border-amber-700 text-amber-300"
          >
            Toplantı düzenle
          </button>
        </div>

        {/* Çığırtkan */}
        <div className="bg-stone-900/80 border border-stone-700 rounded-xl p-4 mb-6">
          <div className="font-semibold text-sm">Peron çığırtkanı — Sv. {crierLevel}/5</div>
          <p className="text-xs text-stone-500 mt-1">
            “İstanbul kalkıyor!” — yolcu dolum hızı +%{crierLevel * 8}
          </p>
          <button
            type="button"
            disabled={crierLevel >= 5}
            onClick={() => {
              if (!upgradeCrier()) alert("Yetersiz kasa veya max seviye");
            }}
            className="mt-3 px-4 py-2 text-sm rounded-lg bg-amber-500/20 border border-amber-600 text-amber-200 disabled:opacity-40"
          >
            {crierLevel >= 5 ? "Max" : `Yükselt ${formatMoney(crierCost)}`}
          </button>
        </div>

        <div className="relative bg-stone-900/80 border border-stone-700 rounded-xl p-6 mb-6 min-h-[130px]">
          <div className="absolute right-6 top-4 w-14 h-24 bg-[#4a3728] border-2 border-[#3a2a1a] rounded-sm flex items-center justify-center">
            <DoorOpen className="w-5 h-5 text-amber-700/80" />
          </div>
          {doorKnock && (
            <div className="absolute right-20 top-8 bg-white text-black text-xs px-2 py-1 rounded animate-bounce">
              tak tak…
            </div>
          )}
          <p className="text-sm text-stone-400 max-w-[70%]">
            Kapıdan aday gelir. İstihbarat için eski firmayı ara (₺500).
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              type="button"
              onClick={() => startHire("driver")}
              className="px-4 py-2 bg-amber-500 text-black text-sm font-semibold rounded-lg"
            >
              Şoför çağır
            </button>
            <button
              type="button"
              onClick={() => startHire("muavin")}
              className="px-4 py-2 border border-stone-600 text-sm rounded-lg"
            >
              Muavin çağır
            </button>
          </div>
        </div>

        <h2 className="font-semibold mb-3 text-stone-300">Kadro</h2>
        <div className="space-y-3">
          {drivers.length === 0 && (
            <p className="text-zinc-600 text-sm">Kimse yok.</p>
          )}
          {drivers.map((d) => (
            <div
              key={d.id}
              className="bg-stone-900 border border-stone-700 rounded-lg p-4 flex flex-wrap justify-between gap-3"
            >
              <div>
                <div className="font-medium">
                  {d.name}{" "}
                  <span className="text-xs text-stone-500">
                    · {d.role === "driver" ? "Şoför" : "Muavin"}
                  </span>
                  {d.onExpedition && (
                    <span className="ml-2 text-[10px] text-sky-400">seferde</span>
                  )}
                  {d.suspicious && (
                    <span className="ml-2 text-[10px] text-red-400">şüpheli</span>
                  )}
                </div>
                <div className="text-xs text-stone-500 mt-1">
                  Beceri {d.skill} · Güven {d.reliability}
                </div>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-stone-400">
                  Takograf
                  <div className="w-24 h-2 bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        d.fatigue > 70
                          ? "bg-red-500"
                          : d.fatigue > 40
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${d.fatigue}%` }}
                    />
                  </div>
                  %{Math.round(d.fatigue)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => restDriver(d.id)}
                disabled={d.onExpedition}
                className="flex items-center gap-1 text-xs px-3 py-1.5 border border-stone-600 rounded-lg disabled:opacity-40"
              >
                <Coffee className="w-3 h-3" /> Dinlendir
              </button>
            </div>
          ))}
        </div>
      </div>

      {pendingInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="bg-stone-900 border border-stone-600 rounded-xl max-w-md w-full p-6">
            <div className="font-bold text-lg">{pendingInterview.name}</div>
            <div className="text-xs text-stone-500 mb-3">
              {pendingInterview.role === "driver" ? "Şoför" : "Muavin"} ·{" "}
              {formatMoney(pendingInterview.wage)}
            </div>

            <button
              type="button"
              onClick={() => {
                if (!checkBackground())
                  alert("500₺ yok veya zaten arandı");
              }}
              disabled={pendingInterview.backgroundChecked}
              className="mb-3 w-full flex items-center justify-center gap-2 text-xs py-2 border border-amber-800 text-amber-200 rounded-lg disabled:opacity-50"
            >
              <Search className="w-3.5 h-3.5" />
              {pendingInterview.backgroundChecked
                ? "İstihbarat alındı (telefona bak)"
                : "Eski firmayı ara — ₺500"}
            </button>

            {pendingInterview.backgroundChecked && (
              <p className="text-[11px] text-red-300/90 mb-3 bg-red-950/40 border border-red-900 rounded p-2">
                {pendingInterview.criminalNote}
              </p>
            )}

            <div className="bg-stone-800 rounded-lg p-3 mb-3">
              <div className="text-[10px] text-stone-500">
                Soru {qIndex + 1}/5
              </div>
              <div className="text-sm text-amber-100/90">{QUESTIONS[qIndex]}</div>
              <div className="mt-2 text-sm bg-stone-950 border border-stone-700 rounded p-2">
                “{pendingInterview.answers[qIndex]}”
              </div>
            </div>

            <div className="flex gap-2">
              {qIndex < 4 ? (
                <button
                  type="button"
                  onClick={() => setQIndex((i) => i + 1)}
                  className="flex-1 py-2 bg-amber-500 text-black font-medium rounded-lg text-sm"
                >
                  Sonraki
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => finishInterview(true)}
                    className="flex-1 py-2 bg-emerald-700 text-white rounded-lg text-sm"
                  >
                    İşe al
                  </button>
                  <button
                    type="button"
                    onClick={() => finishInterview(false)}
                    className="flex-1 py-2 border border-stone-600 rounded-lg text-sm"
                  >
                    Kov
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}