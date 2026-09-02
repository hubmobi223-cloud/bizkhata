"use client";

import {
  Building2,
  CalendarCheck,
  Check,
  Flag,
  ListChecks,
  Package,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        "flex size-11 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
        state === "done" && "border-emerald-600 bg-emerald-600 text-white",
        state === "active" &&
          "border-blue-600 bg-blue-600 text-white",
        state === "pending" &&
          "border-slate-300 bg-white text-slate-500",
        state === "final" && "border-slate-900 bg-slate-900 text-white"
      )}
    >
      {children}
    </div>
  );
}

function StepLine({ state }: { state: "active" | "pending" | "final" }) {
  return (
    <div className="ml-[21px] h-8 w-0.5">
      <div
        className={cn(
          "h-full w-full",
          state === "active" ? "bg-slate-300" : "bg-slate-200"
        )}
      />
    </div>
  );
}

function OnboardingTimeline() {
  return (
    <div className="flex flex-col">
      {/* Step 1 - Complete */}
      <div className="flex items-start gap-4">
        <CircleIcon state="done">
          <Check className="size-5" />
        </CircleIcon>
        <div className="pt-2">
          <p className="font-semibold text-slate-900">Company Profile</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Setup your company and GST details
          </p>
        </div>
      </div>
      <StepLine state="active" />

      {/* Step 2 - Pending / next */}
      <div className="flex items-start gap-4">
        <CircleIcon state="pending">
          <ListChecks className="size-5" />
        </CircleIcon>
        <div className="pt-2 cursor-pointer rounded-lg px-1">
          <p className="font-semibold text-slate-700">Define Chart of Accounts</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Organize groups and ledgers for your books
          </p>
        </div>
      </div>
      <StepLine state="pending" />

      {/* Step 3 - Active */}
      <div className="flex items-start gap-4">
        <CircleIcon state="active">
          <CalendarCheck className="size-5" />
        </CircleIcon>
        <div className="pt-2 rounded-lg bg-blue-50/60 px-3 py-2 -ml-3">
          <p className="font-semibold text-blue-900">Active Financial Year</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Define your financial year to start transactions.
          </p>
        </div>
      </div>
      <StepLine state="pending" />

      {/* Step 4 - Pending */}
      <div className="flex items-start gap-4">
        <CircleIcon state="pending">
          <Package className="size-5" />
        </CircleIcon>
        <div className="pt-2">
          <p className="font-semibold text-slate-700">Setup Items &amp; Inventory</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Add products, units and stock levels
          </p>
        </div>
      </div>
      <StepLine state="final" />

      {/* Step 5 - Final */}
      <div className="flex items-start gap-4">
        <CircleIcon state="final">
          <Flag className="size-5" />
        </CircleIcon>
        <div className="pt-2">
          <p className="font-semibold text-slate-900">Ready for Business</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Start billing, vouchers and transactions
          </p>
        </div>
      </div>
    </div>
  );
}

export function Onboarding() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Get your company ready
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {isSupabaseConfigured()
            ? "A few quick steps to set up your company and start trading with BizKhata."
            : "Complete the setup below to begin."}
        </p>
      </div>

      {!isSupabaseConfigured() && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configuration required</CardTitle>
            <CardDescription>
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
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <Card className="p-2 sm:p-4">
          <CardHeader className="px-6 pt-6">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Sparkles className="size-4 text-blue-600" />
              Setup progress
            </div>
            <CardTitle className="text-xl">Onboarding timeline</CardTitle>
            <CardDescription>
              Track where you are in setting up your company.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <OnboardingTimeline />
          </CardContent>
        </Card>

        <div className="flex flex-col justify-center gap-4">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Building2 className="size-6" />
              </div>
              <CardTitle className="text-lg">Create your company</CardTitle>
              <CardDescription>
                {isSupabaseConfigured()
                  ? "Start by creating your first company. A seeded chart of accounts, default ledgers and the current financial year are set up automatically."
                  : "No companies found."}
              </CardDescription>
            </CardHeader>
            {isSupabaseConfigured() && (
              <CardContent className="pt-0">
                <CreateCompanyDialog
                  trigger={
                    <Button size="lg" className="w-full">
                      <Building2 />
                      Create company
                    </Button>
                  }
                />
              </CardContent>
            )}
          </Card>

          <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">What happens next?</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Company profile is saved</li>
              <li>Chart of accounts and default ledgers are seeded</li>
              <li>Financial year is activated</li>
              <li>You are added as the company owner</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
