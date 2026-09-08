"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type CareerRank,
  type ShiftBand,
  type WorkTask,
  type DialogueOption,
  generateShiftTasks,
  generateTask,
  getShiftBand,
  shiftLabel,
  outcomeFor,
  randomCompany,
  randomPatronName,
  randomAbiName,
  hitap,
  nextRank,
  RANK_LABEL,
  JOB_OFFERS,
  MAFIA_HEADLINES,
  MEMLEKET_HITAP,
} from "@/data/apprenticeContent";
import { getGlobalGameClock } from "@/lib/gameTime";
import { rollDramaEvent, type DramaEvent } from "@/data/dramaEvents";
import { useGameStore } from "@/store/gameStore";

export function rankNeed(r: CareerRank): {
  trust: number;
  fame: number;
  savings: number;
  tasks: number;
} {
  switch (r) {
    case "cirak":
      return { trust: 0, fame: 0, savings: 0, tasks: 0 };
    case "yamak":
      return { trust: 12, fame: 4, savings: 900, tasks: 6 };
    case "muavin":
      return { trust: 24, fame: 12, savings: 4000, tasks: 14 };
    case "kaptan_yamagi":
      return { trust: 40, fame: 22, savings: 14000, tasks: 26 };
    case "bagimsiz":
      return { trust: 55, fame: 35, savings: 32000, tasks: 40 };
  }
}

