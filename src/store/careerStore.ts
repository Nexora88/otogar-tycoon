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
      return { trust: 10, fame: 3, savings: 800, tasks: 6 };
    case "muavin":
      return { trust: 22, fame: 10, savings: 3500, tasks: 14 };
    case "kaptan_yamagi":
      return { trust: 38, fame: 20, savings: 12000, tasks: 24 };
    case "bagimsiz":
      return { trust: 50, fame: 32, savings: 28000, tasks: 36 };
  }
}

function wageFor(rank: CareerRank): number {
  switch (rank) {
    case "cirak":
      return 35;
    case "yamak":
      return 55;
    case "muavin":
      return 90;
    case "kaptan_yamagi":
      return 130;
    case "bagimsiz":
      return 0;
  }
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

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

      canFoundTerminal: () => {
        const s = get();
        return s.careerDone || s.rank === "bagimsiz";
      },

      pushLog: (line) =>
        set((s) => ({ log: [line, ...s.log].slice(0, 50) })),

      startCareer: (name, memleket) => {
        const n = name.trim().slice(0, 24) || "Çırak";
        const mem =
          memleket.trim() ||
          MEMLEKET_HITAP[Math.floor(Math.random() * MEMLEKET_HITAP.length)]!;

        const near: Record<string, string[]> = {
          Keşanlı: ["Edirne", "İstanbul", "Tekirdağ"],
          Edirneli: ["Edirne", "İstanbul"],
          Samsunlu: ["Samsun", "İstanbul", "Ankara"],
          Trabzonlu: ["Samsun", "Trabzon", "Ankara"],
          Ankaralı: ["Ankara", "İstanbul"],
          İzmirli: ["İzmir", "İstanbul"],
          Adanalı: ["Adana", "Ankara", "İstanbul"],
          Bursalı: ["Bursa", "İstanbul"],
        };
        const pool = near[mem] || ["İstanbul", "Ankara", "İzmir"];
        const workCity =
          Math.random() > 0.4
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
          trust: 10,
          fame: 0,
          savings: 500,
          fatigue: 0,
          tasksDone: 0,
          shiftsDone: 0,
          lastTaskDay: -1,
          tasks: [],
          activeTask: null,
          lastOutcome: null,
          patronCalling: false,
          jobOffer: null,
          mafiaWhisper: null,
          drama: null,
          log: [
            `${workCity} · ${company}`,
            `Patron ${patron} · ${abi} / ${abi2}`,
            `Hitap: ${hitap(mem, n)}. Sefer yok — sadece yardım.`,
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
            fatigue: clamp(st.fatigue + 4, 0, 100),
            lastOutcome: "Aynı gün ikinci vardiya — yorgunluk arttı.",
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

        if (Math.random() > 0.65) get().triggerPatronCall();
        if (Math.random() > 0.82) get().rollJobOffer();
        if (Math.random() > 0.88) {
          const h =
            MAFIA_HEADLINES[
              Math.floor(Math.random() * MAFIA_HEADLINES.length)
            ]!;
          set({ mafiaWhisper: h });
        }
        if (Math.random() > 0.5) get().maybeRollDrama();
      },

      openTask: (id) => {
        const t = get().tasks.find((x) => x.id === id) || null;
        set({ activeTask: t, lastOutcome: null });
      },

      resolveOption: (opt) => {
        const task = get().activeTask;
        if (!task) return;

        const s0 = get();
        const fatigueRisk = s0.fatigue / 180;
        const risk = Math.min(0.9, opt.risk + fatigueRisk);

        let caught = false;
        if (opt.tone === "crooked" && Math.random() < risk) caught = true;
        if (
          task.kind === "rusvet" &&
          opt.label.toLowerCase().includes("patron") &&
          Math.random() < 0.45
        ) {
          caught = true;
        }

        let trustD = opt.trustDelta;
        let moneyD = opt.moneyDelta;
        let fameD = 0;
        const baseWage = wageFor(s0.rank);

        if (caught) {
          trustD = -10;
          moneyD = -Math.abs(opt.moneyDelta) - 40;
          fameD = -3;
        } else {
          moneyD += baseWage;
          if (opt.tone === "obedient" && Math.random() > 0.75) fameD += 1;
          if (opt.tone === "honest") fameD += 1;
          if (task.kind === "pis" && opt.tone === "obedient") trustD += 1;
        }

        const line = outcomeFor(opt.tone, caught);
        const speaker = task.speakerName;

        set((s) => ({
          trust: clamp(s.trust + trustD, 0, 100),
          fame: clamp(s.fame + fameD, 0, 100),
          savings: Math.max(0, s.savings + moneyD),
          fatigue: clamp(
            s.fatigue + (opt.tone === "lazy" ? 3 : 7) + (caught ? 5 : 0),
            0,
            100
          ),
          tasksDone: s.tasksDone + 1,
          tasks: s.tasks.filter((t) => t.id !== task.id),
          activeTask: null,
          lastOutcome: `${speaker}: “${line}”${
            !caught && baseWage > 0
              ? ` · +${baseWage + Math.max(0, opt.moneyDelta)} ₺`
              : ""
          }`,
          log: [
            `[${task.kind}] ${opt.label} → ${caught ? "YAKALANDI" : "ok"}`,
            ...s.log,
          ].slice(0, 50),
        }));

        get().tryPromote();
        if (Math.random() > 0.4) get().maybeRollDrama();
      },

      rest: () => {
        set((s) => ({
          fatigue: clamp(s.fatigue - 25, 0, 100),
          lastOutcome: "Köşede 10 dk. Biraz toparlandın.",
        }));
      },

      maybeRollDrama: () => {
        if (get().careerDone || get().drama || get().activeTask) return;
        if (Math.random() > 0.55) return;
        set({ drama: rollDramaEvent() });
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
          log: [`[Olay] ${d.title}: ${ch.label}`, ...s.log].slice(0, 50),
        }));

        if (d.kind === "fight" || d.kind === "mafia") {
          try {
            const day = useGameStore.getState().gameDay;
            useGameStore.setState((s) => ({
              eveningPaper: [
                {
                  id: `dr-news-${Date.now()}`,
                  headline:
                    d.kind === "mafia"
                      ? "Peron fısıltısı: ağır ziyaret"
                      : `Peronda arbede: ${d.title}`,
                  body: d.body.slice(0, 160),
                  kind: "rival" as const,
                  aboutPlayer: true,
                  day,
                },
                ...s.eveningPaper,
              ].slice(0, 8),
              paperNotify: "evening",
            }));
          } catch {
            /* ignore */
          }
        }
      },

      triggerPatronCall: () => {
        if (get().careerDone) return;
        set({ patronCalling: true });
        get().pushLog("PATRON ÇAĞIRDI");
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
      },

      ignorePatronCall: () => {
        set((s) => ({
          patronCalling: false,
          trust: clamp(s.trust - 5, 0, 100),
          lastOutcome: `${s.patronName}: “İki saattir yoksun. Gözüm üstünde.”`,
        }));
      },

      rollJobOffer: () => {
        if (get().rank === "cirak" && get().tasksDone < 5) return;
        const offer =
          JOB_OFFERS[Math.floor(Math.random() * JOB_OFFERS.length)]!;
        set({ jobOffer: offer });
        get().pushLog(`Teklif: ${offer.company}`);
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
          trust: clamp(Math.max(12, s.trust - 5), 0, 100),
          fame: clamp(s.fame + 4, 0, 100),
          lastOutcome: `${o.company}: “Yarın peronda. Yeni sayfa.”`,
        }));
        get().rollShiftTasks();
      },

      refuseJobOffer: () => {
        set((s) => ({
          jobOffer: null,
          trust: clamp(s.trust + 3, 0, 100),
          lastOutcome: `${s.patronName}: “Sadakat unutulmaz.”`,
        }));
      },

      resign: () => {
        const s = get();
        const okRank =
          s.rank === "muavin" ||
          s.rank === "kaptan_yamagi" ||
          s.rank === "bagimsiz";
        const okMoney = s.savings >= 12000;

        if (!okRank && !okMoney) {
          set({
            lastOutcome: `${s.patronName}: “Cebin boş, rütben düşük. Biraz daha çalış.”`,
          });
          return;
        }

        set({
          careerDone: true,
          drama: null,
          lastOutcome: `${s.patronName}: “Kapı orada. Peron unutmaz.”`,
          log: [
            "İstifa — terminal kurma hakkı açıldı.",
            ...s.log,
          ].slice(0, 50),
        });
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
            lastOutcome: `Terfi: ${RANK_LABEL[nxt]}`,
          });
          get().pushLog(`Terfi → ${RANK_LABEL[nxt]}`);
          if (nxt === "bagimsiz") get().markIndependent();
          return true;
        }
        return false;
      },

      markIndependent: () => {
        set({
          careerDone: true,
          rank: "bagimsiz",
          drama: null,
          lastOutcome:
            "Bağımsız esnaf. Belediyeden terminal ruhsatı alabilirsin.",
        });
        get().pushLog("Bağımsız — /setup açık");
      },

      clearOutcome: () =>
        set({ lastOutcome: null, mafiaWhisper: null }),
    }),
    { name: "otogar-career-v3" }
  )
);