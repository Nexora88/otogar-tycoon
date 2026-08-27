"use client";

import { useEffect, useState, useRef } from "react";
import { useGameStore } from "@/store/gameStore";

interface DrivingViewProps {
  expeditionId: string;
}

type CamMode = "cockpit" | "hood" | "top";

interface Drop {
  id: number;
  x: number;
  y: number;
  s: number;
}

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
  kind: "tree" | "building" | "station" | "pole";
}

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
  const [wet, setWet] = useState(0.55); // 0 kuru, 1 sırılsıklam cam
  const [drops, setDrops] = useState<Drop[]>([]);
  const [fuel, setFuel] = useState(68);
  const [km, setKm] = useState(165);
  const [prog, setProg] = useState(0);
  const [ents, setEnts] = useState<Ent[]>([]);
  const [scene, setScene] = useState<Scenery[]>([]);
  const [dash, setDash] = useState(0);
  const [atPump, setAtPump] = useState(false);
  const keys = useRef<Record<string, boolean>>({});

  // Yağmur damlaları üret
  useEffect(() => {
    const init: Drop[] = Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 70,
      s: 0.6 + Math.random() * 1.4,
    }));
    setDrops(init);
  }, []);

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
      if (k === "f" && atPump) {
        setFuel((f) => Math.min(100, f + 30));
        setAtPump(false);
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
  }, [atPump]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (keys.current["w"] || keys.current["arrowup"])
        setWant((w) => Math.min(100, w + 20 * dt));
      else if (keys.current["s"] || keys.current["arrowdown"])
        setWant((w) => Math.max(0, w - 32 * dt));
      else setWant((w) => Math.max(0, w - 5 * dt));

      setSpeed((s) => s + (want - s) * Math.min(1, 2.2 * dt));

      let dir = 0;
      if (keys.current["a"] || keys.current["arrowleft"]) dir = -1;
      if (keys.current["d"] || keys.current["arrowright"]) dir = 1;
      setSteer(dir * 16);
      setLane((L) => Math.max(-1, Math.min(1, L + dir * 1.3 * dt)));

      const sp = want;
      setDash((d) => (d + sp * dt * 2.2) % 40);
      if (sp > 2) {
        setKm((k) => Math.max(0, k - sp * dt * 0.016));
        setFuel((f) => Math.max(0, f - sp * dt * 0.006));
        setProg((p) => Math.min(1, p + sp * dt * 0.00011));
      }

      // Cam ıslaklığı: yağmur artar, silecek temizler
      setWet((w) => {
        let n = w + 0.04 * dt; // yavaş kirlen / yağmur
        if (wiper) n -= 0.55 * dt; // silecek güçlü siler
        return Math.max(0, Math.min(1, n));
      });

      // Damlalar: silecek varken yukarı süpürülür / kaybolur
      setDrops((prev) =>
        prev.map((d) => {
          if (wiper) {
            return {
              ...d,
              y: d.y - 50 * dt,
              x: d.x + (d.x < 50 ? -15 : 15) * dt,
            };
          }
          return {
            ...d,
            y: d.y + 12 * dt * d.s,
            x: d.x + Math.sin(now / 400 + d.id) * 0.3,
          };
        }).map((d) =>
          d.y > 85 || d.y < -5
            ? { ...d, y: Math.random() * 20 - 5, x: Math.random() * 100 }
            : d
        )
      );

      setEnts((prev) => {
        let n = prev
          .map((e) => ({ ...e, z: e.z + (0.35 + sp * 0.01) * dt * 50 }))
          .filter((e) => e.z < 100);
        if (Math.random() < 0.03 && n.length < 7) {
          n.push({
            id: Math.random(),
            z: 5,
            lane: [-0.6, 0, 0.6][Math.floor(Math.random() * 3)],
            kind: Math.random() > 0.7 ? "truck" : "car",
            color: ["#3b82f6", "#ef4444", "#eab308", "#f8fafc", "#171717"][
              Math.floor(Math.random() * 5)
            ],
          });
        }
        return n;
      });

      setScene((prev) => {
        let n = prev
          .map((s) => ({ ...s, z: s.z + (0.4 + sp * 0.011) * dt * 50 }))
          .filter((s) => s.z < 102);
        if (Math.random() < 0.055 && n.length < 14) {
          const kinds: Scenery["kind"][] = [
            "tree",
            "tree",
            "tree",
            "building",
            "pole",
            "station",
          ];
          const kind = kinds[Math.floor(Math.random() * kinds.length)];
          n.push({
            id: Math.random(),
            z: 7,
            side: Math.random() > 0.5 ? 1 : -1,
            kind,
          });
          if (kind === "station") setAtPump(true);
        }
        return n;
      });

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [want, wiper]);

  if (!exp || exp.status !== "departed") return null;

  const origin = exp.origin.split(" ")[0];
  const dest = exp.destination.split(" ")[0];
  const shift = lane * 48;

  const proj = (z: number, lat: number) => {
    const t = Math.max(0, Math.min(1, z / 100));
    const scale = 0.1 + t * t * 1.8;
    const y = 28 + t * 50;
    const x = lat * (14 + t * 110) - shift * t;
    return { scale, y, x, o: Math.min(1, z / 12) };
  };

  const glassBlur = wet > 0.15 && !wiper ? Math.min(8, wet * 10) : wet * 2;

  return (
    <div className="fixed inset-0 z-40 overflow-hidden select-none bg-[#6a9bc2]">
      {/* === DIŞ DÜNYA (camın arkası) === */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#5a8ab8] via-[#7a9f6a] to-[#5a6b48]" />

        {/* Çam ağacı sırası (referans) */}
        <div className="absolute top-[20%] left-0 right-0 h-24 flex justify-around opacity-70 pointer-events-none">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[40px] border-l-transparent border-r-transparent border-b-[#1b4332]"
              style={{ marginTop: (i % 3) * 6 }}
            />
          ))}
        </div>

        <div
          className="absolute inset-0"
          style={{
            transform:
              cam === "top"
                ? "perspective(500px) rotateX(55deg) translateY(12%)"
                : "perspective(950px) rotateX(8deg)",
            transformOrigin: "50% 100%",
          }}
        >
          {/* Asfalt alan */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: "26%",
              width: "160%",
              height: "60%",
              background: "linear-gradient(to bottom, #8a8a8a, #4a4a4a)",
              clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)",
              transform: `translateX(${-shift * 0.2}px)`,
            }}
          />

          {Array.from({ length: 10 }).map((_, i) => {
            const z = (i * 10 + dash) % 100;
            const { scale, y, o } = proj(z, 0);
            return (
              <div
                key={i}
                className="absolute left-1/2 bg-white/90"
                style={{
                  top: `${y}%`,
                  width: Math.max(2, 4 * scale),
                  height: Math.max(4, 12 * scale),
                  transform: `translateX(calc(-50% + ${-shift * (z / 100)}px))`,
                  opacity: o,
                }}
              />
            );
          })}

          {scene.map((s) => {
            const { scale, y, x, o } = proj(s.z, s.side * 1.45);
            const st = {
              left: `calc(50% + ${x}px)`,
              top: `${y}%`,
              transform: "translate(-50%, -90%)",
              opacity: o,
              zIndex: Math.floor(s.z),
            };
            if (s.kind === "tree") {
              return (
                <div key={s.id} className="absolute" style={st}>
                  <div
                    className="mx-auto bg-[#5c4033]"
                    style={{ width: 4 * scale, height: 14 * scale }}
                  />
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: `${14 * scale}px solid transparent`,
                      borderRight: `${14 * scale}px solid transparent`,
                      borderBottom: `${28 * scale}px solid #2d6a4f`,
                      marginLeft: -14 * scale,
                    }}
                  />
                </div>
              );
            }
            if (s.kind === "station") {
              return (
                <div key={s.id} className="absolute" style={st}>
                  {/* Pompa saçağı */}
                  <div
                    style={{
                      width: 80 * scale,
                      height: 14 * scale,
                      background: "#e5e7eb",
                      borderRadius: 2,
                      position: "relative",
                    }}
                  >
                    <div
                      className="absolute left-2 top-full w-2 bg-yellow-400"
                      style={{ height: 22 * scale }}
                    />
                    <div
                      className="absolute right-2 top-full w-2 bg-yellow-400"
                      style={{ height: 22 * scale }}
                    />
                  </div>
                  <div
                    style={{
                      width: 50 * scale,
                      height: 18 * scale,
                      background: "#3b82f6",
                      marginTop: 4 * scale,
                      marginLeft: 15 * scale,
                    }}
                  />
                  <div
                    className="text-white font-bold text-center bg-blue-800"
                    style={{ fontSize: Math.max(5, 7 * scale) }}
                  >
                    POMPA
                  </div>
                </div>
              );
            }
            if (s.kind === "building") {
              return (
                <div
                  key={s.id}
                  className="absolute bg-slate-500 border border-slate-600"
                  style={{
                    ...st,
                    width: 36 * scale,
                    height: 44 * scale,
                    boxShadow: `${3 * scale}px ${3 * scale}px 0 rgba(0,0,0,0.2)`,
                  }}
                />
              );
            }
            return (
              <div
                key={s.id}
                className="absolute bg-zinc-400"
                style={{
                  left: st.left,
                  top: st.top,
                  width: 3 * scale,
                  height: 32 * scale,
                  transform: "translate(-50%, -100%)",
                  opacity: o,
                  zIndex: Math.floor(s.z),
                }}
              />
            );
          })}

          {ents.map((e) => {
            const { scale, y, x, o } = proj(e.z, e.lane);
            const w = (e.kind === "truck" ? 38 : 26) * scale;
            const h = (e.kind === "truck" ? 48 : 32) * scale;
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
                }}
              >
                <div
                  style={{
                    width: w,
                    height: h,
                    background: e.color,
                    border: "1px solid #222",
                    borderRadius: 3,
                    boxShadow: "2px 3px 0 rgba(0,0,0,0.25)",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "14%",
                      left: "10%",
                      right: "10%",
                      height: "30%",
                      background: "linear-gradient(#bae6fd,#0369a1)",
                      borderRadius: 2,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* === CAM: buğu + damlalar === */}
      <div
        className="absolute inset-0 z-20 pointer-events-none transition-all duration-200"
        style={{
          backdropFilter: glassBlur > 0.5 ? `blur(${glassBlur}px)` : undefined,
          background:
            wet > 0.05
              ? `rgba(180,200,220,${0.08 + wet * 0.2})`
              : "transparent",
        }}
      >
        {drops.map((d) =>
          wet < 0.08 ? null : (
            <div
              key={d.id}
              className="absolute rounded-full bg-white/40 border border-white/20"
              style={{
                left: `${d.x}%`,
                top: `${d.y}%`,
                width: 3 * d.s,
                height: 5 * d.s,
                opacity: wet * 0.85,
                boxShadow: "0 0 2px rgba(255,255,255,0.5)",
              }}
            />
          )
        )}
      </div>

      {/* Silecek kolları */}
      {wiper && (
        <>
          <div
            className="absolute z-30 pointer-events-none origin-bottom"
            style={{
              left: "15%",
              top: "8%",
              width: "40%",
              height: "55%",
              animation: "wipeL 0.85s ease-in-out infinite",
            }}
          >
            <div className="w-full h-[3px] bg-zinc-300/90 rounded shadow mt-[80%]" />
          </div>
          <div
            className="absolute z-30 pointer-events-none origin-bottom"
            style={{
              right: "15%",
              top: "8%",
              width: "40%",
              height: "55%",
              animation: "wipeR 0.85s ease-in-out infinite",
            }}
          >
            <div className="w-full h-[3px] bg-zinc-300/90 rounded shadow mt-[80%]" />
          </div>
        </>
      )}

      {atPump && (
        <div className="absolute top-[38%] left-1/2 -translate-x-1/2 z-50 bg-black/80 border border-blue-400 px-4 py-2 rounded text-center">
          <div className="text-blue-300 font-bold text-sm">Benzinlik</div>
          <div className="text-xs text-zinc-300">F — dolum</div>
        </div>
      )}

      {/* === KOKPİT (referans: gri modern) === */}
      {cam !== "top" && (
        <div
          className="absolute bottom-0 inset-x-0 z-40 pointer-events-none"
          style={{ height: cam === "hood" ? "16%" : "42%" }}
        >
          {cam === "cockpit" && (
            <>
              {/* Ana torpido — açık gri */}
              <div
                className="absolute bottom-0 inset-x-0 h-[92%]"
                style={{
                  background: "linear-gradient(to top, #3a3d42, #6a6e75 55%, #8a8e95)",
                  clipPath:
                    "polygon(0% 35%, 5% 8%, 12% 0%, 88% 0%, 95% 8%, 100% 35%, 100% 100%, 0% 100%)",
                  boxShadow: "0 -8px 24px rgba(0,0,0,0.35)",
                }}
              />

              {/* Sol gösterge grubu */}
              <div className="absolute bottom-[48%] left-[12%] flex gap-2 items-end">
                <div className="w-10 h-10 rounded-full bg-zinc-900 border-2 border-zinc-600 flex items-center justify-center">
                  <span className="text-[9px] text-zinc-400 font-mono">0</span>
                </div>
                <div className="w-14 h-14 rounded-full bg-zinc-900 border-2 border-zinc-500 flex flex-col items-center justify-center">
                  <span className="text-lg font-mono text-zinc-100 leading-none">
                    {Math.round(speed)}
                  </span>
                  <span className="text-[7px] text-zinc-500">km/h</span>
                </div>
              </div>

              {/* Üst renkli düğme şeridi */}
              <div className="absolute bottom-[58%] left-1/2 -translate-x-1/2 flex gap-0.5">
                {["#22c55e", "#eab308", "#ef4444", "#3b82f6", "#a855f7", "#f97316", "#06b6d4", "#84cc16"].map(
                  (c, i) => (
                    <div
                      key={i}
                      className="w-3 h-2.5 rounded-sm border border-black/30"
                      style={{ background: c }}
                    />
                  )
                )}
              </div>

              {/* Sağ kırmızı düğmeler */}
              <div className="absolute bottom-[52%] right-[14%] flex gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-red-500 border border-red-300 shadow-[0_0_6px_#ef4444]" />
                <div className="w-3.5 h-3.5 rounded-full bg-red-600 border border-red-400" />
                <div className="w-3.5 h-3.5 rounded-full bg-zinc-500" />
              </div>

              {/* Direksiyon — referans stili */}
              <div
                className="absolute bottom-1 left-1/2 -translate-x-1/2"
                style={{ transform: `rotate(${steer}deg)` }}
              >
                <div className="relative w-44 h-44 rounded-full border-[11px] border-[#4a4e54] bg-[#2c2f34] shadow-2xl">
                  <div className="absolute inset-2 rounded-full border border-zinc-600/50" />
                  {/* Kollar */}
                  <div className="absolute top-1/2 left-1/2 w-[70%] h-3 bg-[#3a3e44] -translate-x-1/2 -translate-y-1/2 rounded" />
                  <div className="absolute top-1/2 left-1/2 w-3 h-[55%] bg-[#3a3e44] -translate-x-1/2 -translate-y-[10%] rounded" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#22262a] border border-zinc-600 flex items-center justify-center">
                    <span className="text-[11px] font-black text-zinc-400">◆</span>
                  </div>
                </div>
              </div>

              {/* Sarı tutamak */}
              <div className="absolute right-[6%] bottom-[38%] w-2 h-28 bg-yellow-400 rounded-full shadow-md" />

              {/* Koltuk hissi */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-10 bg-[#5a5e64] rounded-t-lg opacity-90" />

              {/* Mazot + sinyal */}
              <div className="absolute bottom-5 left-4 bg-black/80 border border-zinc-600 rounded px-2 py-1 text-[10px] text-zinc-300">
                MAZOT{" "}
                <span className={fuel < 20 ? "text-red-400" : "text-emerald-400"}>
                  %{Math.round(fuel)}
                </span>
              </div>
              <div className="absolute bottom-5 right-4 flex gap-2">
                <div
                  className={`w-6 h-6 rounded-full border-2 text-[10px] flex items-center justify-center ${
                    signal === "left"
                      ? "bg-amber-400 border-amber-200 text-black"
                      : "border-zinc-500 text-zinc-500"
                  }`}
                >
                  ◀
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 text-[10px] flex items-center justify-center ${
                    signal === "right"
                      ? "bg-amber-400 border-amber-200 text-black"
                      : "border-zinc-500 text-zinc-500"
                  }`}
                >
                  ▶
                </div>
              </div>

              {wiper && (
                <div className="absolute bottom-[62%] left-4 text-[9px] text-sky-300 bg-black/50 px-1.5 py-0.5 rounded">
                  SİLECEK · cam temizleniyor
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* HUD */}
      <div className="absolute top-2 left-2 z-50 text-[9px] text-white bg-black/70 px-2 py-1 rounded">
        WASD · C · Q/E · Space silecek · F pompa
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
      {/* silecek anim class bağla */}
      <style jsx>{`
        div[style*="wipeL"] {
          animation-name: wipeL;
        }
      `}</style>
    </div>
  );
}