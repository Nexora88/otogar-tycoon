/** Gerçek takvim — ulusal coşku / yas (TR) */

export type DayMood = "normal" | "national" | "mourning";

export type CalendarBeat = {
  mood: DayMood;
  code: string;
  title: string;
  paperLine: string;
  phoneFrom: string;
  phoneBody: string;
  bakracLine: string;
  themeClass: string; // layout body
};

function md(d: Date) {
  return `${d.getMonth() + 1}-${d.getDate()}`;
}

/** Bugünün gerçek tarihi (tarayıcı / sunucu local) */
export function getCalendarBeat(now = new Date()): CalendarBeat {
  const key = md(now);

  // Yas
  if (key === "11-10") {
    return {
      mood: "mourning",
      code: "10kasim",
      title: "10 Kasım",
      paperLine:
        "HAKİKİ PERON: Saat 09:05 — Gazi Mustafa Kemal Atatürk’ü saygıyla anıyoruz.",
      phoneFrom: "Otogar Tycoon",
      phoneBody:
        "10 Kasım. Bir dakikalık saygı duruşu. Peronlar sessiz. — Ahmet Eymen Bakraç",
      bakracLine:
        "Bugün yas var. Oyun coşkusu değil; saygı var. Atamızı saygıyla anıyoruz.",
      themeClass: "ot-mood-mourning",
    };
  }

  // Ulusal bayram / coşku
  const national: Record<string, Omit<CalendarBeat, "mood" | "themeClass">> = {
    "4-23": {
      code: "23nisan",
      title: "23 Nisan",
      paperLine:
        "HAKİKİ PERON: 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı — peronlarda bayrak.",
      phoneFrom: "Otogar Tycoon",
      phoneBody:
        "23 Nisan kutlu olsun. Çocukların ve egemenliğin günü. — Ahmet Eymen Bakraç / Nexora",
      bakracLine: "Bugün her yazıhanede bir tebessüm. 23 Nisan kutlu olsun!",
    },
    "5-19": {
      code: "19mayis",
      title: "19 Mayıs",
      paperLine:
        "HAKİKİ PERON: 19 Mayıs Atatürk’ü Anma, Gençlik ve Spor Bayramı.",
      phoneFrom: "Otogar Tycoon",
      phoneBody:
        "19 Mayıs kutlu olsun. Gençlik, spor, umut. — Ahmet Eymen Bakraç",
      bakracLine: "Samsun’un ruhu peronlarda. 19 Mayıs kutlu olsun!",
    },
    "8-30": {
      code: "30agustos",
      title: "30 Ağustos",
      paperLine: "HAKİKİ PERON: 30 Ağustos Zafer Bayramı — yollar açık, baş dik.",
      phoneFrom: "Otogar Tycoon",
      phoneBody: "Zafer Bayramı kutlu olsun. — Ahmet Eymen Bakraç",
      bakracLine: "Büyük Taarruz’un izi. 30 Ağustos kutlu olsun!",
    },
    "10-29": {
      code: "29ekim",
      title: "29 Ekim",
      paperLine:
        "HAKİKİ PERON: Cumhuriyet Bayramı — 1923’ten beri aynı gök, aynı gurur.",
      phoneFrom: "Otogar Tycoon",
      phoneBody:
        "Cumhuriyet Bayramı kutlu olsun. Ne mutlu Türküm diyene. — Ahmet Eymen Bakraç",
      bakracLine: "Cumhuriyet coşkusu tüm otogarlarda. 29 Ekim kutlu olsun!",
    },
    "3-18": {
      code: "18mart",
      title: "18 Mart",
      paperLine:
        "HAKİKİ PERON: 18 Mart Çanakkale — ‘ölürse ten ölür, canlar ölesi değil’.",
      phoneFrom: "Otogar Tycoon",
      phoneBody: "Çanakkale ruhuyla. Saygı ve minnet. — Ahmet Eymen Bakraç",
      bakracLine: "Çanakkale geçilmez. Saygıyla anıyoruz.",
    },
  };

  const n = national[key];
  if (n) {
    return {
      ...n,
      mood: "national",
      themeClass: "ot-mood-national",
    };
  }

  return {
    mood: "normal",
    code: "none",
    title: "",
    paperLine: "",
    phoneFrom: "",
    phoneBody: "",
    bakracLine: "",
    themeClass: "",
  };
}

export function calendarHeadlineForPaper(beat: CalendarBeat): string | null {
  if (beat.mood === "normal") return null;
  return beat.paperLine;
}