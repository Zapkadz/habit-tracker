import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricTone = "neutral" | "blue" | "green" | "amber" | "red";

type PlaceholderMetric = {
  label: string;
  value: string;
  caption: string;
  tone?: MetricTone;
};

type PlaceholderSection = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type PagePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  metrics: PlaceholderMetric[];
  sections: PlaceholderSection[];
};

const metricToneClass: Record<MetricTone, string> = {
  neutral: "border-slate-200 bg-white text-slate-950",
  blue: "border-blue-100 bg-blue-50 text-blue-950",
  green: "border-emerald-100 bg-emerald-50 text-emerald-950",
  amber: "border-amber-100 bg-amber-50 text-amber-950",
  red: "border-rose-100 bg-rose-50 text-rose-950",
};

export function PagePlaceholder({
  eyebrow,
  title,
  description,
  metrics,
  sections,
}: PagePlaceholderProps) {
  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white px-5 py-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {eyebrow}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {description}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
            Phase 0 placeholder
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card
            key={metric.label}
            size="sm"
            className={cn(
              "rounded-lg border shadow-sm ring-0",
              metricToneClass[metric.tone ?? "neutral"]
            )}
          >
            <CardHeader>
              <CardDescription className="text-xs font-medium uppercase tracking-wider text-current/60">
                {metric.label}
              </CardDescription>
              <CardTitle className="text-2xl font-semibold">
                {metric.value}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs leading-5 text-current/65">
                {metric.caption}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-3 lg:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <Card
              key={section.title}
              size="sm"
              className="rounded-lg border border-slate-200 bg-white shadow-sm ring-0"
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                      <Icon className="size-4" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-sm font-semibold">
                      {section.title}
                    </CardTitle>
                  </div>
                  <ArrowRight
                    className="size-4 text-slate-300"
                    aria-hidden="true"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-slate-600">
                  {section.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
