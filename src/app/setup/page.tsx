"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore, CITIES } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";
import { MapPin, Stamp, FileText } from "lucide-react";

export default function SetupPage() {
  const router = useRouter();
  const balance = useGameStore((s) => s.balance);
  const setupDone = useGameStore((s) => s.setupDone);
  const completeCitySetup = useGameStore((s) => s.completeCitySetup);

  const [cityId, setCityId] = useState("ankara");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [stamped, setStamped] = useState(false);

  const city = CITIES.find((c) => c.id === cityId)!;
  const total = city.plotCost + city.licenseCost;

  if (setupDone) {
    if (typeof window !== "undefined") router.replace("/map");
    return null;
  }

  const approve = () => {
    if (!stamped) {
      alert("Belediye mührü zorunlu");
      return;
    }
    if (!completeCitySetup(cityId)) {
      alert("Kasa yetersiz");
      return;
    }
    router.replace("/map");
  };

  return (
    <div className="min-h-screen bg-[#1a1410] text-stone-200 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-stone-900 border border-stone-700 rounded-xl overflow-hidden">
        <div className="bg-red-900 text-white text-center text-xs font-bold py-2 tracking-widest">
          BELEDİYE · TERMİNAL KURULUM RUHSATI
        </div>
        <div className="p-6 space-y-4">
          {step === 1 && (
            <>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                Terminal hangi ilde?
              </h1>
              <p className="text-sm text-stone-500">
                Ofisin yıldızı bu ilde sabitlenir. Sürüş modu sonra açılacak.
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {CITIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCityId(c.id)}
                    className={`text-left p-3 rounded-lg border text-sm ${
                      cityId === c.id
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-stone-700"
                    }`}
                  >
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-[10px] text-stone-500">{c.region}</div>
                    <div className="text-xs text-amber-500/90 mt-1">
                      {formatMoney(c.plotCost + c.licenseCost)}
                    </div>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-2.5 bg-amber-500 text-black font-semibold rounded-lg"
              >
                Devam — maliyet
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-bold flex items-center gap-2">
                <FileText className="w-4 h-4" /> Maliyet — {city.name}
              </h2>
              <div className="bg-stone-950 border border-stone-700 rounded-lg p-4 text-sm space-y-2 font-mono">
                <div className="flex justify-between">
                  <span>Arsa</span>
                  <span>{formatMoney(city.plotCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ruhsat</span>
                  <span>{formatMoney(city.licenseCost)}</span>
                </div>
                <div className="border-t border-stone-700 pt-2 flex justify-between text-amber-400 font-bold">
                  <span>TOPLAM</span>
                  <span>{formatMoney(total)}</span>
                </div>
                <div className="text-xs text-stone-500">Kasa: {formatMoney(balance)}</div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-2 border border-stone-600 rounded-lg">
                  Geri
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={balance < total}
                  className="flex-1 py-2 bg-amber-500 text-black font-semibold rounded-lg disabled:opacity-40"
                >
                  Belge
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="bg-stone-100 text-stone-900 p-4 rounded text-[11px] font-serif leading-relaxed">
                <div className="text-center font-bold text-sm mb-2">
                  {city.name.toUpperCase()} BELEDİYESİ
                  <br />
                  TERMİNAL İŞLETME İZNİ
                </div>
                <p>
                  {city.name} ilinde arsa tahsisi ve ruhsat onaylanmıştır. Bedel{" "}
                  {formatMoney(total)}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStamped(true)}
                className={`w-full py-3 rounded-full border-2 font-bold text-sm flex items-center justify-center gap-2 ${
                  stamped
                    ? "border-red-700 text-red-400"
                    : "border-dashed border-red-500 text-red-400"
                }`}
              >
                <Stamp className="w-4 h-4" />
                {stamped ? "MÜHÜR BASILDI" : "Belediye mührü bas"}
              </button>
              <button
                type="button"
                onClick={approve}
                disabled={!stamped}
                className="w-full py-2.5 bg-emerald-700 text-white font-semibold rounded-lg disabled:opacity-40"
              >
                Onayla — terminali kur
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}