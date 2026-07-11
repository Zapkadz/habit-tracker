"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="rounded-lg border border-rose-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
          <AlertTriangle className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold text-slate-950">
            Something went wrong
          </h1>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            The page failed to load. Try again, then check the terminal if it
            keeps happening.
          </p>
          <p className="mt-2 truncate rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
            {error.message}
          </p>
          <Button type="button" onClick={reset} className="mt-4">
            <RotateCcw className="size-4" aria-hidden="true" />
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
