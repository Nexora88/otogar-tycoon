export interface GameRoute {
  id: string;
  from: string;
  to: string;
  distance: number;
}

export const ROUTES: GameRoute[] = [
  { id: "ist-ank", from: "İstanbul (Esenler)", to: "Ankara (AŞTİ)", distance: 450 },
  { id: "ist-izm", from: "İstanbul", to: "İzmir", distance: 480 },
  { id: "ank-kay", from: "Ankara", to: "Kayseri", distance: 320 },
  { id: "ist-bur", from: "İstanbul", to: "Bursa", distance: 150 },
  { id: "izm-ant", from: "İzmir", to: "Antalya", distance: 420 },
  { id: "ank-sam", from: "Ankara", to: "Samsun", distance: 420 },
  { id: "kes-ist", from: "Keşan", to: "İstanbul", distance: 220 },
  { id: "ist-adi", from: "İstanbul", to: "Adana", distance: 910 },
];