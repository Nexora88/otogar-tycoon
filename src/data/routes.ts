export interface GameRoute {
  id: string;
  origin: string;
  destination: string;
  distance: number;
  baseDuration: number;
  region:
    | "Marmara"
    | "İç Anadolu"
    | "Ege"
    | "Akdeniz"
    | "Karadeniz"
    | "Doğu"
    | "Güneydoğu";
}

export const ROUTES: GameRoute[] = [
  { id: "ist-ank", origin: "İstanbul Esenler", destination: "Ankara AŞTİ", distance: 450, baseDuration: 5.5, region: "Marmara" },
  { id: "ist-izm", origin: "İstanbul Esenler", destination: "İzmir Otogarı", distance: 480, baseDuration: 6.5, region: "Marmara" },
  { id: "ist-burs", origin: "İstanbul Esenler", destination: "Bursa", distance: 240, baseDuration: 3, region: "Marmara" },
  { id: "ist-ant", origin: "İstanbul Esenler", destination: "Antalya", distance: 720, baseDuration: 9, region: "Marmara" },
  { id: "ist-adi", origin: "İstanbul Esenler", destination: "Adana", distance: 910, baseDuration: 11, region: "Marmara" },
  { id: "ist-sam", origin: "İstanbul Esenler", destination: "Samsun", distance: 750, baseDuration: 10, region: "Marmara" },
  { id: "ist-erz", origin: "İstanbul Esenler", destination: "Erzurum", distance: 1220, baseDuration: 16, region: "Marmara" },
  { id: "kes-ist", origin: "Keşan", destination: "İstanbul Esenler", distance: 220, baseDuration: 3, region: "Marmara" },
  { id: "bur-ank", origin: "Bursa", destination: "Ankara AŞTİ", distance: 380, baseDuration: 5, region: "Marmara" },
  { id: "ank-izm", origin: "Ankara AŞTİ", destination: "İzmir Otogarı", distance: 580, baseDuration: 7, region: "İç Anadolu" },
  { id: "ank-ant", origin: "Ankara AŞTİ", destination: "Antalya", distance: 480, baseDuration: 6, region: "İç Anadolu" },
  { id: "ank-konya", origin: "Ankara AŞTİ", destination: "Konya", distance: 260, baseDuration: 3.5, region: "İç Anadolu" },
  { id: "ank-sam", origin: "Ankara AŞTİ", destination: "Samsun", distance: 420, baseDuration: 5.5, region: "İç Anadolu" },
  { id: "ank-kay", origin: "Ankara AŞTİ", destination: "Kayseri", distance: 320, baseDuration: 4, region: "İç Anadolu" },
  { id: "ank-diy", origin: "Ankara AŞTİ", destination: "Diyarbakır", distance: 900, baseDuration: 12, region: "İç Anadolu" },
  { id: "ank-gaz", origin: "Ankara AŞTİ", destination: "Gaziantep", distance: 680, baseDuration: 9, region: "İç Anadolu" },
  { id: "esk-ist", origin: "Eskişehir", destination: "İstanbul Esenler", distance: 320, baseDuration: 4, region: "İç Anadolu" },
  { id: "kon-ant", origin: "Konya", destination: "Antalya", distance: 320, baseDuration: 4.5, region: "İç Anadolu" },
  { id: "izm-ant", origin: "İzmir Otogarı", destination: "Antalya", distance: 420, baseDuration: 5.5, region: "Ege" },
  { id: "izm-mug", origin: "İzmir Otogarı", destination: "Muğla", distance: 230, baseDuration: 3, region: "Ege" },
  { id: "izm-ist", origin: "İzmir Otogarı", destination: "İstanbul Esenler", distance: 480, baseDuration: 6.5, region: "Ege" },
  { id: "ant-mers", origin: "Antalya", destination: "Mersin", distance: 480, baseDuration: 6, region: "Akdeniz" },
  { id: "ant-adana", origin: "Antalya", destination: "Adana", distance: 550, baseDuration: 7, region: "Akdeniz" },
  { id: "ada-ank", origin: "Adana", destination: "Ankara AŞTİ", distance: 490, baseDuration: 6.5, region: "Akdeniz" },
  { id: "sam-trab", origin: "Samsun", destination: "Trabzon", distance: 320, baseDuration: 4.5, region: "Karadeniz" },
  { id: "sam-ank", origin: "Samsun", destination: "Ankara AŞTİ", distance: 420, baseDuration: 5.5, region: "Karadeniz" },
  { id: "tra-ank", origin: "Trabzon", destination: "Ankara AŞTİ", distance: 780, baseDuration: 11, region: "Karadeniz" },
  { id: "erz-van", origin: "Erzurum", destination: "Van", distance: 410, baseDuration: 5.5, region: "Doğu" },
  { id: "van-ank", origin: "Van", destination: "Ankara AŞTİ", distance: 1200, baseDuration: 16, region: "Doğu" },
  { id: "diy-gaz", origin: "Diyarbakır", destination: "Gaziantep", distance: 310, baseDuration: 4, region: "Güneydoğu" },
  { id: "diy-ank", origin: "Diyarbakır", destination: "Ankara AŞTİ", distance: 900, baseDuration: 12, region: "Güneydoğu" },
  { id: "gaz-izm", origin: "Gaziantep", destination: "İzmir Otogarı", distance: 980, baseDuration: 13, region: "Güneydoğu" },
];