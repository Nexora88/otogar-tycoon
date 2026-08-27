"use client";

import { useEffect, useState, useRef } from "react";
import { useGameStore } from "@/store/gameStore";

interface DrivingViewProps {
  expeditionId: string;
}

type CamMode = "cockpit" | "hood" | "top";
type Weather = "clear" | "rain";

interface Traffic {
  id: number;
  lane: number;
  z: number;
  color: string;
  kind: "car" | "truck" | "police" | "ambulance";
  drift: number;
}

interface Prop {
  id: number;
  side: "left" | "right";
  z: number;
  kind: "tree" | "house" | "trash" | "sign" | "billboard" | "barrier" | "simit" | "crosswalk";
}

interface DamageZone {
  id: string;
  label: string;
  x: string;
  y: string;
}

const SIGNS = [
  "🚏 KEŞAN OTOBÜS TERMİNALİ",
  "🇹🇷 MUSTAFA KEMAL'İN ASKERLERİYİZ",
  "🗺️ ANKARA YÖNÜ",
  "⚠️ HIZ 90",
  "⛽ DİNLENME 12 KM",
];

export default function DrivingView({ expeditionId }: DrivingViewProps) {
  const exp = useGameStore((s) =>
    s.expeditions.find((e) => e.id === expeditionId)
  );
  const triggerRoadEvent = useGameStore((s) => s.triggerRoadEvent);

  const [cam, setCam] = useState<CamMode>("cockpit");
  const [x, setX] = useState(0); // -1..1 şerit ofset
  const [tilt, setTilt] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [targetSpeed, setTargetSpeed] = useState(0);
  const [signal, setSignal] = useState<"none" | "left" | "right">("none");
  const [wiper, setWiper] = useState(false);
  const [weather, setWeather] = useState<Weather>("clear");
  const [fuel, setFuel] = useState(78);
  const [kmLeft, setKmLeft] = useState(180);
  const [progress, setProgress] = useState(0); // 0 terminal → 1 varış
  const [wrongWay, setWrongWay] = useState(false);
  const [damages, setDamages] = useState<DamageZone[]>([]);
  const [traffic, setTraffic] = useState<Traffic[]>([]);
  const [props, setProps] = useState<Prop[]>([]);
  const [signText, setSignText] = useState(SIGNS[0]);
  const [showSign, setShowSign] = useState(false);
  const [pedestrians, setPedestrians] = useState<
    { id: number; x: number; z: number; crossing: boolean }[]
  >([]);
  const keys = useRef<Record<string, boolean>>({});

  const night = false;
  const blur = weather === "rain" && !wiper;

  // Klavye
  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keys.current[k] = true;
      if (k === "c") {
        setCam((c) =>
          c === "cockpit" ? "hood" : c === "hood" ? "top" : "cockpit"
        );
      }
      if (k === "q") setSignal((s) => (s === "left" ? "none" : "left"));
      if (k === "e") setSignal((s) => (s === "right" ? "none" : "right"));
      if (e.key === " ") {
        e.preventDefault();
        setWiper((v) => !v);
      }
      if (k === "h") {
        // Korna — ileride ses; şimdilik görsel flash yok
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

  // Ana döngü — yavaş hızlanma
  useEffect(() => {
    let id: number;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(40, now - last) / 16;
      last = now;

      let gas = 0;
      if (keys.current["w"] || keys.current["arrowup"]) gas = 1;
      if (keys.current["s"] || keys.current["arrowdown"]) gas = -1;

      // Hedef hız yavaş değişir
      setTargetSpeed((ts) => {
        if (gas > 0) return Math.min(110, ts + 1.1 * dt);
        if (gas < 0) return Math.max(0, ts - 2.2 * dt);
        return Math.max(0, ts - 0.25 * dt);
      });

      setSpeed((s) => {
        const next = s + (targetSpeed - s) * 0.08 * dt;
        return Math.max(0, Math.min(115, next));
      });

      if (blur) setSpeed((s) => Math.min(s, 55));

      let steer = 0;
      if (keys.current["a"] || keys.current["arrowleft"]) steer = -1;
      if (keys.current["d"] || keys.current["arrowright"]) steer = 1;

      setX((prev) => {
        let n = prev + steer * 0.035 * dt * (0.4 + speed / 120);
        // Yol dışı / yanlış yön
        if (n > 0.92 || n < -0.92) {
          setWrongWay(true);
          n = Math.max(-0.95, Math.min(0.95, n));
        } else {
          setWrongWay(false);
        }
        setTilt(steer * 2.8);
        return n;
      });

      // İlerleme & yakıt & km
      if (speed > 5) {
        setProgress((p) => Math.min(1, p + (speed * dt) / 180000));
        setKmLeft((k) => Math.max(0, k - (speed * dt) / 9000));
        setFuel((f) => Math.max(0, f - (speed * dt) / 25000));
      }

      // Trafik
      setTraffic((prev) =>
        prev
          .map((t) => ({
            ...t,
            z: t.z + t.drift + speed / 100,
            lane: t.lane + (Math.random() > 0.995 ? (Math.random() > 0.5 ? 0.15 : -0.15) : 0),
          }))
          .filter((t) => t.z < 110)
      );

      setProps((prev) =>
        prev
          .map((p) => ({ ...p, z: p.z + 1.2 + speed / 80 }))
          .filter((p) => p.z < 115)
      );

      setPedestrians((prev) =>
        prev
          .map((p) => ({
            ...p,
            z: p.z + 0.8 + speed / 90,
            x: p.crossing ? p.x + 0.4 * dt : p.x,
          }))
          .filter((p) => p.z < 110)
      );

      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [targetSpeed, speed, blur]);

  // Spawn
  useEffect(() => {
    const t = setInterval(() => {
      setTraffic((prev) => {
        if (prev.length > 8) return prev;
        if (Math.random() > 0.55) {
          const kinds: Traffic["kind"][] = ["car", "car", "truck", "police", "ambulance"];
          const kind = kinds[Math.floor(Math.random() * kinds.length)];
          return [
            ...prev,
            {
              id: Date.now() + Math.random(),
              lane: (Math.random() - 0.5) * 1.4,
              z: 2,
              color:
                kind === "police"
                  ? "#1e3a8a"
                  : kind === "ambulance"
                  ? "#f8fafc"
                  : ["#b91c1c", "#a16207", "#374151", "#1d4ed8"][
                      Math.floor(Math.random() * 4)
                    ],
              kind,
              drift: 0.8 + Math.random(),
            },
          ];
        }
        return prev;
      });

      setProps((prev) => {
        if (Math.random() > 0.4) {
          const kinds: Prop["kind"][] = [
            "tree",
            "tree",
            "house",
            "trash",
            "billboard",
            "sign",
            "simit",
            "crosswalk",
          ];
          // Yanlış şeritte bariyer
          const kind =
            Math.abs(x) > 0.85 && Math.random() > 0.7
              ? "barrier"
              : kinds[Math.floor(Math.random() * kinds.length)];
          return [
            ...prev,
            {
              id: Date.now() + Math.random(),
              side: Math.random() > 0.5 ? "left" : "right",
              z: 3,
              kind,
            },
          ];
        }
        return prev;
      });

      if (Math.random() > 0.85) {
        setPedestrians((prev) => [
          ...prev,
          {
            id: Date.now(),
            x: -20,
            z: 5,
            crossing: Math.random() > 0.5,
          },
        ]);
      }
    }, 400);
    return () => clearInterval(t);
  }, [x]);

  // Tabela
  useEffect(() => {
    const t = setInterval(() => {
      setSignText(SIGNS[Math.floor(Math.random() * SIGNS.length)]);
      setShowSign(true);
      setTimeout(() => setShowSign(false), 4000);
    }, 9000);
    return () => clearInterval(t);
  }, []);

  // Kaza → rastgele hasar bölgesi
  useEffect(() => {
    if (Math.random() > 0.999 && speed > 60 && exp) {
      const zones = [
        { id: "fl", label: "Sol ön çamurluk", x: "18%", y: "62%" },
        { id: "fr", label: "Sağ ön çamurluk", x: "72%", y: "62%" },
        { id: "mirror", label: "Dikiz aynası", x: "12%", y: "40%" },
        { id: "bumper", label: "Ön tampon", x: "45%", y: "78%" },
      ];
      const z = zones[Math.floor(Math.random() * zones.length)];
      setDamages((d) => (d.find((x) => x.id === z.id) ? d : [...d, z]));
      triggerRoadEvent(exp.id);
    }
  }, [speed, exp, triggerRoadEvent]);

  if (!exp || exp.status !== "departed") return null;

  const dest = exp.destination.split(" ")[0];
  const origin = exp.origin.split(" ")[0];

  // Perspektif yardımcı
  const depthY = (z: number) => 30 + (z / 100) * 48;
  const depthS = (z: number) => 0.12 + Math.pow(z / 100, 1.3) * 1.5;
  const depthX = (lane: number, z: number) =>
    lane * (20 + (z / 100) * 90) + x * -40;

  const worldTransform =
    cam === "top"
      ? `perspective(600px) rotateX(55deg) translateY(10%) scale(1.1)`
      : cam === "hood"
      ? `perspective(900px) rotateX(8deg) translateY(5%)`
      : `perspective(1000px) rotateX(12deg)`;

  return (
    <div className="fixed inset-0 z-40 overflow-hidden select-none bg-slate-900">
      {/* Gökyüzü */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-700 via-sky-600 to-stone-500" />

      {/* Harita / rota (sağ üst) */}
      <div className="absolute top-3 right-3 z-50 w-40 bg-black/85 border border-zinc-600 rounded-lg p-2 text-[10px]">
        <div className="text-zinc-500 mb-1">ROTA</div>
        <div className="text-amber-400 font-mono leading-tight">
          {origin}
          <br />↓<br />
          {dest}
        </div>
        <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="text-zinc-400 mt-1">{Math.round(kmLeft)} km · C kamera</div>
      </div>

      {/* Dünya */}
      <div
        className="absolute inset-0 transition-transform duration-200"
        style={{
          transform: `${worldTransform} translateX(${-x * 50}px) rotateZ(${tilt * 0.5}deg)`,
          transformOrigin: "50% 100%",
        }}
      >
        {/* Yol — yamuk perspektif */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: "28%",
            bottom: cam === "cockpit" ? "28%" : "10%",
            background: "linear-gradient(to bottom, #57534e, #1c1917)",
            clipPath: "polygon(47% 0%, 53% 0%, 100% 100%, 0% 100%)",
          }}
        />
        {/* Şerit çizgileri */}
        {Array.from({ length: 12 }).map((_, i) => {
          const z = ((i * 9 + (Date.now() / 40) * (speed / 40)) % 100);
          const y = depthY(z);
          const s = depthS(z);
          return (
            <div
              key={i}
              className="absolute left-1/2 bg-amber-400/90"
              style={{
                top: `${y}%`,
                width: 3 * s,
                height: 10 * s,
                transform: "translateX(-50%)",
                opacity: 0.3 + z / 100,
              }}
            />
          );
        })}

        {/* Props */}
        {props.map((p) => {
          const z = p.z;
          const y = depthY(z);
          const s = depthS(z);
          const px =
            (p.side === "left" ? -1 : 1) * (55 + z * 0.9) + depthX(0, z) * 0.1;
          const left = `calc(50% + ${px}px)`;

          if (p.kind === "barrier" || wrongWay) {
            if (p.kind === "barrier") {
              return (
                <div
                  key={p.id}
                  className="absolute font-black text-red-500 bg-yellow-400 border-2 border-black px-1"
                  style={{
                    left,
                    top: `${y}%`,
                    fontSize: Math.max(8, 14 * s),
                    transform: "translateX(-50%)",
                    zIndex: Math.floor(z),
                  }}
                >
                  DUR
                </div>
              );
            }
          }

          if (p.kind === "house") {
            return (
              <div
                key={p.id}
                className="absolute"
                style={{
                  left,
                  top: `${y - 4}%`,
                  transform: "translateX(-50%)",
                  zIndex: Math.floor(z),
                  opacity: Math.min(1, z / 15),
                }}
              >
                <div
                  style={{
                    width: 36 * s,
                    height: 28 * s,
                    background: "#7f1d1d",
                    border: "1px solid #450a0a",
                    boxShadow: `${4 * s}px ${4 * s}px 0 rgba(0,0,0,0.3)`,
                  }}
                />
                <div
                  style={{
                    width: 40 * s,
                    height: 8 * s,
                    marginLeft: -2 * s,
                    background: "#44403c",
                  }}
                />
              </div>
            );
          }

          if (p.kind === "tree") {
            return (
              <div
                key={p.id}
                className="absolute"
                style={{
                  left,
                  top: `${y}%`,
                  transform: "translateX(-50%)",
                  zIndex: Math.floor(z),
                }}
              >
                <div
                  style={{
                    width: 4 * s,
                    height: 16 * s,
                    background: "#3d2914",
                    margin: "0 auto",
                  }}
                />
                <div
                  className="rounded-full"
                  style={{
                    width: 22 * s,
                    height: 20 * s,
                    marginLeft: -9 * s,
                    marginTop: -4,
                    background: "#166534",
                  }}
                />
              </div>
            );
          }

          if (p.kind === "trash") {
            return (
              <div
                key={p.id}
                className="absolute bg-zinc-600 border border-zinc-800"
                style={{
                  left,
                  top: `${y + 5}%`,
                  width: 10 * s,
                  height: 12 * s,
                  transform: "translateX(-50%)",
                  zIndex: Math.floor(z),
                }}
              />
            );
          }

          if (p.kind === "simit") {
            return (
              <div
                key={p.id}
                className="absolute text-center"
                style={{
                  left,
                  top: `${y}%`,
                  transform: "translateX(-50%)",
                  zIndex: Math.floor(z),
                  fontSize: Math.max(7, 11 * s),
                }}
              >
                <div className="bg-amber-800 text-amber-100 px-1 rounded-sm whitespace-nowrap">
                  Simit!
                </div>
              </div>
            );
          }

          if (p.kind === "billboard" || p.kind === "sign") {
            return (
              <div
                key={p.id}
                className="absolute bg-red-800 border-2 border-white text-white text-center font-bold"
                style={{
                  left,
                  top: `${y}%`,
                  transform: "translateX(-50%)",
                  width: 50 * s,
                  fontSize: Math.max(5, 8 * s),
                  padding: 2,
                  zIndex: Math.floor(z),
                }}
              >
                {p.kind === "sign" ? "90" : "NEXORA"}
              </div>
            );
          }

          return null;
        })}

        {/* Yayalar */}
        {pedestrians.map((p) => (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: `calc(50% + ${p.x + depthX(0, p.z)}px)`,
              top: `${depthY(p.z)}%`,
              transform: "translateX(-50%)",
              zIndex: Math.floor(p.z + 5),
            }}
          >
            <div
              className="bg-stone-800"
              style={{
                width: 6 * depthS(p.z),
                height: 14 * depthS(p.z),
                borderRadius: 2,
              }}
            />
          </div>
        ))}

        {/* Trafik */}
        {traffic.map((t) => {
          const s = depthS(t.z);
          const y = depthY(t.z);
          const px = depthX(t.lane, t.z);
          return (
            <div
              key={t.id}
              className="absolute"
              style={{
                left: `calc(50% + ${px}px)`,
                top: `${y}%`,
                transform: "translateX(-50%)",
                zIndex: Math.floor(t.z + 10),
                opacity: Math.min(1, t.z / 12),
              }}
            >
              <div
                style={{
                  width: (t.kind === "truck" ? 36 : 26) * s,
                  height: (t.kind === "truck" ? 50 : 34) * s,
                  background: t.color,
                  border: "1px solid #000",
                  boxShadow: "2px 3px 0 rgba(0,0,0,0.35)",
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
                    background: "#0c4a6e",
                  }}
                />
                {t.kind === "police" && (
                  <div className="absolute top-0 left-0 right-0 h-[8%] bg-red-600" />
                )}
                {t.kind === "ambulance" && (
                  <div className="absolute top-0 left-0 right-0 h-[8%] bg-red-500" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Yanlış yol uyarısı */}
      {wrongWay && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white font-black px-6 py-2 border-4 border-yellow-400 animate-pulse">
          YANLIŞ YÖN — ŞERİDE DÖN
        </div>
      )}

      {/* Tabela */}
      {showSign && (
        <div className="absolute top-[18%] left-1/2 -translate-x-1/2 z-40 bg-yellow-400 text-black border-4 border-black px-4 py-2 font-black text-sm shadow-xl">
          {signText}
        </div>
      )}

      {/* Hasar işaretleri */}
      {damages.map((d) => (
        <div
          key={d.id}
          className="absolute z-45 pointer-events-none"
          style={{ left: d.x, top: d.y }}
        >
          <div className="text-red-500 font-black text-xs bg-black/60 px-1 rounded">
            ✦ {d.label}
          </div>
        </div>
      ))}

      {/* Dikiz aynaları (kokpitte) */}
      {cam === "cockpit" && (
        <>
          <div className="absolute top-16 left-6 z-40 w-24 h-14 rounded border-2 border-zinc-500 bg-sky-900/40 overflow-hidden shadow-lg">
            <div className="text-[8px] text-zinc-400 text-center">SOL AYNА</div>
            <div className="h-full bg-gradient-to-b from-stone-600 to-stone-800 opacity-80" />
          </div>
          <div className="absolute top-16 right-6 z-40 w-24 h-14 rounded border-2 border-zinc-500 bg-sky-900/40 overflow-hidden shadow-lg">
            <div className="text-[8px] text-zinc-400 text-center">SAĞ AYNA</div>
            <div className="h-full bg-gradient-to-b from-stone-600 to-stone-800 opacity-80" />
          </div>
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 w-28 h-12 rounded border-2 border-zinc-600 bg-zinc-900/90 overflow-hidden">
            <div className="text-[8px] text-zinc-500 text-center">ORTA DİKİZ</div>
            <div className="h-full bg-stone-700/50" />
          </div>
        </>
      )}

      {/* Kokpit — BMC esintili */}
      {cam !== "top" && (
        <div className="absolute bottom-0 inset-x-0 z-40 pointer-events-none"
          style={{ height: cam === "hood" ? "22%" : "36%" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1d] via-[#252528ee] to-transparent" />
          {cam === "cockpit" && (
            <>
              <div className="absolute bottom-0 inset-x-0 h-[70%] bg-[#2a2a2e] border-t border-zinc-600">
                {/* Torpido düğmeler */}
                <div className="absolute top-3 left-6 grid grid-cols-4 gap-1">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="w-4 h-3 rounded-sm bg-zinc-600 border border-zinc-500" />
                  ))}
                </div>
                <div className="absolute top-3 right-6 grid grid-cols-3 gap-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i < 2 ? "bg-red-500" : "bg-zinc-600"
                      }`}
                    />
                  ))}
                </div>
                {/* Kadran */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-16 rounded bg-zinc-900 border border-zinc-600 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-mono text-amber-400">
                      {Math.round(speed)}
                    </div>
                    <div className="text-[8px] text-zinc-500">km/s</div>
                  </div>
                </div>
                {/* Direksiyon */}
                <div
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full border-[12px] border-zinc-500 bg-zinc-800"
                  style={{ transform: `rotate(${tilt * 6}deg)` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-zinc-900 border-2 border-blue-600 flex items-center justify-center">
                    <span className="text-[8px] font-black text-blue-400">OT</span>
                  </div>
                </div>
                {/* Sarı tutamak */}
                <div className="absolute right-8 top-8 w-2 h-20 bg-yellow-500 rounded-full opacity-90" />
              </div>
              {/* Yakıt */}
              <div className="absolute bottom-28 left-4 bg-black/90 border border-zinc-600 rounded px-2 py-1 text-[10px]">
                <span className="text-zinc-500">MAZOT </span>
                <span className={fuel < 20 ? "text-red-400" : "text-emerald-400"}>
                  %{Math.round(fuel)}
                </span>
              </div>
              <div className="absolute bottom-28 right-4 flex gap-2">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] ${
                    signal === "left"
                      ? "bg-amber-400 border-amber-200 animate-pulse"
                      : "bg-zinc-800 border-zinc-600 text-zinc-600"
                  }`}
                >
                  ◀
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] ${
                    signal === "right"
                      ? "bg-amber-400 border-amber-200 animate-pulse"
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

      {/* Üst bilgi */}
      <div className="absolute top-3 left-3 z-50 text-[10px] text-zinc-300 bg-black/70 px-2 py-1 rounded border border-zinc-700">
        WASD · C kamera · Q/E sinyal · Space silecek
        {wiper && " · SİLECEK AÇIK"}
      </div>
    </div>
  );
}