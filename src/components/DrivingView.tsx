"use client";

import { useEffect, useState, useRef } from "react";
import { useGameStore } from "@/store/gameStore";

interface DrivingViewProps {
  expeditionId: string;
}

type RadioChannel = "esnaf" | "kral" | "yurt";
type Weather = "clear" | "rain" | "fog";
type CarType = "tofas" | "mercedes" | "truck" | "minibus" | "bus";

interface RoadCar {
  id: number;
  lane: number;
  z: number;
  type: CarType;
  color: string;
  speed: number;
  drift: number;
}

interface Prop {
  id: number;
  side: "left" | "right";
  z: number;
  kind: "tree" | "pole" | "sign" | "rail";
}

const RADIO = {
  esnaf: {
    name: "ESNAF FM",
    freq: "88.4",
    songs: [
      "Şiki Şiki Kaptan",
      "Boncuk Turizm",
      "AŞTİ Realtime",
      "Keşan Ovası",
      "Kostak Muavin",
      "Mustafa Kemal'in İzinde",
      "Çilli Travego",
      "Fesupanallah Şanzıman",
      "Yollara Karşı",
      "9/8 Keşan Sapağı",
    ],
  },
  kral: {
    name: "KRAL FM",
    freq: "94.2",
    songs: [
      "Taht Kurmuşsun Koltuğuma",
      "Rötar Yapmam Sen",
      "Hatsız Dolmuş Olmaz",
      "Gece Seferi",
      "Motor İstemezse",
      "Mazotumuz Kalmadı",
      "Mavi Minibüs",
      "Hararet Yaptın Beni",
      "Yolların Emektarı",
      "Gece Olunca",
    ],
  },
  yurt: {
    name: "YURT FM",
    freq: "101.7",
    songs: [
      "Keşan'ın Dağlarında",
      "Demir Ağlarla Örülü Yollar",
      "Ata'nın Pusulası",
      "Ufuktaki Anıtkabir",
      "Sulh ve Selamet",
      "Neslin Baban",
      "14 Yaşındaki Azim",
      "Tuna Nehri",
      "Yıldırımlar Yaratan",
      "Memleketim",
    ],
  },
};

const ADS = [
  "Kardeşim, Otogar Tycoon'a güven. Tekerine taş değmesin!",
  "Silecekleri unutma. Yurtta sulh, cihanda sulh!",
  "Asıl kumar asfaltta. Bas gaza, terminal ağası ol.",
  "Anıtkabir ufukta. Doğru zamanda bas gaza.",
];

const BOARDS = [
  { t: "Bakraç Ticaret", s: "Geleceğin Bilgisayarlı Sistemleri", c: "tech" },
  { t: "Otogar Tycoon", s: "Kaptanların Hakiki Dostu", c: "yellow" },
  { t: "Nexora Elektronik", s: "Yerli Malı", c: "nexora" },
  { t: "Yurtta Sulh, Cihanda Sulh", s: "M. Kemal Atatürk", c: "red" },
  { t: "Mustafa Kemal'in Askerleriyiz", s: "", c: "red" },
  { t: "Anıtkabir", s: "Emanetlere sahip çık", c: "red" },
];

const PALETTE: Record<CarType, string[]> = {
  tofas: ["#9f1239", "#1e3a8a", "#a16207", "#44403c", "#e7e5e4"],
  mercedes: ["#0a0a0a", "#1e293b", "#f8fafc", "#334155"],
  truck: ["#ca8a04", "#166534", "#9f1239", "#475569"],
  minibus: ["#eab308", "#2563eb", "#dc2626", "#16a34a"],
  bus: ["#f59e0b", "#0f766e", "#7c2d12"],
};

function pickType(): CarType {
  const r = Math.random();
  if (r < 0.34) return "tofas";
  if (r < 0.54) return "mercedes";
  if (r < 0.74) return "truck";
  if (r < 0.9) return "minibus";
  return "bus";
}

