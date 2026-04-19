import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type Tone = "neutral" | "blue" | "green" | "red" | "yellow" | "purple";

const tones: Record<Tone, string> = {
  neutral: "bg-surface text-ink-muted",
  blue: "bg-accent-blue-soft text-accent-blue",
  green: "bg-accent-green-soft text-accent-green",
  red: "bg-accent-red-soft text-accent-red",
  yellow: "bg-accent-yellow-soft text-[#976c00]",
  purple: "bg-accent-purple-soft text-accent-purple",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return <span className={cn("notion-chip", tones[tone], className)} {...props} />;
}
