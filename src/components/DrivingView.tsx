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
  "Bak canım kardeşim... Bu yollarda direksiyon sallarken Otogar Tycoon'a emanet et kendini. Tekerine taş değmesin!",
  "Kaptan, silecekleri unutma. Pusula belli: Yurtta sulh, cihanda sulh!",
  "Ganyanı bırak. Asıl kumar bu asfaltta. Bas gaza, terminal ağası ol.",
  "Ufukta Anıtkabir varken unutma: Yurtta sulh, cihanda sulh. Doğru zamanda bas gaza.",
];

const BILLBOARDS = [
  { title: "Bakraç Ticaret", subtitle: "Geleceğin Bilgisayarlı Sistemleri", style: "tech" },
  { title: "Otogar Tycoon", subtitle: "Kaptanların Hakiki Dostu", style: "yellow" },
  { title: "Nexora Elektronik", subtitle: "Yerli Malı", style: "nexora" },
  { title: "Yurtta Sulh, Cihanda Sulh", subtitle: "M. Kemal Atatürk", style: "ataturk" },
  { title: "Mustafa Kemal'in Askerleriyiz", subtitle: "Köprü geçişi", style: "bridge" },
  { title: "Anıtkabir", subtitle: "Emanetlere sahip çık", style: "anitkabir" },
  { title: "Egemenlik Kayıtsız Şartsız Milletindir!", subtitle: "", style: "republic" },
];

