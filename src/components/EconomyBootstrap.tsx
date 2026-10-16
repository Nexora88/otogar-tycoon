"use client";
import { useEffect } from "react";
import { applyEconomyBalance } from "@/lib/applyEconomyBalance";

/** Game shell içinde bir kez ekonomi kurallarını uygular */
export default function EconomyBootstrap() {
  useEffect(() => {
    applyEconomyBalance();
  }, []);
  return null;
}
