/** Oda müzayedesi — örnek peron ilanları */

export type LotTemplate = {
  from: string;
  to: string;
  capacity: number;
  minBid: number;
};

export const LOT_POOL: LotTemplate[] = [
  { from: "Edirne", to: "Keşan Yaylaköy", capacity: 12, minBid: 8000 },
  { from: "Keşan", to: "İstanbul Esenler", capacity: 24, minBid: 25000 },
  { from: "Tekirdağ", to: "Çorlu", capacity: 8, minBid: 5000 },
  { from: "Ankara AŞTİ", to: "Kırıkkale", capacity: 10, minBid: 7000 },
  { from: "İzmir", to: "Manisa", capacity: 16, minBid: 12000 },
  { from: "Bursa", to: "Yalova", capacity: 14, minBid: 10000 },
  { from: "Samsun", to: "Ordu", capacity: 10, minBid: 9000 },
  { from: "Antalya", to: "Isparta", capacity: 12, minBid: 11000 },
  { from: "Adana", to: "Mersin", capacity: 18, minBid: 14000 },
  { from: "Erzurum", to: "Kars", capacity: 8, minBid: 6000 },
];

export function rollLot(): LotTemplate {
  return LOT_POOL[Math.floor(Math.random() * LOT_POOL.length)]!;
}

export function lobbyTitle(score: number, cityHint?: string): string {
  const c = cityHint || "Peron";
  if (score >= 500000) return `${c} Terminal Ağası`;
  if (score >= 200000) return `${c} Büyük Esnaf`;
  if (score >= 80000) return `${c} Tur Ağası`;
  if (score >= 30000) return `${c} Yazıhane Sahibi`;
  if (score >= 10000) return `${c} Muavinbaşı`;
  return `${c} Çırak Esnaf`;
}
