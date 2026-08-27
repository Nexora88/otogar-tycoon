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
  kind: "car" | "truck" | "bus" | "police";
  color: string;
}

interface Scenery {
  id: number;
  z: number;
  side: -1 | 1;
  kind: "tree" | "house" | "apartment" | "pole" | "station" | "shop" | "fence";
}

const SIGNS = [
  "KEŞAN OTOBÜS TERMİNALİ",
  "MUSTAFA KEMAL'İN ASKERLERİYİZ",
  "ANKARA YÖNÜ · 160 KM",
  "HIZ SINIRI 90",
  "DİNLENME / BENZİNLİK 8 KM",
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
  const [signal, setSignal] = useState<"none" | "left" | "right">("none");
  const [wiper, setWiper] = useState(false);
  const [fuel, setFuel] = useState(70);
  const [km, setKm] = useState(170);
  const [prog, setProg] = useState(0);
  const [ents, setEnts] = useState<Ent[]>([]);
  const [scene, setScene] = useState<Scenery[]>([]);
  const [sign, setSign] = useState(SIGNS[0]);
  const [showSign, setShowSign] = useState(false);
  const [atStation, setAtStation] = useState(false);
  const [dash, setDash] = useState(0);
  const keys = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
      const k = e.key.toLowerCase();
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
      if (k === "f" && atStation) {
        setFuel((f) => Math.min(100, f + 25));
        setAtStation(false);
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
  }, [atStation]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (keys.current["w"] || keys.current["arrowup"])
        setWant((w) => Math.min(100, w + 22 * dt));
      else if (keys.current["s"] || keys.current["arrowdown"])
        setWant((w) => Math.max(0, w - 35 * dt));
      else setWant((w) => Math.max(0, w - 6 * dt));

      setSpeed((s) => s + (want - s) * Math.min(1, 2.5 * dt));

      let dir = 0;
      if (keys.current["a"] || keys.current["arrowleft"]) dir = -1;
      if (keys.current["d"] || keys.current["arrowright"]) dir = 1;
      setSteer(dir * 14);
      setLane((L) => Math.max(-1, Math.min(1, L + dir * 1.4 * dt)));

      const sp = want;
      setDash((d) => (d + sp * dt * 2) % 36);
      if (sp > 2) {
        setKm((k) => Math.max(0, k - sp * dt * 0.018));
        setFuel((f) => Math.max(0, f - sp * dt * 0.007));
        setProg((p) => Math.min(1, p + sp * dt * 0.00012));
      }

      setEnts((prev) => {
        let n = prev
          .map((e) => ({ ...e, z: e.z + (0.4 + sp * 0.01) * dt * 55 }))
          .filter((e) => e.z < 102);
        if (Math.random() < 0.035 && n.length < 8) {
          const kinds: Ent["kind"][] = ["car", "car", "truck", "bus", "police"];
          const kind = kinds[Math.floor(Math.random() * kinds.length)];
          n.push({
            id: Math.random(),
            z: 4,
            lane: [-0.65, 0, 0.65][Math.floor(Math.random() * 3)],
            kind,
            color:
              kind === "police"
                ? "#1e3a8a"
                : kind === "bus"
                ? "#ca8a04"
                : ["#dc2626", "#2563eb", "#78716c", "#fafafa", "#171717"][
                    Math.floor(Math.random() * 5)
                  ],
          });
        }
        return n;
      });

      setScene((prev) => {
        let n = prev
          .map((s) => ({ ...s, z: s.z + (0.45 + sp * 0.012) * dt * 55 }))
          .filter((s) => s.z < 105);
        if (Math.random() < 0.07 && n.length < 16) {
          const kinds: Scenery["kind"][] = [
            "tree",
            "tree",
            "house",
            "apartment",
            "pole",
            "shop",
            "fence",
            "station",
          ];
          const kind = kinds[Math.floor(Math.random() * kinds.length)];
          n.push({
            id: Math.random(),
            z: 6,
            side: Math.random() > 0.5 ? 1 : -1,
            kind,
          });
          if (kind === "station" && sp < 40) setAtStation(true);
        }
        return n;
      });

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [want]);

  useEffect(() => {
    const t = setInterval(() => {
      setSign(SIGNS[Math.floor(Math.random() * SIGNS.length)]);
      setShowSign(true);
      setTimeout(() => setShowSign(false), 3800);
    }, 11000);
    return () => clearInterval(t);
  }, []);

  if (!exp || exp.status !== "departed") return null;

  const origin = exp.origin.split(" ")[0];
  const dest = exp.destination.split(" ")[0];
  const shift = lane * 50;

  const proj = (z: number, lat: number) => {
    const t = Math.max(0, Math.min(1, z / 100));
    const scale = 0.12 + t * t * 1.75;
    const y = 30 + t * 48;
    const x = lat * (16 + t * 105) - shift * t;
    return { scale, y, x, o: Math.min(1, z / 14) };
  };

  const sky =
    "linear-gradient(to bottom, #5b9bd5 0%, #87b8d8 40%, #c9b896 70%, #8a9a6a 100%)";

  return (
    <div className="fixed inset-0 z-40 overflow-hidden select-none" style={{ background: sky }}>
      {/* Uzak şehir silüeti */}
      <div className="absolute inset-x-0 top-[18%] h-28 flex items-end justify-center gap-1 opacity-40 pointer-events-none">
        {[40, 56, 48, 64, 44, 52, 36, 60].map((h, i) => (
          <div
            key={i}
            className="bg-[#4a5560] w-8 md:w-10"
            style={{ height: h }}
          />
        ))}
      </div>

      {/* Dünya */}
      <div
        className="absolute inset-0"
        style={{
          transform:
            cam === "top"
              ? "perspective(480px) rotateX(58deg) translateY(15%)"
              : cam === "hood"
              ? "perspective(820px) rotateX(5deg)"
              : "perspective(920px) rotateX(10deg)",
          transformOrigin: "50% 100%",
        }}
      >
        {/* Yol */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: "28%",
            width: "150%",
            height: "58%",
            background: "linear-gradient(to bottom, #7a7a7a, #333)",
            clipPath: "polygon(43% 0%, 57% 0%, 100% 100%, 0% 100%)",
            transform: `translateX(${-shift * 0.25}px) rotateZ(${steer * 0.12}deg)`,
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.3)",
          }}
        />
        {/* Kenar çizgileri hissi */}
        <div
          className="absolute left-1/2 bg-white/80"
          style={{
            top: "28%",
            width: 2,
            height: "55%",
            transform: `translateX(calc(-50% - 22% + ${-shift * 0.2}px)) skewX(18deg)`,
            transformOrigin: "top",
            opacity: 0.5,
          }}
        />
        <div
          className="absolute left-1/2 bg-white/80"
          style={{
            top: "28%",
            width: 2,
            height: "55%",
            transform: `translateX(calc(-50% + 22% + ${-shift * 0.2}px)) skewX(-18deg)`,
            transformOrigin: "top",
            opacity: 0.5,
          }}
        />

        {/* Şerit */}
        {Array.from({ length: 11 }).map((_, i) => {
          const z = (i * 9 + dash) % 100;
          const { scale, y, o } = proj(z, 0);
          return (
            <div
              key={i}
              className="absolute left-1/2 bg-yellow-400"
              style={{
                top: `${y}%`,
                width: Math.max(3, 5 * scale),
                height: Math.max(5, 14 * scale),
                transform: `translateX(calc(-50% + ${-shift * (z / 100)}px))`,
                opacity: o,
                borderRadius: 1,
              }}
            />
          );
        })}

        {/* Scenery */}
        {scene.map((s) => {
          const { scale, y, x, o } = proj(s.z, s.side * 1.4);
          const left = `calc(50% + ${x}px)`;
          const base = {
            left,
            top: `${y}%`,
            transform: "translate(-50%, -85%)",
            opacity: o,
            zIndex: Math.floor(s.z),
          } as const;

          if (s.kind === "tree") {
            return (
              <div key={s.id} className="absolute" style={base}>
                <div
                  className="mx-auto bg-[#4a3728]"
                  style={{ width: 4 * scale, height: 16 * scale }}
                />
                <div
                  className="rounded-full bg-[#2d5a27]"
                  style={{
                    width: 24 * scale,
                    height: 22 * scale,
                    marginLeft: -10 * scale,
                    marginTop: -5 * scale,
                    border: "1px solid #1a3318",
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
                    width: 38 * scale,
                    height: 30 * scale,
                    background: "#a0522d",
                    border: "1px solid #5c2e0b",
                    boxShadow: `${4 * scale}px ${4 * scale}px 0 rgba(0,0,0,0.25)`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: 9 * scale,
                      height: 9 * scale,
                      left: 5 * scale,
                      top: 7 * scale,
                      background: "#7dd3fc99",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      width: 9 * scale,
                      height: 9 * scale,
                      right: 5 * scale,
                      top: 7 * scale,
                      background: "#7dd3fc99",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 44 * scale,
                    height: 9 * scale,
                    marginLeft: -3 * scale,
                    background: "#3f3f46",
                  }}
                />
              </div>
            );
          }
          if (s.kind === "apartment") {
            return (
              <div key={s.id} className="absolute" style={base}>
                <div
                  style={{
                    width: 34 * scale,
                    height: 48 * scale,
                    background: "#94a3b8",
                    border: "1px solid #64748b",
                    boxShadow: `${4 * scale}px ${4 * scale}px 0 rgba(0,0,0,0.2)`,
                  }}
                >
                  {[0, 1, 2].map((r) => (
                    <div key={r} className="flex gap-[2px] justify-center mt-1">
                      <div
                        style={{
                          width: 6 * scale,
                          height: 5 * scale,
                          background: "#fde68a66",
                        }}
                      />
                      <div
                        style={{
                          width: 6 * scale,
                          height: 5 * scale,
                          background: "#fde68a66",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (s.kind === "station") {
            return (
              <div key={s.id} className="absolute" style={base}>
                <div
                  style={{
                    width: 70 * scale,
                    height: 28 * scale,
                    background: "#dc2626",
                    border: "2px solid #fff",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: -10 * scale,
                      left: 4 * scale,
                      right: 4 * scale,
                      height: 12 * scale,
                      background: "#e5e5e5",
                      borderRadius: 2,
                    }}
                  />
                  <div
                    className="text-white font-black text-center"
                    style={{ fontSize: Math.max(5, 8 * scale), marginTop: 8 * scale }}
                  >
                    POMPA
                  </div>
                </div>
                <div
                  className="bg-yellow-400 text-black font-bold text-center border border-black"
                  style={{ fontSize: Math.max(5, 7 * scale) }}
                >
                  BENZİNLİK
                </div>
              </div>
            );
          }
          if (s.kind === "shop") {
            return (
              <div key={s.id} className="absolute" style={base}>
                <div
                  style={{
                    width: 32 * scale,
                    height: 20 * scale,
                    background: "#b45309",
                  }}
                />
                <div
                  className="bg-red-700 text-white text-center"
                  style={{ fontSize: Math.max(5, 7 * scale) }}
                >
                  Büfe
                </div>
              </div>
            );
          }
          if (s.kind === "fence") {
            return (
              <div
                key={s.id}
                className="absolute bg-zinc-500"
                style={{
                  ...base,
                  width: 28 * scale,
                  height: 4 * scale,
                  transform: "translate(-50%, 0)",
                }}
              />
            );
          }
          return (
            <div
              key={s.id}
              className="absolute bg-zinc-500"
              style={{
                left,
                top: `${y}%`,
                width: 3 * scale,
                height: 34 * scale,
                transform: "translate(-50%, -100%)",
                opacity: o,
                zIndex: Math.floor(s.z),
              }}
            />
          );
        })}

        {/* Trafik */}
        {ents.map((e) => {
          const { scale, y, x, o } = proj(e.z, e.lane);
          const w =
            (e.kind === "truck" ? 40 : e.kind === "bus" ? 36 : 26) * scale;
          const h =
            (e.kind === "truck" ? 52 : e.kind === "bus" ? 48 : 34) * scale;
          return (
            <div
              key={e.id}
              className="absolute"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `${y}%`,
                transform: "translate(-50%, -40%)",
                opacity: o,
                zIndex: Math.floor(e.z + 25),
              }}
            >
              <div
                style={{
                  width: w,
                  height: h,
                  background: e.color,
                  border: "1px solid #111",
                  borderRadius: 2,
                  boxShadow: "3px 4px 0 rgba(0,0,0,0.3)",
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
                    background: "linear-gradient(#93c5fd,#1e40af)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "10%",
                    left: "10%",
                    width: "16%",
                    height: "12%",
                    background: "#fde68a",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "10%",
                    right: "10%",
                    width: "16%",
                    height: "12%",
                    background: "#fde68a",
                  }}
                />
                {e.kind === "police" && (
                  <div className="absolute top-0 inset-x-0 h-[10%] bg-red-600" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showSign && (
        <div className="absolute top-[14%] left-1/2 -translate-x-1/2 z-30 px-3 py-1 bg-yellow-400 text-black border-[3px] border-black font-black text-[11px] md:text-sm shadow-xl whitespace-nowrap">
          {sign}
        </div>
      )}

      {atStation && (
        <div className="absolute top-[42%] left-1/2 -translate-x-1/2 z-50 bg-black/85 border-2 border-amber-500 px-4 py-2 rounded-lg text-center">
          <div className="text-amber-400 font-bold text-sm">BENZİNLİK</div>
          <div className="text-zinc-300 text-xs">F tuşu — dolum +%25</div>
        </div>
      )}

      {/* Aynalar */}
      {cam === "cockpit" && (
        <>
          {(["left", "right"] as const).map((side) => (
            <div
              key={side}
              className={`absolute top-12 z-40 w-28 h-[4.5rem] rounded-md border-2 border-zinc-400 overflow-hidden shadow-xl ${
                side === "left" ? "left-3" : "right-3"
              }`}
              style={{
                background: "linear-gradient(to bottom, #6d8f6a, #3d4f3a)",
              }}
            >
              <div className="text-[7px] text-center text-white/80 bg-black/50">
                {side === "left" ? "SOL AYNA" : "SAĞ AYNA"}
              </div>
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[45%] h-[65%] bg-zinc-600"
                style={{
                  clipPath: "polygon(28% 0%, 72% 0%, 100% 100%, 0% 100%)",
                }}
              />
              {ents[0] && (
                <div
                  className="absolute w-4 h-5 border border-black/50 rounded-sm"
                  style={{
                    background: ents[0].color,
                    bottom: 8,
                    [side === "left" ? "left" : "right"]: 10,
                  }}
                />
              )}
            </div>
          ))}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 z-40 w-36 h-14 rounded border-2 border-zinc-500 bg-zinc-800 overflow-hidden">
            <div className="text-[7px] text-center text-zinc-500">ORTA DİKİZ</div>
            <div className="h-full bg-gradient-to-b from-zinc-600 to-zinc-900 flex items-end justify-center pb-1 gap-1">
              <div className="w-6 h-2.5 bg-zinc-500 rounded-sm" />
              <div className="w-4 h-3 bg-zinc-400 rounded-sm opacity-70" />
            </div>
          </div>
        </>
      )}

      {/* Kokpit BMC */}
      {cam !== "top" && (
        <div
          className="absolute bottom-0 inset-x-0 z-40 pointer-events-none"
          style={{ height: cam === "hood" ? "18%" : "40%" }}
        >
          {cam === "cockpit" && (
            <>
              <div
                className="absolute bottom-0 inset-x-0 h-[88%]"
                style={{
                  background: "linear-gradient(to top, #1a1a1d 0%, #3d3d44 100%)",
                  clipPath:
                    "polygon(0 30%, 6% 0, 94% 0, 100% 30%, 100% 100%, 0 100%)",
                  borderTop: "2px solid #666",
                }}
              />
              <div className="absolute bottom-[55%] left-[7%] grid grid-cols-4 gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-5 h-3 rounded-sm bg-zinc-600 border border-zinc-500"
                  />
                ))}
              </div>
              <div className="absolute bottom-[55%] right-[7%] flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                <div className="w-3 h-3 rounded-full bg-red-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-600" />
              </div>
              <div className="absolute bottom-[50%] left-1/2 -translate-x-1/2 w-28 h-22 flex flex-col items-center">
                <div className="w-24 h-16 rounded-full bg-zinc-950 border-4 border-zinc-600 flex flex-col items-center justify-center shadow-inner">
                  <span className="text-3xl font-mono text-amber-400 leading-none">
                    {Math.round(speed)}
                  </span>
                  <span className="text-[8px] text-zinc-500">km/s</span>
                </div>
              </div>
              <div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[10.5rem] h-[10.5rem] rounded-full border-[13px] border-zinc-500 bg-zinc-800"
                style={{ transform: `rotate(${steer}deg)` }}
              >
                <div className="absolute inset-3 rounded-full border border-zinc-600" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-zinc-900 border-2 border-blue-500 flex items-center justify-center">
                  <span className="text-[10px] font-black text-blue-400">BMC</span>
                </div>
              </div>
              <div className="absolute right-8 bottom-[42%] w-2.5 h-28 bg-yellow-400 rounded-full shadow-lg" />
              <div className="absolute bottom-6 left-5 bg-black/90 border border-zinc-600 rounded px-2 py-1 text-[10px]">
                MAZOT{" "}
                <span className={fuel < 20 ? "text-red-400" : "text-emerald-400"}>
                  %{Math.round(fuel)}
                </span>
              </div>
              <div className="absolute bottom-6 right-5 flex gap-2">
                <div
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs ${
                    signal === "left"
                      ? "bg-amber-400 border-amber-200 text-black"
                      : "bg-zinc-800 border-zinc-600 text-zinc-600"
                  }`}
                >
                  ◀
                </div>
                <div
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs ${
                    signal === "right"
                      ? "bg-amber-400 border-amber-200 text-black"
                      : "bg-zinc-800 border-zinc-600 text-zinc-600"
                  }`}
                >
                  ▶
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="absolute top-2 left-2 z-50 text-[9px] text-white bg-black/75 px-2 py-1 rounded">
        WASD · C kamera · Q/E · Space · F istasyon
      </div>
      <div className="absolute top-2 right-2 z-50 w-36 bg-black/85 border border-zinc-600 rounded-lg p-2 text-[10px]">
        <div className="text-zinc-500">ROTA</div>
        <div className="text-amber-400 font-mono">
          {origin} → {dest}
        </div>
        <div className="mt-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500" style={{ width: `${prog * 100}%` }} />
        </div>
        <div className="text-zinc-400 mt-0.5">{Math.round(km)} km</div>
      </div>
    </div>
  );
}