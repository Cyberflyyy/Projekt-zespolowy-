import { cn } from "@/lib/utils/cn";

export function Separator({ className }: { className?: string }) {
  return <div className={cn("notion-divider", className)} />;
}
