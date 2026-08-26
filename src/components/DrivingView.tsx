"use client";

import { useEffect, useState, useRef } from "react";
import { useGameStore } from "@/store/gameStore";

interface DrivingViewProps {
  expeditionId: string;
}

type RadioChannel = "esnaf" | "kral" | "yurt";
type Weather = "clear" | "rain" | "snow";
type CarType = "tofas" | "mercedes" | "truck" | "minibus";

interface RoadCar {
  id: number;
  x: number;
  z: number;
  type: CarType;
  color: string;
}

interface Tree {
  id: number;
  x: number;
  z: number;
  side: "left" | "right";
}

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
  "Bak canım kardeşim... Otogar Tycoon'a emanet et kendini. Tekerine taş değmesin!",
  "Kaptan, silecekleri unutma. Yurtta sulh, cihanda sulh!",
  "Ganyanı bırak. Asıl kumar bu asfaltta. Bas gaza!",
  "Ufukta Anıtkabir varken unutma: Yurtta sulh, cihanda sulh.",
];

const BILLBOARDS = [
  { title: "Bakraç Ticaret", subtitle: "Geleceğin Bilgisayarlı Sistemleri", style: "tech" },
  { title: "Otogar Tycoon", subtitle: "Kaptanların Hakiki Dostu", style: "yellow" },
  { title: "Nexora Elektronik", subtitle: "Yerli Malı", style: "nexora" },
  { title: "Yurtta Sulh, Cihanda Sulh", subtitle: "M. Kemal Atatürk", style: "ataturk" },
  { title: "Mustafa Kemal'in Askerleriyiz", subtitle: "Köprü", style: "bridge" },
  { title: "Anıtkabir", subtitle: "Emanetlere sahip çık", style: "anitkabir" },
  { title: "Egemenlik Kayıtsız Şartsız Milletindir!", subtitle: "", style: "republic" },
];

const CAR_COLORS = {
  tofas: ["#b91c1c", "#1d4ed8", "#a16207", "#374151", "#f5f5f4"],
  mercedes: ["#171717", "#1e3a5f", "#4b5563", "#fafafa"],
  truck: ["#ca8a04", "#15803d", "#9f1239", "#334155"],
  minibus: ["#eab308", "#2563eb", "#dc2626", "#16a34a"],
};

