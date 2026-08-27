import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(amount: number): string {
  const n = Math.round(amount);
  return (
    new Intl.NumberFormat("tr-TR", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(n) + " ₺"
  );
}

export function formatPercent(value: number): string {
  return `%${Math.round(value)}`;
}