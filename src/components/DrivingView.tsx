"use client";

import { useEffect, useState, useRef } from "react";
import { useGameStore } from "@/store/gameStore";

interface DrivingViewProps {
  expeditionId: string;
}

type CamMode = "cockpit" | "hood" | "top";

interface Car {
  id: number;
  z: number;
  lane: number;
  color: string;
  w: number;
}

interface Side {
  id: number;
  z: number;
  side: -1 | 1;
  kind: "tree" | "house" | "light" | "billboard";
}

const GEAR_MAX = [0, 28, 48, 72, 98, 120];
const GEAR_UP = [0, 24, 42, 64, 90];

const RADIO = [
  "Esnaf FM · Şiki Şiki Kaptan",
  "Kral FM · Koltuğuma Taht",
  "Yurt FM · Ceddin Deden",
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
  const [wet, setWet] = useState(0.4);
  const [fuel, setFuel] = useState(72);
  const [km, setKm] = useState(155);
  const [prog, setProg] = useState(0);
  const [cars, setCars] = useState<Car[]>([]);
  const [sides, setSides] = useState<Side[]>([]);
  const [dash, setDash] = useState(0);
  const [barrierPhase, setBarrierPhase] = useState(0);
  const [radio, setRadio] = useState(RADIO[0]);
  const [radioOn, setRadioOn] = useState(true);
  const [skyShift, setSkyShift] = useState(0);
  const keys = useRef<Record<string, boolean>>({});

  // Yağmur damlaları (sabit grid + anim)
  const drops = useRef(
    Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 55,
      s: 0.5 + Math.random(),
    }))
  );

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
      if (["1", "2", "3", "4", "5"].includes(k)) {
        setGear(Number(k));
        setGearFlash(true);
        setTimeout(() => setGearFlash(false), 250);
      }
      if (k === "r") {
        setRadioOn((v) => !v);
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

      const cap = GEAR_MAX[gear];
      if (keys.current["w"] || keys.current["arrowup"])
        setWant((w) => Math.min(cap, w + 16 * dt));
      else if (keys.current["s"] || keys.current["arrowdown"])
        setWant((w) => Math.max(0, w - 26 * dt));
      else setWant((w) => Math.max(0, w - 3.5 * dt));

      setSpeed((s) => s + (Math.min(want, cap) - s) * Math.min(1, 2 * dt));

      let dir = 0;
      if (keys.current["a"] || keys.current["arrowleft"]) dir = -1;
      if (keys.current["d"] || keys.current["arrowright"]) dir = 1;
      setSteer(dir * 15);
      setLane((L) => Math.max(-0.95, Math.min(0.95, L + dir * 1.15 * dt)));

      const sp = speed;
      setDash((d) => (d + sp * dt * 2.4) % 28);
      setBarrierPhase((p) => (p + sp * dt * 3) % 16);
      setSkyShift((p) => (p + sp * dt * 0.15) % 100);

      if (sp > 2) {
        setKm((k) => Math.max(0, k - sp * dt * 0.014));
        setFuel((f) => Math.max(0, f - sp * dt * 0.0045));
        setProg((p) => Math.min(1, p + sp * dt * 0.00009));
      }

      setWet((w) => {
        let n = w + 0.025 * dt;
        if (wiper) n -= 0.55 * dt;
        return Math.max(0, Math.min(0.85, n));
      });

      // Damlalar
      drops.current = drops.current.map((d) => {
        if (wiper) {
          return {
            ...d,
            y: d.y - 55 * dt,
            x: d.x + (d.x < 50 ? -18 : 18) * dt,
          };
        }
        let y = d.y + 10 * dt * d.s;
        let x = d.x;
        if (y > 58) {
          y = -2;
          x = Math.random() * 100;
        }
        return { ...d, x, y };
      });

      setCars((prev) => {
        let n = prev
          .map((c) => ({ ...c, z: c.z + (0.32 + sp * 0.011) * dt * 52 }))
          .filter((c) => c.z < 100);
        if (Math.random() < 0.03 && n.length < 7) {
          n.push({
            id: Math.random(),
            z: 5,
            lane: [-0.55, -0.2, 0.2, 0.55][Math.floor(Math.random() * 4)],
            color: ["#e74c3c", "#3498db", "#f1c40f", "#ecf0f1", "#2c3e50", "#e67e22"][
              Math.floor(Math.random() * 6)
            ],
            w: 22 + Math.random() * 12,
          });
        }
        return n;
      });

      setSides((prev) => {
        let n = prev
          .map((s) => ({ ...s, z: s.z + (0.38 + sp * 0.013) * dt * 52 }))
          .filter((s) => s.z < 102);
        if (Math.random() < 0.07 && n.length < 16) {
          const kinds: Side["kind"][] = ["tree", "tree", "house", "light", "billboard"];
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

  if (!exp || exp.status !== "departed") return null;

  const origin = exp.origin.split(" ")[0];
  const dest = exp.destination.split(" ")[0];
  const shift = lane * 44;
  const needUp =
    gear < 5 && speed >= GEAR_UP[gear] && want >= GEAR_MAX[gear] - 2;

  /** z 0 uzak → 100 yakın — ufka daralan yol */
  const proj = (z: number, lat: number) => {
    const t = Math.max(0, Math.min(1, z / 100));
    const scale = 0.08 + t * t * 1.85;
    const y = 26 + t * 52;
    const x = lat * (12 + t * 108) - shift * t;
    return { scale, y, x, o: Math.min(1, z / 11) };
  };

  const px = { fontFamily: "monospace", letterSpacing: "-0.02em" } as const;

  // Şehir silüeti binaları (parallax)
  const buildings = [
    { h: 28, w: 14, lit: true },
    { h: 42, w: 18, lit: true },
    { h: 22, w: 12, lit: false },
    { h: 48, w: 16, lit: true },
    { h: 34, w: 20, lit: true },
    { h: 26, w: 11, lit: false },
    { h: 40, w: 15, lit: true },
    { h: 30, w: 13, lit: true },
    { h: 36, w: 17, lit: false },
    { h: 44, w: 14, lit: true },
  ];

  return (
    <div
      className="fixed inset-0 z-40 overflow-hidden select-none"
      style={{
        imageRendering: "pixelated",
        background: "#0a0e18",
      }}
    >
      {/* Gökyüzü gece */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #0b1020 0%, #1a2744 40%, #2a3550 70%, #1e2a20 100%)",
        }}
      />

      {/* Parallax şehir — ufuk */}
      <div
        className="absolute left-0 right-0 flex items-end justify-center gap-[2px] pointer-events-none"
        style={{
          top: "8%",
          height: 56,
          transform: `translateX(${-skyShift * 0.8}px)`,
          opacity: 0.95,
        }}
      >
        {buildings.concat(buildings).map((b, i) => (
          <div
            key={i}
            style={{
              width: b.w,
              height: b.h,
              background: i % 3 === 0 ? "#1a2332" : "#243044",
              boxShadow: "inset -3px 0 0 #0d121c",
              position: "relative",
            }}
          >
            {b.lit &&
              Array.from({ length: 6 }).map((_, wi) => (
                <div
                  key={wi}
                  style={{
                    position: "absolute",
                    width: 2,
                    height: 2,
                    left: 3 + (wi % 3) * 4,
                    top: 4 + Math.floor(wi / 3) * 8,
                    background: wi % 2 === 0 ? "#f5c542" : "#f0a020",
                    opacity: 0.85,
                  }}
                />
              ))}
          </div>
        ))}
      </div>

      {/* Yol + dünya */}
      <div
        className="absolute inset-0"
        style={{
          transform:
            cam === "top"
              ? "perspective(500px) rotateX(58deg) translateY(8%)"
              : "perspective(920px) rotateX(8deg)",
          transformOrigin: "50% 100%",
        }}
      >
        {/* Asfalt — pürüzlü piksel */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: "24%",
            width: "160%",
            height: "62%",
            background: `
              repeating-linear-gradient(
                0deg,
                transparent 0px, transparent 3px,
                rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px
              ),
              linear-gradient(to bottom, #4a4a52, #2a2a30)
            `,
            clipPath: "polygon(44% 0%, 56% 0%, 100% 100%, 0% 100%)",
            transform: `translateX(${-shift * 0.2}px)`,
          }}
        />

        {/* Orta kesik çizgiler */}
        {Array.from({ length: 12 }).map((_, i) => {
          const z = (i * 8.5 + dash) % 100;
          const { scale, y, o } = proj(z, 0);
          return (
            <div
              key={`d-${i}`}
              className="absolute left-1/2"
              style={{
                top: `${y}%`,
                width: Math.max(3, 5 * scale),
                height: Math.max(5, 12 * scale),
                background: "#e8e86a",
                boxShadow: "1px 0 0 #a0a040",
                transform: `translateX(calc(-50% + ${-shift * (z / 100)}px))`,
                opacity: o,
              }}
            />
          );
        })}

        {/* Sarı-beyaz bariyer şeritleri (sol/sağ) */}
        {Array.from({ length: 14 }).map((_, i) => {
          const z = (i * 7 + barrierPhase * 2) % 100;
          const { scale, y, o } = proj(z, 0);
          const stripe = Math.floor((i + barrierPhase) % 2) === 0;
          return (
            <div key={`b-${i}`}>
              {([-1, 1] as const).map((side) => {
                const { x } = proj(z, side * 1.15);
                return (
                  <div
                    key={side}
                    className="absolute"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `${y}%`,
                      width: Math.max(4, 8 * scale),
                      height: Math.max(6, 14 * scale),
                      background: stripe ? "#f1c40f" : "#ecf0f1",
                      transform: "translate(-50%, -50%)",
                      opacity: o,
                      boxShadow: "2px 2px 0 #0006",
                      zIndex: Math.floor(z),
                    }}
                  />
                );
              })}
            </div>
          );
        })}

        {/* Kenar ağaç / ev / tabela */}
        {sides.map((s) => {
          const { scale, y, x, o } = proj(s.z, s.side * 1.55);
          const left = `calc(50% + ${x}px)`;
          if (s.kind === "tree") {
            return (
              <div
                key={s.id}
                className="absolute"
                style={{
                  left,
                  top: `${y}%`,
                  transform: "translate(-50%, -95%)",
                  opacity: o,
                  zIndex: Math.floor(s.z),
                }}
              >
                <div
                  style={{
                    width: 5 * scale,
                    height: 16 * scale,
                    margin: "0 auto",
                    background: "#5d4037",
                  }}
                />
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: `${13 * scale}px solid transparent`,
                    borderRight: `${13 * scale}px solid transparent`,
                    borderBottom: `${26 * scale}px solid #1b5e20`,
                    marginLeft: -13 * scale,
                    filter: "contrast(1.1)",
                  }}
                />
              </div>
            );
          }
          if (s.kind === "house") {
            return (
              <div
                key={s.id}
                className="absolute"
                style={{
                  left,
                  top: `${y}%`,
                  transform: "translate(-50%, -90%)",
                  opacity: o,
                  zIndex: Math.floor(s.z),
                }}
              >
                <div
                  style={{
                    width: 32 * scale,
                    height: 26 * scale,
                    background: "#6d4c41",
                    boxShadow: `inset -4px 0 0 #4e342e, ${3 * scale}px ${3 * scale}px 0 #0005`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 6 * scale,
                      top: 8 * scale,
                      width: 7 * scale,
                      height: 7 * scale,
                      background: "#ffe082",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 36 * scale,
                    height: 8 * scale,
                    marginLeft: -2 * scale,
                    background: "#3e2723",
                  }}
                />
              </div>
            );
          }
          if (s.kind === "billboard") {
            return (
              <div
                key={s.id}
                className="absolute"
                style={{
                  left,
                  top: `${y}%`,
                  transform: "translate(-50%, -90%)",
                  opacity: o,
                  zIndex: Math.floor(s.z),
                  fontSize: Math.max(5, 7 * scale),
                  ...px,
                }}
              >
                <div
                  style={{
                    background: "#c62828",
                    color: "#fff",
                    border: "2px solid #fff",
                    padding: "1px 3px",
                    textAlign: "center",
                  }}
                >
                  BAKRAÇ
                </div>
                <div
                  style={{
                    width: 3 * scale,
                    height: 14 * scale,
                    margin: "0 auto",
                    background: "#78909c",
                  }}
                />
              </div>
            );
          }
          // street light
          return (
            <div
              key={s.id}
              className="absolute"
              style={{
                left,
                top: `${y}%`,
                transform: "translate(-50%, -100%)",
                opacity: o,
                zIndex: Math.floor(s.z),
              }}
            >
              <div
                style={{
                  width: 3 * scale,
                  height: 28 * scale,
                  background: "#546e7a",
                }}
              />
              <div
                style={{
                  width: 10 * scale,
                  height: 6 * scale,
                  marginLeft: -3 * scale,
                  background: "#ffecb3",
                  boxShadow: `0 0 ${8 * scale}px #ffc107`,
                }}
              />
            </div>
          );
        })}

        {/* Diğer araçlar — net silüet */}
        {cars.map((c) => {
          const { scale, y, x, o } = proj(c.z, c.lane);
          return (
            <div
              key={c.id}
              className="absolute"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `${y}%`,
                transform: "translate(-50%, -35%)",
                opacity: o,
                zIndex: Math.floor(c.z + 25),
              }}
            >
              <div
                style={{
                  width: c.w * scale,
                  height: 28 * scale,
                  background: c.color,
                  boxShadow: "inset -3px 0 0 #0005, 2px 3px 0 #0004",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "10%",
                    left: "12%",
                    right: "12%",
                    height: "32%",
                    background: "#81d4fa",
                    boxShadow: "inset 0 -2px 0 #0277bd",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "8%",
                    left: "8%",
                    width: "14%",
                    height: "14%",
                    background: "#fff59d",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "8%",
                    right: "8%",
                    width: "14%",
                    height: "14%",
                    background: "#fff59d",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Yağmur damlaları */}
      {wet > 0.08 &&
        drops.current.map((d) => (
          <div
            key={d.id}
            className="absolute z-20 pointer-events-none rounded-full"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: 2 * d.s,
              height: 4 * d.s,
              background: "rgba(200,220,255,0.55)",
              opacity: wiper ? wet * 0.35 : wet * 0.9,
              boxShadow: "0 0 2px rgba(255,255,255,0.4)",
            }}
          />
        ))}

      {wiper && (
        <>
          <div
            className="absolute z-30 pointer-events-none"
            style={{
              left: "8%",
              top: "4%",
              width: "44%",
              height: "48%",
              transformOrigin: "95% 100%",
              animation: "wipeL 0.88s ease-in-out infinite",
            }}
          >
            <div className="w-full h-[2px] bg-slate-300/90 mt-[78%] shadow" />
          </div>
          <div
            className="absolute z-30 pointer-events-none"
            style={{
              right: "8%",
              top: "4%",
              width: "44%",
              height: "48%",
              transformOrigin: "5% 100%",
              animation: "wipeR 0.88s ease-in-out infinite",
            }}
          >
            <div className="w-full h-[2px] bg-slate-300/90 mt-[78%] shadow" />
          </div>
        </>
      )}

      {/* Orta dikiz */}
      {cam === "cockpit" && (
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 z-40 border-2 border-zinc-500 bg-zinc-900 overflow-hidden"
          style={{ width: 72, height: 28 }}
        >
          <div className="h-full bg-gradient-to-b from-zinc-700 to-zinc-900 flex items-end justify-center pb-0.5">
            <div className="w-8 h-2 bg-zinc-600" />
          </div>
        </div>
      )}

      {needUp && (
        <div
          className="absolute top-[34%] left-1/2 -translate-x-1/2 z-50 px-3 py-1 bg-red-800 text-yellow-300 border-2 border-yellow-400 text-xs font-bold animate-pulse"
          style={px}
        >
          VİTES {gear + 1}
        </div>
      )}

      {/* ===== KOKPİT — referans stili ===== */}
      {cam !== "top" && (
        <div
          className="absolute bottom-0 inset-x-0 z-40 pointer-events-none"
          style={{ height: cam === "hood" ? "16%" : "46%" }}
        >
          {cam === "cockpit" && (
            <>
              {/* Göğüs — koyu piksel */}
              <div
                className="absolute bottom-0 inset-x-0 h-full"
                style={{
                  background: "linear-gradient(to top, #1a1c22 0%, #3a3e48 50%, #2a2e36 100%)",
                  clipPath:
                    "polygon(0% 40%, 4% 12%, 10% 0%, 90% 0%, 96% 12%, 100% 40%, 100% 100%, 0% 100%)",
                  boxShadow: "inset 0 6px 0 #4a4e58",
                }}
              />

              {/* Ahşap direksiyon göbeği bandı hissi */}
              <div
                className="absolute bottom-[6%] left-1/2 -translate-x-1/2"
                style={{ transform: `rotate(${steer}deg)` }}
              >
                <div
                  className="relative"
                  style={{
                    width: 168,
                    height: 168,
                    borderRadius: "50%",
                    border: "14px solid #5d4037",
                    boxShadow:
                      "inset 0 0 0 6px #3e2723, 0 0 0 3px #2c2c2c, 4px 8px 0 #0005",
                    background: "#2c3038",
                  }}
                >
                  <div
                    className="absolute inset-3 rounded-full"
                    style={{ border: "2px solid #4a4e56" }}
                  />
                  {/* Kollar */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      width: "68%",
                      height: 10,
                      background: "#4e342e",
                      borderRadius: 2,
                    }}
                  />
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2"
                    style={{
                      width: 10,
                      height: "40%",
                      background: "#4e342e",
                      marginTop: "-5%",
                      borderRadius: 2,
                    }}
                  />
                  {/* Amblem */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "#1a1a1a",
                      border: "2px solid #c9a227",
                      color: "#c9a227",
                      fontSize: 9,
                      fontWeight: 900,
                      ...px,
                    }}
                  >
                    ★
                  </div>
                  {/* Sol el */}
                  <div
                    style={{
                      position: "absolute",
                      left: 6,
                      top: "38%",
                      width: 28,
                      height: 36,
                      background: "#d4a574",
                      borderRadius: 6,
                      boxShadow: "inset -4px 0 0 #b8956a",
                      transform: `rotate(${-8 - steer * 0.2}deg)`,
                    }}
                  />
                  {/* Sağ el */}
                  <div
                    style={{
                      position: "absolute",
                      right: 6,
                      top: "38%",
                      width: 28,
                      height: 36,
                      background: "#d4a574",
                      borderRadius: 6,
                      boxShadow: "inset 4px 0 0 #b8956a",
                      transform: `rotate(${8 - steer * 0.2}deg)`,
                    }}
                  />
                </div>
              </div>

              {/* Sol kadran grubu */}
              <div
                className="absolute bottom-[42%] left-[10%] flex gap-2 items-end"
                style={px}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "#0a0a0a",
                    border: "3px solid #5a5a5a",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "inset 0 0 12px #000",
                  }}
                >
                  <span style={{ color: "#e8e86a", fontSize: 16, lineHeight: 1 }}>
                    {Math.round(speed)}
                  </span>
                  <span style={{ color: "#666", fontSize: 7 }}>km/s</span>
                </div>
              </div>

              {/* Vites kutusu */}
              <div
                className="absolute bottom-[42%] left-[28%]"
                style={{
                  ...px,
                  background: gearFlash ? "#f1c40f" : "#111",
                  border: "2px solid #666",
                  padding: "4px 8px",
                  color: gearFlash ? "#000" : "#f1c40f",
                }}
              >
                <div style={{ fontSize: 7, color: gearFlash ? "#333" : "#666" }}>
                  VİTES
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}>
                  {gear}
                </div>
              </div>

              {/* Radyo */}
              <div
                className="absolute bottom-[58%] right-[12%]"
                style={{
                  ...px,
                  width: 120,
                  background: "#111",
                  border: "2px solid #555",
                  padding: 4,
                  fontSize: 8,
                }}
              >
                <div style={{ color: "#888" }}>TEYP R</div>
                <div style={{ color: radioOn ? "#2ecc71" : "#555", marginTop: 2 }}>
                  {radioOn ? `♪ ${radio.slice(0, 22)}` : "KAPALI"}
                </div>
              </div>

              {/* Nazar */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 text-xl z-50">
                🧿
              </div>

              {/* Mazot bar */}
              <div
                className="absolute bottom-4 left-3"
                style={{ ...px, fontSize: 10, color: "#aaa" }}
              >
                MAZOT{" "}
                <span style={{ color: fuel < 20 ? "#e74c3c" : "#2ecc71" }}>
                  %{Math.round(fuel)}
                </span>
              </div>

              <div className="absolute bottom-4 right-3 flex gap-1">
                <div
                  style={{
                    width: 22,
                    height: 22,
                    border: "2px solid #666",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    background: signal === "left" ? "#f1c40f" : "transparent",
                    color: signal === "left" ? "#000" : "#666",
                  }}
                >
                  ◀
                </div>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    border: "2px solid #666",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    background: signal === "right" ? "#f1c40f" : "transparent",
                    color: signal === "right" ? "#000" : "#666",
                  }}
                >
                  ▶
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <div
        className="absolute top-2 left-2 z-50 text-white bg-black/80 border border-zinc-600 px-2 py-1"
        style={{ ...px, fontSize: 9 }}
      >
        WASD · 1-5 vites · R · C · Space · Q/E
      </div>
      <div
        className="absolute top-2 right-2 z-50 bg-black/90 border-2 border-zinc-600 p-2"
        style={{ ...px, fontSize: 10, width: 130 }}
      >
        <div style={{ color: "#888" }}>ROTA</div>
        <div style={{ color: "#f1c40f" }}>
          {origin}→{dest}
        </div>
        <div className="mt-1 h-1 bg-zinc-800">
          <div
            className="h-full bg-emerald-500"
            style={{ width: `${prog * 100}%` }}
          />
        </div>
        <div style={{ color: "#888", marginTop: 2 }}>
          {Math.round(km)}km · V{gear}
        </div>
      </div>

      <style jsx global>{`
        @keyframes wipeL {
          0%,
          100% {
            transform: rotate(-28deg);
          }
          50% {
            transform: rotate(28deg);
          }
        }
        @keyframes wipeR {
          0%,
          100% {
            transform: rotate(28deg);
          }
          50% {
            transform: rotate(-28deg);
          }
        }
      `}</style>
    </div>
  );
}