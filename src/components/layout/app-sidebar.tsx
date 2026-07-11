"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CalendarCheck,
  CalendarDays,
  CalendarRange,
  LayoutDashboard,
  ListChecks,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { label: "Today", href: "/today", icon: LayoutDashboard },
  { label: "Week", href: "/week", icon: CalendarRange },
  { label: "Month", href: "/month", icon: CalendarDays },
  { label: "Habits", href: "/habits", icon: CalendarCheck },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || (href === "/today" && pathname === "/");
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="border-b border-slate-200 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <ListChecks className="size-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-5">
                Habit Tracker
              </p>
              <p className="text-xs text-slate-500">Routine Balance</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950",
                  active &&
                    "bg-slate-900 text-white hover:bg-slate-900 hover:text-white"
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Local First
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Private SQLite data on this machine.
          </p>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-slate-200 bg-white/95 shadow-sm backdrop-blur lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-w-0 flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] font-medium text-slate-500",
                active && "text-slate-950"
              )}
            >
              <Icon
                className={cn(
                  "size-4",
                  active && "rounded-md bg-slate-900 p-0.5 text-white"
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
