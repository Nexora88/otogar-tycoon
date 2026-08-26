"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useGameStore } from "@/store/gameStore";

interface DrivingViewProps {
  expeditionId: string;
}

type RadioChannel = "esnaf" | "kral" | "yurt";
type Weather = "clear" | "rain" | "fog";
type CarType = "tofas" | "mercedes" | "truck" | "minibus" | "bus";

interface RoadCar {
  id: number;
  lane: number; // -2 .. 2
  z: number; // 0 yakın, 100 uzak
  type: CarType;
  color: string;
  speed: number;
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
  "Kardeşim, bu yollarda Otogar Tycoon'a güven. Tekerine taş değmesin!",
  "Silecekleri unutma kaptan. Yurtta sulh, cihanda sulh!",
  "Asıl kumar asfaltta. Bas gaza, terminal ağası ol.",
  "Anıtkabir ufukta. Doğru zamanda bas gaza.",
];

const BILLBOARDS = [
  { t: "Bakraç Ticaret", s: "Geleceğin Bilgisayarlı Sistemleri", c: "tech" },
  { t: "Otogar Tycoon", s: "Kaptanların Hakiki Dostu", c: "yellow" },
  { t: "Nexora Elektronik", s: "Yerli Malı", c: "nexora" },
  { t: "Yurtta Sulh, Cihanda Sulh", s: "M. Kemal Atatürk", c: "red" },
  { t: "Mustafa Kemal'in Askerleriyiz", s: "", c: "red" },
  { t: "Anıtkabir", s: "Emanetlere sahip çık", c: "red" },
  { t: "Egemenlik Milletindir!", s: "", c: "red" },
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
  if (r < 0.35) return "tofas";
  if (r < 0.55) return "mercedes";
  if (r < 0.75) return "truck";
  if (r < 0.9) return "minibus";
  return "bus";
}

