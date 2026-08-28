export const CITY_PLATE: Record<string, string> = {
  edirne: "22",
  istanbul: "34",
  ankara: "06",
  izmir: "35",
  antalya: "07",
  samsun: "55",
  adana: "01",
  erzurum: "25",
};

export function makePlate(cityId: string | null, model: string): string {
  const code = (cityId && CITY_PLATE[cityId]) || "34";
  const mid = model.replace(/\s/g, "").slice(0, 3).toUpperCase() || "OTB";
  return `${code} ${mid} ${10 + Math.floor(Math.random() * 89)}`;
}