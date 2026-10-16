/**
 * Tur 3 ekonomi yaması — layout içinde EconomyBootstrap ile bir kez çalışır.
 */
import { useGameStore } from "@/store/gameStore";

let applied = false;

export function applyEconomyBalance() {
  if (applied || typeof window === "undefined") return;
  applied = true;

  const api = useGameStore.getState() as any;

  if (api.fuelPrice && api.fuelPrice < 50) {
    useGameStore.setState({ fuelPrice: 58 });
  }

  useGameStore.setState({
    settleExpeditionProfit: (p: number) => {
      let net = p;
      if (net > 25000) {
        const windfall = Math.round((net - 25000) * 0.45);
        net -= windfall;
        useGameStore.getState().addLedger("Rüzgâr vergisi (fahiş sefer)", -windfall);
        useGameStore.getState().pushPhone(
          "Vergi Dairesi",
          `Fahiş sefer kârı incelendi. Ek kesinti ${windfall.toLocaleString("tr-TR")} ₺.`
        );
      } else if (net > 12000) {
        const windfall = Math.round((net - 12000) * 0.25);
        net -= windfall;
        useGameStore.getState().addLedger("Ek gelir payı", -windfall);
      }
      useGameStore.setState((s: any) => ({
        balance: s.balance + net,
        companyRevenue: (s.companyRevenue || 0) + Math.max(0, net),
        companyProfit: (s.companyProfit || 0) + net,
      }));
      useGameStore.getState().addLedger("Sefer kâr/zarar", net);
      if (net > 0) {
        useGameStore.getState().accrueTax(Math.round(net * 0.1));
      }
      if (net < -1500) {
        useGameStore.getState().pushPhone(
          "Muhasebe",
          "Bu sefer zarar yazdı. Fiyat veya ikramı gözden geçir."
        );
      }
      return net;
    },
  } as any);

  useGameStore.setState({
    signLoanContract: (principal: number, guarantor: string) => {
      const st = useGameStore.getState() as any;
      const cap = Math.min(
        60000,
        Math.max(8000, Math.round(st.balance * 1.2 + st.reputation * 400))
      );
      const p = Math.min(cap, Math.max(2000, Math.floor(principal)));
      if (p < 2000 || st.bankDebt > 40000) {
        st.pushPhone?.("Ahmet Bankacılık", "Kredi reddedildi.");
        return false;
      }
      if (st.loanContract?.active) {
        st.pushPhone?.("Ahmet Bankacılık", "Önce mevcut taksiti kapat.");
        return false;
      }
      const g = (guarantor || "Kefil belirsiz").trim().slice(0, 28);
      const totalDue = Math.round(p * 1.22);
      const day = st.gameDay;
      const dueDay = day + 10;
      const month = ((dueDay % 12) + 1).toString().padStart(2, "0");
      const dom = ((dueDay % 27) + 1).toString().padStart(2, "0");
      const dueLabel = `${dom}.${month}.1987`;
      useGameStore.setState((s: any) => ({
        balance: s.balance + p,
        bankDebt: s.bankDebt + totalDue,
        loanContract: {
          principal: p,
          totalDue,
          paid: 0,
          guarantor: g,
          signedAtDay: day,
          dueDay,
          dueLabel,
          active: true,
          lawsuit: false,
        },
        lastDebtInterestDay: day,
      }));
      useGameStore.getState().addLedger(`Kredi imzalı (${g})`, p);
      useGameStore
        .getState()
        .pushPhone(
          "Ahmet Bankacılık",
          `Kredi onay. Toplam borç ${totalDue.toLocaleString("tr-TR")} ₺ · vade ${dueLabel}`
        );
      return true;
    },
  } as any);

  useGameStore.setState({
    priceCapMultiplier: () => {
      const g = useGameStore.getState() as any;
      let m = 1;
      if (g.bayramActive) m *= 1.18;
      if (g.calendarMood === "national") m *= 1.08;
      if (g.calendarMood === "mourning") m *= 0.85;
      if (g.rivalWeak) m *= 1.05;
      return Math.min(1.35, m);
    },
  } as any);

  const origTick = (useGameStore.getState() as any).tickGameTime;
  if (typeof origTick === "function") {
    useGameStore.setState({
      tickGameTime: () => {
        const lastI = (useGameStore.getState() as any).lastDebtInterestDay || 0;
        origTick.call(useGameStore.getState());
        const after = useGameStore.getState() as any;
        if (
          after.bankDebt > 0 &&
          after.gameDay - lastI >= 7 &&
          after.lastDebtInterestDay === lastI
        ) {
          const interest = Math.max(120, Math.round(after.bankDebt * 0.035));
          useGameStore.setState((s: any) => ({
            bankDebt: s.bankDebt + interest,
            lastDebtInterestDay: s.gameDay,
          }));
          useGameStore.getState().addLedger("Banka faiz", -interest);
          useGameStore
            .getState()
            .pushPhone(
              "Ahmet Bankacılık",
              `Faiz işletildi: +${interest.toLocaleString("tr-TR")} ₺ borç.`
            );
        }
      },
    } as any);
  }
}
