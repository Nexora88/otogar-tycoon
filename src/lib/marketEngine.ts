export interface RouteDemand {
  route: string;
  dailyPassengers: number;
  playerShare: number;
  rivalShare: number;
  unmet: number;
  pressure: "düşük" | "normal" | "yüksek";
}

const BASE_DEMAND: Record<string, number> = {
  "İstanbul → Ankara": 420,
  "Ankara → İstanbul": 390,
  "İstanbul → İzmir": 360,
  "İzmir → İstanbul": 330,
  "Ankara → İzmir": 270,
  "İstanbul → Bursa": 260,
  "Bursa → İstanbul": 240,
  "İstanbul → Edirne": 190,
  "Edirne → İstanbul": 180,
  "İzmir → Antalya": 220,
  "Ankara → Konya": 210,
  "Ankara → Bursa": 200,
  "İstanbul → Antalya": 300,
};

export function routeDemand(route: string, multiplier = 1, day = 1) {
  const base = BASE_DEMAND[route] ?? 150;
  const weekly = day % 7 === 0 ? 1.28 : 1;
  return Math.round(base * Math.max(0.65, multiplier) * weekly);
}

export function routeCompetition(route: string, playerReputation: number, playerFleet: number, playerPrice = 1, rivals: Array<{routes: string[]; reputation: number; fleet: number; ticketIndex: number; active: boolean}>) : RouteDemand {
  const dailyPassengers = routeDemand(route, 1, 1);
  const playerPower = Math.max(0.1, (playerFleet * 1.4 + playerReputation * 0.08) / Math.max(0.55, playerPrice));
  const rivalPower = rivals.filter(r => r.active && r.routes.includes(route)).reduce((sum, r) => sum + Math.max(0.1, (r.fleet * 1.4 + r.reputation * 0.08) / Math.max(0.55, r.ticketIndex)), 0);
  const total = playerPower + rivalPower;
  const playerShare = Math.round((playerPower / Math.max(0.01, total)) * 100);
  const rivalShare = 100 - playerShare;
  const unmet = Math.max(0, Math.round(dailyPassengers * 0.18));
  return { route, dailyPassengers, playerShare, rivalShare, unmet, pressure: dailyPassengers > 300 ? "yüksek" : dailyPassengers < 190 ? "düşük" : "normal" };
}

export function companyValuation(input: { revenue: number; profit: number; fleet: number; reputation: number; marketShare: number; debt: number }) {
  const revenuePart = Math.max(0, input.revenue) * 2.2;
  const profitPart = Math.max(0, input.profit) * 5;
  const fleetPart = input.fleet * 55000;
  const brandPart = input.reputation * 7000 + input.marketShare * 15000;
  const debtPenalty = Math.max(0, input.debt) * 0.8;
  return Math.max(25000, Math.round(revenuePart + profitPart + fleetPart + brandPart - debtPenalty));
}

export const IPO_RULES = {
  minValuation: 1000000,
  minFleet: 5,
  minReputation: 60,
  minRoutes: 3,
  founderOwnershipAfter: 0.8,
};
