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

interface DashLine {
  id: number;
  z: number;
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
  "Asıl kumar asfaltta. Bas gaza!",
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

function skyFor(hour: number, weather: Weather) {
  if (weather === "rain")
    return { bg: "from-[#1e293b] via-[#334155] to-[#44403c]", sun: null as string | null };
  if (weather === "fog")
    return { bg: "from-[#78716c] via-[#a8a29e] to-[#57534e]", sun: null };
  if (hour >= 21 || hour < 5)
    return { bg: "from-[#020617] via-[#0f172a] to-[#1e293b]", sun: "moon" };
  if (hour >= 18 && hour < 21)
    return { bg: "from-[#7c2d12] via-[#ea580c] to-[#57534e]", sun: "sunset" };
  if (hour >= 5 && hour < 7)
    return { bg: "from-[#9a3412] via-[#fb923c] to-[#7dd3fc]", sun: "sunrise" };
  return { bg: "from-[#0c4a6e] via-[#0284c7] to-[#78716c]", sun: "day" };
}

/** z: 0=ufuk (uzak), 100=yakın (otobüsün önü) */
function depthScale(z: number) {
  const t = Math.max(0, Math.min(1, z / 100));
  // Yaklaştıkça büyür (perspektif)
  return 0.08 + t * t * 1.6;
}

function depthY(z: number) {
  // Ufuk ~28%, yakın ~78%
  const t = Math.max(0, Math.min(1, z / 100));
  return 28 + t * 50;
}

function depthX(lane: number, z: number) {
  const t = Math.max(0, Math.min(1, z / 100));
  // Ufukta şeritler birbirine yakın, yakında geniş
  return lane * (12 + t * 70);
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
  const [hour, setHour] = useState(18);
  const [channel, setChannel] = useState<RadioChannel>("esnaf");
  const [song, setSong] = useState(0);
  const [ad, setAd] = useState<string | null>(null);
  const [board, setBoard] = useState(0);
  const [showBoard, setShowBoard] = useState(false);
  const [km, setKm] = useState(150);
  const [cars, setCars] = useState<RoadCar[]>([]);
  const [props, setProps] = useState<Prop[]>([]);
  const [dashes, setDashes] = useState<DashLine[]>(() =>
    Array.from({ length: 14 }).map((_, i) => ({ id: i, z: i * 7 }))
  );
  const [mountainShift, setMountainShift] = useState(0);
  const keys = useRef<Record<string, boolean>>({});

  const night = hour >= 21 || hour < 5;
  const sunset = hour >= 18 && hour < 21;
  const blur = (weather === "rain" || weather === "fog") && !wiper;
  const sky = skyFor(hour, weather);
  const dashGlow = night || sunset;

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
        setSpeed((s) => Math.min(130, s + 0.7 * dt));
      else if (keys.current["s"] || keys.current["arrowdown"])
        setSpeed((s) => Math.max(0, s - 1.35 * dt));
      else setSpeed((s) => Math.max(28, s - 0.05 * dt));

      if (blur) setSpeed((s) => Math.min(s, 58));

      setX((prev) => {
        const next = Math.max(-145, Math.min(145, prev + steer * 2.4 * dt));
        setTilt(steer * 3.1);
        return next;
      });

      setMountainShift((m) => (m + speed * dt * 0.018) % 240);
      setKm((k) => Math.max(0, k - (speed * dt) / 7000));

      // Şerit çizgileri: ufuktan yakına aksın
      const scroll = (speed * dt) / 12;
      setDashes((prev) =>
        prev.map((d) => {
          let z = d.z + scroll;
          if (z > 100) z -= 100;
          return { ...d, z };
        })
      );

      setCars((prev) =>
        prev
          .map((c) => {
            let lane = c.lane + c.drift * dt * 0.025;
            let drift = c.drift;
            if (lane > 2.1 || lane < -2.1) drift = -drift;
            lane = Math.max(-2.1, Math.min(2.1, lane));
            return {
              ...c,
              z: c.z + c.speed + speed / 90,
              lane,
              drift,
            };
          })
          .filter((c) => c.z < 108)
      );

      setProps((prev) =>
        prev
          .map((p) => ({ ...p, z: p.z + 1.5 + speed / 70 }))
          .filter((p) => p.z < 115)
      );

      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [blur, speed]);

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

