"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompany } from "@/components/company/company-provider";
import { Onboarding } from "@/components/company/onboarding";
import { VoucherForm } from "@/components/vouchers/voucher-form";
import { fetchLedgers } from "@/lib/api/ledgers";
import type { LedgerRow } from "@/lib/types";

export default function NewVoucherPage() {
  const { companies, activeCompany, activeFY, isLoadingFY } = useCompany();
  const [ledgers, setLedgers] = useState<LedgerRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!activeCompany) return;
    fetchLedgers(activeCompany.id)
      .then((data) => {
        if (!cancelled) setLedgers(data);
      })
      .catch(() => {
        if (!cancelled) setLedgers([]);
      });
    return () => {
      cancelled = true;
    };
  }, [activeCompany]);

  const loadingLedgers = ledgers === null && !!activeCompany;

  if (companies.length === 0) {
    return <Onboarding />;
  }

  if (!activeCompany) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/vouchers">
            <ArrowLeft className="size-4" />
            Back to vouchers
          </Link>
        </Button>
        <Card>
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            Please select a company first to post vouchers.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoadingFY || loadingLedgers) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (!activeFY) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/vouchers">
            <ArrowLeft className="size-4" />
            Back to vouchers
          </Link>
        </Button>
        <Card>
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            No active financial year found for {activeCompany.name}. Please
            create a financial year from the database console.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/vouchers">
            <ArrowLeft className="size-4" />
            Vouchers
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">New voucher</h1>
      </div>
      <VoucherForm
        companyId={activeCompany.id}
        fyId={activeFY.id}
        ledgers={ledgers ?? []}
      />
    </div>
  );
}