export default function DrivingView({ expeditionId }: DrivingViewProps) {
  const { expeditions } = useGameStore();
  const exp = expeditions.find((e) => e.id === expeditionId);

  const [offset, setOffset] = useState(0);
  const [tilt, setTilt] = useState(0);
  const [speed, setSpeed] = useState(55);
  const [signal, setSignal] = useState<"none" | "left" | "right">("none");
  const [wiperOn, setWiperOn] = useState(false);
  const [weather, setWeather] = useState<Weather>("clear");
  const [gameHour, setGameHour] = useState(15);
  const [channel, setChannel] = useState<RadioChannel>("esnaf");
  const [songIndex, setSongIndex] = useState(0);
  const [isAd, setIsAd] = useState(false);
  const [adText, setAdText] = useState("");
  const [billboardIndex, setBillboardIndex] = useState(0);
  const [showBillboard, setShowBillboard] = useState(false);
  const [kmLeft, setKmLeft] = useState(120);
  const keys = useRef<Record<string, boolean>>({});
  const [cars, setCars] = useState<{ id: number; x: number; z: number; color: string }[]>([]);

  const visionBlurred = (weather === "rain" || weather === "snow") && !wiperOn;
  const roadDuration = Math.max(0.08, 0.5 - speed / 320);
  const isNight = gameHour < 6 || gameHour >= 20;

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
      if (keys.current["a"] || keys.current["arrowleft"]) dx -= 2.1;
      if (keys.current["d"] || keys.current["arrowright"]) dx += 2.1;

      if (keys.current["w"] || keys.current["arrowup"]) {
        setSpeed((s) => Math.min(128, s + 0.55));
      } else if (keys.current["s"] || keys.current["arrowdown"]) {
        setSpeed((s) => Math.max(0, s - 1.1));
      } else {
        setSpeed((s) => Math.max(35, s - 0.08));
      }

      if (visionBlurred) setSpeed((s) => Math.min(s, 65));

      setOffset((o) => {
        const next = Math.max(-140, Math.min(140, o + dx));
        setTilt(dx * 2.6);
        return next;
      });

      // Kalan km azalır
      setKmLeft((k) => Math.max(0, k - speed / 9000));

      anim = requestAnimationFrame(loop);
    };
    anim = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(anim);
  }, [visionBlurred]);

  // Saat & hava
  useEffect(() => {
    const t1 = setInterval(() => setGameHour((h) => (h + 1) % 24), 10000);
    const t2 = setInterval(() => {
      const r = Math.random();
      setWeather(r > 0.75 ? "rain" : r > 0.9 ? "snow" : "clear");
    }, 16000);
    return () => {
      clearInterval(t1);
      clearInterval(t2);
    };
  }, []);

  // Trafik
  useEffect(() => {
    const t = setInterval(() => {
      setCars((prev) => {
        const moved = prev
          .map((c) => ({ ...c, z: c.z + 1.8 + speed / 50 }))
          .filter((c) => c.z < 100);
        if (Math.random() > 0.65) {
          moved.push({
            id: Date.now() + Math.random(),
            x: (Math.random() - 0.5) * 220,
            z: -5,
            color: ["#dc2626", "#2563eb", "#16a34a", "#ca8a04", "#7c3aed"][
              Math.floor(Math.random() * 5)
            ],
          });
        }
        return moved;
      });
    }, 350);
    return () => clearInterval(t);
  }, [speed]);

  // Radyo
  useEffect(() => {
    const t = setInterval(() => {
      if (isAd) return;
      setSongIndex((i) => {
        const next = i + 1;
        if (next % 3 === 0) {
          setIsAd(true);
          setAdText(ADS[Math.floor(Math.random() * ADS.length)]);
          setTimeout(() => {
            setIsAd(false);
          }, 7000);
        }
        return next % RADIO[channel].songs.length;
      });
    }, 12000);
    return () => clearInterval(t);
  }, [channel, isAd]);

  useEffect(() => {
    setSongIndex(Math.floor(Math.random() * RADIO[channel].songs.length));
    setIsAd(false);
  }, [channel]);

  // Tabela
  useEffect(() => {
    const t = setInterval(() => {
      setBillboardIndex((i) => (i + 1) % BILLBOARDS.length);
      setShowBillboard(true);
      setTimeout(() => setShowBillboard(false), 4000);
    }, 9000);
    return () => clearInterval(t);
  }, []);

  if (!exp || exp.status !== "departed") return null;

  const billboard = BILLBOARDS[billboardIndex];
  const sky = isNight
    ? "from-[#0a0e1a] via-[#111827] to-[#1f2937]"
    : weather === "rain"
    ? "from-slate-600 via-slate-500 to-zinc-600"
    : "from-[#1e3a5f] via-[#3b6ea5] to-[#6b7280]";

  return (
    <div className="fixed inset-0 z-40 overflow-hidden select-none bg-black">
      {/* Gökyüzü + ufuk */}
      <div className={`absolute inset-0 bg-gradient-to-b ${sky}`} />
      <div className="absolute inset-x-0 top-[28%] h-[12%] bg-gradient-to-b from-transparent to-zinc-600/40" />

      {/* Uzak dağ / silüet */}
      <div className="absolute inset-x-0 top-[22%] h-24 opacity-40">
        <div className="absolute left-[10%] w-40 h-16 bg-zinc-800/80 rounded-t-full" />
        <div className="absolute left-[35%] w-56 h-20 bg-zinc-900/70 rounded-t-full" />
        <div className="absolute right-[15%] w-48 h-14 bg-zinc-800/75 rounded-t-full" />
      </div>

      {/* Yol dünyası */}
      <div
        className="absolute inset-0 transition-transform duration-100 ease-out"
        style={{
          transform: `perspective(900px) rotateX(18deg) translateX(${-offset * 0.9}px) rotateZ(${tilt}deg)`,
          transformOrigin: "50% 100%",
        }}
      >
        {/* Asfalt */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[200%] h-[70%]"
          style={{
            background: "linear-gradient(to top, #27272a 0%, #3f3f46 40%, #52525b 100%)",
            transform: "rotateX(55deg)",
            transformOrigin: "bottom center",
          }}
        >
          {/* Kenar çizgileri */}
          <div className="absolute left-[18%] top-0 bottom-0 w-1 bg-white/90" />
          <div className="absolute right-[18%] top-0 bottom-0 w-1 bg-white/90" />
          {/* Orta kesik çizgi */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[3px]"
            style={{
              background:
                "repeating-linear-gradient(0deg, #fbbf24 0 36px, transparent 36px 72px)",
              animation: `roadFlow ${roadDuration}s linear infinite`,
            }}
          />
        </div>

        {/* Trafik */}
        {cars.map((c) => {
          const scale = 0.35 + (c.z / 100) * 1.1;
          const y = 30 + c.z * 0.55;
          return (
            <div
              key={c.id}
              className="absolute rounded-sm shadow-xl border border-black/40"
              style={{
                left: `calc(50% + ${c.x * (0.4 + c.z / 120)}px)`,
                top: `${y}%`,
                width: `${28 * scale}px`,
                height: `${48 * scale}px`,
                backgroundColor: c.color,
                transform: "translateX(-50%)",
                opacity: Math.min(1, c.z / 15),
              }}
            />
          );
        })}
      </div>

      {/* Yağmur / kar */}
      {(weather === "rain" || weather === "snow") && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {Array.from({ length: weather === "rain" ? 45 : 28 }).map((_, i) => (
            <div
              key={i}
              className={`absolute ${
                weather === "rain"
                  ? "w-px h-6 bg-white/45"
                  : "w-1.5 h-1.5 rounded-full bg-white/85"
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                animation: `fall ${0.7 + Math.random()}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Bulanık cam */}
      {visionBlurred && (
        <div className="absolute inset-0 z-20 backdrop-blur-[6px] bg-slate-500/10 pointer-events-none" />
      )}

      {/* Silecek */}
      {wiperOn && (
        <>
          <div className="absolute top-0 left-0 w-[52%] h-[50%] origin-top-right animate-wiper-l z-30 pointer-events-none">
            <div className="w-full h-[2px] bg-zinc-200/50 mt-[42%]" />
          </div>
          <div className="absolute top-0 right-0 w-[52%] h-[50%] origin-top-left animate-wiper-r z-30 pointer-events-none">
            <div className="w-full h-[2px] bg-zinc-200/50 mt-[42%]" />
          </div>
        </>
      )}

      {/* Tabela */}
      {showBillboard && (
        <div
          className={`absolute top-[18%] z-20 transition-all duration-700 ${
            offset > 50 ? "left-8" : offset < -50 ? "right-8" : "left-1/2 -translate-x-1/2"
          }`}
        >
          <div
            className={`px-5 py-3 border-4 max-w-[240px] text-center shadow-2xl ${
              billboard.style === "yellow"
                ? "bg-amber-400 border-black text-black"
                : billboard.style === "ataturk" ||
                  billboard.style === "bridge" ||
                  billboard.style === "anitkabir" ||
                  billboard.style === "republic"
                ? "bg-red-800 border-white text-white"
                : billboard.style === "nexora"
                ? "bg-white border-blue-800 text-blue-900"
                : "bg-zinc-800 border-amber-500 text-amber-50"
            }`}
          >
            <div className="font-black text-sm leading-tight">{billboard.title}</div>
            {billboard.subtitle && (
              <div className="text-[10px] mt-1 opacity-90">{billboard.subtitle}</div>
            )}
          </div>
        </div>
      )}

      {/* === KOKPİT (otobüs torpido) === */}
      <div className="absolute bottom-0 left-0 right-0 h-[42%] z-40 pointer-events-none">
        {/* Torpido gövdesi */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1c] via-[#252528] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[70%] bg-[#1c1c1e] border-t border-zinc-700/50" />

        {/* Ön cam alt çerçevesi */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-zinc-900 to-transparent" />

        {/* Direksiyon */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div
            className="relative w-48 h-48 rounded-full border-[14px] border-[#3f3f46] bg-[#18181b] shadow-2xl transition-transform duration-100"
            style={{ transform: `rotate(${tilt * 5}deg)` }}
          >
            <div className="absolute inset-4 rounded-full border-[3px] border-zinc-700" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-600" />
            {/* Kollar */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2.5 h-12 bg-zinc-600 rounded" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-2.5 h-12 bg-zinc-600 rounded" />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-2.5 bg-zinc-600 rounded" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-2.5 bg-zinc-600 rounded" />
          </div>
        </div>

        {/* Sol gösterge */}
        <div className="absolute bottom-12 left-10 bg-black/90 border border-zinc-600 rounded-lg px-4 py-3 min-w-[90px]">
          <div className="text-[10px] text-zinc-500 tracking-wider">HIZ</div>
          <div className="text-3xl font-mono text-amber-400 leading-none">
            {Math.round(speed)}
          </div>
          <div className="text-[10px] text-zinc-500">km/s</div>
        </div>

        {/* Sağ gösterge */}
        <div className="absolute bottom-12 right-10 bg-black/90 border border-zinc-600 rounded-lg px-4 py-3 min-w-[90px] text-right">
          <div className="text-[10px] text-zinc-500">KALAN</div>
          <div className="text-2xl font-mono text-emerald-400 leading-none">
            {Math.round(kmLeft)}
          </div>
          <div className="text-[10px] text-zinc-500">km</div>
        </div>

        {/* Sinyaller */}
        <div className="absolute bottom-[7.5rem] left-1/2 -translate-x-1/2 flex gap-8">
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
              signal === "left"
                ? "bg-amber-400 border-amber-200 text-black animate-pulse"
                : "bg-zinc-800 border-zinc-600 text-zinc-600"
            }`}
          >
            ◀
          </div>
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
              signal === "right"
                ? "bg-amber-400 border-amber-200 text-black animate-pulse"
                : "bg-zinc-800 border-zinc-600 text-zinc-600"
            }`}
          >
            ▶
          </div>
        </div>
      </div>

      {/* Üst bar */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black/70 px-5 py-1.5 rounded-full text-xs text-zinc-300 border border-zinc-700">
        <span>{String(gameHour).padStart(2, "0")}:00</span>
        <span>
          {weather === "rain" ? "🌧️ Yağmur" : weather === "snow" ? "❄️ Kar" : "☀️ Açık"}
        </span>
        {visionBlurred && <span className="text-red-400 font-semibold">SİLECEK!</span>}
      </div>

      {/* Radyo */}
      <div className="absolute top-12 left-4 w-64 bg-zinc-900/95 border border-zinc-700 rounded-xl p-3 z-50 shadow-xl">
        <div className="flex gap-1 mb-2">
          {(["esnaf", "kral", "yurt"] as RadioChannel[]).map((ch) => (
            <button
              key={ch}
              onClick={() => setChannel(ch)}
              className={`flex-1 text-[10px] py-1 rounded pointer-events-auto ${
                channel === ch ? "bg-amber-500 text-black font-bold" : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {RADIO[ch].name}
            </button>
          ))}
        </div>
        {isAd ? (
          <p className="text-[11px] text-amber-200/90 leading-snug max-h-20 overflow-y-auto">
            <span className="text-amber-400 font-bold">REKLAM • </span>
            {adText}
          </p>
        ) : (
          <div>
            <div className="text-[9px] text-zinc-500">ÇALIYOR</div>
            <div className="text-sm text-amber-300 font-medium truncate">
              {RADIO[channel].songs[songIndex]}
            </div>
          </div>
        )}
      </div>

      {/* Sefer bilgisi */}
      <div className="absolute top-12 right-4 text-right bg-black/70 border border-zinc-700 px-3 py-2 rounded-lg text-sm z-50">
        <div className="text-amber-400 font-semibold text-xs sm:text-sm">
          {exp.origin.split(" ")[0]} → {exp.destination.split(" ")[0]}
        </div>
        <div className="text-zinc-400 text-[10px] mt-0.5">WASD • Q/E sinyal • Space silecek</div>
      </div>

      <style jsx>{`
        @keyframes roadFlow {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 0 120px;
          }
        }
        @keyframes fall {
          0% {
            transform: translateY(-40px);
            opacity: 0;
          }
          15% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(110vh);
            opacity: 0;
          }
        }
        @keyframes wiper-l {
          0%,
          100% {
            transform: rotate(-22deg);
          }
          50% {
            transform: rotate(22deg);
          }
        }
        @keyframes wiper-r {
          0%,
          100% {
            transform: rotate(22deg);
          }
          50% {
            transform: rotate(-22deg);
          }
        }
        .animate-wiper-l {
          animation: wiper-l 0.85s ease-in-out infinite;
        }
        .animate-wiper-r {
          animation: wiper-r 0.85s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}