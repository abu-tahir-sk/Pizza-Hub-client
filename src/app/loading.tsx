import { Pizza } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <div className="relative grid size-16 place-items-center rounded-full bg-[#c8402b]/10 text-[#c8402b] animate-pulse">
        <Pizza className="size-8 animate-spin" />
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        Preparing something delicious…
      </p>
    </div>
  );
}
