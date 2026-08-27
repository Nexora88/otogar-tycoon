"use client";

import { useEffect, useState, useRef } from "react";
import { useGameStore } from "@/store/gameStore";

interface DrivingViewProps {
  expeditionId: string;
}

type CamMode = "cockpit" | "hood" | "top";

interface Ent {
  id: number;
  z: number;
  lane: number;
  kind: "car" | "truck" | "bus";
  color: string;
}

interface Scenery {
  id: number;
  z: number;
  side: -1 | 1;
  kind: "tree" | "billboard" | "house" | "mountain" | "pole" | "nazar";
}

/** Vites → hedef hız tavanı (km/s) */
const GEAR_MAX = [0, 25, 45, 70, 95, 120];
/** Bu hızın üstünde bir üst vitese geç uyarısı */
const GEAR_UP_AT = [0, 22, 40, 62, 88];

const RADIO = [
  "Esnaf FM · Şiki Şiki Kaptan",
  "Kral FM · Taht Kurmuşsun Koltuğuma",
  "Yurt FM · Ceddin Deden",
  "Esnaf FM · AŞTİ Realtime",
  "Yurt FM · Ankara Ankara",
];

const SIGNS = [
  "KEŞAN TERMİNAL",
  "MUSTAFA KEMAL'İN ASKERLERİYİZ",
  "ANKARA 160 KM",
  "NAZAR BONCUĞU — MAŞALLAH",
  "ÇAY MOLASI 5 KM",
];

