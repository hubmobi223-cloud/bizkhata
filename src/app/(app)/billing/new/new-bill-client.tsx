"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useCompany } from "@/components/company/company-provider";
import { Onboarding } from "@/components/company/onboarding";
import { BillForm } from "@/components/billing/bill-form";
import { fetchBillingLedgers } from "@/lib/api/billing";
import { fetchItems } from "@/lib/api/inventory";
import type { BillingLedgers, ItemRow } from "@/lib/types";

export function NewBillClient({
  initialMode,
  hideTabs = false,
}: {
  initialMode: "sales" | "purchase" | "credit_note" | "debit_note";
  hideTabs?: boolean;
}) {
  const { companies, activeCompany, activeFY, isLoadingFY } = useCompany();
  const [mode, setMode] = useState<"sales" | "purchase" | "credit_note" | "debit_note">(initialMode);
  const [ledgers, setLedgers] = useState<BillingLedgers | null>(null);
  const [items, setItems] = useState<ItemRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    if (!activeCompany) return;
    Promise.all([
      fetchBillingLedgers(activeCompany.id),
      fetchItems(activeCompany.id),
    ])
      .then(([ledgerData, itemData]) => {
        if (!cancelled) {
          setLedgers(ledgerData);
          setItems(itemData);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLedgers({ parties: [], cashBanks: [], sales: null, purchase: null, cgstOut: null, sgstOut: null, igstOut: null, cgstIn: null, sgstIn: null, igstIn: null });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [activeCompany]);

  if (companies.length === 0) {
    return <Onboarding />;
  }

  if (!activeCompany) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            Please select a company first.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoadingFY || ledgers === null) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!activeFY) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            No active financial year found for {activeCompany.name}.
          </CardContent>
        </Card>
      </div>
    );
  }

  const switchMode = (next: "sales" | "purchase" | "credit_note" | "debit_note") => {
    if (next !== mode) setMode(next);
  };

  const title =
    mode === "sales" ? "New sales bill"
    : mode === "purchase" ? "New purchase bill"
    : mode === "credit_note" ? "New credit note"
    : "New debit note";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/billing">
              <ArrowLeft className="size-4" />
              Billing
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        </div>
      </div>

      {!hideTabs && (
        <Tabs value={mode} onValueChange={(v) => switchMode(v as "sales" | "purchase")}>
          <TabsList>
            <TabsTrigger value="sales">
              <ShoppingCart className="size-4" />
              Sales
            </TabsTrigger>
            <TabsTrigger value="purchase">
              <ShoppingBag className="size-4" />
              Purchase
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <BillForm
        key={mode}
        companyId={activeCompany.id}
        fyId={activeFY.id}
        companyStateCode={activeCompany.state_code}
        mode={mode}
        ledgers={ledgers}
        items={items}
      />
    </div>
  );
}