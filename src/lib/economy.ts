/** Otogar Tycoon — ekonomi tavanları (Tur 3) */
export function maxTicketPrice(distanceKm: number, priceCapMult: number): number {
  // ~1.05 ₺/km taban, bayram çarpanı ile; sert tavan
  const raw = Math.round(Math.max(80, distanceKm) * 1.05 * priceCapMult);
  return Math.min(850, Math.max(90, raw));
}

export function minTicketPrice(distanceKm: number): number {
  return Math.min(120, Math.max(70, Math.round(distanceKm * 0.22)));
}