export default function DrivingView({ expeditionId }: DrivingViewProps) {
  const exp = useGameStore((s) =>
    s.expeditions.find((e) => e.id === expeditionId)
  );

  const [cam, setCam] = useState<CamMode>("cockpit");
  const [lane, setLane] = useState(0);
  const [steer, setSteer] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [want, setWant] = useState(0);
  const [gear, setGear] = useState(1);
  const [gearFlash, setGearFlash] = useState(false);
  const [signal, setSignal] = useState<"none" | "left" | "right">("none");
  const [wiper, setWiper] = useState(false);
  const [wet, setWet] = useState(0.3);
  const [fuel, setFuel] = useState(70);
  const [km, setKm] = useState(160);
  const [prog, setProg] = useState(0);
  const [ents, setEnts] = useState<Ent[]>([]);
  const [scene, setScene] = useState<Scenery[]>([]);
  const [dash, setDash] = useState(0);
  const [radio, setRadio] = useState(RADIO[0]);
  const [radioOn, setRadioOn] = useState(true);
  const [sign, setSign] = useState(SIGNS[0]);
  const [showSign, setShowSign] = useState(false);
  const [teaSteam, setTeaSteam] = useState(true);
  const keys = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keys.current[k] = true;
      if (k === "c")
        setCam((c) =>
          c === "cockpit" ? "hood" : c === "hood" ? "top" : "cockpit"
        );
      if (k === "q") setSignal((s) => (s === "left" ? "none" : "left"));
      if (k === "e") setSignal((s) => (s === "right" ? "none" : "right"));
      if (e.key === " ") {
        e.preventDefault();
        setWiper((v) => !v);
      }
      // Vites 1–5
      if (["1", "2", "3", "4", "5"].includes(k)) {
        const g = Number(k);
        setGear(g);
        setGearFlash(true);
        setTimeout(() => setGearFlash(false), 280);
      }
      if (k === "r") {
        setRadioOn((v) => !v);
        if (Math.random() > 0.4)
          setRadio(RADIO[Math.floor(Math.random() * RADIO.length)]);
      }
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
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const cap = GEAR_MAX[gear] ?? 25;
      if (keys.current["w"] || keys.current["arrowup"])
        setWant((w) => Math.min(cap, w + 18 * dt));
      else if (keys.current["s"] || keys.current["arrowdown"])
        setWant((w) => Math.max(0, w - 28 * dt));
      else setWant((w) => Math.max(0, w - 4 * dt));

      // Vites tavanına yumuşak yapış
      setSpeed((s) => {
        const target = Math.min(want, cap);
        return s + (target - s) * Math.min(1, 2 * dt);
      });

      let dir = 0;
      if (keys.current["a"] || keys.current["arrowleft"]) dir = -1;
      if (keys.current["d"] || keys.current["arrowright"]) dir = 1;
      setSteer(dir * 14);
      setLane((L) => Math.max(-1, Math.min(1, L + dir * 1.2 * dt)));

      const sp = speed;
      setDash((d) => (d + sp * dt * 2) % 32);
      if (sp > 2) {
        setKm((k) => Math.max(0, k - sp * dt * 0.015));
        setFuel((f) => Math.max(0, f - sp * dt * 0.005));
        setProg((p) => Math.min(1, p + sp * dt * 0.0001));
      }

      setWet((w) => {
        let n = w + 0.03 * dt;
        if (wiper) n -= 0.5 * dt;
        return Math.max(0, Math.min(0.9, n));
      });

      setEnts((prev) => {
        let n = prev
          .map((e) => ({ ...e, z: e.z + (0.3 + sp * 0.01) * dt * 48 }))
          .filter((e) => e.z < 100);
        if (Math.random() < 0.028 && n.length < 6) {
          n.push({
            id: Math.random(),
            z: 6,
            lane: [-0.55, 0, 0.55][Math.floor(Math.random() * 3)],
            kind: Math.random() > 0.75 ? "truck" : "car",
            color: ["#c0392b", "#2980b9", "#f1c40f", "#ecf0f1", "#2c3e50"][
              Math.floor(Math.random() * 5)
            ],
          });
        }
        return n;
      });

      setScene((prev) => {
        let n = prev
          .map((s) => ({ ...s, z: s.z + (0.35 + sp * 0.012) * dt * 48 }))
          .filter((s) => s.z < 105);
        if (Math.random() < 0.06 && n.length < 18) {
          const kinds: Scenery["kind"][] = [
            "tree",
            "tree",
            "house",
            "billboard",
            "pole",
            "mountain",
            "nazar",
          ];
          n.push({
            id: Math.random(),
            z: 8,
            side: Math.random() > 0.5 ? 1 : -1,
            kind: kinds[Math.floor(Math.random() * kinds.length)],
          });
        }
        return n;
      });

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [want, gear, speed, wiper]);

  useEffect(() => {
    const t = setInterval(() => {
      setSign(SIGNS[Math.floor(Math.random() * SIGNS.length)]);
      setShowSign(true);
      setTimeout(() => setShowSign(false), 3500);
    }, 12000);
    return () => clearInterval(t);
  }, []);

  if (!exp || exp.status !== "departed") return null;

  const origin = exp.origin.split(" ")[0];
  const dest = exp.destination.split(" ")[0];
  const shift = lane * 46;
  const needUp =
    gear < 5 && speed >= (GEAR_UP_AT[gear] ?? 999) && want >= GEAR_MAX[gear] - 2;

  const proj = (z: number, lat: number) => {
    const t = Math.max(0, Math.min(1, z / 100));
    const scale = 0.1 + t * t * 1.7;
    const y = 30 + t * 48;
    const x = lat * (14 + t * 100) - shift * t;
    return { scale, y, x, o: Math.min(1, z / 12) };
  };

  // Piksel font hissi
  const px = "font-mono tracking-tight";

  return (
    <div
      className="fixed inset-0 z-40 overflow-hidden select-none"
      style={{
        imageRendering: "pixelated",
        background: "linear-gradient(#3d6b9a 0%, #6a9a5a 55%, #4a5a3a 100%)",
      }}
    >
      {/* Piksel dağ silüeti */}
      <div className="absolute top-[12%] left-0 right-0 h-20 flex items-end justify-center gap-0 opacity-50 pointer-events-none">
        {[20, 36, 28, 44, 32, 40, 24, 38, 30].map((h, i) => (
          <div
            key={i}
            style={{
              width: 48,
              height: h,
              background: "#3d4a5c",
              boxShadow: "inset -4px 0 0 #2a3340",
            }}
          />
        ))}
      </div>

      {/* Dünya */}
      <div
        className="absolute inset-0"
        style={{
          transform:
            cam === "top"
              ? "perspective(480px) rotateX(56deg) translateY(10%)"
              : "perspective(900px) rotateX(9deg)",
          transformOrigin: "50% 100%",
        }}
      >
        {/* Eskitilmiş asfalt — piksel şerit */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: "28%",
            width: "155%",
            height: "58%",
            background: `
              repeating-linear-gradient(
                90deg,
                #5a5a5a 0px, #5a5a5a 4px,
                #555 4px, #555 8px
              ),
              linear-gradient(#6e6e6e, #3a3a3a)
            `,
            clipPath: "polygon(42% 0%, 58% 0%, 100% 100%, 0% 100%)",
            transform: `translateX(${-shift * 0.22}px)`,
          }}
        />

        {Array.from({ length: 10 }).map((_, i) => {
          const z = (i * 10 + dash) % 100;
          const { scale, y, o } = proj(z, 0);
          return (
            <div
              key={i}
              className="absolute left-1/2"
              style={{
                top: `${y}%`,
                width: Math.max(4, 6 * scale),
                height: Math.max(6, 14 * scale),
                background: "#f1c40f",
                boxShadow: "2px 0 0 #b7950b",
                transform: `translateX(calc(-50% + ${-shift * (z / 100)}px))`,
                opacity: o,
              }}
            />
          );
        })}

        {scene.map((s) => {
          const { scale, y, x, o } = proj(s.z, s.side * 1.4);
          const left = `calc(50% + ${x}px)`;
          const base: React.CSSProperties = {
            left,
            top: `${y}%`,
            transform: "translate(-50%, -90%)",
            opacity: o,
            zIndex: Math.floor(s.z),
            imageRendering: "pixelated",
          };

          if (s.kind === "tree") {
            return (
              <div key={s.id} className="absolute" style={base}>
                <div
                  style={{
                    width: 6 * scale,
                    height: 14 * scale,
                    margin: "0 auto",
                    background: "#6b4226",
                  }}
                />
                <div
                  style={{
                    width: 22 * scale,
                    height: 18 * scale,
                    marginLeft: -8 * scale,
                    marginTop: -4 * scale,
                    background: "#1e8449",
                    boxShadow: `inset -4px -2px 0 #145a32`,
                  }}
                />
              </div>
            );
          }
          if (s.kind === "house") {
            return (
              <div key={s.id} className="absolute" style={base}>
                <div
                  style={{
                    width: 36 * scale,
                    height: 28 * scale,
                    background: "#a04000",
                    boxShadow: `inset -4px 0 0 #6e2c00, ${4 * scale}px ${4 * scale}px 0 #0004`,
                  }}
                />
                <div
                  style={{
                    width: 40 * scale,
                    height: 10 * scale,
                    marginLeft: -2 * scale,
                    background: "#5d4e37",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 6 * scale,
                    top: 8 * scale,
                    width: 8 * scale,
                    height: 8 * scale,
                    background: "#f7dc6f",
                  }}
                />
              </div>
            );
          }
          if (s.kind === "billboard") {
            return (
              <div key={s.id} className="absolute" style={base}>
                <div
                  style={{
                    width: 48 * scale,
                    height: 22 * scale,
                    background: "#c0392b",
                    border: "2px solid #fff",
                    color: "#fff",
                    fontSize: Math.max(5, 7 * scale),
                    fontFamily: "monospace",
                    textAlign: "center",
                    lineHeight: `${14 * scale}px`,
                  }}
                >
                  NEXORA
                </div>
                <div
                  style={{
                    width: 4 * scale,
                    height: 16 * scale,
                    margin: "0 auto",
                    background: "#7f8c8d",
                  }}
                />
              </div>
            );
          }
          if (s.kind === "nazar") {
            return (
              <div
                key={s.id}
                className="absolute"
                style={{
                  ...base,
                  fontSize: Math.max(10, 16 * scale),
                }}
              >
                🧿
              </div>
            );
          }
          if (s.kind === "mountain") {
            return (
              <div
                key={s.id}
                className="absolute"
                style={{
                  left,
                  top: `${y - 8}%`,
                  width: 50 * scale,
                  height: 30 * scale,
                  background: "#5d6d7e",
                  opacity: o * 0.6,
                  transform: "translateX(-50%)",
                  zIndex: 1,
                }}
              />
            );
          }
          return (
            <div
              key={s.id}
              className="absolute"
              style={{
                left,
                top: `${y}%`,
                width: 4 * scale,
                height: 30 * scale,
                background: "#95a5a6",
                transform: "translate(-50%, -100%)",
                opacity: o,
                zIndex: Math.floor(s.z),
              }}
            />
          );
        })}

        {ents.map((e) => {
          const { scale, y, x, o } = proj(e.z, e.lane);
          const w = (e.kind === "truck" ? 36 : 24) * scale;
          const h = (e.kind === "truck" ? 46 : 30) * scale;
          return (
            <div
              key={e.id}
              className="absolute"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `${y}%`,
                transform: "translate(-50%, -40%)",
                opacity: o,
                zIndex: Math.floor(e.z + 20),
                imageRendering: "pixelated",
              }}
            >
              <div
                style={{
                  width: w,
                  height: h,
                  background: e.color,
                  boxShadow: "inset -3px 0 0 #0005, 3px 3px 0 #0004",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "12%",
                    left: "10%",
                    right: "10%",
                    height: "28%",
                    background: "#5dade2",
                    boxShadow: "inset 0 -2px 0 #1a5276",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Cam buğu */}
      {wet > 0.1 && !wiper && (
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: `rgba(150,180,200,${wet * 0.25})`,
            backdropFilter: `blur(${wet * 4}px)`,
          }}
        />
      )}

      {wiper && (
        <>
          <div
            className="absolute z-30 pointer-events-none"
            style={{
              left: "10%",
              top: "6%",
              width: "42%",
              height: "50%",
              transformOrigin: "90% 100%",
              animation: "wipeL 0.9s ease-in-out infinite",
            }}
          >
            <div className="w-full h-[3px] bg-zinc-300 mt-[80%] shadow" />
          </div>
          <div
            className="absolute z-30 pointer-events-none"
            style={{
              right: "10%",
              top: "6%",
              width: "42%",
              height: "50%",
              transformOrigin: "10% 100%",
              animation: "wipeR 0.9s ease-in-out infinite",
            }}
          >
            <div className="w-full h-[3px] bg-zinc-300 mt-[80%] shadow" />
          </div>
        </>
      )}

      {showSign && (
        <div
          className={`absolute top-[14%] left-1/2 -translate-x-1/2 z-30 px-3 py-1 bg-[#f1c40f] text-black border-4 border-black text-xs font-bold ${px}`}
        >
          {sign}
        </div>
      )}

      {/* Vites uyarısı */}
      {needUp && (
        <div
          className={`absolute top-[36%] left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-red-700 text-white border-4 border-yellow-400 font-bold text-sm animate-pulse ${px}`}
        >
          VİTES YÜKSELT → {gear + 1}
        </div>
      )}

      {/* === PİKSEL KOKPİT === */}
      {cam !== "top" && (
        <div
          className="absolute bottom-0 inset-x-0 z-40 pointer-events-none"
          style={{ height: cam === "hood" ? "18%" : "44%" }}
        >
          {cam === "cockpit" && (
            <>
              {/* Torpido gövde — piksel blok */}
              <div
                className="absolute bottom-0 inset-x-0 h-[90%]"
                style={{
                  background: "linear-gradient(#4a4e54, #2c2f34)",
                  clipPath:
                    "polygon(0 28%, 6% 0, 94% 0, 100% 28%, 100% 100%, 0 100%)",
                  boxShadow: "inset 0 4px 0 #6a6e74",
                }}
              />

              {/* Nazar boncuğu ayna üstü */}
              <div
                className="absolute top-2 left-1/2 -translate-x-1/2 text-2xl z-50"
                title="Maşallah"
              >
                🧿
              </div>

              {/* Radyo teyp */}
              <div
                className={`absolute bottom-[58%] left-4 w-36 border-2 border-zinc-600 bg-zinc-900 p-1.5 ${px}`}
              >
                <div className="text-[8px] text-amber-500/80">TEYP · R aç/kapa</div>
                <div className="text-[9px] text-emerald-400 truncate mt-0.5">
                  {radioOn ? `♪ ${radio}` : "— kapalı —"}
                </div>
                <div className="h-1 mt-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-600 transition-all"
                    style={{ width: radioOn ? "70%" : "0%" }}
                  />
                </div>
              </div>

              {/* Çay bardağı + buhar */}
              <div className="absolute bottom-[52%] right-10 flex flex-col items-center">
                {teaSteam && (
                  <div className="text-[10px] text-white/40 animate-pulse mb-0.5">
                    ~
                  </div>
                )}
                <div
                  style={{
                    width: 14,
                    height: 18,
                    background: "#c0392b",
                    borderRadius: "0 0 4px 4px",
                    boxShadow: "inset 0 -6px 0 #f5b7b1",
                  }}
                />
                <div className="text-[7px] text-zinc-500 mt-0.5">çay</div>
              </div>

              {/* Kadran */}
              <div
                className={`absolute bottom-[48%] left-1/2 -translate-x-1/2 w-24 h-16 border-4 border-zinc-500 bg-black flex flex-col items-center justify-center ${px}`}
              >
                <span className="text-2xl text-amber-400 leading-none">
                  {Math.round(speed)}
                </span>
                <span className="text-[8px] text-zinc-500">km/s</span>
              </div>

              {/* Vites göstergesi */}
              <div
                className={`absolute bottom-[48%] left-[18%] border-2 border-zinc-500 bg-zinc-950 px-2 py-1 ${px} ${
                  gearFlash ? "bg-amber-600 text-black" : "text-amber-400"
                }`}
              >
                <div className="text-[8px] text-zinc-500">VİTES</div>
                <div className="text-xl font-bold leading-none">{gear}</div>
              </div>

              {/* Direksiyon + eller */}
              <div
                className="absolute bottom-2 left-1/2 -translate-x-1/2"
                style={{ transform: `rotate(${steer}deg)` }}
              >
                <div
                  className="relative w-44 h-44 rounded-full border-[12px] border-zinc-600 bg-zinc-800"
                  style={{ boxShadow: "inset 0 0 0 4px #3a3a3a" }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-zinc-900 border-2 border-blue-600 flex items-center justify-center">
                    <span className={`text-[9px] text-blue-400 font-black ${px}`}>
                      OT
                    </span>
                  </div>
                  {/* Sol el */}
                  <div
                    className="absolute"
                    style={{
                      left: 8,
                      top: "42%",
                      width: 22,
                      height: 28,
                      background: "#c4a484",
                      borderRadius: 4,
                      boxShadow: "inset -3px 0 0 #a08060",
                      transform: `rotate(${-steer * 0.3}deg)`,
                    }}
                  />
                  {/* Sağ el */}
                  <div
                    className="absolute"
                    style={{
                      right: 8,
                      top: "42%",
                      width: 22,
                      height: 28,
                      background: "#c4a484",
                      borderRadius: 4,
                      boxShadow: "inset 3px 0 0 #a08060",
                      transform: `rotate(${-steer * 0.3}deg)`,
                    }}
                  />
                </div>
              </div>

              {/* Vites kolu görseli */}
              <div
                className={`absolute bottom-16 right-[22%] w-3 bg-zinc-500 origin-bottom transition-transform duration-200 ${
                  gearFlash ? "scale-110" : ""
                }`}
                style={{
                  height: 28 + gear * 4,
                  transform: `rotate(${(gear - 3) * 12}deg)`,
                }}
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-zinc-300 border-2 border-zinc-600" />
              </div>

              <div className={`absolute bottom-5 left-3 text-[10px] bg-black/80 border border-zinc-600 px-2 py-1 ${px}`}>
                MAZOT{" "}
                <span className={fuel < 20 ? "text-red-400" : "text-emerald-400"}>
                  %{Math.round(fuel)}
                </span>
              </div>
              <div className="absolute bottom-5 right-3 flex gap-1">
                <div
                  className={`w-6 h-6 border-2 flex items-center justify-center text-[10px] ${
                    signal === "left"
                      ? "bg-amber-400 border-black text-black"
                      : "border-zinc-500 text-zinc-500"
                  }`}
                >
                  ◀
                </div>
                <div
                  className={`w-6 h-6 border-2 flex items-center justify-center text-[10px] ${
                    signal === "right"
                      ? "bg-amber-400 border-black text-black"
                      : "border-zinc-500 text-zinc-500"
                  }`}
                >
                  ▶
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <div className={`absolute top-2 left-2 z-50 text-[9px] bg-black/80 text-white px-2 py-1 border border-zinc-600 ${px}`}>
        WASD · 1-5 vites · R radyo · C kamera · Space silecek · Q/E
      </div>
      <div className={`absolute top-2 right-2 z-50 w-36 bg-black/90 border-2 border-zinc-500 p-2 text-[10px] ${px}`}>
        <div className="text-zinc-500">ROTA</div>
        <div className="text-amber-400">
          {origin}→{dest}
        </div>
        <div className="mt-1 h-1 bg-zinc-800">
          <div className="h-full bg-emerald-500" style={{ width: `${prog * 100}%` }} />
        </div>
        <div className="text-zinc-400">{Math.round(km)}km · V{gear}</div>
      </div>

      <style jsx global>{`
        @keyframes wipeL {
          0%,
          100% {
            transform: rotate(-26deg);
          }
          50% {
            transform: rotate(26deg);
          }
        }
        @keyframes wipeR {
          0%,
          100% {
            transform: rotate(26deg);
          }
          50% {
            transform: rotate(-26deg);
          }
        }
      `}</style>
    </div>
  );
}