function randomCarType(): CarType {
  const r = Math.random();
  if (r < 0.4) return "tofas";
  if (r < 0.65) return "mercedes";
  if (r < 0.85) return "truck";
  return "minibus";
}

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
  const [kmLeft, setKmLeft] = useState(140);
  const [cars, setCars] = useState<RoadCar[]>([]);
  const [trees, setTrees] = useState<Tree[]>([]);
  const keys = useRef<Record<string, boolean>>({});

  const visionBlurred = (weather === "rain" || weather === "snow") && !wiperOn;
  const roadDuration = Math.max(0.08, 0.48 - speed / 300);
  const isNight = gameHour < 6 || gameHour >= 20;

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

  useEffect(() => {
    let anim: number;
    const loop = () => {
      let dx = 0;
      if (keys.current["a"] || keys.current["arrowleft"]) dx -= 2.1;
      if (keys.current["d"] || keys.current["arrowright"]) dx += 2.1;

      if (keys.current["w"] || keys.current["arrowup"]) setSpeed((s) => Math.min(125, s + 0.5));
      else if (keys.current["s"] || keys.current["arrowdown"]) setSpeed((s) => Math.max(0, s - 1.1));
      else setSpeed((s) => Math.max(32, s - 0.07));

      if (visionBlurred) setSpeed((s) => Math.min(s, 62));

      setOffset((o) => {
        const next = Math.max(-140, Math.min(140, o + dx));
        setTilt(dx * 2.5);
        return next;
      });
      setKmLeft((k) => Math.max(0, k - speed / 9500));
      anim = requestAnimationFrame(loop);
    };
    anim = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(anim);
  }, [visionBlurred, speed]);

  useEffect(() => {
    const t1 = setInterval(() => setGameHour((h) => (h + 1) % 24), 10000);
    const t2 = setInterval(() => {
      const r = Math.random();
      setWeather(r > 0.78 ? "rain" : r > 0.92 ? "snow" : "clear");
    }, 15000);
    return () => {
      clearInterval(t1);
      clearInterval(t2);
    };
  }, []);

  // Araçlar: Tofaş, Mercedes, tır, minibüs
  useEffect(() => {
    const t = setInterval(() => {
      setCars((prev) => {
        const moved = prev
          .map((c) => ({ ...c, z: c.z + 1.6 + speed / 55 }))
          .filter((c) => c.z < 105);
        if (Math.random() > 0.6) {
          const type = randomCarType();
          const colors = CAR_COLORS[type];
          moved.push({
            id: Date.now() + Math.random(),
            x: (Math.random() - 0.5) * 200,
            z: -8,
            type,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }
        return moved;
      });
    }, 320);
    return () => clearInterval(t);
  }, [speed]);

  // Ağaçlar
  useEffect(() => {
    const t = setInterval(() => {
      setTrees((prev) => {
        const moved = prev
          .map((tr) => ({ ...tr, z: tr.z + 1.4 + speed / 60 }))
          .filter((tr) => tr.z < 110);
        if (Math.random() > 0.45) {
          moved.push({
            id: Date.now() + Math.random(),
            x: 90 + Math.random() * 40,
            z: -5,
            side: Math.random() > 0.5 ? "left" : "right",
          });
        }
        return moved;
      });
    }, 280);
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
          setTimeout(() => setIsAd(false), 7000);
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

  useEffect(() => {
    const t = setInterval(() => {
      setBillboardIndex((i) => (i + 1) % BILLBOARDS.length);
      setShowBillboard(true);
      setTimeout(() => setShowBillboard(false), 4200);
    }, 8500);
    return () => clearInterval(t);
  }, []);

  if (!exp || exp.status !== "departed") return null;

  const billboard = BILLBOARDS[billboardIndex];
  const sky = isNight
    ? "from-[#0a0e1a] via-[#111827] to-[#1f2937]"
    : weather === "rain"
    ? "from-slate-600 via-slate-500 to-zinc-600"
    : "from-[#1e3a5f] via-[#3b6ea5] to-[#78716c]";

  const renderCar = (c: RoadCar) => {
    const scale = 0.3 + (c.z / 100) * 1.15;
    const y = 28 + c.z * 0.52;
    const w =
      c.type === "truck" ? 36 * scale : c.type === "minibus" ? 30 * scale : 26 * scale;
    const h =
      c.type === "truck" ? 56 * scale : c.type === "minibus" ? 44 * scale : 40 * scale;

    return (
      <div
        key={c.id}
        className="absolute"
        style={{
          left: `calc(50% + ${c.x * (0.35 + c.z / 130)}px)`,
          top: `${y}%`,
          transform: "translateX(-50%)",
          opacity: Math.min(1, c.z / 12),
          zIndex: Math.floor(c.z),
        }}
      >
        {/* Gövde */}
        <div
          className="relative rounded-sm border border-black/50 shadow-lg"
          style={{
            width: w,
            height: h,
            backgroundColor: c.color,
          }}
        >
          {/* Cam */}
          <div
            className="absolute left-[10%] right-[10%] bg-sky-900/70 border border-black/30"
            style={{
              top: c.type === "truck" ? "8%" : "12%",
              height: c.type === "truck" ? "22%" : "28%",
            }}
          />
          {/* Tofaş kare kasa hissi */}
          {c.type === "tofas" && (
            <div className="absolute bottom-0 left-0 right-0 h-[18%] bg-black/25" />
          )}
          {/* Tır dorsesi */}
          {c.type === "truck" && (
            <div className="absolute bottom-[20%] left-[5%] right-[5%] h-[35%] bg-black/20 border border-black/30" />
          )}
          {/* Far */}
          <div className="absolute bottom-[12%] left-[8%] w-[18%] h-[10%] bg-amber-200/90 rounded-sm" />
          <div className="absolute bottom-[12%] right-[8%] w-[18%] h-[10%] bg-amber-200/90 rounded-sm" />
        </div>
      </div>
    );
  };

  const renderTree = (tr: Tree) => {
    const scale = 0.25 + (tr.z / 100) * 1.2;
    const y = 26 + tr.z * 0.5;
    const xPos =
      tr.side === "left"
        ? `calc(50% - ${130 + tr.x * 0.3}px)`
        : `calc(50% + ${130 + tr.x * 0.3}px)`;

    return (
      <div
        key={tr.id}
        className="absolute"
        style={{
          left: xPos,
          top: `${y}%`,
          transform: "translateX(-50%)",
          opacity: Math.min(1, tr.z / 14),
          zIndex: Math.floor(tr.z),
        }}
      >
        {/* Gövde */}
        <div
          className="mx-auto bg-amber-950"
          style={{ width: 4 * scale, height: 18 * scale }}
        />
        {/* Yaprak */}
        <div
          className="rounded-full bg-green-800 border border-green-950/50 -mt-1"
          style={{
            width: 22 * scale,
            height: 20 * scale,
            marginLeft: -9 * scale,
          }}
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 overflow-hidden select-none bg-black">
      <div className={`absolute inset-0 bg-gradient-to-b ${sky}`} />

      {/* Ufuk silüet */}
      <div className="absolute inset-x-0 top-[20%] h-28 opacity-50">
        <div className="absolute left-[5%] w-36 h-14 bg-zinc-800/90 rounded-t-[40%]" />
        <div className="absolute left-[30%] w-52 h-20 bg-zinc-900/80 rounded-t-[45%]" />
        <div className="absolute right-[10%] w-44 h-16 bg-zinc-800/85 rounded-t-[40%]" />
      </div>

      {/* Yol */}
      <div
        className="absolute inset-0 transition-transform duration-100 ease-out"
        style={{
          transform: `perspective(900px) rotateX(18deg) translateX(${-offset * 0.85}px) rotateZ(${tilt}deg)`,
          transformOrigin: "50% 100%",
        }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[200%] h-[72%]"
          style={{
            background: "linear-gradient(to top, #1c1917 0%, #292524 45%, #44403c 100%)",
            transform: "rotateX(55deg)",
            transformOrigin: "bottom center",
          }}
        >
          <div className="absolute left-[16%] top-0 bottom-0 w-[2px] bg-white/85" />
          <div className="absolute right-[16%] top-0 bottom-0 w-[2px] bg-white/85" />
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[3px]"
            style={{
              background:
                "repeating-linear-gradient(0deg, #fbbf24 0 34px, transparent 34px 68px)",
              animation: `roadFlow ${roadDuration}s linear infinite`,
            }}
          />
        </div>

        {trees.map(renderTree)}
        {cars.map(renderCar)}
      </div>

      {/* Yağmur / kar */}
      {(weather === "rain" || weather === "snow") && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {Array.from({ length: weather === "rain" ? 42 : 26 }).map((_, i) => (
            <div
              key={i}
              className={`absolute ${
                weather === "rain" ? "w-px h-5 bg-white/40" : "w-1.5 h-1.5 rounded-full bg-white/80"
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

      {visionBlurred && (
        <div className="absolute inset-0 z-20 backdrop-blur-[6px] bg-slate-500/10 pointer-events-none" />
      )}

      {wiperOn && (
        <>
          <div className="absolute top-0 left-0 w-[52%] h-[48%] origin-top-right animate-wiper-l z-30 pointer-events-none">
            <div className="w-full h-[2px] bg-zinc-200/45 mt-[40%]" />
          </div>
          <div className="absolute top-0 right-0 w-[52%] h-[48%] origin-top-left animate-wiper-r z-30 pointer-events-none">
            <div className="w-full h-[2px] bg-zinc-200/45 mt-[40%]" />
          </div>
        </>
      )}

      {/* Reklam tabelası */}
      {showBillboard && (
        <div
          className={`absolute top-[16%] z-20 transition-all duration-700 ${
            offset > 45 ? "left-6" : offset < -45 ? "right-6" : "left-1/2 -translate-x-1/2"
          }`}
        >
          <div
            className={`px-4 py-2.5 border-4 max-w-[230px] text-center shadow-2xl ${
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
              <div className="text-[10px] mt-0.5 opacity-90">{billboard.subtitle}</div>
            )}
          </div>
        </div>
      )}

      {/* Kokpit */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] z-40 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-[#1c1c1e] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[68%] bg-[#18181b] border-t border-zinc-700/40" />

        <div className="absolute bottom-9 left-1/2 -translate-x-1/2">
          <div
            className="relative w-44 h-44 rounded-full border-[12px] border-zinc-600 bg-zinc-900 shadow-2xl transition-transform duration-100"
            style={{ transform: `rotate(${tilt * 5}deg)` }}
          >
            <div className="absolute inset-3 rounded-full border-2 border-zinc-700" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-zinc-800 border border-zinc-600" />
          </div>
        </div>

        <div className="absolute bottom-10 left-8 bg-black/90 border border-zinc-600 rounded-lg px-3 py-2">
          <div className="text-[9px] text-zinc-500">HIZ</div>
          <div className="text-2xl font-mono text-amber-400">{Math.round(speed)}</div>
        </div>
        <div className="absolute bottom-10 right-8 bg-black/90 border border-zinc-600 rounded-lg px-3 py-2 text-right">
          <div className="text-[9px] text-zinc-500">KALAN</div>
          <div className="text-xl font-mono text-emerald-400">{Math.round(kmLeft)} km</div>
        </div>

        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-8">
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
              signal === "left" ? "bg-amber-400 text-black animate-pulse" : "bg-zinc-800 text-zinc-600"
            }`}
          >
            ◀
          </div>
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
              signal === "right" ? "bg-amber-400 text-black animate-pulse" : "bg-zinc-800 text-zinc-600"
            }`}
          >
            ▶
          </div>
        </div>
      </div>

      {/* Üst bar */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex gap-3 bg-black/75 px-4 py-1 rounded-full text-[11px] text-zinc-300 border border-zinc-700">
        <span>{String(gameHour).padStart(2, "0")}:00</span>
        <span>
          {weather === "rain" ? "🌧️" : weather === "snow" ? "❄️" : "☀️"}
        </span>
        {visionBlurred && <span className="text-red-400 font-bold">SİLECEK</span>}
      </div>

      {/* Radyo */}
      <div className="absolute top-10 left-3 w-60 bg-zinc-900/95 border border-zinc-700 rounded-xl p-2.5 z-50">
        <div className="flex gap-1 mb-1.5">
          {(["esnaf", "kral", "yurt"] as RadioChannel[]).map((ch) => (
            <button
              key={ch}
              onClick={() => setChannel(ch)}
              className={`flex-1 text-[9px] py-1 rounded pointer-events-auto ${
                channel === ch ? "bg-amber-500 text-black font-bold" : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {RADIO[ch].name}
            </button>
          ))}
        </div>
        {isAd ? (
          <p className="text-[10px] text-amber-200/90 leading-snug max-h-16 overflow-y-auto">
            <span className="text-amber-400 font-bold">REKLAM • </span>
            {adText}
          </p>
        ) : (
          <div className="text-xs text-amber-300 font-medium truncate">
            {RADIO[channel].songs[songIndex]}
          </div>
        )}
      </div>

      <div className="absolute top-10 right-3 text-right bg-black/75 border border-zinc-700 px-2.5 py-1.5 rounded-lg z-50">
        <div className="text-amber-400 font-semibold text-xs">
          {exp.origin.split(" ")[0]} → {exp.destination.split(" ")[0]}
        </div>
        <div className="text-zinc-500 text-[9px]">WASD • Space silecek</div>
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
            transform: translateY(-30px);
            opacity: 0;
          }
          20% {
            opacity: 0.65;
          }
          100% {
            transform: translateY(110vh);
            opacity: 0;
          }
        }
        @keyframes wiper-l {
          0%,
          100% {
            transform: rotate(-20deg);
          }
          50% {
            transform: rotate(20deg);
          }
        }
        @keyframes wiper-r {
          0%,
          100% {
            transform: rotate(20deg);
          }
          50% {
            transform: rotate(-20deg);
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