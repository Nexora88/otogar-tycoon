"use client";

import { useEffect, useState, useRef } from "react";
import { useGameStore } from "@/store/gameStore";

interface DrivingViewProps {
  expeditionId: string;
}

type RadioChannel = "esnaf" | "kral" | "yurt";
type Weather = "clear" | "rain" | "snow";

const RADIO = {
  esnaf: {
    name: "ESNAF FM",
    songs: [
      "Şiki Şiki Kaptan",
      "Boncuk Turizm",
      "AŞTİ Realtime",
      "Keşan Ovası",
      "Kostak Muavin",
      "Mustafa Kemal'in İzinde",
      "Çilli Travego",
      "Fesupanallah Şanzıman",
      "Yollara Karşı Yapay Zeka",
      "9/8'lik Keşan Sapağı",
    ],
  },
  kral: {
    name: "KRAL FM",
    songs: [
      "Taht Kurmuşsun Koltuğuma",
      "Rötar Yapmam Sen",
      "Hatsız Dolmuş Olmaz",
      "Gece Seferi Başlayınca",
      "Yapay Duygularım",
      "Motor İstemezse",
      "Mazotumuz Kalmadı",
      "Mavi Minibüs",
      "Hararet Yaptın Beni",
      "Yolların Emektarı",
    ],
  },
  yurt: {
    name: "YURT FM",
    songs: [
      "Keşan'ın Dağlarında Çiçekler Açar",
      "Demir Ağlarla Örülü Yollar",
      "Yıldırımlar Yaratan Bir Devrim",
      "Ata'nın Pusulası",
      "Havasına Suyuna Yapay Zekasına",
      "Tuna Nehri Akmam Diyor",
      "Neslin Baban / Kaptanlar Marşı",
      "14 Yaşındaki Üretim Azmi",
      "Ufuktaki Anıtkabir",
      "Sulh ve Selamet Seferi",
    ],
  },
};

const ADS = [
  `Bak canım kardeşim... Bu uzun yollarda direksiyon sallarken bile bile lades olmak istemiyorsan... Koltuğunu Ahmet Eymen Bakraç'ın Otogar Tycoon'una emanet edeceksin! Aç radyoyu, tekerine taş değmesin!`,
  `Kaptan... Gece Keşan sapağından dönerken ön cam buz tutar. Silecekleri zamanında çalıştırmazsan motoru eline alırsın! Pusulamız bellidir: Yurtta sulh, cihanda sulh!`,
  `Bırak ganyan kuponunu kardeşim. Gerçek kumar bu asfaltta dönüyor. Ya terminal ağası olursun ya muavin koltuğunda kalırsın. Bas gaza!`,
  `Direksiyon salladığın bu topraklar kolay kazanılmadı. Ufukta Anıtkabir belirirken unutma: Yurtta sulh, cihanda sulh! Doğru zamanda bas gaza.`,
];

const BILLBOARDS = [
  { title: "Bakraç Ticaret", subtitle: "Geleceğin Bilgisayarlı Sistemleri", style: "tech" },
  { title: "Otogar Tycoon", subtitle: "Yolcuların ve Kaptanların Hakiki Dostu!", style: "yellow" },
  { title: "Nexora Elektronik", subtitle: "Yerli Malı, Herkes Onu Kullanmalı", style: "nexora" },
  { title: "Yurtta Sulh, Cihanda Sulh", subtitle: "— M. Kemal Atatürk", style: "ataturk" },
  { title: "Egemenlik Kayıtsız Şartsız Milletindir!", subtitle: "", style: "republic" },
  { title: "Gelecek Göklerdedir!", subtitle: "", style: "sky" },
  { title: "Mustafa Kemal'in Askerleriyiz", subtitle: "Köprü geçişi", style: "bridge" },
  { title: "Anıtkabir", subtitle: "Emanetlere sahip çık", style: "anitkabir" },
];

