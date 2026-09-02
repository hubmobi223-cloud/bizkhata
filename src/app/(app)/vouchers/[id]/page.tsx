"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Ban, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompany } from "@/components/company/company-provider";
import { Onboarding } from "@/components/company/onboarding";
import { createClient } from "@/lib/supabase/client";
import { cancelVoucher, fetchVoucherDetail, VOUCHER_TYPE_LABELS } from "@/lib/api/vouchers";
import { formatAmount, formatDate, formatQty } from "@/lib/format";
import type { DayBookRow, VoucherEntryRow, VoucherItemRow } from "@/lib/types";

function VoucherSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Skeleton className="h-8 w-72" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <Skeleton className="h-56" />
    </div>
  );
}

export default function VoucherDetailPage() {
  const params = useParams<{ id: string }>();
  const { companies, activeCompany } = useCompany();
  const [voucher, setVoucher] = useState<NonNullable<Awaited<ReturnType<typeof fetchVoucherDetail>>>["voucher"] | null>(null);
  const [entries, setEntries] = useState<VoucherEntryRow[]>([]);
  const [items, setItems] = useState<VoucherItemRow[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!activeCompany || !params.id) return;
    fetchVoucherDetail({
      companyId: activeCompany.id,
      voucherId: params.id,
    })
      .then((detail) => {
        if (!cancelled) {
          setVoucher(detail.voucher);
          setEntries(detail.entries);
          setItems(detail.items);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setVoucher(null);
          setEntries([]);
          setItems([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [activeCompany, params.id]);

  const loading = voucher === null && !!activeCompany;

  async function handleCancel() {
    setCancelling(true);
    try {
      await cancelVoucher(params.id);
      toast.success("Voucher cancelled");
      setConfirming(false);

      const supabase = createClient();
      const { data, error } = await supabase
        .from("v_day_book")
        .select("*")
        .eq("company_id", activeCompany?.id ?? "")
        .eq("id", params.id)
        .single();
      if (!error && data) setVoucher(data as DayBookRow);
    } catch (err) {
      toast.error("Could not cancel voucher", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setCancelling(false);
    }
  }

  if (companies.length === 0) {
    return <Onboarding />;
  }

  if (!activeCompany || loading) {
    return <VoucherSkeleton />;
  }

  if (!voucher) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            Voucher not found.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/vouchers">
              <ArrowLeft className="size-4" />
              Vouchers
            </Link>
          </Button>
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              {VOUCHER_TYPE_LABELS[voucher.voucher_type]}
              <span className="text-muted-foreground">
                {voucher.voucher_number}
              </span>
            </h1>
            <p className="text-sm text-muted-foreground">
              {formatDate(voucher.voucher_date)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {voucher.status === "cancelled" ? (
            <Badge variant="destructive">Cancelled</Badge>
          ) : (
            <Badge variant="outline" className="text-emerald-600">
              Posted
            </Badge>
          )}
          {voucher.status === "posted" && (
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => setConfirming(true)}
            >
              <Ban className="size-4" />
              Cancel voucher
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Party</p>
            <p className="mt-1 font-medium">{voucher.party_name ?? "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Debit total</p>
            <p className="mt-1 font-medium tabular-nums">
              {formatAmount(voucher.debit)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Credit total</p>
            <p className="mt-1 font-medium tabular-nums">
              {formatAmount(voucher.credit)}
            </p>
          </CardContent>
        </Card>
      </div>

      {voucher.narration && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Narration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{voucher.narration}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Entries</CardTitle>
          <CardDescription>
            {entries.length} posting{entries.length === 1 ? "" : "s"} on each
            side via the matching engine.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="px-3 py-2 font-medium">Ledger</th>
                <th className="px-3 py-2 font-medium">Group</th>
                <th className="px-3 py-2 text-right font-medium">Debit</th>
                <th className="px-3 py-2 text-right font-medium">Credit</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.entry_id} className="border-b last:border-0">
                  <td className="px-3 py-2 font-medium">{entry.ledger_name}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {entry.group_name}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {entry.debit !== 0 ? formatAmount(entry.debit) : ""}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {entry.credit !== 0 ? formatAmount(entry.credit) : ""}
                  </td>
                </tr>
              ))}
              <tr className="border-t font-semibold">
                <td className="px-3 py-2" colSpan={2}>
                  Total
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {formatAmount(voucher.debit)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {formatAmount(voucher.credit)}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {items.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Items</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Item</th>
                  <th className="px-3 py-2 text-right font-medium">Qty</th>
                  <th className="px-3 py-2 text-right font-medium">Rate</th>
                  <th className="px-3 py-2 text-right font-medium">Taxable</th>
                  <th className="px-3 py-2 text-right font-medium">GST</th>
                  <th className="px-3 py-2 text-right font-medium">Tax</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-3 py-2">
                      <div className="font-medium">{item.item?.name ?? "—"}</div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatQty(item.qty)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatAmount(item.rate)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatAmount(item.taxable_value)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {item.gst_rate}%
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatAmount(item.cgst + item.sgst + item.igst + item.cess)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Cancel this voucher?</DialogTitle>
            <DialogDescription>
              The voucher and all its entries will be reversed. This cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirming(false)}
            >
              Keep voucher
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling && <Loader2 className="animate-spin" />}
              Cancel voucher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}