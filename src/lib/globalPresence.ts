import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

let lobbyChannel: RealtimeChannel | null = null;

export type GlobalPulse = {
  online: number;
  live: boolean;
};

/** Site geneli “lobide kim var” — tek kanal */
export async function subscribeGlobalPresence(
  displayName: string,
  onPulse: (p: GlobalPulse) => void
): Promise<() => void> {
  if (!isSupabaseConfigured()) {
    onPulse({ online: 1, live: false });
    return () => {};
  }

  const sb = getSupabase()!;
  if (lobbyChannel) {
    sb.removeChannel(lobbyChannel);
    lobbyChannel = null;
  }

  lobbyChannel = sb.channel("otogar-global-lobby", {
    config: { presence: { key: `${displayName}-${Math.random().toString(36).slice(2, 6)}` } },
  });

  lobbyChannel.on("presence", { event: "sync" }, () => {
    const state = lobbyChannel?.presenceState() || {};
    onPulse({ online: Object.keys(state).length, live: true });
  });

  await new Promise<void>((resolve) => {
    lobbyChannel!.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await lobbyChannel!.track({
          name: displayName || "Misafir",
          at: Date.now(),
        });
        resolve();
      }
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") resolve();
    });
  });

  return () => {
    if (lobbyChannel) {
      sb.removeChannel(lobbyChannel);
      lobbyChannel = null;
    }
  };
}

/** Landing için sefer nabzı — presence yoksa tahmini + online çarpanı */
export function estimateSeferCount(online: number) {
  const base = 40 + (online || 1) * 12;
  const wobble = Math.floor(Math.sin(Date.now() / 20000) * 8 + 8);
  return base + wobble;
}

export function estimatePeronSavasi(online: number) {
  return Math.max(1, Math.floor((online || 1) * 1.4) + (Date.now() % 5));
}