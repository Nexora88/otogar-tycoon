import type { CareerRank } from "@/data/apprenticeContent";

export type UnlockKey =
  | "shift"
  | "setup"
  | "expeditions"
  | "garage"
  | "market"
  | "office"
  | "terminal"
  | "staff"
  | "lobby_compete"
  | "auction"
  | "sabotage";

/** Rütbe skoru — kıyas için */
export function rankScore(rank: CareerRank): number {
  switch (rank) {
    case "cirak":
      return 0;
    case "yamak":
      return 1;
    case "muavin":
      return 2;
    case "kaptan_yamagi":
      return 3;
    case "bagimsiz":
      return 4;
    default:
      return 0;
  }
}

/**
 * careerDone = bağımsız veya geçerli istifa.
 * setupDone = belediye ruhsatı.
 */
export function canUnlock(
  key: UnlockKey,
  opts: {
    careerStarted: boolean;
    careerDone: boolean;
    rank: CareerRank;
    setupDone: boolean;
  }
): { ok: boolean; reason: string } {
  const { careerStarted, careerDone, rank, setupDone } = opts;

  if (key === "shift") {
    return { ok: true, reason: "" };
  }

  if (!careerStarted) {
    return { ok: false, reason: "Önce vardiyaya yazıl (ad + memleket)." };
  }

  // Terminal / sefer dünyası — çırakken YOK
  const needsBoss = [
    "setup",
    "expeditions",
    "garage",
    "market",
    "office",
    "terminal",
    "staff",
    "lobby_compete",
    "auction",
    "sabotage",
  ];

  if (needsBoss.includes(key)) {
    if (!careerDone && rankScore(rank) < 4) {
      return {
        ok: false,
        reason:
          "Henüz ağa değilsin. Vardiyada terfi et veya şartlı istifa et.",
      };
    }
  }

  if (key === "setup") {
    return careerDone || rank === "bagimsiz"
      ? { ok: true, reason: "" }
      : { ok: false, reason: "Bağımsız ol veya geçerli istifa." };
  }

  if (
    ["expeditions", "garage", "market", "office", "terminal", "staff"].includes(
      key
    )
  ) {
    if (!setupDone) {
      return {
        ok: false,
        reason: "Önce belediyeden terminal ruhsatı al (/setup).",
      };
    }
  }

  if (["auction", "sabotage", "lobby_compete"].includes(key) && !setupDone) {
    return {
      ok: false,
      reason: "Canlı rekabet terminal sonrası açılır.",
    };
  }

  return { ok: true, reason: "" };
}