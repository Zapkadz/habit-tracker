import { Database, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-[#f5f6f8]/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">
            Routine Balance Dashboard
          </p>
          <p className="hidden text-xs text-slate-500 sm:block">
            Daily-first, weekly-balanced, monthly-reviewed.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-lg border-slate-300 bg-white text-slate-600"
          >
            <Database className="size-3" aria-hidden="true" />
            SQLite
          </Badge>
          <Badge
            variant="outline"
            className="hidden rounded-lg border-slate-300 bg-white text-slate-600 sm:inline-flex"
          >
            <ShieldCheck className="size-3" aria-hidden="true" />
            Local
          </Badge>
        </div>
      </div>
    </header>
  );
}
