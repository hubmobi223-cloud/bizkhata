"use client";

import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Check,
  Flag,
  ListChecks,
  Package,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { CreateCompanyDialog } from "./create-company-dialog";
import { cn } from "@/lib/utils";

function CircleIcon({
  state,
  children,
}: {
  state: "done" | "active" | "pending" | "final";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
        state === "done" &&
          "border-emerald-500 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/40",
        state === "active" && [
          "size-14 border-blue-400 bg-gradient-to-br from-blue-500 to-indigo-600 text-white",
          "shadow-xl shadow-blue-500/50",
        ],
        state === "pending" &&
          "border-slate-300 bg-white/80 text-slate-400 dark:border-slate-600 dark:bg-slate-800/60",
        state === "final" &&
          "border-slate-900 bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-lg shadow-slate-900/40 dark:border-slate-500"
      )}
    >
      {children}
    </div>
  );
}

interface StepProps {
  title: string;
  sub: string;
  state: "done" | "active" | "pending" | "final";
  icon: React.ReactNode;
}

function Step({ title, sub, state, icon }: StepProps) {
  const isActive = state === "active";
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-2xl border p-3 transition-all duration-300",
        isActive &&
          "border-blue-400/60 scale-[1.03] bg-white shadow-xl shadow-blue-500/10 dark:bg-slate-900/70 dark:shadow-blue-500/20"
      )}
    >
      <CircleIcon state={state}>
        {state === "done" ? (
          <Check className="size-6" />
        ) : (
          <span className="flex">{icon}</span>
        )}
      </CircleIcon>
      <div className="min-w-0 flex-1 pt-1.5">
        <p
          className={cn(
            "font-semibold",
            state === "done" && "text-slate-900 dark:text-white",
            isActive &&
              "animate-[iconPulse_2s_ease-in-out_infinite] text-blue-700 dark:text-blue-400",
            state === "pending" && "text-slate-500 dark:text-slate-400",
            state === "final" && "text-slate-900 dark:text-white"
          )}
        >
          {title}
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

function OnboardingTimeline() {
  return (
    <div className="flex flex-col gap-1">
      <Step
        title="Company Profile"
        sub="Setup your company and GST details"
        state="done"
        icon={<Check className="size-6" />}
      />

      <Step
        title="Define Chart of Accounts"
        sub="Organize groups and ledgers for your books"
        state="pending"
        icon={<ListChecks className="size-6" />}
      />

      <Step
        title="Active Financial Year"
        sub="Define your financial year to start transactions."
        state="active"
        icon={<CalendarCheck className="size-6" />}
      />

      <Step
        title="Setup Items & Inventory"
        sub="Add products, units and stock levels"
        state="pending"
        icon={<Package className="size-6" />}
      />

      <Step
        title="Ready for Business"
        sub="Start billing, vouchers and transactions"
        state="final"
        icon={<Flag className="size-6" />}
      />
    </div>
  );
}

export function Onboarding() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      <div
        className="space-y-2"
        style={{ animation: "fadeInUp 0.4s ease-out both" }}
      >
        <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
          <Sparkles className="size-4" />
          Setup progress
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Get your company ready
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {isSupabaseConfigured()
            ? "A few quick steps to set up your company and start trading with BizKhata."
            : "Complete the setup below to begin."}
        </p>
      </div>

      {!isSupabaseConfigured() && (
        <div
          className="rounded-2xl border border-white/20 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:bg-slate-900/60"
          style={{ animation: "fadeInUp 0.4s ease-out both" }}
        >
          <p className="text-base font-semibold text-foreground">
            Configuration required
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Supabase is not configured yet. Add{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              NEXT_PUBLIC_SUPABASE_URL
            </code>{" "}
            and{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>{" "}
            to{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              .env.local
            </code>
            , then run the Phase 1 SQL scripts in the Supabase SQL editor before
            continuing.
          </p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div
          className="rounded-3xl border border-white/20 bg-white/70 p-4 shadow-2xl shadow-indigo-500/5 backdrop-blur-xl dark:bg-slate-900/60 sm:p-6"
          style={{ animation: "fadeInUp 0.5s ease-out both" }}
        >
          <div className="mb-6">
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              Onboarding timeline
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Track where you are in setting up your company.
            </p>
          </div>
          <OnboardingTimeline />
        </div>

        <div className="flex flex-col justify-center gap-4">
          <div
            className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-[1px] shadow-2xl shadow-indigo-500/20"
            style={{ animation: "fadeInUp 0.6s ease-out both" }}
          >
            <div className="rounded-3xl p-6 text-white">
              <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <Building2 className="size-6" />
              </div>
              <h3 className="text-lg font-bold tracking-tight">
                Create your company
              </h3>
              <p className="mt-1.5 text-sm text-white/80">
                {isSupabaseConfigured()
                  ? "Start by creating your first company. A seeded chart of accounts, default ledgers and the current financial year are set up automatically."
                  : "No companies found."}
              </p>
              {isSupabaseConfigured() && (
                <div className="mt-5">
                  <CreateCompanyDialog
                    trigger={
                      <Button
                        size="lg"
                        className="group relative w-full overflow-hidden rounded-xl bg-white text-indigo-700 shadow-lg shadow-black/10 transition-transform duration-200 hover:scale-[1.03] hover:bg-white"
                      >
                        <span
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent bg-[length:200%_100%] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          style={{
                            backgroundImage:
                              "linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.7) 50%, transparent 80%)",
                            animation: "shimmer 2s linear infinite",
                            backgroundSize: "200% 100%",
                          }}
                        />
                        <span className="relative flex items-center gap-2">
                          <Building2 />
                          Create company
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </Button>
                    }
                  />
                </div>
              )}
            </div>
          </div>

          <div
            className="rounded-2xl border border-white/20 bg-white/60 p-4 text-sm text-muted-foreground shadow-lg backdrop-blur-xl dark:bg-slate-900/50"
            style={{ animation: "fadeInUp 0.7s ease-out both" }}
          >
            <p className="font-semibold text-foreground">What happens next?</p>
            <ul className="mt-2 space-y-1.5 pl-1">
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-500" />
                Company profile is saved
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-500" />
                Chart of accounts and default ledgers are seeded
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-500" />
                Financial year is activated
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-500" />
                You are added as the company owner
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