export default function DrivingView({ expeditionId }: DrivingViewProps) {
  const exp = useGameStore((s) => s.expeditions.find((e) => e.id === expeditionId));

  const [x, setX] = useState(0);
  const [tilt, setTilt] = useState(0);
  const [speed, setSpeed] = useState(58);
  const [signal, setSignal] = useState<"none" | "left" | "right">("none");
  const [wiper, setWiper] = useState(false);
  const [weather, setWeather] = useState<Weather>("clear");
  const [hour, setHour] = useState(16);
  const [channel, setChannel] = useState<RadioChannel>("esnaf");
  const [song, setSong] = useState(0);
  const [ad, setAd] = useState<string | null>(null);
  const [board, setBoard] = useState(0);
  const [showBoard, setShowBoard] = useState(false);
  const [km, setKm] = useState(160);
  const [cars, setCars] = useState<RoadCar[]>([]);
  const [props, setProps] = useState<Prop[]>([]);
  const keys = useRef<Record<string, boolean>>({});
  const zRoad = useRef(0);

  const night = hour < 6 || hour >= 19;
  const blur = (weather === "rain" || weather === "fog") && !wiper;
  const animDur = Math.max(0.06, 0.42 - speed / 340);

  // Input
  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
      if (e.key === "q" || e.key === "Q") setSignal((v) => (v === "left" ? "none" : "left"));
      if (e.key === "e" || e.key === "E") setSignal((v) => (v === "right" ? "none" : "right"));
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

  // Main loop
  useEffect(() => {
    let id: number;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(32, now - last) / 16;
      last = now;

      let steer = 0;
      if (keys.current["a"] || keys.current["arrowleft"]) steer -= 1;
      if (keys.current["d"] || keys.current["arrowright"]) steer += 1;

      if (keys.current["w"] || keys.current["arrowup"]) {
        setSpeed((s) => Math.min(130, s + 0.7 * dt));
      } else if (keys.current["s"] || keys.current["arrowdown"]) {
        setSpeed((s) => Math.max(0, s - 1.4 * dt));
      } else {
        setSpeed((s) => Math.max(28, s - 0.06 * dt));
      }

      setSpeed((s) => (blur ? Math.min(s, 60) : s));

      setX((prev) => {
        const next = Math.max(-155, Math.min(155, prev + steer * 2.4 * dt));
        setTilt(steer * 3.2);
        return next;
      });

      setKm((k) => Math.max(0, k - (speed * dt) / 7000));
      zRoad.current = (zRoad.current + speed * dt * 0.15) % 100;

      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [blur, speed]);

  // Weather & time
  useEffect(() => {
    const a = setInterval(() => setHour((h) => (h + 1) % 24), 11000);
    const b = setInterval(() => {
      const r = Math.random();
      setWeather(r > 0.8 ? "rain" : r > 0.92 ? "fog" : "clear");
    }, 14000);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  // Traffic spawn
  useEffect(() => {
    const t = setInterval(() => {
      setCars((prev) => {
        const next = prev
          .map((c) => ({ ...c, z: c.z + c.speed + speed / 80 }))
          .filter((c) => c.z < 110);
        if (Math.random() > 0.55) {
          const type = pickType();
          const colors = PALETTE[type];
          next.push({
            id: Date.now() + Math.random(),
            lane: Math.floor(Math.random() * 5) - 2,
            z: -6,
            type,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: 1.2 + Math.random() * 1.5,
          });
        }
        return next;
      });
    }, 300);
    return () => clearInterval(t);
  }, [speed]);

  // Roadside props
  useEffect(() => {
    const t = setInterval(() => {
      setProps((prev) => {
        const next = prev
          .map((p) => ({ ...p, z: p.z + 1.5 + speed / 70 }))
          .filter((p) => p.z < 115);
        if (Math.random() > 0.35) {
          const kinds: Prop["kind"][] = ["tree", "tree", "pole", "rail", "sign"];
          next.push({
            id: Date.now() + Math.random(),
            side: Math.random() > 0.5 ? "left" : "right",
            z: -4,
            kind: kinds[Math.floor(Math.random() * kinds.length)],
          });
        }
        return next;
      });
    }, 220);
    return () => clearInterval(t);
  }, [speed]);

  // Radio
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

  // Billboards
  useEffect(() => {
    const t = setInterval(() => {
      setBoard((i) => (i + 1) % BILLBOARDS.length);
      setShowBoard(true);
      setTimeout(() => setShowBoard(false), 4500);
    }, 9000);
    return () => clearInterval(t);
  }, []);

  const project = useCallback((lane: number, z: number) => {
    const depth = Math.max(0.05, z / 100);
    const scale = 0.25 + depth * 1.35;
    const y = 26 + z * 0.5;
    const xPos = lane * 38 * (0.4 + depth);
    return { scale, y, xPos, opacity: Math.min(1, z / 10) };
  }, []);

  if (!exp || exp.status !== "departed") return null;

  const bb = BILLBOARDS[board];

  const sky = night
    ? "from-[#060a14] via-[#0f172a] to-[#1e293b]"
    : weather === "rain"
    ? "from-[#334155] via-[#475569] to-[#57534e]"
    : weather === "fog"
    ? "from-[#78716c] via-[#a8a29e] to-[#78716c]"
    : "from-[#0c4a6e] via-[#0369a1] to-[#78716c]";

  return (
    <div className="fixed inset-0 z-40 overflow-hidden select-none bg-black">
      {/* Sky */}
      <div className={`absolute inset-0 bg-gradient-to-b ${sky} transition-colors duration-1000`} />

      {/* Sun / moon glow */}
      <div
        className={`absolute rounded-full blur-3xl pointer-events-none ${
          night ? "bg-slate-300/20 w-40 h-40 top-10 right-16" : "bg-amber-300/30 w-56 h-56 top-6 right-20"
        }`}
      />

      {/* Distant hills */}
      <svg className="absolute inset-x-0 top-[18%] h-32 opacity-60" viewBox="0 0 400 80" preserveAspectRatio="none">
        <path
          d="M0,80 L0,50 Q40,20 80,45 T160,40 T240,50 T320,35 T400,55 L400,80 Z"
          fill={night ? "#1e293b" : "#44403c"}
        />
        <path
          d="M0,80 L0,60 Q50,35 100,55 T200,48 T300,58 T400,50 L400,80 Z"
          fill={night ? "#0f172a" : "#292524"}
          opacity="0.85"
        />
      </svg>

      {/* World */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `perspective(1000px) rotateX(16deg) translateX(${-x * 0.9}px) rotateZ(${tilt * 0.9}deg)`,
          transformOrigin: "50% 100%",
          transition: "transform 0.08s linear",
        }}
      >
        {/* Road bed */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[220%] h-[74%]"
          style={{
            background: night
              ? "linear-gradient(to top, #0c0a09 0%, #1c1917 50%, #292524 100%)"
              : "linear-gradient(to top, #1c1917 0%, #292524 50%, #57534e 100%)",
            transform: "rotateX(56deg)",
            transformOrigin: "bottom center",
            boxShadow: "0 0 80px rgba(0,0,0,0.5)",
          }}
        >
          {/* Lane edges */}
          <div className="absolute left-[14%] top-0 bottom-0 w-[3px] bg-white/90" />
          <div className="absolute right-[14%] top-0 bottom-0 w-[3px] bg-white/90" />
          {/* Shoulder */}
          <div className="absolute left-0 top-0 bottom-0 w-[14%] bg-stone-700/40" />
          <div className="absolute right-0 top-0 bottom-0 w-[14%] bg-stone-700/40" />
          {/* Center dashes */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[4px]"
            style={{
              background: "repeating-linear-gradient(0deg, #fbbf24 0 32px, transparent 32px 64px)",
              animation: `roadFlow ${animDur}s linear infinite`,
            }}
          />
        </div>

        {/* Props */}
        {props.map((p) => {
          const { scale, y, opacity } = project(p.side === "left" ? -3.2 : 3.2, p.z);
          const left =
            p.side === "left"
              ? `calc(50% - ${145 * (0.5 + p.z / 100)}px)`
              : `calc(50% + ${145 * (0.5 + p.z / 100)}px)`;

          if (p.kind === "tree") {
            return (
              <div
                key={p.id}
                className="absolute"
                style={{ left, top: `${y}%`, transform: "translateX(-50%)", opacity, zIndex: Math.floor(p.z) }}
              >
                <div className="mx-auto bg-[#3d2914]" style={{ width: 5 * scale, height: 22 * scale }} />
                <div
                  className="rounded-full -mt-2 border border-black/30"
                  style={{
                    width: 28 * scale,
                    height: 26 * scale,
                    marginLeft: -11.5 * scale,
                    background: "radial-gradient(circle at 40% 40%, #166534, #14532d)",
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
                style={{ left, top: `${y - 2}%`, transform: "translateX(-50%)", opacity, zIndex: Math.floor(p.z) }}
              >
                <div className="bg-zinc-500" style={{ width: 3 * scale, height: 40 * scale }} />
                {night && (
                  <div
                    className="rounded-full bg-amber-200/80 blur-[2px]"
                    style={{ width: 10 * scale, height: 6 * scale, marginLeft: -3.5 * scale, marginTop: -2 }}
                  />
                )}
              </div>
            );
          }
          if (p.kind === "rail") {
            return (
              <div
                key={p.id}
                className="absolute bg-zinc-500/80"
                style={{
                  left,
                  top: `${y + 8}%`,
                  width: 18 * scale,
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
              className="absolute bg-zinc-200 border border-zinc-600 text-[8px] font-bold text-zinc-800 flex items-center justify-center"
              style={{
                left,
                top: `${y}%`,
                width: 20 * scale,
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

        {/* Cars */}
        {cars.map((c) => {
          const { scale, y, xPos, opacity } = project(c.lane, c.z);
          const w =
            (c.type === "truck" ? 38 : c.type === "bus" ? 34 : c.type === "minibus" ? 30 : 26) * scale;
          const h =
            (c.type === "truck" ? 58 : c.type === "bus" ? 50 : c.type === "minibus" ? 44 : 38) * scale;

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
                className="relative rounded-[2px] border border-black/60 shadow-xl overflow-hidden"
                style={{ width: w, height: h, backgroundColor: c.color }}
              >
                {/* Window */}
                <div
                  className="absolute left-[8%] right-[8%] border border-black/40"
                  style={{
                    top: "10%",
                    height: c.type === "truck" ? "20%" : "30%",
                    background: night
                      ? "linear-gradient(180deg, #1e3a5f, #0f172a)"
                      : "linear-gradient(180deg, #7dd3fc, #0c4a6e)",
                  }}
                />
                {/* Body line */}
                <div className="absolute left-0 right-0 h-px bg-black/30" style={{ top: "45%" }} />
                {/* Headlights */}
                <div
                  className="absolute bottom-[10%] left-[10%] rounded-sm"
                  style={{
                    width: "16%",
                    height: "12%",
                    background: night ? "#fef3c7" : "#fde68a",
                    boxShadow: night ? "0 0 8px #fde68a" : "none",
                  }}
                />
                <div
                  className="absolute bottom-[10%] right-[10%] rounded-sm"
                  style={{
                    width: "16%",
                    height: "12%",
                    background: night ? "#fef3c7" : "#fde68a",
                    boxShadow: night ? "0 0 8px #fde68a" : "none",
                  }}
                />
                {c.type === "truck" && (
                  <div className="absolute bottom-[22%] left-[6%] right-[6%] h-[30%] bg-black/25 border border-black/30" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Weather particles */}
      {weather === "rain" && (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px bg-white/35"
              style={{
                left: `${(i * 17) % 100}%`,
                height: 10 + (i % 5) * 3,
                animation: `fall ${0.6 + (i % 7) * 0.08}s linear infinite`,
                animationDelay: `${(i % 10) * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}
      {weather === "fog" && (
        <div className="absolute inset-0 z-10 bg-white/15 backdrop-blur-[1px] pointer-events-none" />
      )}

      {blur && (
        <div className="absolute inset-0 z-20 backdrop-blur-[7px] bg-slate-400/10 pointer-events-none" />
      )}

      {/* Wipers */}
      {wiper && (
        <>
          <div className="absolute top-0 left-0 w-[50%] h-[46%] origin-[100%_10%] animate-wl z-30 pointer-events-none">
            <div className="w-full h-[2px] bg-zinc-100/40 mt-[45%]" />
          </div>
          <div className="absolute top-0 right-0 w-[50%] h-[46%] origin-[0%_10%] animate-wr z-30 pointer-events-none">
            <div className="w-full h-[2px] bg-zinc-100/40 mt-[45%]" />
          </div>
        </>
      )}

      {/* Billboard */}
      {showBoard && (
        <div
          className={`absolute top-[14%] z-20 transition-all duration-500 ${
            x > 40 ? "left-5" : x < -40 ? "right-5" : "left-1/2 -translate-x-1/2"
          }`}
        >
          <div
            className={`px-4 py-2.5 border-[3px] max-w-[220px] text-center shadow-2xl ${
              bb.c === "yellow"
                ? "bg-amber-400 border-black text-black"
                : bb.c === "red"
                ? "bg-red-800 border-white text-white"
                : bb.c === "nexora"
                ? "bg-white border-blue-900 text-blue-900"
                : "bg-zinc-900 border-amber-500 text-amber-100"
            }`}
          >
            <div className="font-black text-[13px] leading-tight tracking-wide">{bb.t}</div>
            {bb.s && <div className="text-[9px] mt-0.5 opacity-90">{bb.s}</div>}
          </div>
        </div>
      )}

      {/* ===== COCKPIT ===== */}
      <div className="absolute bottom-0 inset-x-0 h-[38%] z-40 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#141416ee] to-transparent" />
        {/* Dash plate */}
        <div className="absolute bottom-0 inset-x-0 h-[72%] bg-gradient-to-b from-[#1a1a1d] to-[#0f0f10] border-t border-zinc-700/50" />
        {/* Windshield frame */}
        <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-black/80 to-transparent" />

        {/* Steering wheel */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div
            className="relative w-[11.5rem] h-[11.5rem] rounded-full border-[13px] shadow-2xl transition-transform duration-75"
            style={{
              borderColor: "#3f3f46",
              background: "radial-gradient(circle at 50% 50%, #27272a, #18181b)",
              transform: `rotate(${tilt * 5.5}deg)`,
              boxShadow: "0 10px 40px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.5)",
            }}
          >
            <div className="absolute inset-3 rounded-full border-2 border-zinc-700/80" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-zinc-800 border border-zinc-600 shadow-inner" />
            {/* Spokes */}
            {[0, 90, 180, 270].map((deg) => (
              <div
                key={deg}
                className="absolute top-1/2 left-1/2 w-2 h-[42%] bg-zinc-600 rounded origin-top"
                style={{ transform: `translateX(-50%) rotate(${deg}deg)` }}
              />
            ))}
          </div>
        </div>

        {/* Speedo */}
        <div className="absolute bottom-10 left-8 rounded-xl bg-black/95 border border-zinc-600 px-4 py-3 shadow-lg">
          <div className="text-[9px] text-zinc-500 tracking-[0.2em]">HIZ</div>
          <div className="text-3xl font-mono text-amber-400 tabular-nums leading-none">
            {Math.round(speed)}
          </div>
          <div className="text-[9px] text-zinc-500 mt-0.5">km/s</div>
        </div>

        {/* Distance */}
        <div className="absolute bottom-10 right-8 rounded-xl bg-black/95 border border-zinc-600 px-4 py-3 text-right shadow-lg">
          <div className="text-[9px] text-zinc-500 tracking-[0.2em]">KALAN</div>
          <div className="text-2xl font-mono text-emerald-400 tabular-nums leading-none">
            {Math.round(km)}
          </div>
          <div className="text-[9px] text-zinc-500 mt-0.5">km</div>
        </div>

        {/* Turn signals */}
        <div className="absolute bottom-[6.5rem] left-1/2 -translate-x-1/2 flex gap-10">
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] ${
              signal === "left"
                ? "bg-amber-400 border-amber-200 text-black animate-pulse shadow-[0_0_12px_#fbbf24]"
                : "bg-zinc-900 border-zinc-600 text-zinc-600"
            }`}
          >
            ◀
          </div>
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] ${
              signal === "right"
                ? "bg-amber-400 border-amber-200 text-black animate-pulse shadow-[0_0_12px_#fbbf24]"
                : "bg-zinc-900 border-zinc-600 text-zinc-600"
            }`}
          >
            ▶
          </div>
        </div>
      </div>

      {/* Top HUD */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-black/80 border border-zinc-700/80 px-4 py-1 rounded-full text-[11px] text-zinc-300 backdrop-blur-sm">
        <span className="font-mono">{String(hour).padStart(2, "0")}:00</span>
        <span className="text-zinc-600">|</span>
        <span>
          {weather === "rain" ? "🌧️ Yağmur" : weather === "fog" ? "🌫️ Sis" : night ? "🌙 Gece" : "☀️ Açık"}
        </span>
        {blur && <span className="text-red-400 font-bold animate-pulse">SİLECEK!</span>}
      </div>

      {/* Radio */}
      <div className="absolute top-11 left-3 w-64 z-50 rounded-xl bg-zinc-900/95 border border-zinc-700 shadow-2xl p-2.5 backdrop-blur">
        <div className="flex gap-1 mb-1.5">
          {(["esnaf", "kral", "yurt"] as RadioChannel[]).map((ch) => (
            <button
              key={ch}
              onClick={() => setChannel(ch)}
              className={`flex-1 text-[9px] py-1 rounded pointer-events-auto transition ${
                channel === ch ? "bg-amber-500 text-black font-bold" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {RADIO[ch].name}
            </button>
          ))}
        </div>
        {ad ? (
          <p className="text-[10px] text-amber-100/90 leading-snug max-h-[4.5rem] overflow-y-auto">
            <span className="text-amber-400 font-bold">REKLAM • </span>
            {ad}
          </p>
        ) : (
          <div className="text-[12px] text-amber-300 font-medium truncate">
            {RADIO[channel].songs[song]}
          </div>
        )}
      </div>

      {/* Route chip */}
      <div className="absolute top-11 right-3 z-50 text-right rounded-lg bg-black/80 border border-zinc-700 px-3 py-1.5">
        <div className="text-amber-400 font-semibold text-xs">
          {exp.origin.split(" ")[0]} → {exp.destination.split(" ")[0]}
        </div>
        <div className="text-zinc-500 text-[9px] mt-0.5">WASD · Q/E · Space</div>
      </div>

      <style jsx>{`
        @keyframes roadFlow {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 0 128px;
          }
        }
        @keyframes fall {
          0% {
            transform: translateY(-40px);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(110vh);
            opacity: 0;
          }
        }
        @keyframes wl {
          0%,
          100% {
            transform: rotate(-24deg);
          }
          50% {
            transform: rotate(24deg);
          }
        }
        @keyframes wr {
          0%,
          100% {
            transform: rotate(24deg);
          }
          50% {
            transform: rotate(-24deg);
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