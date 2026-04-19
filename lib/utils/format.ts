import { format, formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";

export function formatMoney(minor: number, currency = "pln"): string {
  const amount = minor / 100;
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatDateLong(input: string | Date): string {
  return format(new Date(input), "d MMMM yyyy, HH:mm", { locale: pl });
}

export function formatDateShort(input: string | Date): string {
  return format(new Date(input), "d MMM, HH:mm", { locale: pl });
}

export function formatRelative(input: string | Date): string {
  return formatDistanceToNow(new Date(input), { addSuffix: true, locale: pl });
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}
