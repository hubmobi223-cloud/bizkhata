"use client";

import Link from "next/link";
import {
  BarChart3,
  BookOpenText,
  Boxes,
  FileText,
  LineChart,
  ScrollText,
} from "lucide-react";
import { useCompany } from "@/components/company/company-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const REPORTS: Array<{
  href: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    href: "/reports/trial-balance",
    title: "Trial Balance",
    desc: "Opening, period and net balances for every ledger.",
    icon: ScrollText,
  },
  {
    href: "/reports/profit-loss",
    title: "Profit & Loss",
    desc: "Income and expenses for the period with net profit/loss.",
    icon: LineChart,
  },
  {
    href: "/reports/balance-sheet",
    title: "Balance Sheet",
    desc: "Assets, liabilities and current-period profit position.",
    icon: BarChart3,
  },
  {
    href: "/reports/ledger-statement",
    title: "Ledger Statement",
    desc: "Date-wise debit/credit with running balance for any ledger.",
    icon: BookOpenText,
  },
  {
    href: "/reports/stock-summary",
    title: "Stock Summary",
    desc: "Current quantity and valuation of every item in stock.",
    icon: Boxes,
  },
];

export default function ReportsPage() {
  const { activeCompany, activeFY } = useCompany();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Financial and inventory reports for{" "}
            {activeCompany ? activeCompany.name : "company"} /
            {activeFY ? ` FY ${activeFY.name}` : " current year"}.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REPORTS.map((r) => (
          <Link key={r.href} href={r.href} className="group">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="space-y-1.5">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <r.icon className="size-4 text-primary" />
                    {r.title}
                  </CardTitle>
                  <CardDescription className="leading-relaxed">
                    {r.desc}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <FileText className="size-10 text-muted-foreground/30 transition-colors group-hover:text-primary/40" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
