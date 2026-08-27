"use client";

import { useRef, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";
import { FileText, Stamp, PenLine, X } from "lucide-react";

export interface BankPackage {
  id: string;
  name: string;
  rateLabel: string; // gösterim
  multiplier: number; // borç = tutar * multiplier
  maxAmount: number;
  minAmount: number;
  note: string;
}

export const BANK_PACKAGES: BankPackage[] = [
  {
    id: "ahmet",
    name: "Ahmet Bankacılık",
    rateLabel: "%8 faiz · 3 ay",
    multiplier: 1.08,
    maxAmount: 25000,
    minAmount: 2000,
    note: "Kısa vade, düşük faiz. Esnaf dostu.",
  },
  {
    id: "nexora",
    name: "Nexora Bankacılık",
    rateLabel: "%12 faiz · 6 ay",
    multiplier: 1.12,
    maxAmount: 50000,
    minAmount: 5000,
    note: "Orta limit, dengeli taksit.",
  },
  {
    id: "ziraat",
    name: "Ziraat Esnaf",
    rateLabel: "%6 faiz · 4 ay",
    multiplier: 1.06,
    maxAmount: 20000,
    minAmount: 1000,
    note: "Muhafazakâr limit, resmi kurum havası.",
  },
  {
    id: "peron",
    name: "Peron Kredi",
    rateLabel: "%18 faiz · 12 ay",
    multiplier: 1.18,
    maxAmount: 50000,
    minAmount: 10000,
    note: "Yüksek limit, yüksek faiz. Dikkat.",
  },
  {
    id: "kesan",
    name: "Keşan Kooperatif",
    rateLabel: "%5 faiz · 2 ay",
    multiplier: 1.05,
    maxAmount: 15000,
    minAmount: 1000,
    note: "Küçük tutar, komşu kooperatif.",
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function LoanContractModal({ open, onClose }: Props) {
  const takeBankLoan = useGameStore((s) => s.takeBankLoan);
  const companyName = useGameStore((s) => s.companyName);
  const bankDebt = useGameStore((s) => s.bankDebt);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [bank, setBank] = useState<BankPackage>(BANK_PACKAGES[1]);
  const [amount, setAmount] = useState(10000);
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [signed, setSigned] = useState(false);
  const [stamped, setStamped] = useState(false);
  const [sigMode, setSigMode] = useState<"draw" | "pick">("pick");
  const [pickedSig, setPickedSig] = useState("A.E.B.");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  if (!open) return null;

  const debtWrite = Math.round(amount * bank.multiplier);
  const canProceedAmount =
    amount >= bank.minAmount && amount <= bank.maxAmount && amount >= 1000;

  const reset = () => {
    setStep(1);
    setQ1("");
    setQ2("");
    setSigned(false);
    setStamped(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  // Canvas imza
  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const c = canvasRef.current;
    if (!c) return;
    drawing.current = true;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    const rect = c.getBoundingClientRect();
    const pt =
      "touches" in e
        ? { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
        : { x: e.clientX - rect.left, y: e.clientY - rect.top };
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
  };
  const moveDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const rect = c.getBoundingClientRect();
    const pt =
      "touches" in e
        ? { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
        : { x: e.clientX - rect.left, y: e.clientY - rect.top };
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
  };
  const endDraw = () => {
    drawing.current = false;
    setSigned(true);
  };
  const clearCanvas = () => {
    const c = canvasRef.current;
    if (!c) return;
    c.getContext("2d")?.clearRect(0, 0, c.width, c.height);
    setSigned(false);
  };

  const approve = () => {
    if (!signed || !stamped) {
      alert("İmza ve mühür zorunlu");
      return;
    }
    // Store: miktarı ver, borç multiplier ile yazılıyor — store 1.12 sabit kullanıyordu.
    // takeBankLoan amount alır, borç amount*1.12 yazar. Biz borç tutarını doğru yazmak için
    // sadece ana parayı gönderiyoruz; faiz bank.multiplier ofiste gösterilir.
    // Daha doğru: takeBankLoan'u amount ile çağır (store kendi faizini uygular).
    // İsteğe bağlı tutarlılık: ana para amount.
    if (!takeBankLoan(amount)) {
      alert("Kredi alınamadı (limit veya tutar)");
      return;
    }
    close();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-3 overflow-y-auto">
      <div className="bg-stone-200 text-stone-900 max-w-lg w-full rounded shadow-2xl my-4 relative">
        <button
          type="button"
          onClick={close}
          className="absolute top-2 right-2 p-1 text-stone-500 hover:text-stone-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Üst şerit */}
        <div className="bg-stone-800 text-stone-100 px-4 py-3 flex items-center gap-2 rounded-t">
          <FileText className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-semibold tracking-wide">
            KREDİ SÖZLEŞMESİ — A4
          </span>
          <span className="text-[10px] text-stone-400 ml-auto">Adım {step}/4</span>
        </div>

        <div className="p-5 space-y-4">
          {/* ADIM 1 — Banka + tutar */}
          {step === 1 && (
            <>
              <p className="text-xs text-stone-600">
                Mevcut borç: {formatMoney(bankDebt)} · Şirket: {companyName}
              </p>
              <div className="space-y-2">
                {BANK_PACKAGES.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setBank(b);
                      setAmount(Math.min(amount, b.maxAmount));
                    }}
                    className={`w-full text-left p-3 rounded border text-sm ${
                      bank.id === b.id
                        ? "border-amber-700 bg-amber-50"
                        : "border-stone-300 bg-white hover:border-stone-400"
                    }`}
                  >
                    <div className="font-semibold">{b.name}</div>
                    <div className="text-xs text-stone-500">
                      {b.rateLabel} · max {formatMoney(b.maxAmount)}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">{b.note}</div>
                  </button>
                ))}
              </div>
              <label className="block text-sm">
                <span className="text-xs text-stone-500">
                  Tutar ({formatMoney(bank.minAmount)} – {formatMoney(bank.maxAmount)})
                </span>
                <input
                  type="number"
                  value={amount}
                  min={bank.minAmount}
                  max={bank.maxAmount}
                  step={1000}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-1 w-full border border-stone-400 rounded px-3 py-2 bg-white"
                />
              </label>
              <p className="text-xs text-stone-600">
                Yazılacak borç (faizli):{" "}
                <strong>{formatMoney(debtWrite)}</strong>
              </p>
              <button
                type="button"
                disabled={!canProceedAmount}
                onClick={() => setStep(2)}
                className="w-full py-2.5 bg-stone-800 text-white rounded font-medium disabled:opacity-40"
              >
                Resmi sorulara geç
              </button>
            </>
          )}

          {/* ADIM 2 — Resmi sorular */}
          {step === 2 && (
            <>
              <p className="text-sm font-medium">Beyan formu</p>
              <label className="block text-sm">
                <span className="text-xs text-stone-500">
                  1. Teminat / kefil beyanı?
                </span>
                <select
                  value={q1}
                  onChange={(e) => setQ1(e.target.value)}
                  className="mt-1 w-full border border-stone-400 rounded px-3 py-2 bg-white"
                >
                  <option value="">Seçiniz</option>
                  <option value="yok">Teminatsız (açık risk)</option>
                  <option value="otobus">Filodaki otobüs rehin</option>
                  <option value="kefil">Şahsi kefil</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="text-xs text-stone-500">
                  2. Aylık taksit ödeme taahhüdü?
                </span>
                <select
                  value={q2}
                  onChange={(e) => setQ2(e.target.value)}
                  className="mt-1 w-full border border-stone-400 rounded px-3 py-2 bg-white"
                >
                  <option value="">Seçiniz</option>
                  <option value="evet">Evet, kasa müsait oldukça</option>
                  <option value="sefer">Sefer kârından kesilsin</option>
                  <option value="gecikme">Gecikme riskini kabul ediyorum</option>
                </select>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2 border border-stone-400 rounded text-sm"
                >
                  Geri
                </button>
                <button
                  type="button"
                  disabled={!q1 || !q2}
                  onClick={() => setStep(3)}
                  className="flex-1 py-2 bg-stone-800 text-white rounded text-sm disabled:opacity-40"
                >
                  Sözleşmeyi aç
                </button>
              </div>
            </>
          )}

          {/* ADIM 3 — A4 metin */}
          {step === 3 && (
            <>
              <div className="bg-white border border-stone-400 p-4 text-[11px] leading-relaxed font-serif max-h-56 overflow-y-auto shadow-inner">
                <div className="text-center font-bold text-sm mb-2 tracking-wide">
                  {bank.name.toUpperCase()}
                  <br />
                  KREDİ KULLANDIRIM SÖZLEŞMESİ
                </div>
                <p>
                  İşbu sözleşme, <strong>{companyName}</strong> unvanlı taşımacılık
                  işletmesi ile {bank.name} arasında {new Date().toLocaleDateString("tr-TR")}{" "}
                  tarihinde akdedilmiştir.
                </p>
                <p className="mt-2">
                  <strong>Madde 1 — Tutar:</strong> Kredinin anaparası{" "}
                  {formatMoney(amount)} olup, faiz ve masraflar dahil borç bakiyesi{" "}
                  {formatMoney(debtWrite)} olarak deftere işlenecektir. ({bank.rateLabel})
                </p>
                <p className="mt-2">
                  <strong>Madde 2 — Teminat:</strong> Beyan: {q1}. Ödeme: {q2}.
                </p>
                <p className="mt-2">
                  <strong>Madde 3:</strong> Ödenmeyen kısımlar itibarı ve ilerideki kredi
                  limitini etkiler. Gecikmede ek faiz işletilebilir.
                </p>
                <p className="mt-2 text-center text-stone-500">
                  — Otogar Tycoon · Peron Savaşları — resmi oyun belgesi —
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-2 border border-stone-400 rounded text-sm"
                >
                  Geri
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex-1 py-2 bg-stone-800 text-white rounded text-sm"
                >
                  İmzaya geç
                </button>
              </div>
            </>
          )}

          {/* ADIM 4 — İmza + mühür */}
          {step === 4 && (
            <>
              <div className="flex gap-2 text-xs mb-1">
                <button
                  type="button"
                  onClick={() => setSigMode("pick")}
                  className={`px-2 py-1 rounded border ${
                    sigMode === "pick" ? "border-amber-700 bg-amber-50" : "border-stone-300"
                  }`}
                >
                  Hazır imza
                </button>
                <button
                  type="button"
                  onClick={() => setSigMode("draw")}
                  className={`px-2 py-1 rounded border ${
                    sigMode === "draw" ? "border-amber-700 bg-amber-50" : "border-stone-300"
                  }`}
                >
                  Çiz
                </button>
              </div>

              {sigMode === "pick" ? (
                <div className="flex flex-wrap gap-2">
                  {["A.E.B.", "Kaptan", "Müdür", "X"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setPickedSig(s);
                        setSigned(true);
                      }}
                      className={`px-3 py-2 border rounded font-serif italic ${
                        signed && pickedSig === s
                          ? "border-amber-700 bg-amber-50"
                          : "border-stone-300 bg-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={100}
                    className="w-full border border-stone-400 bg-white rounded touch-none"
                    onMouseDown={startDraw}
                    onMouseMove={moveDraw}
                    onMouseUp={endDraw}
                    onMouseLeave={endDraw}
                    onTouchStart={startDraw}
                    onTouchMove={moveDraw}
                    onTouchEnd={endDraw}
                  />
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-xs text-stone-500 mt-1 underline"
                  >
                    Temizle
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => setStamped(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-bold ${
                    stamped
                      ? "border-red-700 text-red-800 bg-red-50"
                      : "border-dashed border-red-400 text-red-600"
                  }`}
                >
                  <Stamp className="w-4 h-4" />
                  {stamped ? "MÜHÜR BASILDI" : "Otogar mührü bas"}
                </button>
                {stamped && (
                  <div className="w-16 h-16 rounded-full border-4 border-red-700/80 text-red-800 flex flex-col items-center justify-center text-[8px] font-black rotate-[-12deg] opacity-90">
                    <span>OTOGAR</span>
                    <span>TYCOON</span>
                    <span className="text-[6px] font-normal">1987</span>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-stone-500 flex items-center gap-1">
                <PenLine className="w-3 h-3" />
                İmza {signed ? "✓" : "—"} · Mühür {stamped ? "✓" : "—"}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-2 border border-stone-400 rounded text-sm"
                >
                  Geri
                </button>
                <button
                  type="button"
                  onClick={approve}
                  disabled={!signed || !stamped}
                  className="flex-1 py-2.5 bg-emerald-800 text-white rounded text-sm font-semibold disabled:opacity-40"
                >
                  Onayla — {formatMoney(amount)} çek
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}