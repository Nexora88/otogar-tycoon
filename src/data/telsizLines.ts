export const TELSIZ_LINES = [
  "Czzzt… Keşan arabası 3 nolu perondan kalkacaktır, kaptan yerini alsın.",
  "Czzzt… Bolu Dağı çıkışında sis — sürati düşün kaptanlar.",
  "Czzzt… 1 nolu peronda rakip çığırtkan, itibar barını kontrol et.",
  "Czzzt… TEM’de EDS zinciri aktif, hız 90’ı geçme.",
  "Czzzt… Ankara AŞTİ’de peron yoğun, erken yanaşın.",
  "Czzzt… Mazot istasyonunda kuyruk — planı kaydırın.",
  "Czzzt… Gece seferi: takograf yeşil kalsın.",
  "Czzzt… Yolcu şikâyeti: ikram soğuk — muavin kontrol.",
  "Czzzt… Esenler’de zabıta turu, bagaj açık tutulsun.",
  "Czzzt… Bayram yoğunluğu — bilet tavanı gevşedi deniyor.",
  "Czzzt… Trakya hattı rüzgârlı, bagaj kayışlarını sıkın.",
  "Czzzt… Dinlenme tesisi komisyon anlaşması yenilendi.",
  "Czzzt… Jandarma rastgele arama — evrak hazır olsun.",
  "Czzzt… Peron hoparlörü bozuk, çığırtkan sesleniyor.",
  "Czzzt… İstanbul–Ankara hattında fiyat savaşı başladı.",
];

export function randomTelsiz(): string {
  return TELSIZ_LINES[Math.floor(Math.random() * TELSIZ_LINES.length)]!;
}