"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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

const GEAR_MAX = [0, 30, 50, 75, 100, 125];
const GEAR_UP = [0, 26, 44, 68, 92];
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
  const [ui, setUi] = useState({
    speed: 0,
    gear: 1,
    fuel: 75,
    km: 160,
    prog: 0,
    signal: "none" as "none" | "left" | "right",
    wiper: false,
    wet: 0.35,
    radioOn: true,
    radio: RADIO[0],
    gearFlash: false,
    needUp: false,
  });
  const [lane, setLane] = useState(0);
  const [steer, setSteer] = useState(0);
  const [cars, setCars] = useState<Car[]>([]);
  const [sides, setSides] = useState<Side[]>([]);
  const [dash, setDash] = useState(0);
  const [barrierPhase, setBarrierPhase] = useState(0);
  const [skyShift, setSkyShift] = useState(0);

  // Fizik — ref (stale closure yok)
  const phys = useRef({
    speed: 0,
    want: 0,
    gear: 1,
    lane: 0,
    fuel: 75,
    km: 160,
    prog: 0,
    wet: 0.35,
    wiper: false,
    signal: "none" as "none" | "left" | "right",
    gas: 0, // -1 | 0 | 1
    steer: 0, // -1 | 0 | 1
  });
  const keys = useRef<Record<string, boolean>>({});
  const drops = useRef(
    Array.from({ length: 36 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 55,
      s: 0.5 + Math.random(),
    }))
  );

  const setGear = useCallback((g: number) => {
    phys.current.gear = g;
    setUi((u) => ({ ...u, gear: g, gearFlash: true }));
    setTimeout(() => setUi((u) => ({ ...u, gearFlash: false })), 280);
  }, []);

  // Klavye
  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keys.current[k] = true;
      if (k === "c")
        setCam((c) =>
          c === "cockpit" ? "hood" : c === "hood" ? "top" : "cockpit"
        );
      if (k === "q") {
        phys.current.signal =
          phys.current.signal === "left" ? "none" : "left";
      }
      if (k === "e") {
        phys.current.signal =
          phys.current.signal === "right" ? "none" : "right";
      }
      if (e.key === " ") {
        e.preventDefault();
        phys.current.wiper = !phys.current.wiper;
      }
      if (["1", "2", "3", "4", "5"].includes(k)) setGear(Number(k));
      if (k === "r") {
        setUi((u) => ({
          ...u,
          radioOn: !u.radioOn,
          radio: RADIO[Math.floor(Math.random() * RADIO.length)],
        }));
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
  }, [setGear]);

  // Ana fizik döngüsü — tek sefer mount
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let spawnAcc = 0;

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const p = phys.current;

      // Klavye → gaz / direksiyon
      let gas = p.gas;
      let st = p.steer;
      if (keys.current["w"] || keys.current["arrowup"]) gas = 1;
      else if (keys.current["s"] || keys.current["arrowdown"]) gas = -1;
      else if (p.gas === 0) gas = 0;

      if (keys.current["a"] || keys.current["arrowleft"]) st = -1;
      else if (keys.current["d"] || keys.current["arrowright"]) st = 1;
      else if (p.steer === 0) st = 0;

      // Mobil butonlar p.gas / p.steer ile basılı kalır
      if (p.gas !== 0) gas = p.gas;
      if (p.steer !== 0) st = p.steer;

      const cap = GEAR_MAX[p.gear] ?? 30;
      if (gas > 0) p.want = Math.min(cap, p.want + 22 * dt);
      else if (gas < 0) p.want = Math.max(0, p.want - 35 * dt);
      else p.want = Math.max(0, p.want - 5 * dt);

      p.speed += (Math.min(p.want, cap) - p.speed) * Math.min(1, 2.4 * dt);
      if (p.speed < 0.15) p.speed = 0;

      p.lane = Math.max(-0.95, Math.min(0.95, p.lane + st * 1.35 * dt));
      const steerVis = st * 16;

      if (p.speed > 1) {
        p.km = Math.max(0, p.km - p.speed * dt * 0.016);
        p.fuel = Math.max(0, p.fuel - p.speed * dt * 0.005);
        p.prog = Math.min(1, p.prog + p.speed * dt * 0.00012);
      }

      p.wet = Math.max(
        0,
        Math.min(0.85, p.wet + 0.02 * dt - (p.wiper ? 0.6 * dt : 0))
      );

      drops.current = drops.current.map((d) => {
        if (p.wiper) {
          return {
            ...d,
            y: d.y - 60 * dt,
            x: d.x + (d.x < 50 ? -20 : 20) * dt,
          };
        }
        let y = d.y + 11 * dt * d.s;
        let x = d.x;
        if (y > 58) {
          y = -2;
          x = Math.random() * 100;
        }
        return { ...d, x, y };
      });

      const needUp =
        p.gear < 5 &&
        p.speed >= (GEAR_UP[p.gear] ?? 999) &&
        p.want >= cap - 2;

      // UI throttle ~20fps
      setUi((u) => ({
        ...u,
        speed: p.speed,
        gear: p.gear,
        fuel: p.fuel,
        km: p.km,
        prog: p.prog,
        wet: p.wet,
        wiper: p.wiper,
        signal: p.signal,
        needUp,
      }));
      setLane(p.lane);
      setSteer(steerVis);
      setDash((d) => (d + p.speed * dt * 2.5) % 28);
      setBarrierPhase((b) => (b + p.speed * dt * 3.2) % 16);
      setSkyShift((s) => (s + p.speed * dt * 0.2) % 120);

      spawnAcc += dt;
      if (spawnAcc > 0.35) {
        spawnAcc = 0;
        setCars((prev) => {
          let n = prev
            .map((c) => ({
              ...c,
              z: c.z + (0.35 + p.speed * 0.012) * 18,
            }))
            .filter((c) => c.z < 100);
          if (Math.random() < 0.45 && n.length < 7) {
            n.push({
              id: Math.random(),
              z: 4,
              lane: [-0.5, -0.2, 0.2, 0.5][Math.floor(Math.random() * 4)],
              color: ["#e74c3c", "#3498db", "#f1c40f", "#ecf0f1", "#2c3e50"][
                Math.floor(Math.random() * 5)
              ],
              w: 22 + Math.random() * 12,
            });
          }
          return n;
        });
        setSides((prev) => {
          let n = prev
            .map((s) => ({
              ...s,
              z: s.z + (0.4 + p.speed * 0.014) * 18,
            }))
            .filter((s) => s.z < 102);
          if (Math.random() < 0.55 && n.length < 14) {
            const kinds: Side["kind"][] = [
              "tree",
              "tree",
              "house",
              "light",
              "billboard",
            ];
            n.push({
              id: Math.random(),
              z: 6,
              side: Math.random() > 0.5 ? 1 : -1,
              kind: kinds[Math.floor(Math.random() * kinds.length)],
            });
          }
          return n;
        });
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Mobil basınç
  const hold = (field: "gas" | "steer", value: number) => {
    if (field === "gas") phys.current.gas = value;
    else phys.current.steer = value;
  };
  const release = (field: "gas" | "steer") => {
    if (field === "gas") phys.current.gas = 0;
    else phys.current.steer = 0;
  };

  if (!exp || exp.status !== "departed") return null;

  const origin = exp.origin.split(" ")[0];
  const dest = exp.destination.split(" ")[0];
  const shift = lane * 44;

  const proj = (z: number, lat: number) => {
    const t = Math.max(0, Math.min(1, z / 100));
    const scale = 0.08 + t * t * 1.85;
    const y = 26 + t * 52;
    const x = lat * (12 + t * 108) - shift * t;
    return { scale, y, x, o: Math.min(1, z / 11) };
  };

  const px = { fontFamily: "monospace", letterSpacing: "-0.02em" } as const;
  const buildings = [
    28, 42, 22, 48, 34, 26, 40, 30, 36, 44, 24, 38,
  ];

  return (
    <div
      className="fixed inset-0 z-40 overflow-hidden select-none touch-none"
      style={{ imageRendering: "pixelated", background: "#0a0e18" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #0b1020 0%, #1a2744 45%, #1e2a20 100%)",
        }}
      />

      {/* Şehir */}
      <div
        className="absolute left-0 right-0 flex items-end justify-center gap-[2px] pointer-events-none"
        style={{
          top: "6%",
          height: 52,
          transform: `translateX(${-skyShift * 0.7}px)`,
        }}
      >
        {[...buildings, ...buildings].map((h, i) => (
          <div
            key={i}
            style={{
              width: 12 + (i % 3) * 4,
              height: h,
              background: i % 2 ? "#1a2332" : "#243044",
              position: "relative",
            }}
          >
            {i % 2 === 0 && (
              <>
                <div
                  style={{
                    position: "absolute",
                    left: 3,
                    top: 6,
                    width: 2,
                    height: 2,
                    background: "#f5c542",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 8,
                    top: 14,
                    width: 2,
                    height: 2,
                    background: "#f0a020",
                  }}
                />
              </>
            )}
          </div>
        ))}
      </div>

      {/* Yol */}
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
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: "22%",
            width: "165%",
            height: "65%",
            background: `
              repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px),
              linear-gradient(to bottom, #4a4a52, #2a2a30)
            `,
            clipPath: "polygon(44% 0%, 56% 0%, 100% 100%, 0% 100%)",
            transform: `translateX(${-shift * 0.2}px)`,
          }}
        />

        {Array.from({ length: 12 }).map((_, i) => {
          const z = (i * 8.5 + dash) % 100;
          const { scale, y, o } = proj(z, 0);
          return (
            <div
              key={`d${i}`}
              className="absolute left-1/2"
              style={{
                top: `${y}%`,
                width: Math.max(3, 5 * scale),
                height: Math.max(5, 12 * scale),
                background: "#e8e86a",
                transform: `translateX(calc(-50% + ${-shift * (z / 100)}px))`,
                opacity: o,
              }}
            />
          );
        })}

        {Array.from({ length: 12 }).map((_, i) => {
          const z = (i * 8 + barrierPhase * 2) % 100;
          const stripe = Math.floor(i + barrierPhase) % 2 === 0;
          return ([-1.12, 1.12] as const).map((side) => {
            const { scale, y, x, o } = proj(z, side);
            return (
              <div
                key={`b${i}${side}`}
                className="absolute"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `${y}%`,
                  width: Math.max(4, 8 * scale),
                  height: Math.max(6, 12 * scale),
                  background: stripe ? "#f1c40f" : "#ecf0f1",
                  transform: "translate(-50%, -50%)",
                  opacity: o,
                  zIndex: Math.floor(z),
                }}
              />
            );
          });
        })}

        {sides.map((s) => {
          const { scale, y, x, o } = proj(s.z, s.side * 1.5);
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
                    height: 14 * scale,
                    margin: "0 auto",
                    background: "#5d4037",
                  }}
                />
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: `${12 * scale}px solid transparent`,
                    borderRight: `${12 * scale}px solid transparent`,
                    borderBottom: `${24 * scale}px solid #1b5e20`,
                    marginLeft: -12 * scale,
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
                  width: 30 * scale,
                  height: 24 * scale,
                  background: "#6d4c41",
                  transform: "translate(-50%, -90%)",
                  opacity: o,
                  zIndex: Math.floor(s.z),
                  boxShadow: `inset -3px 0 0 #4e342e`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 5 * scale,
                    top: 6 * scale,
                    width: 6 * scale,
                    height: 6 * scale,
                    background: "#ffe082",
                  }}
                />
              </div>
            );
          }
          return (
            <div
              key={s.id}
              className="absolute"
              style={{
                left,
                top: `${y}%`,
                width: 3 * scale,
                height: 26 * scale,
                background: "#546e7a",
                transform: "translate(-50%, -100%)",
                opacity: o,
                zIndex: Math.floor(s.z),
              }}
            />
          );
        })}

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
                zIndex: Math.floor(c.z + 20),
              }}
            >
              <div
                style={{
                  width: c.w * scale,
                  height: 26 * scale,
                  background: c.color,
                  boxShadow: "inset -3px 0 0 #0005",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "12%",
                    left: "12%",
                    right: "12%",
                    height: "30%",
                    background: "#81d4fa",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Damlalar */}
      {ui.wet > 0.08 &&
        drops.current.map((d) => (
          <div
            key={d.id}
            className="absolute z-20 pointer-events-none rounded-full"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: 2 * d.s,
              height: 4 * d.s,
              background: "rgba(200,220,255,0.5)",
              opacity: ui.wiper ? ui.wet * 0.3 : ui.wet * 0.85,
            }}
          />
        ))}

      {ui.needUp && (
        <div
          className="absolute top-[32%] left-1/2 -translate-x-1/2 z-50 px-3 py-1 bg-red-800 text-yellow-300 border-2 border-yellow-400 text-xs font-bold animate-pulse"
          style={px}
        >
          VİTES {ui.gear + 1} (tuş {ui.gear + 1})
        </div>
      )}

      {/* Kokpit */}
      {cam !== "top" && (
        <div
          className="absolute bottom-0 inset-x-0 z-40 pointer-events-none"
          style={{ height: cam === "hood" ? "14%" : "42%" }}
        >
          {cam === "cockpit" && (
            <>
              <div
                className="absolute bottom-0 inset-x-0 h-full"
                style={{
                  background:
                    "linear-gradient(to top, #1a1c22, #3a3e48 55%, #2a2e36)",
                  clipPath:
                    "polygon(0% 38%, 5% 10%, 12% 0%, 88% 0%, 95% 10%, 100% 38%, 100% 100%, 0% 100%)",
                }}
              />
              <div
                className="absolute bottom-[4%] left-1/2 -translate-x-1/2"
                style={{ transform: `rotate(${steer}deg)` }}
              >
                <div
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    border: "12px solid #5d4037",
                    background: "#2c3038",
                    boxShadow: "inset 0 0 0 5px #3e2723",
                    position: "relative",
                  }}
                >
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "#111",
                      border: "2px solid #c9a227",
                      color: "#c9a227",
                      fontSize: 10,
                      fontWeight: 900,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ★
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 4,
                      top: "36%",
                      width: 24,
                      height: 32,
                      background: "#d4a574",
                      borderRadius: 5,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: 4,
                      top: "36%",
                      width: 24,
                      height: 32,
                      background: "#d4a574",
                      borderRadius: 5,
                    }}
                  />
                </div>
              </div>
              <div
                className="absolute bottom-[40%] left-[8%]"
                style={{
                  ...px,
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "#0a0a0a",
                  border: "3px solid #555",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: "#e8e86a", fontSize: 15 }}>
                  {Math.round(ui.speed)}
                </span>
                <span style={{ color: "#666", fontSize: 7 }}>km/s</span>
              </div>
              <div
                className="absolute bottom-[40%] left-[24%]"
                style={{
                  ...px,
                  background: ui.gearFlash ? "#f1c40f" : "#111",
                  border: "2px solid #666",
                  padding: "3px 7px",
                  color: ui.gearFlash ? "#000" : "#f1c40f",
                }}
              >
                <div style={{ fontSize: 7 }}>V</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{ui.gear}</div>
              </div>
              <div
                className="absolute bottom-3 left-2 text-[10px] text-zinc-400"
                style={px}
              >
                MAZOT{" "}
                <span
                  style={{ color: ui.fuel < 20 ? "#e74c3c" : "#2ecc71" }}
                >
                  %{Math.round(ui.fuel)}
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* HUD */}
      <div
        className="absolute top-1 left-1 z-50 text-white bg-black/85 border border-zinc-600 px-2 py-0.5 text-[8px] sm:text-[9px]"
        style={px}
      >
        W gaz · 1-5 vites · R radyo
      </div>
      <div
        className="absolute top-1 right-1 z-50 bg-black/90 border border-zinc-600 p-1.5 text-[9px] w-28 sm:w-32"
        style={px}
      >
        <div className="text-amber-400">
          {origin}→{dest}
        </div>
        <div className="h-1 bg-zinc-800 mt-1">
          <div
            className="h-full bg-emerald-500"
            style={{ width: `${ui.prog * 100}%` }}
          />
        </div>
        <div className="text-zinc-500">
          {Math.round(ui.km)}km V{ui.gear}
        </div>
      </div>

      {/* ===== MOBİL KONTROL ===== */}
      <div className="absolute bottom-0 inset-x-0 z-50 flex justify-between items-end p-3 pb-4 pointer-events-none md:pb-6">
        <div className="flex gap-2 pointer-events-auto">
          <button
            type="button"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/70 border-2 border-zinc-500 text-white text-xl active:bg-amber-600/80"
            onTouchStart={(e) => {
              e.preventDefault();
              hold("steer", -1);
            }}
            onTouchEnd={() => release("steer")}
            onMouseDown={() => hold("steer", -1)}
            onMouseUp={() => release("steer")}
            onMouseLeave={() => release("steer")}
          >
            ◀
          </button>
          <button
            type="button"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/70 border-2 border-zinc-500 text-white text-xl active:bg-amber-600/80"
            onTouchStart={(e) => {
              e.preventDefault();
              hold("steer", 1);
            }}
            onTouchEnd={() => release("steer")}
            onMouseDown={() => hold("steer", 1)}
            onMouseUp={() => release("steer")}
            onMouseLeave={() => release("steer")}
          >
            ▶
          </button>
        </div>
        <div className="flex flex-col gap-2 pointer-events-auto">
          <div className="flex gap-1 justify-end">
            {[1, 2, 3, 4, 5].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGear(g)}
                className={`w-8 h-8 rounded text-xs font-bold border ${
                  ui.gear === g
                    ? "bg-amber-500 text-black border-amber-300"
                    : "bg-black/70 text-zinc-300 border-zinc-600"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="w-20 h-16 sm:w-24 sm:h-20 rounded-xl bg-emerald-800/90 border-2 border-emerald-500 text-white font-bold text-sm active:bg-emerald-500 active:text-black"
            onTouchStart={(e) => {
              e.preventDefault();
              hold("gas", 1);
            }}
            onTouchEnd={() => release("gas")}
            onMouseDown={() => hold("gas", 1)}
            onMouseUp={() => release("gas")}
            onMouseLeave={() => release("gas")}
          >
            GAZ
          </button>
          <button
            type="button"
            className="w-20 h-10 rounded-lg bg-black/70 border border-zinc-500 text-zinc-300 text-xs"
            onTouchStart={(e) => {
              e.preventDefault();
              hold("gas", -1);
            }}
            onTouchEnd={() => release("gas")}
            onMouseDown={() => hold("gas", -1)}
            onMouseUp={() => release("gas")}
            onMouseLeave={() => release("gas")}
          >
            FREN
          </button>
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