/** Saat dilimine göre gökyüzü */
function skyFor(hour: number, weather: Weather) {
  if (weather === "rain") {
    return {
      bg: "from-[#1e293b] via-[#334155] to-[#44403c]",
      sun: null as string | null,
      ambient: "bg-slate-900/20",
    };
  }
  if (weather === "fog") {
    return {
      bg: "from-[#78716c] via-[#a8a29e] to-[#57534e]",
      sun: null,
      ambient: "bg-white/10",
    };
  }
  // Gece
  if (hour >= 21 || hour < 5) {
    return {
      bg: "from-[#020617] via-[#0f172a] to-[#1e293b]",
      sun: "moon",
      ambient: "bg-blue-950/30",
    };
  }
  // Gün batımı 18-21
  if (hour >= 18 && hour < 21) {
    return {
      bg: "from-[#7c2d12] via-[#c2410c] via-[#ea580c] to-[#57534e]",
      sun: "sunset",
      ambient: "bg-orange-900/20",
    };
  }
  // Şafak 5-7
  if (hour >= 5 && hour < 7) {
    return {
      bg: "from-[#9a3412] via-[#fb923c] to-[#7dd3fc]",
      sun: "sunrise",
      ambient: "bg-orange-500/10",
    };
  }
  // Gündüz
  return {
    bg: "from-[#0c4a6e] via-[#0284c7] to-[#78716c]",
    sun: "day",
    ambient: "",
  };
}