  useEffect(() => {
    const t = setInterval(() => {
      setCars((prev) => {
        if (prev.length > 9) return prev;
        if (Math.random() > 0.6) {
          const type = pickType();
          const colors = PALETTE[type];
          return [
            ...prev,
            {
              id: Date.now() + Math.random(),
              lane: Math.floor(Math.random() * 5) - 2,
              z: 2,
              type,
              color: colors[Math.floor(Math.random() * colors.length)],
              speed: 0.9 + Math.random() * 1.3,
              drift: Math.random() > 0.5 ? (Math.random() > 0.5 ? 1 : -1) : 0,
            },
          ];
        }
        return prev;
      });
    }, 500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setProps((prev) => {
        if (Math.random() > 0.28) {
          const kinds: Prop["kind"][] = ["tree", "tree", "pole", "rail", "sign"];
          return [
            ...prev,
            {
              id: Date.now() + Math.random(),
              side: Math.random() > 0.5 ? "left" : "right",
              z: 3,
              kind: kinds[Math.floor(Math.random() * kinds.length)],
            },
          ];
        }
        return prev;
      });
    }, 240);
    return () => clearInterval(t);
  }, []);

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
    }, 11000);
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
      setTimeout(() => setShowBoard(false), 4200);
    }, 9000);
    return () => clearInterval(t);
  }, []);

  if (!exp || exp.status !== "departed") return null;

  const bb = BOARDS[board];

  return (
    <div className="fixed inset-0 z-40 overflow-hidden select-none bg-black">
      {/* Gökyüzü */}
      <div className={`absolute inset-0 bg-gradient-to-b ${sky.bg} transition-all duration-1000`} />

      {/* Güneş / ay — güçlü glow */}
      {sky.sun === "day" && (
        <div
          className="absolute top-8 right-24 w-16 h-16 rounded-full bg-amber-100"
          style={{ boxShadow: "0 0 40px 20px #ffaa00, 0 0 80px 40px rgba(255,170,0,0.35)" }}
        />
      )}
      {sky.sun === "sunset" && (
        <div
          className="absolute top-[20%] right-[16%] w-24 h-24 rounded-full bg-orange-400"
          style={{
            boxShadow:
              "0 0 50px 25px #ff6600, 0 0 100px 50px rgba(255,100,0,0.4), 0 0 150px 70px rgba(255,80,0,0.2)",
          }}
        />
      )}
      {sky.sun === "sunrise" && (
        <div
          className="absolute top-[26%] left-[14%] w-20 h-20 rounded-full bg-orange-300"
          style={{ boxShadow: "0 0 45px 22px #ffaa55, 0 0 90px 45px rgba(255,150,50,0.3)" }}
        />
      )}
      {sky.sun === "moon" && (
        <div
          className="absolute top-10 right-20 w-12 h-12 rounded-full bg-slate-200"
          style={{ boxShadow: "0 0 30px 12px rgba(226,232,240,0.5)" }}
        />
      )}

      {/* Parallax dağlar */}
      <div
        className="absolute inset-x-0 top-[15%] h-32 pointer-events-none opacity-75"
        style={{ transform: `translateX(${-mountainShift * 0.3}px)` }}
      >
        <svg className="absolute w-[160%] h-full left-[-20%]" viewBox="0 0 600 90" preserveAspectRatio="none">
          <defs>
            <linearGradient id="h1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={night ? "#334155" : "#78716c"} />
              <stop offset="100%" stopColor={night ? "#1e293b" : "#44403c"} />
            </linearGradient>
            <linearGradient id="h2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={night ? "#1e293b" : "#57534e"} />
              <stop offset="100%" stopColor={night ? "#0f172a" : "#292524"} />
            </linearGradient>
          </defs>
          <path d="M0,90 L0,50 Q70,20 140,48 T280,38 T420,50 T560,30 T600,45 L600,90 Z" fill="url(#h1)" />
          <path d="M0,90 L0,60 Q90,38 180,58 T360,50 T540,60 T600,52 L600,90 Z" fill="url(#h2)" />
        </svg>
      </div>

      {/* ===== PERSPEKTİF YOL ===== */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translateX(${-x * 0.9}px) rotateZ(${tilt * 0.7}deg)`,
          transition: "transform 0.07s linear",
        }}
      >
        {/* Yol yamuk (ufka daralan) */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: "28%",
            bottom: "22%",
            background: night
              ? "linear-gradient(to bottom, #1c1917, #0c0a09)"
              : "linear-gradient(to bottom, #44403c, #1c1917)",
            clipPath: "polygon(46% 0%, 54% 0%, 100% 100%, 0% 100%)",
          }}
        />

        {/* Sol kenar çizgisi — ufka daralan */}
        <div
          className="absolute bg-white/90 origin-top"
          style={{
            top: "28%",
            bottom: "22%",
            left: "46%",
            width: 3,
            transform: "skewX(28deg)",
            transformOrigin: "top center",
          }}
        />
        {/* Sağ kenar */}
        <div
          className="absolute bg-white/90 origin-top"
          style={{
            top: "28%",
            bottom: "22%",
            right: "46%",
            width: 3,
            transform: "skewX(-28deg)",
            transformOrigin: "top center",
          }}
        />

        {/* Orta kesik çizgiler — perspektif scale */}
        {dashes.map((d) => {
          const s = depthScale(d.z);
          const y = depthY(d.z);
          const h = Math.max(4, 8 * s);
          const w = Math.max(2, 5 * s);
          return (
            <div
              key={d.id}
              className="absolute left-1/2 bg-amber-400 rounded-sm"
              style={{
                top: `${y}%`,
                width: w,
                height: h,
                transform: `translateX(calc(-50% + ${-x * 0.05}px))`,
                opacity: 0.3 + (d.z / 100) * 0.7,
                boxShadow: "0 0 4px rgba(251,191,36,0.5)",
              }}
            />
          );
        })}

        {/* Yol kenarı props */}
        {props.map((p) => {
          const s = depthScale(p.z);
          const y = depthY(p.z);
          const sideX = p.side === "left" ? -1 : 1;
          const px = depthX(sideX * 2.8, p.z);

          if (p.kind === "tree") {
            return (
              <div
                key={p.id}
                className="absolute"
                style={{
                  left: `calc(50% + ${px}px)`,
                  top: `${y}%`,
                  transform: "translateX(-50%)",
                  opacity: Math.min(1, p.z / 12),
                  zIndex: Math.floor(p.z),
                }}
              >
                <div style={{ width: 4 * s, height: 20 * s, background: "#3d2914", margin: "0 auto" }} />
                <div
                  className="rounded-full border border-black/40 -mt-1"
                  style={{
                    width: 26 * s,
                    height: 24 * s,
                    marginLeft: -11 * s,
                    background: "radial-gradient(circle at 35% 35%, #16a34a, #14532d)",
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
                  left: `calc(50% + ${px}px)`,
                  top: `${y - 2}%`,
                  transform: "translateX(-50%)",
                  opacity: Math.min(1, p.z / 12),
                  zIndex: Math.floor(p.z),
                }}
              >
                <div style={{ width: 3 * s, height: 38 * s, background: "#71717a" }} />
                {night && (
                  <div
                    className="rounded-full"
                    style={{
                      width: 10 * s,
                      height: 6 * s,
                      marginLeft: -3.5 * s,
                      background: "#fde68a",
                      boxShadow: `0 0 ${12 * s}px #fbbf24`,
                    }}
                  />
                )}
              </div>
            );
          }
          return (
            <div
              key={p.id}
              className="absolute bg-zinc-500/90"
              style={{
                left: `calc(50% + ${px}px)`,
                top: `${y + 6}%`,
                width: 16 * s,
                height: 3 * s,
                transform: "translateX(-50%)",
                opacity: Math.min(1, p.z / 12),
                zIndex: Math.floor(p.z),
              }}
            />
          );
        })}

        {/* Araçlar — yaklaşınca büyür */}
        {cars.map((c) => {
          const s = depthScale(c.z);
          const y = depthY(c.z);
          const px = depthX(c.lane, c.z);
          const w =
            (c.type === "truck" ? 42 : c.type === "bus" ? 38 : c.type === "minibus" ? 32 : 28) * s;
          const h =
            (c.type === "truck" ? 62 : c.type === "bus" ? 54 : c.type === "minibus" ? 46 : 40) * s;

          return (
            <div
              key={c.id}
              className="absolute"
              style={{
                left: `calc(50% + ${px}px)`,
                top: `${y}%`,
                transform: "translateX(-50%)",
                opacity: Math.min(1, c.z / 10),
                zIndex: Math.floor(c.z + 20),
              }}
            >
              <div
                className="relative border border-black/70 overflow-hidden"
                style={{
                  width: w,
                  height: h,
                  backgroundColor: c.color,
                  borderRadius: 2,
                  boxShadow: night
                    ? `0 0 ${10 * s}px rgba(0,0,0,0.9)`
                    : `0 ${4 * s}px ${12 * s}px rgba(0,0,0,0.5)`,
                }}
              >
                <div
                  className="absolute left-[8%] right-[8%] border border-black/50"
                  style={{
                    top: "10%",
                    height: c.type === "truck" ? "18%" : "28%",
                    background: night
                      ? "linear-gradient(180deg,#1e3a5f,#0c1222)"
                      : "linear-gradient(180deg,#7dd3fc,#075985)",
                  }}
                />
                <div
                  className="absolute bottom-[10%] left-[10%] rounded-sm"
                  style={{
                    width: "14%",
                    height: "10%",
                    background: night ? "#fef3c7" : "#fde68a",
                    boxShadow: night ? `0 0 ${8 * s}px #fde68a` : "none",
                  }}
                />
                <div
                  className="absolute bottom-[10%] right-[10%] rounded-sm"
                  style={{
                    width: "14%",
                    height: "10%",
                    background: night ? "#fef3c7" : "#fde68a",
                    boxShadow: night ? `0 0 ${8 * s}px #fde68a` : "none",
                  }}
                />
                {c.type === "truck" && (
                  <div className="absolute bottom-[22%] left-[5%] right-[5%] h-[30%] bg-black/30 border border-black/40" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Yağmur / sis / bulanık cam */}
      {weather === "rain" && (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {Array.from({ length: 45 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px bg-white/30"
              style={{
                left: `${(i * 19) % 100}%`,
                height: 8 + (i % 5) * 3,
                animation: `fall ${0.55 + (i % 7) * 0.08}s linear infinite`,
                animationDelay: `${(i % 10) * 0.09}s`,
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

      {wiper && (
        <>
          <div className="absolute top-0 left-0 w-[50%] h-[44%] origin-[100%_8%] animate-wl z-30 pointer-events-none">
            <div className="w-full h-[2px] bg-zinc-100/35 mt-[44%]" />
          </div>
          <div className="absolute top-0 right-0 w-[50%] h-[44%] origin-[0%_8%] animate-wr z-30 pointer-events-none">
            <div className="w-full h-[2px] bg-zinc-100/35 mt-[44%]" />
          </div>
        </>
      )}

      {showBoard && (
        <div
          className={`absolute top-[12%] z-20 transition-all duration-500 ${
            x > 30 ? "left-4" : x < -30 ? "right-4" : "left-1/2 -translate-x-1/2"
          }`}
        >
          <div
            className={`px-4 py-2 border-[3px] max-w-[200px] text-center shadow-2xl ${
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

      {/* ===== KOKPİT ===== */}
      <div className="absolute bottom-0 inset-x-0 h-[38%] z-40 pointer-events-none">
        <div className="absolute bottom-[28%] left-0 w-20 h-[75%] origin-bottom-left bg-gradient-to-r from-black to-transparent"
          style={{ transform: "skewY(-14deg)" }} />
        <div className="absolute bottom-[28%] right-0 w-20 h-[75%] origin-bottom-right bg-gradient-to-l from-black to-transparent"
          style={{ transform: "skewY(14deg)" }} />

        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#121214cc] to-transparent" />
        <div
          className="absolute bottom-0 inset-x-0 h-[68%]"
          style={{
            background: "linear-gradient(to bottom, #1a1a1f, #0c0c10)",
            borderTop: "1px solid rgba(63,63,70,0.5)",
            boxShadow: dashGlow
              ? "inset 0 1px 0 rgba(251,191,36,0.2), 0 -8px 30px rgba(251,191,36,0.06)"
              : "none",
          }}
        />

        {/* Direksiyon + Otogar amblemi */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div
            className="relative w-[11.5rem] h-[11.5rem] rounded-full transition-transform duration-75"
            style={{
              border: "13px solid #3f3f46",
              background: "radial-gradient(circle at 50% 42%, #2a2a30, #121214 72%)",
              transform: `rotate(${tilt * 5.5}deg)`,
              boxShadow: dashGlow
                ? "0 10px 36px rgba(0,0,0,0.9), 0 0 18px rgba(251,191,36,0.15)"
                : "0 10px 36px rgba(0,0,0,0.9)",
            }}
          >
            <div className="absolute inset-3 rounded-full border-2 border-zinc-700/60" />
            {/* Merkez amblem */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-zinc-900 border-2 border-amber-500/60 flex items-center justify-center shadow-[0_0_12px_rgba(251,191,36,0.35)]">
              <span className="text-[8px] font-black text-amber-400 leading-tight text-center">
                OT
                <br />
                GAR
              </span>
            </div>
            {[0, 72, 144, 216, 288].map((deg) => (
              <div
                key={deg}
                className="absolute top-1/2 left-1/2 w-[6px] h-[43%] bg-zinc-600 rounded-sm origin-top"
                style={{ transform: `translateX(-50%) rotate(${deg}deg)` }}
              />
            ))}
          </div>
        </div>

        {/* Göstergeler */}
        <div
          className="absolute bottom-8 left-6 rounded-xl px-3 py-2 border"
          style={{
            background: "#000",
            borderColor: dashGlow ? "rgba(251,191,36,0.5)" : "#52525b",
            boxShadow: dashGlow ? "0 0 14px rgba(251,191,36,0.3)" : "none",
          }}
        >
          <div className="text-[8px] text-zinc-500 tracking-widest">HIZ</div>
          <div className="text-3xl font-mono text-amber-400 tabular-nums leading-none">
            {Math.round(speed)}
          </div>
        </div>
        <div
          className="absolute bottom-8 right-6 rounded-xl px-3 py-2 border text-right"
          style={{
            background: "#000",
            borderColor: dashGlow ? "rgba(52,211,153,0.45)" : "#52525b",
            boxShadow: dashGlow ? "0 0 14px rgba(52,211,153,0.25)" : "none",
          }}
        >
          <div className="text-[8px] text-zinc-500 tracking-widest">KALAN</div>
          <div className="text-2xl font-mono text-emerald-400 tabular-nums leading-none">
            {Math.round(km)}
          </div>
        </div>

        {/* Sinyal okları — ışıklı */}
        <div className="absolute bottom-[5.8rem] left-1/2 -translate-x-1/2 flex gap-10">
          {(["left", "right"] as const).map((dir) => (
            <div
              key={dir}
              className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px]"
              style={{
                background: signal === dir ? "#fbbf24" : "#18181b",
                borderColor: signal === dir ? "#fde68a" : "#52525b",
                color: signal === dir ? "#000" : "#52525b",
                boxShadow: signal === dir ? "0 0 16px #fbbf24, 0 0 28px rgba(251,191,36,0.4)" : "none",
              }}
            >
              {dir === "left" ? "◀" : "▶"}
            </div>
          ))}
        </div>
      </div>

      {/* LED tabela */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50">
        <div
          className="px-5 py-1 rounded border border-zinc-700 font-mono text-sm tracking-widest"
          style={{
            background: "#0a0a0a",
            color: "#4ade80",
            textShadow: "0 0 10px rgba(74,222,128,0.7)",
            boxShadow: "inset 0 0 14px rgba(74,222,128,0.12)",
          }}
        >
          {exp.origin.split(" ")[0].toUpperCase()} → {exp.destination.split(" ")[0].toUpperCase()}
        </div>
      </div>

      <div className="absolute top-11 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-black/80 border border-zinc-700 px-3 py-0.5 rounded-full text-[10px] text-zinc-300">
        <span className="font-mono">{String(hour).padStart(2, "0")}:00</span>
        <span>
          {weather === "rain" ? "🌧️" : weather === "fog" ? "🌫️" : sunset ? "🌅" : night ? "🌙" : "☀️"}
        </span>
        {blur && <span className="text-red-400 font-bold animate-pulse">SİLECEK</span>}
      </div>

      {/* Teyp */}
      <div className="absolute top-11 left-3 w-[16.5rem] z-50 rounded-lg border-2 border-zinc-600 overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-b from-zinc-600 to-zinc-800 px-2 py-1 flex justify-between">
          <span className="text-[9px] text-zinc-200 font-bold">OTOBÜS TEYPİ</span>
          <span className="text-[9px] text-amber-400 font-mono">{RADIO[channel].freq}</span>
        </div>
        <div className="bg-zinc-900 p-2">
          <div className="flex gap-1 mb-1">
            {(["esnaf", "kral", "yurt"] as RadioChannel[]).map((ch) => (
              <button
                key={ch}
                onClick={() => setChannel(ch)}
                className={`flex-1 text-[8px] py-1 rounded pointer-events-auto ${
                  channel === ch ? "bg-amber-500 text-black font-bold" : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {RADIO[ch].name}
              </button>
            ))}
          </div>
          <div className="h-1 bg-zinc-800 rounded-full mb-1 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-700 to-amber-400 rounded-full"
              style={{ width: `${35 + (song % 8) * 8}%` }}
            />
          </div>
          {ad ? (
            <p className="text-[9px] text-amber-100/90 leading-snug max-h-12 overflow-y-auto">
              <span className="text-amber-400 font-bold">REKLAM • </span>
              {ad}
            </p>
          ) : (
            <div className="text-[11px] text-amber-300 font-medium truncate">
              ▶ {RADIO[channel].songs[song]}
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-11 right-3 z-50 text-[9px] text-zinc-500 bg-black/70 px-2 py-1 rounded border border-zinc-700">
        WASD · Q/E · Space
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-30px);
            opacity: 0;
          }
          15% {
            opacity: 0.5;
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