function wageFor(rank: CareerRank): number {
  switch (rank) {
    case "cirak":
      return 40;
    case "yamak":
      return 65;
    case "muavin":
      return 100;
    case "kaptan_yamagi":
      return 145;
    case "bagimsiz":
      return 0;
  }
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

/** Ruhsat / sicil — bağımsızlığa giden ince detay */
export type LicenseStatus =
  | "yok"
  | "basvuru"
  | "belediye_bekliyor"
  | "onayli"
  | "iptal_riski";

const PATRON_CALL_LINES = [
  (p: string) => `${p}: “Hemen yanıma gel. Konuşacak iş var.”`,
  (p: string) => `${p}: “Çay soğudu, sen de soğuma. Yazıhaneye.”`,
  (p: string) => `${p}: “İki dakikan yok mu? Kapı açık.”`,
  (p: string) => `${p}: “Defterde açık var. Gel.”`,
];

const PATRON_IGNORE = [
  (p: string) => `${p}: “İki saattir yoksun. Gözüm üstünde.”`,
  (p: string) => `${p}: “Telefon çalıyor, sen kayıpsın. Yarın konuşuruz.”`,
  (p: string) => `${p}: “Çırak kaybolursa peron unutmaz.”`,
];

const PATRON_ANSWER = [
  (p: string, name: string) =>
    `${p}: “Aferin ${name}, en azından geldin. Dinle.”`,
  (p: string) => `${p}: “Otur. Bu işi temiz kapatacağız.”`,
  (p: string) => `${p}: “Kapıyı kapat. Dışarıdaki duymasın.”`,
];

const REST_LINES = [
  "Köşede 10 dk. Ayaklar biraz toparlandı.",
  "Termostan yudum. Yorgunluk hafifledi.",
  "Sigara molası yok — çay var. Nefes aldın.",
  "Peron gürültüsü uzaklaştı. Kısa mola.",
];

const PROMOTE_LINES: Record<CareerRank, string[]> = {
  cirak: ["Hâlâ çıraksın. Koş, öğren."],
  yamak: [
    "Yamak oldun. Artık sadece çay değil; bagaj da senin.",
    "Patron: “Omzuna yük biniyor. Omurga dik tut.”",
  ],
  muavin: [
    "Muavin rozeti gibi bir şey yok ama herkes ‘muavin’ diyor.",
    "İkram tepsisi, yolcu yüzü, bilet — üçü birden sende.",
  ],
  kaptan_yamagi: [
    "Kaptan yamağı: direksiyon değil ama sorumluluk senin.",
    "Gece seferinde uyanık kal; kaptanın sağ kolusun.",
  ],
  bagimsiz: [
    "Bağımsız esnaf. Belediye ruhsatı yolun açık.",
    "Artık başkasının peronunda çay taşımazsın — kendi yazıhanen.",
  ],
};

const LICENSE_LINES: Record<LicenseStatus, string> = {
  yok: "Ruhsat yok. Bağımsız olmadan belediye kapısı açılmaz.",
  basvuru: "Başvuru dosyası hazır. İmza ve kefil bekleniyor.",
  belediye_bekliyor: "Belediye kuyruğu. Mühür için sabır.",
  onayli: "Ruhsat onaylı. Terminal kurma hakkı doğdu.",
  iptal_riski: "Sicil bozuldu. Ruhsat risk altında — itibarı topla.",
};

export interface CareerState {
  careerStarted: boolean;
  careerDone: boolean;
  playerName: string;
  memleket: string;
  displayHitap: string;
  companyName: string;
  patronName: string;
  abiName: string;
  abi2Name: string;
  workCity: string;
  rank: CareerRank;
  trust: number;
  fame: number;
  savings: number;
  fatigue: number;
  tasksDone: number;
  shiftsDone: number;
  lastTaskDay: number;
  shiftBand: ShiftBand;
  shiftLabelText: string;
  tasks: WorkTask[];
  activeTask: WorkTask | null;
  lastOutcome: string | null;
  patronCalling: boolean;
  jobOffer: { company: string; body: string } | null;
  mafiaWhisper: string | null;
  drama: DramaEvent | null;
  log: string[];
  /** Ruhsat süreci */
  licenseStatus: LicenseStatus;
  licenseNote: string;
  daysWithoutCaught: number;
  caughtCount: number;

  canFoundTerminal: () => boolean;
  startCareer: (name: string, memleket: string) => void;
  syncShiftFromClock: () => void;
  rollShiftTasks: () => void;
  openTask: (id: string) => void;
  resolveOption: (opt: DialogueOption) => void;
  rest: () => void;
  maybeRollDrama: () => void;
  resolveDrama: (choiceId: string) => void;
  triggerPatronCall: () => void;
  answerPatronCall: () => void;
  ignorePatronCall: () => void;
  rollJobOffer: () => void;
  acceptJobOffer: () => void;
  refuseJobOffer: () => void;
  resign: () => void;
  tryPromote: () => boolean;
  markIndependent: () => void;
  applyLicenseStep: () => void;
  clearOutcome: () => void;
  pushLog: (line: string) => void;
}

export { RANK_LABEL, MEMLEKET_HITAP };

export const useCareerStore = create<CareerState>()(
  persist(
    (set, get) => ({
      careerStarted: false,
      careerDone: false,
      playerName: "",
      memleket: "",
      displayHitap: "",
      companyName: "",
      patronName: "",
      abiName: "",
      abi2Name: "",
      workCity: "İstanbul",
      rank: "cirak",
      trust: 10,
      fame: 0,
      savings: 500,
      fatigue: 0,
      tasksDone: 0,
      shiftsDone: 0,
      lastTaskDay: -1,
      shiftBand: "morning",
      shiftLabelText: "Sabah vardiyası",
      tasks: [],
      activeTask: null,
      lastOutcome: null,
      patronCalling: false,
      jobOffer: null,
      mafiaWhisper: null,
      drama: null,
      log: [],
      licenseStatus: "yok",
      licenseNote: LICENSE_LINES.yok,
      daysWithoutCaught: 0,
      caughtCount: 0,

      canFoundTerminal: () => {
        const s = get();
        return (
          s.careerDone ||
          s.rank === "bagimsiz" ||
          s.licenseStatus === "onayli"
        );
      },

      pushLog: (line) =>
        set((s) => ({ log: [line, ...s.log].slice(0, 60) })),

      startCareer: (name, memleket) => {
        const n = name.trim().slice(0, 24) || "Çırak";
        const mem =
          memleket.trim() ||
          MEMLEKET_HITAP[
            Math.floor(Math.random() * MEMLEKET_HITAP.length)
          ]!;

        const near: Record<string, string[]> = {
          Keşanlı: ["Edirne", "İstanbul", "Tekirdağ"],
          Edirneli: ["Edirne", "İstanbul"],
          Samsunlu: ["Samsun", "İstanbul", "Ankara"],
          Trabzonlu: ["Samsun", "Trabzon", "Ankara"],
          Ankaralı: ["Ankara", "İstanbul"],
          İzmirli: ["İzmir", "İstanbul"],
          Adanalı: ["Adana", "Ankara", "İstanbul"],
          Bursalı: ["Bursa", "İstanbul"],
          Konyalı: ["Konya", "Ankara"],
          Vanlı: ["Van", "Ankara", "İstanbul"],
        };
        const pool = near[mem] || ["İstanbul", "Ankara", "İzmir"];
        const workCity =
          Math.random() > 0.35
            ? "İstanbul"
            : pool[Math.floor(Math.random() * pool.length)]!;

        const company = randomCompany();
        const patron = randomPatronName();
        const abi = randomAbiName();
        let abi2 = randomAbiName();
        if (abi2 === abi) abi2 = randomAbiName();

        set({
          careerStarted: true,
          careerDone: false,
          playerName: n,
          memleket: mem,
          displayHitap: hitap(mem, n),
          companyName: company,
          patronName: patron,
          abiName: abi,
          abi2Name: abi2,
          workCity,
          rank: "cirak",
          trust: 12,
          fame: 0,
          savings: 500,
          fatigue: 0,
          tasksDone: 0,
          shiftsDone: 0,
          lastTaskDay: -1,
          tasks: [],
          activeTask: null,
          lastOutcome: `${patron}: “${hitap(mem, n)}, perona bak. Çay, gazete, ayak işi. Sefer sana yok — daha.”`,
          patronCalling: false,
          jobOffer: null,
          mafiaWhisper: null,
          drama: null,
          licenseStatus: "yok",
          licenseNote: LICENSE_LINES.yok,
          daysWithoutCaught: 0,
          caughtCount: 0,
          log: [
            `${workCity} · ${company}`,
            `Patron ${patron} · ${abi} / ${abi2}`,
            `Hitap: ${hitap(mem, n)}. Ruhsat yok. Çıraklık başladı.`,
          ],
        });
        get().syncShiftFromClock();
        get().rollShiftTasks();
      },

      syncShiftFromClock: () => {
        const { gameHour } = getGlobalGameClock();
        const band = getShiftBand(gameHour);
        set({
          shiftBand: band,
          shiftLabelText: shiftLabel(band),
        });
      },

      rollShiftTasks: () => {
        const s = get();
        if (!s.careerStarted || s.careerDone) return;

        get().syncShiftFromClock();
        const clock = getGlobalGameClock();

        if (s.lastTaskDay === clock.gameDay && s.tasks.length > 0) {
          set((st) => ({
            fatigue: clamp(st.fatigue + 6, 0, 100),
            lastOutcome:
              "Aynı gün ikinci vardiya. Bacaklar ağır, patron umursamıyor.",
          }));
        }

        if (s.lastTaskDay !== clock.gameDay && s.lastTaskDay >= 0) {
          set((st) => ({
            daysWithoutCaught: st.daysWithoutCaught + 1,
          }));
        }

        const abi = Math.random() > 0.5 ? s.abiName : s.abi2Name;
        const tasks = generateShiftTasks({
          band: get().shiftBand,
          patronName: s.patronName,
          abiName: abi,
          count: s.fatigue > 70 ? 2 : 3,
        });

        set({
          tasks,
          activeTask: null,
          lastTaskDay: clock.gameDay,
          shiftsDone: s.shiftsDone + 1,
        });
        get().pushLog(
          `${get().shiftLabelText}: ${tasks.length} iş · yorgun %${Math.round(get().fatigue)}`
        );

        if (Math.random() > 0.6) get().triggerPatronCall();
        if (Math.random() > 0.8) get().rollJobOffer();
        if (Math.random() > 0.85) {
          set({ mafiaWhisper: pick(MAFIA_HEADLINES) });
          get().pushLog("Fısıltı: kapı / aidat kulisleri");
        }
        if (Math.random() > 0.48) get().maybeRollDrama();

        // Ruhsat ilerlemesi (bağımsızlığa yakın)
        if (s.rank === "kaptan_yamagi" || s.rank === "muavin") {
          if (Math.random() > 0.7) get().applyLicenseStep();
        }
      },

      openTask: (id) => {
        const t = get().tasks.find((x) => x.id === id) || null;
        set({ activeTask: t, lastOutcome: null });
      },

      resolveOption: (opt) => {
        const task = get().activeTask;
        if (!task) return;

        const s0 = get();
        const fatigueRisk = s0.fatigue / 160;
        const risk = Math.min(0.92, opt.risk + fatigueRisk);

        let caught = false;
        if (opt.tone === "crooked" && Math.random() < risk) caught = true;
        if (
          task.kind === "rusvet" &&
          opt.label.toLowerCase().includes("patron") &&
          Math.random() < 0.42
        ) {
          caught = true;
        }
        if (task.kind === "kasa" && opt.tone === "crooked" && Math.random() < 0.35) {
          caught = true;
        }

        let trustD = opt.trustDelta;
        let moneyD = opt.moneyDelta;
        let fameD = 0;
        const baseWage = wageFor(s0.rank);

        if (caught) {
          trustD = -12;
          moneyD = -Math.abs(opt.moneyDelta) - 50;
          fameD = -4;
          set((s) => ({
            caughtCount: s.caughtCount + 1,
            daysWithoutCaught: 0,
            licenseStatus:
              s.licenseStatus === "onayli" || s.licenseStatus === "belediye_bekliyor"
                ? "iptal_riski"
                : s.licenseStatus,
            licenseNote:
              s.licenseStatus === "onayli"
                ? LICENSE_LINES.iptal_riski
                : s.licenseNote,
          }));
        } else {
          moneyD += baseWage;
          if (opt.tone === "obedient" && Math.random() > 0.7) fameD += 1;
          if (opt.tone === "honest") fameD += 1;
          if (task.kind === "pis" && opt.tone === "obedient") trustD += 2;
          if (task.kind === "patron_cagri" && opt.tone === "obedient") {
            trustD += 2;
            fameD += 1;
          }
        }

        const line = outcomeFor(opt.tone, caught);
        const speaker = task.speakerName;

        set((s) => ({
          trust: clamp(s.trust + trustD, 0, 100),
          fame: clamp(s.fame + fameD, 0, 100),
          savings: Math.max(0, s.savings + moneyD),
          fatigue: clamp(
            s.fatigue + (opt.tone === "lazy" ? 4 : 8) + (caught ? 6 : 0),
            0,
            100
          ),
          tasksDone: s.tasksDone + 1,
          tasks: s.tasks.filter((t) => t.id !== task.id),
          activeTask: null,
          lastOutcome: caught
            ? `${speaker}: “${line}” · YAKALANDIN · güven ${trustD}`
            : `${speaker}: “${line}”${
                baseWage > 0
                  ? ` · +${baseWage + Math.max(0, opt.moneyDelta)} ₺`
                  : ""
              }`,
          log: [
            `[${task.kind}] ${opt.label} → ${caught ? "YAKALANDI" : "tamam"}`,
            ...s.log,
          ].slice(0, 60),
        }));

        if (caught) {
          get().pushLog(
            `${s0.patronName} öfkesi: sicil çizildi. Ruhsat yolu uzadı.`
          );
        }

        get().tryPromote();
        if (Math.random() > 0.38) get().maybeRollDrama();
      },

      rest: () => {
        set((s) => ({
          fatigue: clamp(s.fatigue - 28, 0, 100),
          lastOutcome: pick(REST_LINES),
        }));
      },

      maybeRollDrama: () => {
        if (get().careerDone || get().drama || get().activeTask) return;
        if (Math.random() > 0.52) return;
        set({ drama: rollDramaEvent() });
        get().pushLog("Ani olay — seçim zamanı");
      },

      resolveDrama: (choiceId) => {
        const d = get().drama;
        if (!d) return;
        const ch = d.choices.find((c) => c.id === choiceId);
        if (!ch) return;

        set((s) => ({
          drama: null,
          trust: clamp(s.trust + ch.trustDelta, 0, 100),
          fame: clamp(s.fame + ch.fameDelta, 0, 100),
          savings: Math.max(0, s.savings + ch.moneyDelta),
          fatigue: clamp(s.fatigue + ch.fatigueDelta, 0, 100),
          lastOutcome: ch.result,
          log: [`[Olay] ${d.title}: ${ch.label}`, ...s.log].slice(0, 60),
        }));

        if (d.kind === "fight" || d.kind === "mafia") {
          try {
            useGameStore.setState((s) => ({
              eveningPaper: [
                {
                  id: `dr-news-${Date.now()}`,
                  title:
                    d.kind === "mafia"
                      ? "Peron fısıltısı: ağır ziyaret"
                      : `Peronda arbede: ${d.title}`,
                  body: d.body.slice(0, 160),
                  tag: "rival",
                },
                ...s.eveningPaper,
              ].slice(0, 8),
              paperNotify: "evening" as const,
            }));
            useGameStore.getState().pushPhone?.(
              "Hakiki Peron",
              d.kind === "mafia"
                ? "Kulis: yazıhaneye ağır ziyaret iddiası."
                : `Peronda arbede: ${d.title}`
            );
          } catch {
            /* ignore */
          }
        }
      },

      triggerPatronCall: () => {
        if (get().careerDone) return;
        set({ patronCalling: true });
        get().pushLog("PATRON ÇAĞIRDI");
        set({
          lastOutcome: pick(PATRON_CALL_LINES)(get().patronName),
        });
      },

      answerPatronCall: () => {
        const s = get();
        const task = generateTask({
          band: s.shiftBand,
          patronName: s.patronName,
          abiName: s.abiName,
          forceKind: "patron_cagri",
        });
        set({
          patronCalling: false,
          activeTask: task,
          trust: clamp(s.trust + 2, 0, 100),
          lastOutcome: pick(PATRON_ANSWER)(s.patronName, s.playerName),
        });
      },

      ignorePatronCall: () => {
        const p = get().patronName;
        set((s) => ({
          patronCalling: false,
          trust: clamp(s.trust - 6, 0, 100),
          lastOutcome: pick(PATRON_IGNORE)(p),
        }));
        get().pushLog("Patron çağrısı yok sayıldı");
      },

      rollJobOffer: () => {
        if (get().rank === "cirak" && get().tasksDone < 5) return;
        const offer = pick(JOB_OFFERS);
        set({ jobOffer: offer });
        get().pushLog(`İş teklifi: ${offer.company}`);
        set({
          lastOutcome: `${offer.company}: “${offer.body}”`,
        });
      },

      acceptJobOffer: () => {
        const o = get().jobOffer;
        if (!o) return;
        set((s) => ({
          jobOffer: null,
          companyName: o.company,
          patronName: randomPatronName(),
          abiName: randomAbiName(),
          abi2Name: randomAbiName(),
          trust: clamp(Math.max(14, s.trust - 4), 0, 100),
          fame: clamp(s.fame + 5, 0, 100),
          lastOutcome: `${o.company}: “Yarın peronda. Yeni sayfa, eski racon.”`,
          licenseStatus: "yok",
          licenseNote: "Firma değişti — ruhsat dosyası sıfırlandı.",
        }));
        get().pushLog(`Firma değişti → ${o.company}`);
        get().rollShiftTasks();
      },

      refuseJobOffer: () => {
        set((s) => ({
          jobOffer: null,
          trust: clamp(s.trust + 3, 0, 100),
          lastOutcome: `${s.patronName}: “Sadakat unutulmaz. İyi.”`,
        }));
      },

      resign: () => {
        const s = get();
        const okRank =
          s.rank === "muavin" ||
          s.rank === "kaptan_yamagi" ||
          s.rank === "bagimsiz";
        const okMoney = s.savings >= 12000;
        const okLicense =
          s.licenseStatus === "onayli" || s.licenseStatus === "belediye_bekliyor";

        if (!okRank && !okMoney) {
          set({
            lastOutcome: `${s.patronName}: “Cebin boş, rütben düşük. Biraz daha çalış ${s.displayHitap}.”`,
          });
          return;
        }

        set({
          careerDone: true,
          drama: null,
          rank: okRank ? s.rank : "bagimsiz",
          licenseStatus: okLicense ? s.licenseStatus : "basvuru",
          licenseNote: okLicense
            ? LICENSE_LINES[s.licenseStatus]
            : "İstifa sonrası ruhsat başvurusu açıldı.",
          lastOutcome: `${s.patronName}: “Kapı orada. Peron unutmaz. Haydi.”`,
          log: [
            "İstifa — terminal / ruhsat yolu açıldı.",
            ...s.log,
          ].slice(0, 60),
        });
        get().pushLog("İstifa edildi");
      },

      tryPromote: () => {
        const s = get();
        const nxt = nextRank(s.rank);
        if (!nxt) return false;
        const need = rankNeed(nxt);
        if (
          s.trust >= need.trust &&
          s.fame >= need.fame &&
          s.savings >= need.savings &&
          s.tasksDone >= need.tasks
        ) {
          set({
            rank: nxt,
            lastOutcome: pick(PROMOTE_LINES[nxt] || ["Terfi."]),
          });
          get().pushLog(`Terfi → ${RANK_LABEL[nxt]}`);
          if (nxt === "bagimsiz") {
            get().markIndependent();
          } else if (nxt === "kaptan_yamagi") {
            set({
              licenseStatus: "basvuru",
              licenseNote: LICENSE_LINES.basvuru,
            });
            get().pushLog("Ruhsat başvurusu dosyası açıldı");
          }
          return true;
        }
        return false;
      },

      markIndependent: () => {
        set({
          careerDone: true,
          rank: "bagimsiz",
          drama: null,
          licenseStatus: "onayli",
          licenseNote: LICENSE_LINES.onayli,
          lastOutcome:
            "Bağımsız esnaf. Belediye mührü hayali — /setup ile yazıhaneni kur.",
        });
        get().pushLog("Bağımsız — ruhsat onaylı · /setup");
        try {
          useGameStore.getState().pushPhone?.(
            "Ahmet Eymen Bakraç",
            "Çıraklıktan çıktın. Portre duvarda, defter sende. Yurtta sulh."
          );
        } catch {
          /* */
        }
      },

      applyLicenseStep: () => {
        const s = get();
        if (s.licenseStatus === "yok" && s.rank !== "cirak") {
          set({
            licenseStatus: "basvuru",
            licenseNote: LICENSE_LINES.basvuru,
            lastOutcome:
              "Belediye kâğıdı: ‘Başvuru alındı. Kefil ve sicil kontrolü.’",
          });
          return;
        }
        if (s.licenseStatus === "basvuru" && s.caughtCount < 3) {
          set({
            licenseStatus: "belediye_bekliyor",
            licenseNote: LICENSE_LINES.belediye_bekliyor,
            lastOutcome: "Dosya sırada. Mühür için bekle.",
          });
          return;
        }
        if (
          s.licenseStatus === "belediye_bekliyor" &&
          s.daysWithoutCaught >= 3 &&
          s.trust >= 35
        ) {
          set({
            licenseStatus: "onayli",
            licenseNote: LICENSE_LINES.onayli,
            lastOutcome:
              "Mühür basıldı. Ruhsat onaylı — terminal kurma hakkı doğdu.",
          });
          get().pushLog("RUHŞAT ONAYLI");
          return;
        }
        if (s.licenseStatus === "iptal_riski" && s.daysWithoutCaught >= 5) {
          set({
            licenseStatus: "basvuru",
            licenseNote: "Sicil toparlanıyor. Yeniden başvuru.",
            lastOutcome: "İptal riski düştü. Tekrar dosya açıldı.",
          });
        }
      },

      clearOutcome: () =>
        set({ lastOutcome: null, mafiaWhisper: null }),
    }),
    {
      name: "otogar-career-v4",
      partialize: (s) => ({
        careerStarted: s.careerStarted,
        careerDone: s.careerDone,
        playerName: s.playerName,
        memleket: s.memleket,
        displayHitap: s.displayHitap,
        companyName: s.companyName,
        patronName: s.patronName,
        abiName: s.abiName,
        abi2Name: s.abi2Name,
        workCity: s.workCity,
        rank: s.rank,
        trust: s.trust,
        fame: s.fame,
        savings: s.savings,
        fatigue: s.fatigue,
        tasksDone: s.tasksDone,
        shiftsDone: s.shiftsDone,
        lastTaskDay: s.lastTaskDay,
        licenseStatus: s.licenseStatus,
        licenseNote: s.licenseNote,
        daysWithoutCaught: s.daysWithoutCaught,
        caughtCount: s.caughtCount,
        log: s.log.slice(0, 30),
      }),
    }
  )
);