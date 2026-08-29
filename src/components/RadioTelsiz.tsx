"use client";

import { useEffect, useState } from "react";

const LINES = [
  "Czzzt… Keşan–Ankara 3 nolu perondan kalkacaktır, kaptan yerini alsın!",
  "Czzzt… Bolu Dağı’nda sis var, sürati düşün kaptanlar!",
  "Czzzt… 1 nolu peronda çığırtkan atışması, itibara bak!",
  "Czzzt… Mazot konuşuluyor… yazıhaneler hesap yapıyor!",
  "Czzzt… Rakip fiyat kırdı söylentisi… borsayı izleyin!",
  "Czzzt… Akşam baskısı yaklaşıyor, manşet sıcak olacak!",
  "Czzzt… Muavin mikrofonu açık unutmuş, yolcular gülüyor!",
  "Czzzt… EDS flaş yağmuru Bolu çıkışı!",
  "Czzzt… Pişmaniye stoku azaldı, ikramı kontrol edin!",
  "Czzzt… Jandarma bagaj kontrolü artabilir!",
  "Czzzt… Peron hoparlörü cızırdıyor, anons gecikti!",
  "Czzzt… Gece seferi için kaptan hazır mı?",
  "Czzzt… Çay ocakçısı maaşını sordu, not edin!",
  "Czzzt… Yazıhane kapısı çalındı… kim geldi?",
  "Czzzt… Lobi kodu paylaşan var, peron savaşı kızışıyor!",
];

export default function RadioTelsiz() {
  const [line, setLine] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const pick = () =>
      setLine(LINES[Math.floor(Math.random() * LINES.length)]);
    pick();
    const t = setInterval(pick, 28000);
    return () => clearInterval(t);
  }, []);

  if (hidden || !line) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-3 right-3 md:left-auto md:right-4 md:max-w-sm z-40">
      <div className="rounded-xl border border-amber-900/50 bg-zinc-950/95 shadow-xl p-3">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[10px] tracking-widest text-amber-500/90 font-bold">
            OTOGAR TELSİZİ
          </span>
          <button
            type="button"
            onClick={() => setHidden(true)}
            className="text-[10px] text-zinc-500"
          >
            kapat
          </button>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed font-mono">{line}</p>
      </div>
    </div>
  );
}
