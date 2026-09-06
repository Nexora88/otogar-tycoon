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
  rankThreshold,
  RANK_LABEL,
  JOB_OFFERS,
  MAFIA_HEADLINES,
  MEMLEKET_HITAP,
} from "@/data/apprenticeContent";
import { getGlobalGameClock } from "@/lib/gameTime";

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
  shiftBand: ShiftBand;
  shiftLabelText: string;
  tasks: WorkTask[];
  activeTask: WorkTask | null;
  lastOutcome: string | null;
  patronCalling: boolean;
  jobOffer: { company: string; body: string } | null;
  mafiaWhisper: string | null;
  log: string[];

  startCareer: (name: string, memleket: string) => void;
  syncShiftFromClock: () => void;
  rollShiftTasks: () => void;
  openTask: (id: string) => void;
  resolveOption: (opt: DialogueOption) => void;
  triggerPatronCall: () => void;
  answerPatronCall: () => void;
  ignorePatronCall: () => void;
  rollJobOffer: () => void;
  acceptJobOffer: () => void;
  refuseJobOffer: () => void;
  resign: () => void;
  tryPromote: () => boolean;
  clearOutcome: () => void;
  pushLog: (line: string) => void;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

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
      trust: 8,
      fame: 0,
      savings: 400,
      fatigue: 10,
      shiftBand: "morning",
      shiftLabelText: "Sabah vardiyası",
      tasks: [],
      activeTask: null,
      lastOutcome: null,
      patronCalling: false,
      jobOffer: null,
      mafiaWhisper: null,
      log: [],

      pushLog: (line) =>
        set((s) => ({ log: [line, ...s.log].slice(0, 40) })),

      startCareer: (name, memleket) => {
        const n = name.trim().slice(0, 20) || "Çırak";
        const mem =
          memleket.trim() ||
          MEMLEKET_HITAP[Math.floor(Math.random() * MEMLEKET_HITAP.length)]!;
        const company = randomCompany();
        const patron = randomPatronName();
        const abi = randomAbiName();
        const abi2 = randomAbiName();
        const cities = [
          "İstanbul",
          "Ankara",
          "İzmir",
          "Bursa",
          "Adana",
          "Samsun",
          "Edirne",
        ];
        const workCity =
          Math.random() > 0.35
            ? "İstanbul"
            : cities[Math.floor(Math.random() * cities.length)]!;

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
          trust: 8,
          fame: 0,
          savings: 400,
          fatigue: 10,
          tasks: [],
          activeTask: null,
          lastOutcome: null,
          patronCalling: false,
          jobOffer: null,
          mafiaWhisper: null,
          log: [
            `${workCity} · ${company}. Patron: ${patron}. Abi: ${abi}.`,
            `Hitap: ${hitap(mem, n)}. Vardiyaya yazıldın.`,
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
        const tasks = generateShiftTasks({
          band: get().shiftBand,
          patronName: s.patronName,
          abiName: Math.random() > 0.5 ? s.abiName : s.abi2Name,
          count: 3,
        });
        set({ tasks, activeTask: null });
        get().pushLog(
          `${get().shiftLabelText}: ${tasks.length} iş yazıldı.`
        );
        if (Math.random() > 0.72) get().triggerPatronCall();
        if (Math.random() > 0.85) get().rollJobOffer();
        if (Math.random() > 0.9) {
          const h =
            MAFIA_HEADLINES[
              Math.floor(Math.random() * MAFIA_HEADLINES.length)
            ]!;
          set({ mafiaWhisper: h });
          get().pushLog(`Fısıltı / manşet: ${h}`);
        }
      },

      openTask: (id) => {
        const t = get().tasks.find((x) => x.id === id) || null;
        set({ activeTask: t, lastOutcome: null });
      },

      resolveOption: (opt) => {
        const task = get().activeTask;
        if (!task) return;

        let caught = false;
        const fatigueBonus = get().fatigue / 200;
        const risk = Math.min(0.85, opt.risk + fatigueBonus);

        if (opt.tone === "crooked" && Math.random() < risk) {
          caught = true;
        }
        if (task.kind === "rusvet" && opt.id.includes("snitch") && Math.random() < 0.4) {
          caught = true;
        }

        let trustD = opt.trustDelta;
        let moneyD = opt.moneyDelta;
        let fameD = 0;

        if (caught) {
          trustD = -8;
          moneyD = -Math.abs(opt.moneyDelta) - 30;
          fameD = -2;
        } else {
          if (opt.tone === "obedient") fameD += Math.random() > 0.7 ? 1 : 0;
          if (opt.tone === "honest") fameD += 1;
        }

        const line = outcomeFor(opt.tone, caught);
        const speaker = task.speakerName;

        set((s) => ({
          trust: clamp(s.trust + trustD, 0, 100),
          fame: clamp(s.fame + fameD, 0, 100),
          savings: Math.max(0, s.savings + moneyD),
          fatigue: clamp(s.fatigue + (opt.tone === "lazy" ? 2 : 6), 0, 100),
          tasks: s.tasks.filter((t) => t.id !== task.id),
          activeTask: null,
          lastOutcome: `${speaker}: “${line}”`,
          log: [
            `[${task.kind}] ${opt.label} → ${line}`,
            ...s.log,
          ].slice(0, 40),
        }));

        get().tryPromote();
      },

      triggerPatronCall: () => {
        set({ patronCalling: true });
        get().pushLog("PATRON ÇAĞIRDI — yazıhaneye.");
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
          trust: clamp(s.trust + 1, 0, 100),
        });
        get().pushLog("Yazıhaneye girdin.");
      },

      ignorePatronCall: () => {
        set((s) => ({
          patronCalling: false,
          trust: clamp(s.trust - 4, 0, 100),
          fatigue: clamp(s.fatigue + 3, 0, 100),
          lastOutcome: `${s.patronName}: “Seni iki saattir arıyorum. Gözüm üstünde.”`,
        }));
        get().pushLog("Çağrıyı yok saydın. Güven düştü.");
      },

      rollJobOffer: () => {
        const offer =
          JOB_OFFERS[Math.floor(Math.random() * JOB_OFFERS.length)]!;
        set({ jobOffer: offer });
        get().pushLog(`İş teklifi: ${offer.company}`);
      },

      acceptJobOffer: () => {
        const o = get().jobOffer;
        if (!o) return;
        set((s) => ({
          jobOffer: null,
          companyName: o.company,
          patronName: randomPatronName(),
          abiName: randomAbiName(),
          trust: 12,
          fame: clamp(s.fame + 5, 0, 100),
          lastOutcome: `${o.company}: “Yarın peronda ol. Yeni sayfa.”`,
        }));
        get().pushLog(`Teklif kabul: ${o.company}`);
        get().rollShiftTasks();
      },

      refuseJobOffer: () => {
        set((s) => ({
          jobOffer: null,
          trust: clamp(s.trust + 2, 0, 100),
          lastOutcome: `${s.patronName}: “Sadakat unutulmaz.”`,
        }));
        get().pushLog("Teklif reddedildi.");
      },

      resign: () => {
        set((s) => ({
          careerDone: true,
          lastOutcome: `${s.patronName}: “Kapı orada. Peron unutmaz.”`,
          log: ["İstifa ettin. Kendi yolun başlıyor.", ...s.log],
        }));
      },

      tryPromote: () => {
        const s = get();
        const nxt = nextRank(s.rank);
        if (!nxt) return false;
        const need = rankThreshold(nxt);
        if (
          s.trust >= need.trust &&
          s.fame >= need.fame &&
          s.savings >= need.savings
        ) {
          set({
            rank: nxt,
            lastOutcome: `Rütbe: ${RANK_LABEL[nxt]}. Peron seni konuşuyor.`,
          });
          get().pushLog(`Terfi: ${RANK_LABEL[nxt]}`);
          if (nxt === "bagimsiz") {
            set({ careerDone: true });
            get().pushLog("Bağımsız esnaf — kendi işin açılabilir.");
          }
          return true;
        }
        return false;
      },

      clearOutcome: () => set({ lastOutcome: null, mafiaWhisper: null }),
    }),
    { name: "otogar-career-v1" }
  )
);