export default function DrivingView({ expeditionId }: DrivingViewProps) {
  const { expeditions } = useGameStore();
  const exp = expeditions.find((e) => e.id === expeditionId);

  // Sürüş
  const [offset, setOffset] = useState(0);
  const [tilt, setTilt] = useState(0);
  const [speed, setSpeed] = useState(45);
  const [signal, setSignal] = useState<"none" | "left" | "right">("none");
  const [wiperOn, setWiperOn] = useState(false);
  const keys = useRef<Record<string, boolean>>({});

  // Hava & saat
  const [weather, setWeather] = useState<Weather>("clear");
  const [gameHour, setGameHour] = useState(14); // 0-23

  // Radyo
  const [channel, setChannel] = useState<RadioChannel>("esnaf");
  const [songIndex, setSongIndex] = useState(0);
  const [isAd, setIsAd] = useState(false);
  const [adText, setAdText] = useState("");
  const [songCount, setSongCount] = useState(0);

  // Tabela
  const [billboardIndex, setBillboardIndex] = useState(0);
  const [showBillboard, setShowBillboard] = useState(false);

  // Diğer arabalar
  const [cars, setCars] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  // Yol animasyon süresi (hız arttıkça kısalır)
  const roadDuration = Math.max(0.12, 0.55 - speed / 280);

  // Görüş bulanık mı? (yağmur/kar + silecek kapalı)
  const visionBlurred = (weather === "rain" || weather === "snow") && !wiperOn;

  // Klavye
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
      if (e.key === "q" || e.key === "Q") setSignal((s) => (s === "left" ? "none" : "left"));
      if (e.key === "e" || e.key === "E") setSignal((s) => (s === "right" ? "none" : "right"));
      if (e.key === " ") {
        e.preventDefault();
        setWiperOn((v) => !v);
      }
      if (e.key === "1") setChannel("esnaf");
      if (e.key === "2") setChannel("kral");
      if (e.key === "3") setChannel("yurt");
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Sürüş döngüsü
  useEffect(() => {
    let anim: number;
    const loop = () => {
      let dx = 0;
      if (keys.current["a"] || keys.current["arrowleft"]) dx -= 1.9;
      if (keys.current["d"] || keys.current["arrowright"]) dx += 1.9;

      if (keys.current["w"] || keys.current["arrowup"]) {
        setSpeed((s) => Math.min(135, s + 0.65));
      } else if (keys.current["s"] || keys.current["arrowdown"]) {
        setSpeed((s) => Math.max(0, s - 1.3));
      } else {
        setSpeed((s) => Math.max(20, s - 0.12));
      }

      // Yağmurda sileceksiz biraz daha yavaşla
      if (visionBlurred) {
        setSpeed((s) => Math.min(s, 70));
      }

      setOffset((o) => {
        const next = Math.max(-130, Math.min(130, o + dx));
        setTilt(dx * 2.4);
        return next;
      });

      anim = requestAnimationFrame(loop);
    };
    anim = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(anim);
  }, [visionBlurred]);

  // Saat ilerlesin
  useEffect(() => {
    const t = setInterval(() => {
      setGameHour((h) => (h + 1) % 24);
    }, 9000); // her 9 sn ≈ 1 oyun saati
    return () => clearInterval(t);
  }, []);

  // Hava rastgele değişsin
  useEffect(() => {
    const t = setInterval(() => {
      const r = Math.random();
      if (r > 0.72) setWeather("rain");
      else if (r > 0.88) setWeather("snow");
      else setWeather("clear");
    }, 14000);
    return () => clearInterval(t);
  }, []);

  // Diğer arabalar
  useEffect(() => {
    const t = setInterval(() => {
      setCars((prev) => {
        const moved = prev
          .map((c) => ({ ...c, y: c.y + 2.5 + speed / 40 }))
          .filter((c) => c.y < 115);
        if (Math.random() > 0.68) {
          moved.push({
            id: Date.now() + Math.random(),
            x: (Math.random() - 0.5) * 200,
            y: -8,
            color: ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7"][
              Math.floor(Math.random() * 5)
            ],
          });
        }
        return moved;
      });
    }, 380);
    return () => clearInterval(t);
  }, [speed]);

  // Radyo
  useEffect(() => {
    const t = setInterval(() => {
      if (isAd) return;
      setSongCount((c) => {
        const next = c + 1;
        if (next % 3 === 0) {
          setIsAd(true);
          setAdText(ADS[Math.floor(Math.random() * ADS.length)]);
          setTimeout(() => {
            setIsAd(false);
            setSongIndex((i) => (i + 1) % RADIO[channel].songs.length);
          }, 7500);
        } else {
          setSongIndex((i) => (i + 1) % RADIO[channel].songs.length);
        }
        return next;
      });
    }, 11000);
    return () => clearInterval(t);
  }, [channel, isAd]);

  useEffect(() => {
    setSongIndex(Math.floor(Math.random() * RADIO[channel].songs.length));
    setIsAd(false);
  }, [channel]);

  // Tabelalar (Anıtkabir / köprü dahil)
  useEffect(() => {
    const t = setInterval(() => {
      setBillboardIndex((i) => (i + 1) % BILLBOARDS.length);
      setShowBillboard(true);
      setTimeout(() => setShowBillboard(false), 3800);
    }, 7500);
    return () => clearInterval(t);
  }, []);

  if (!exp || exp.status !== "departed") return null;

  const currentSong = RADIO[channel].songs[songIndex];
  const billboard = BILLBOARDS[billboardIndex];

  // Gökyüzü rengi (saate göre)
  const isNight = gameHour < 6 || gameHour >= 20;
  const skyClass = isNight
    ? "from-slate-950 via-slate-900 to-zinc-800"
    : weather === "rain"
    ? "from-slate-700 via-slate-600 to-zinc-600"
    : weather === "snow"
    ? "from-slate-400 via-slate-500 to-zinc-500"
    : "from-sky-800 via-sky-700 to-zinc-600";

  const timeLabel = `${String(gameHour).padStart(2, "0")}:00`;

  return (
    <div className="fixed inset-0 z-40 bg-zinc-950 overflow-hidden select-none">
      {/* Gökyüzü */}
      <div className={`absolute inset-0 bg-gradient-to-b ${skyClass} transition-colors duration-1000`} />

      {/* Yol */}
      <div
        className="absolute inset-0 transition-transform duration-150 ease-out"
        style={{
          transform: `perspective(700px) rotateX(14deg) translateX(${-offset}px) rotateZ(${tilt}deg)`,
        }}
      >
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[160%] h-[75%]"
          style={{
            background: `repeating-linear-gradient(0deg, #3f3f46 0px, #3f3f46 50px, #52525b 50px, #52525b 100px)`,
            transform: "rotateX(58deg)",
          }}
        >
          {/* Orta çizgi - hız ile senkron */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2"
            style={{
              background: `repeating-linear-gradient(0deg, #fbbf24 0 28px, transparent 28px 56px)`,
              animation: `roadFlow ${roadDuration}s linear infinite`,
            }}
          />
        </div>

        {/* Diğer araçlar */}
        {cars.map((c) => (
          <div
            key={c.id}
            className="absolute w-10 h-16 rounded-sm shadow-lg border border-black/30"
            style={{
              left: `calc(50% + ${c.x}px)`,
              top: `${c.y}%`,
              backgroundColor: c.color,
              transform: "translateX(-50%)",
            }}
          />
        ))}
      </div>

      {/* Yağmur / Kar taneleri */}
      {(weather === "rain" || weather === "snow") && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: weather === "rain" ? 40 : 25 }).map((_, i) => (
            <div
              key={i}
              className={`absolute ${
                weather === "rain"
                  ? "w-0.5 h-5 bg-white/50"
                  : "w-1.5 h-1.5 rounded-full bg-white/80"
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `fall ${0.8 + Math.random() * 0.9}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Görüş bulanıklığı (silecek kapalıysa) */}
      {visionBlurred && (
        <div className="absolute inset-0 z-20 backdrop-blur-md bg-white/5 pointer-events-none transition-all duration-500" />
      )}

      {/* Silecekler */}
      {wiperOn && (
        <>
          <div className="absolute top-0 left-0 w-1/2 h-[55%] origin-top-right animate-wiper-l pointer-events-none z-30">
            <div className="w-full h-0.5 bg-zinc-200/60 mt-[38%]" />
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-[55%] origin-top-left animate-wiper-r pointer-events-none z-30">
            <div className="w-full h-0.5 bg-zinc-200/60 mt-[38%]" />
          </div>
        </>
      )}

      {/* Tabela / Anıtkabir / Köprü */}
      {showBillboard && (
        <div
          className={`absolute top-16 z-10 transition-all duration-700 ${
            offset > 40 ? "left-6" : offset < -40 ? "right-6" : "left-1/2 -translate-x-1/2"
          }`}
        >
          <div
            className={`px-5 py-3 rounded border-4 max-w-[260px] text-center shadow-2xl ${
              billboard.style === "yellow"
                ? "bg-amber-400 border-black text-black"
                : billboard.style === "ataturk" ||
                  billboard.style === "republic" ||
                  billboard.style === "bridge" ||
                  billboard.style === "anitkabir"
                ? "bg-red-800 border-white text-white"
                : billboard.style === "nexora"
                ? "bg-zinc-100 border-blue-800 text-blue-900"
                : "bg-zinc-800 border-amber-500 text-amber-50"
            }`}
          >
            <div className="font-black text-base leading-tight">{billboard.title}</div>
            {billboard.subtitle && (
              <div className="text-[11px] mt-1 opacity-90">{billboard.subtitle}</div>
            )}
          </div>
        </div>
      )}

      {/* Kokpit */}
      <div className="absolute bottom-0 left-0 right-0 h-[36%] z-40">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/95 to-transparent" />

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div
            className="w-40 h-40 rounded-full border-[10px] border-zinc-600 bg-zinc-900/90 shadow-2xl transition-transform duration-150"
            style={{ transform: `rotate(${tilt * 4}deg)` }}
          >
            <div className="absolute inset-3 rounded-full border-2 border-zinc-700" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-zinc-800 border border-zinc-600" />
          </div>
        </div>

        <div className="absolute bottom-8 left-8 bg-black/80 border border-zinc-700 rounded px-3 py-2">
          <div className="text-[10px] text-zinc-500">HIZ</div>
          <div className="text-xl font-mono text-amber-400">{Math.round(speed)}</div>
        </div>

        <div className="absolute bottom-8 right-8 flex gap-2">
          <div
            className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs ${
              signal === "left" ? "bg-amber-400 text-black animate-pulse" : "bg-zinc-800 text-zinc-500"
            }`}
          >
            ←
          </div>
          <div
            className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs ${
              signal === "right" ? "bg-amber-400 text-black animate-pulse" : "bg-zinc-800 text-zinc-500"
            }`}
          >
            →
          </div>
        </div>
      </div>

      {/* Üst bilgi çubuğu */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black/60 px-4 py-1.5 rounded-full text-xs text-zinc-300">
        <span>🕐 {timeLabel}</span>
        <span>
          {weather === "rain" ? "🌧️ Yağmur" : weather === "snow" ? "❄️ Kar" : "☀️ Açık"}
        </span>
        {visionBlurred && (
          <span className="text-red-400 font-medium">Silecek gerekli!</span>
        )}
      </div>

      {/* RADYO */}
      <div className="absolute top-12 left-4 w-72 bg-zinc-900/95 border border-zinc-700 rounded-xl p-3 shadow-xl z-50">
        <div className="flex gap-1 mb-2">
          {(["esnaf", "kral", "yurt"] as RadioChannel[]).map((ch) => (
            <button
              key={ch}
              onClick={() => setChannel(ch)}
              className={`flex-1 text-[11px] py-1 rounded ${
                channel === ch ? "bg-amber-500 text-black font-bold" : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {RADIO[ch].name}
            </button>
          ))}
        </div>

        {isAd ? (
          <div className="text-xs text-amber-200/90 leading-relaxed max-h-24 overflow-y-auto">
            <span className="text-amber-400 font-bold">REKLAM • </span>
            {adText}
          </div>
        ) : (
          <div>
            <div className="text-[10px] text-zinc-500">ŞİMDİ ÇALIYOR</div>
            <div className="text-sm text-amber-300 font-medium truncate">{currentSong}</div>
          </div>
        )}
        <div className="mt-2 text-[10px] text-zinc-500">1 Esnaf • 2 Kral • 3 Yurt • BOŞLUK Silecek</div>
      </div>

      {/* Sefer */}
      <div className="absolute top-12 right-4 text-right bg-black/60 px-3 py-2 rounded text-sm z-50">
        <div className="text-amber-400 font-medium">
          {exp.origin} → {exp.destination}
        </div>
        <div className="text-zinc-400 text-xs">WASD sür • Q/E sinyal</div>
      </div>

      <style jsx>{`
        @keyframes roadFlow {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 0 100px;
          }
        }
        @keyframes fall {
          0% {
            transform: translateY(-30px);
            opacity: 0;
          }
          20% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
        @keyframes wiper-l {
          0%,
          100% {
            transform: rotate(-18deg);
          }
          50% {
            transform: rotate(18deg);
          }
        }
        @keyframes wiper-r {
          0%,
          100% {
            transform: rotate(18deg);
          }
          50% {
            transform: rotate(-18deg);
          }
        }
        .animate-wiper-l {
          animation: wiper-l 0.9s ease-in-out infinite;
        }
        .animate-wiper-r {
          animation: wiper-r 0.9s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}