export default function DrivingView({ expeditionId }: DrivingViewProps) {
  const exp = useGameStore((s) =>
    s.expeditions.find((e) => e.id === expeditionId)
  );

  const [x, setX] = useState(0);
  const [tilt, setTilt] = useState(0);
  const [speed, setSpeed] = useState(56);
  const [signal, setSignal] = useState<"none" | "left" | "right">("none");
  const [wiper, setWiper] = useState(false);
  const [weather, setWeather] = useState<Weather>("clear");
  const [hour, setHour] = useState(17);
  const [channel, setChannel] = useState<RadioChannel>("esnaf");
  const [song, setSong] = useState(0);
  const [ad, setAd] = useState<string | null>(null);
  const [board, setBoard] = useState(0);
  const [showBoard, setShowBoard] = useState(false);
  const [km, setKm] = useState(155);
  const [cars, setCars] = useState<RoadCar[]>([]);
  const [props, setProps] = useState<Prop[]>([]);
  const [mountainShift, setMountainShift] = useState(0);
  const keys = useRef<Record<string, boolean>>({});

  const night = hour >= 21 || hour < 5;
  const sunset = hour >= 18 && hour < 21;
  const blur = (weather === "rain" || weather === "fog") && !wiper;
  const animDur = Math.max(0.055, 0.4 - speed / 350);
  const sky = skyFor(hour, weather);
  const dashGlow = night || sunset;

  // Klavye
  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
      if (e.key === "q" || e.key === "Q")
        setSignal((v) => (v === "left" ? "none" : "left"));
      if (e.key === "e" || e.key === "E")
        setSignal((v) => (v === "right" ? "none" : "right"));
      if (e.key === " ") {
        e.preventDefault();
        setWiper((v) => !v);
      }
      if (e.key === "1") setChannel("esnaf");
      if (e.key === "2") setChannel("kral");
      if (e.key === "3") setChannel("yurt");
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", dn);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", dn);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Ana döngü
  useEffect(() => {
    let id: number;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(32, now - last) / 16;
      last = now;

      let steer = 0;
      if (keys.current["a"] || keys.current["arrowleft"]) steer -= 1;
      if (keys.current["d"] || keys.current["arrowright"]) steer += 1;

      if (keys.current["w"] || keys.current["arrowup"])
        setSpeed((s) => Math.min(128, s + 0.65 * dt));
      else if (keys.current["s"] || keys.current["arrowdown"])
        setSpeed((s) => Math.max(0, s - 1.3 * dt));
      else setSpeed((s) => Math.max(30, s - 0.05 * dt));

      if (blur) setSpeed((s) => Math.min(s, 58));

      setX((prev) => {
        const next = Math.max(-150, Math.min(150, prev + steer * 2.3 * dt));
        setTilt(steer * 3);
        return next;
      });

      // Parallax: dağlar yavaş kayar
      setMountainShift((m) => (m + speed * dt * 0.02) % 200);

      setKm((k) => Math.max(0, k - (speed * dt) / 7200));

      // Arabalar ilerler + hafif sağ/sol
      setCars((prev) =>
        prev
          .map((c) => {
            let lane = c.lane + c.drift * dt * 0.02;
            // şerit sınırında geri dön
            if (lane > 2.2 || lane < -2.2) {
              return {
                ...c,
                z: c.z + c.speed + speed / 85,
                lane: Math.max(-2.2, Math.min(2.2, lane)),
                drift: -c.drift,
              };
            }
            return {
              ...c,
              z: c.z + c.speed + speed / 85,
              lane,
            };
          })
          .filter((c) => c.z < 112)
      );

      setProps((prev) =>
        prev
          .map((p) => ({ ...p, z: p.z + 1.55 + speed / 65 }))
          .filter((p) => p.z < 118)
      );

      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [blur, speed]);

  // Saat & hava
  useEffect(() => {
    const a = setInterval(() => setHour((h) => (h + 1) % 24), 10000);
    const b = setInterval(() => {
      const r = Math.random();
      setWeather(r > 0.82 ? "rain" : r > 0.93 ? "fog" : "clear");
    }, 15000);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  // Trafik spawn (çok sık değil, aradan geçilebilir)
  useEffect(() => {
    const t = setInterval(() => {
      setCars((prev) => {
        if (prev.length > 10) return prev;
        if (Math.random() > 0.62) {
          const type = pickType();
          const colors = PALETTE[type];
          return [
            ...prev,
            {
              id: Date.now() + Math.random(),
              lane: Math.floor(Math.random() * 5) - 2,
              z: -8,
              type,
              color: colors[Math.floor(Math.random() * colors.length)],
              speed: 1.1 + Math.random() * 1.4,
              // ara sıra şerit değiştirsin
              drift: Math.random() > 0.55 ? (Math.random() > 0.5 ? 1 : -1) : 0,
            },
          ];
        }
        return prev;
      });
    }, 480);
    return () => clearInterval(t);
  }, []);

  // Yol kenarı
  useEffect(() => {
    const t = setInterval(() => {
      setProps((prev) => {
        if (Math.random() > 0.3) {
          const kinds: Prop["kind"][] = ["tree", "tree", "pole", "rail", "sign"];
          return [
            ...prev,
            {
              id: Date.now() + Math.random(),
              side: Math.random() > 0.5 ? "left" : "right",
              z: -5,
              kind: kinds[Math.floor(Math.random() * kinds.length)],
            },
          ];
        }
        return prev;
      });
    }, 260);
    return () => clearInterval(t);
  }, []);

  // Radyo
  useEffect(() => {
    const t = setInterval(() => {
      if (ad) return;
      setSong((i) => {
        const n = i + 1;
        if (n % 3 === 0) {
          setAd(ADS[Math.floor(Math.random() * ADS.length)]);
          setTimeout(() => setAd(null), 6500);
        }
        return n % RADIO[channel].songs.length;
      });
    }, 11500);
    return () => clearInterval(t);
  }, [channel, ad]);

  useEffect(() => {
    setSong(Math.floor(Math.random() * RADIO[channel].songs.length));
    setAd(null);
  }, [channel]);

  useEffect(() => {
    const t = setInterval(() => {
      setBoard((i) => (i + 1) % BOARDS.length);
      setShowBoard(true);
      setTimeout(() => setShowBoard(false), 4300);
    }, 8800);
    return () => clearInterval(t);
  }, []);

  if (!exp || exp.status !== "departed") return null;

  const bb = BOARDS[board];

  const project = (lane: number, z: number) => {
    const depth = Math.max(0.04, z / 100);
    const scale = 0.22 + depth * 1.4;
    const y = 25 + z * 0.51;
    const xPos = lane * 40 * (0.38 + depth);
    return { scale, y, xPos, opacity: Math.min(1, z / 9) };
  };

  return (
    <div
      className="fixed inset-0 z-40 overflow-hidden select-none bg-black"
      style={{ imageRendering: "auto" }}
    >
      {/* Gökyüzü */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${sky.bg} transition-all duration-1000`}
      />
      {sky.ambient && (
        <div className={`absolute inset-0 ${sky.ambient} pointer-events-none`} />
      )}

      {/* Güneş / ay / batış */}
      {sky.sun === "day" && (
        <div className="absolute top-8 right-24 w-20 h-20 rounded-full bg-amber-200/90 blur-[2px] shadow-[0_0_60px_#fde68a]" />
      )}
      {sky.sun === "sunset" && (
        <div className="absolute top-[22%] right-[18%] w-28 h-28 rounded-full bg-orange-400 blur-[1px] shadow-[0_0_80px_#ea580c,0_0_120px_#c2410c]" />
      )}
      {sky.sun === "sunrise" && (
        <div className="absolute top-[28%] left-[15%] w-24 h-24 rounded-full bg-orange-300 shadow-[0_0_70px_#fb923c]" />
      )}
      {sky.sun === "moon" && (
        <div className="absolute top-10 right-20 w-14 h-14 rounded-full bg-slate-200/90 shadow-[0_0_40px_#e2e8f0]" />
      )}

      {/* Parallax dağlar — yavaş */}
      <div
        className="absolute inset-x-0 top-[16%] h-36 opacity-70 pointer-events-none"
        style={{ transform: `translateX(${-mountainShift * 0.35}px)` }}
      >
        <svg
          className="absolute w-[150%] h-full left-[-15%]"
          viewBox="0 0 600 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="hill1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={night ? "#1e293b" : "#57534e"} />
              <stop offset="100%" stopColor={night ? "#0f172a" : "#292524"} />
            </linearGradient>
            <linearGradient id="hill2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={night ? "#334155" : "#78716c"} />
              <stop offset="100%" stopColor={night ? "#1e293b" : "#44403c"} />
            </linearGradient>
          </defs>
          <path
            d="M0,100 L0,55 Q60,25 120,50 T240,40 T360,55 T480,35 T600,50 L600,100 Z"
            fill="url(#hill2)"
          />
          <path
            d="M0,100 L0,65 Q80,40 160,60 T320,52 T480,62 T600,55 L600,100 Z"
            fill="url(#hill1)"
            opacity="0.95"
          />
        </svg>
      </div>

      {/* Yol dünyası */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `perspective(1100px) rotateX(15deg) translateX(${-x * 0.88}px) rotateZ(${tilt * 0.85}deg)`,
          transformOrigin: "50% 100%",
          transition: "transform 0.07s linear",
        }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[230%] h-[75%]"
          style={{
            background: night
              ? "linear-gradient(to top, #0c0a09, #1c1917 55%, #292524)"
              : "linear-gradient(to top, #1c1917, #292524 50%, #57534e)",
            transform: "rotateX(55deg)",
            transformOrigin: "bottom center",
          }}
        >
          <div className="absolute left-[13%] top-0 bottom-0 w-[3px] bg-white/90" />
          <div className="absolute right-[13%] top-0 bottom-0 w-[3px] bg-white/90" />
          <div className="absolute left-0 top-0 bottom-0 w-[13%] bg-stone-700/35" />
          <div className="absolute right-0 top-0 bottom-0 w-[13%] bg-stone-700/35" />
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[4px]"
            style={{
              background:
                "repeating-linear-gradient(0deg, #fbbf24 0 30px, transparent 30px 60px)",
              animation: `roadFlow ${animDur}s linear infinite`,
            }}
          />
        </div>

        {/* Props (hızlı parallax) */}
        {props.map((p) => {
          const { scale, y, opacity } = project(
            p.side === "left" ? -3.3 : 3.3,
            p.z
          );
          const left =
            p.side === "left"
              ? `calc(50% - ${150 * (0.48 + p.z / 100)}px)`
              : `calc(50% + ${150 * (0.48 + p.z / 100)}px)`;

          if (p.kind === "tree") {
            return (
              <div
                key={p.id}
                className="absolute"
                style={{
                  left,
                  top: `${y}%`,
                  transform: "translateX(-50%)",
                  opacity,
                  zIndex: Math.floor(p.z),
                }}
              >
                <div
                  className="mx-auto"
                  style={{
                    width: 5 * scale,
                    height: 24 * scale,
                    background: "#3d2914",
                  }}
                />
                <div
                  className="rounded-full -mt-2 border border-black/40"
                  style={{
                    width: 30 * scale,
                    height: 28 * scale,
                    marginLeft: -12.5 * scale,
                    background:
                      "radial-gradient(circle at 35% 35%, #15803d, #14532d)",
                  }}
                />
              </div>
            );
          }
          if (p.kind === "pole") {
            return (
              <div
                key={p.id}
                className="absolute"
                style={{
                  left,
                  top: `${y - 3}%`,
                  transform: "translateX(-50%)",
                  opacity,
                  zIndex: Math.floor(p.z),
                }}
              >
                <div
                  style={{
                    width: 3 * scale,
                    height: 44 * scale,
                    background: "#71717a",
                  }}
                />
                {night && (
                  <div
                    className="rounded-full"
                    style={{
                      width: 12 * scale,
                      height: 7 * scale,
                      marginLeft: -4.5 * scale,
                      marginTop: -2,
                      background: "#fde68a",
                      boxShadow: `0 0 ${10 * scale}px #fbbf24`,
                    }}
                  />
                )}
              </div>
            );
          }
          if (p.kind === "rail") {
            return (
              <div
                key={p.id}
                className="absolute bg-zinc-500/90"
                style={{
                  left,
                  top: `${y + 9}%`,
                  width: 20 * scale,
                  height: 3 * scale,
                  transform: "translateX(-50%)",
                  opacity,
                  zIndex: Math.floor(p.z),
                }}
              />
            );
          }
          return (
            <div
              key={p.id}
              className="absolute bg-zinc-100 border border-zinc-600 text-[7px] font-bold text-zinc-800 flex items-center justify-center"
              style={{
                left,
                top: `${y}%`,
                width: 22 * scale,
                height: 14 * scale,
                transform: "translateX(-50%)",
                opacity,
                zIndex: Math.floor(p.z),
              }}
            >
              km
            </div>
          );
        })}

        {/* Arabalar */}
        {cars.map((c) => {
          const { scale, y, xPos, opacity } = project(c.lane, c.z);
          const w =
            (c.type === "truck"
              ? 40
              : c.type === "bus"
              ? 36
              : c.type === "minibus"
              ? 31
              : 27) * scale;
          const h =
            (c.type === "truck"
              ? 60
              : c.type === "bus"
              ? 52
              : c.type === "minibus"
              ? 45
              : 39) * scale;

          return (
            <div
              key={c.id}
              className="absolute"
              style={{
                left: `calc(50% + ${xPos}px)`,
                top: `${y}%`,
                transform: "translateX(-50%)",
                opacity,
                zIndex: Math.floor(c.z),
              }}
            >
              <div
                className="relative border border-black/70 shadow-xl overflow-hidden"
                style={{
                  width: w,
                  height: h,
                  backgroundColor: c.color,
                  borderRadius: 2,
                  boxShadow: night
                    ? `0 0 ${8 * scale}px rgba(0,0,0,0.8)`
                    : "0 4px 12px rgba(0,0,0,0.45)",
                }}
              >
                <div
                  className="absolute left-[8%] right-[8%] border border-black/50"
                  style={{
                    top: "9%",
                    height: c.type === "truck" ? "18%" : "28%",
                    background: night
                      ? "linear-gradient(180deg,#1e3a5f,#0c1222)"
                      : "linear-gradient(180deg,#7dd3fc,#075985)",
                  }}
                />
                <div
                  className="absolute left-0 right-0 h-px bg-black/35"
                  style={{ top: "44%" }}
                />
                <div
                  className="absolute bottom-[9%] left-[9%] rounded-sm"
                  style={{
                    width: "15%",
                    height: "11%",
                    background: night ? "#fef3c7" : "#fde68a",
                    boxShadow: night ? `0 0 ${6 * scale}px #fde68a` : "none",
                  }}
                />
                <div
                  className="absolute bottom-[9%] right-[9%] rounded-sm"
                  style={{
                    width: "15%",
                    height: "11%",
                    background: night ? "#fef3c7" : "#fde68a",
                    boxShadow: night ? `0 0 ${6 * scale}px #fde68a` : "none",
                  }}
                />
                {c.type === "truck" && (
                  <div className="absolute bottom-[20%] left-[5%] right-[5%] h-[32%] bg-black/30 border border-black/40" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Yağmur */}
      {weather === "rain" && (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px bg-white/30"
              style={{
                left: `${(i * 19) % 100}%`,
                height: 8 + (i % 6) * 3,
                animation: `fall ${0.55 + (i % 8) * 0.07}s linear infinite`,
                animationDelay: `${(i % 12) * 0.08}s`,
              }}
            />
          ))}
        </div>
      )}
      {weather === "fog" && (
        <div className="absolute inset-0 z-10 bg-white/12 backdrop-blur-[1px] pointer-events-none" />
      )}
      {blur && (
        <div className="absolute inset-0 z-20 backdrop-blur-[7px] bg-slate-500/10 pointer-events-none" />
      )}

      {/* Silecek */}
      {wiper && (
        <>
          <div className="absolute top-0 left-0 w-[50%] h-[45%] origin-[100%_8%] animate-wl z-30 pointer-events-none">
            <div className="w-full h-[2px] bg-zinc-100/35 mt-[44%]" />
          </div>
          <div className="absolute top-0 right-0 w-[50%] h-[45%] origin-[0%_8%] animate-wr z-30 pointer-events-none">
            <div className="w-full h-[2px] bg-zinc-100/35 mt-[44%]" />
          </div>
        </>
      )}

      {/* Tabela */}
      {showBoard && (
        <div
          className={`absolute top-[13%] z-20 transition-all duration-500 ${
            x > 35 ? "left-4" : x < -35 ? "right-4" : "left-1/2 -translate-x-1/2"
          }`}
        >
          <div
            className={`px-4 py-2 border-[3px] max-w-[210px] text-center shadow-2xl ${
              bb.c === "yellow"
                ? "bg-amber-400 border-black text-black"
                : bb.c === "red"
                ? "bg-red-800 border-white text-white"
                : bb.c === "nexora"
                ? "bg-white border-blue-900 text-blue-900"
                : "bg-zinc-900 border-amber-500 text-amber-100"
            }`}
          >
            <div className="font-black text-[12px] leading-tight">{bb.t}</div>
            {bb.s && <div className="text-[9px] mt-0.5 opacity-90">{bb.s}</div>}
          </div>
        </div>
      )}

      {/* ===== KOKPİT 3D HİSSİ ===== */}
      <div className="absolute bottom-0 inset-x-0 h-[40%] z-40 pointer-events-none">
        {/* Yan dikmeler (A-pillar) */}
        <div
          className="absolute bottom-[30%] left-0 w-16 h-[70%] origin-bottom-left"
          style={{
            background: "linear-gradient(90deg,#0a0a0b,transparent)",
            transform: "skewY(-12deg)",
          }}
        />
        <div
          className="absolute bottom-[30%] right-0 w-16 h-[70%] origin-bottom-right"
          style={{
            background: "linear-gradient(270deg,#0a0a0b,transparent)",
            transform: "skewY(12deg)",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#121214dd] to-transparent" />
        <div
          className="absolute bottom-0 inset-x-0 h-[70%]"
          style={{
            background: dashGlow
              ? "linear-gradient(to bottom, #1a1a22, #0c0c10)"
              : "linear-gradient(to bottom, #1a1a1d, #0f0f10)",
            borderTop: "1px solid rgba(63,63,70,0.5)",
            boxShadow: dashGlow
              ? "inset 0 1px 0 rgba(251,191,36,0.15), 0 -10px 40px rgba(251,191,36,0.05)"
              : "none",
          }}
        />

        {/* Direksiyon */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2">
          <div
            className="relative w-[12rem] h-[12rem] rounded-full transition-transform duration-75"
            style={{
              border: "14px solid #3f3f46",
              background:
                "radial-gradient(circle at 50% 45%, #2a2a2e, #141416 70%)",
              transform: `rotate(${tilt * 5.5}deg)`,
              boxShadow: dashGlow
                ? "0 12px 40px rgba(0,0,0,0.9), 0 0 20px rgba(251,191,36,0.12)"
                : "0 12px 40px rgba(0,0,0,0.9)",
            }}
          >
            <div className="absolute inset-3 rounded-full border-2 border-zinc-700/70" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-15 h-15 w-14 h-14 rounded-full bg-zinc-800 border border-zinc-600" />
            {[0, 72, 144, 216, 288].map((deg) => (
              <div
                key={deg}
                className="absolute top-1/2 left-1/2 w-[7px] h-[44%] bg-zinc-600 rounded-sm origin-top"
                style={{ transform: `translateX(-50%) rotate(${deg}deg)` }}
              />
            ))}
          </div>
        </div>

        {/* Hız — glow gece */}
        <div
          className="absolute bottom-9 left-7 rounded-xl px-4 py-2.5 border"
          style={{
            background: "#000",
            borderColor: dashGlow ? "rgba(251,191,36,0.45)" : "#52525b",
            boxShadow: dashGlow ? "0 0 16px rgba(251,191,36,0.25)" : "none",
          }}
        >
          <div className="text-[8px] text-zinc-500 tracking-[0.25em]">HIZ</div>
          <div
            className="text-3xl font-mono tabular-nums leading-none"
            style={{ color: dashGlow ? "#fbbf24" : "#f59e0b" }}
          >
            {Math.round(speed)}
          </div>
          <div className="text-[8px] text-zinc-500">km/s</div>
        </div>

        <div
          className="absolute bottom-9 right-7 rounded-xl px-4 py-2.5 border text-right"
          style={{
            background: "#000",
            borderColor: dashGlow ? "rgba(52,211,153,0.4)" : "#52525b",
            boxShadow: dashGlow ? "0 0 16px rgba(52,211,153,0.2)" : "none",
          }}
        >
          <div className="text-[8px] text-zinc-500 tracking-[0.25em]">KALAN</div>
          <div className="text-2xl font-mono text-emerald-400 tabular-nums leading-none">
            {Math.round(km)}
          </div>
          <div className="text-[8px] text-zinc-500">km</div>
        </div>

        {/* Sinyal */}
        <div className="absolute bottom-[6.2rem] left-1/2 -translate-x-1/2 flex gap-10">
          {(["left", "right"] as const).map((dir) => (
            <div
              key={dir}
              className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px]"
              style={{
                background: signal === dir ? "#fbbf24" : "#18181b",
                borderColor: signal === dir ? "#fde68a" : "#52525b",
                color: signal === dir ? "#000" : "#52525b",
                boxShadow:
                  signal === dir ? "0 0 14px #fbbf24" : "none",
                animation: signal === dir ? "pulse 1s infinite" : "none",
              }}
            >
              {dir === "left" ? "◀" : "▶"}
            </div>
          ))}
        </div>
      </div>

      {/* LED hat tabelası */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50">
        <div
          className="px-5 py-1.5 rounded border border-zinc-700 font-mono text-sm tracking-widest"
          style={{
            background: "#0a0a0a",
            color: "#4ade80",
            boxShadow: "inset 0 0 12px rgba(74,222,128,0.15), 0 0 8px rgba(0,0,0,0.5)",
            textShadow: "0 0 8px rgba(74,222,128,0.6)",
          }}
        >
          {exp.origin.split(" ")[0].toUpperCase()} →{" "}
          {exp.destination.split(" ")[0].toUpperCase()}
        </div>
      </div>

      {/* Saat / hava */}
      <div className="absolute top-11 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-black/80 border border-zinc-700 px-3 py-0.5 rounded-full text-[10px] text-zinc-300">
        <span className="font-mono">{String(hour).padStart(2, "0")}:00</span>
        <span>
          {weather === "rain"
            ? "🌧️"
            : weather === "fog"
            ? "🌫️"
            : sunset
            ? "🌅"
            : night
            ? "🌙"
            : "☀️"}
        </span>
        {blur && (
          <span className="text-red-400 font-bold animate-pulse">SİLECEK</span>
        )}
      </div>

      {/* Nostaljik teyp radyo */}
      <div className="absolute top-11 left-3 w-[17rem] z-50 rounded-lg border-2 border-zinc-600 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-b from-zinc-700 to-zinc-800 px-2 py-1 flex items-center justify-between">
          <span className="text-[9px] text-zinc-300 font-bold tracking-wider">
            OTOBÜS TEYPİ
          </span>
          <span className="text-[9px] text-amber-400 font-mono">
            {RADIO[channel].freq} MHz
          </span>
        </div>
        <div className="bg-zinc-900 p-2">
          <div className="flex gap-1 mb-1.5">
            {(["esnaf", "kral", "yurt"] as RadioChannel[]).map((ch) => (
              <button
                key={ch}
                onClick={() => setChannel(ch)}
                className={`flex-1 text-[8px] py-1 rounded pointer-events-auto ${
                  channel === ch
                    ? "bg-amber-500 text-black font-bold"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {RADIO[ch].name}
              </button>
            ))}
          </div>
          {/* Frekans çubuğu */}
          <div className="h-1.5 bg-zinc-800 rounded-full mb-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500"
              style={{
                width: `${30 + (song % 10) * 7}%`,
              }}
            />
          </div>
          {ad ? (
            <p className="text-[9px] text-amber-100/90 leading-snug max-h-14 overflow-y-auto">
              <span className="text-amber-400 font-bold">REKLAM • </span>
              {ad}
            </p>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-amber-500 text-[10px]">▶</span>
              <span className="text-[11px] text-amber-300 font-medium truncate">
                {RADIO[channel].songs[song]}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-11 right-3 z-50 text-[9px] text-zinc-500 bg-black/70 px-2 py-1 rounded border border-zinc-700">
        WASD · Q/E · Space
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
          15% {
            opacity: 0.55;
          }
          100% {
            transform: translateY(110vh);
            opacity: 0;
          }
        }
        @keyframes wl {
          0%,
          100% {
            transform: rotate(-22deg);
          }
          50% {
            transform: rotate(22deg);
          }
        }
        @keyframes wr {
          0%,
          100% {
            transform: rotate(22deg);
          }
          50% {
            transform: rotate(-22deg);
          }
        }
        .animate-wl {
          animation: wl 0.8s ease-in-out infinite;
        }
        .animate-wr {
          animation: wr 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}