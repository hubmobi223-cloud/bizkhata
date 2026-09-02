"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LedgerPicker } from "@/components/ledger-picker";
import { postVoucher, VOUCHER_TYPE_LABELS } from "@/lib/api/vouchers";
import { todayISO, formatAmount } from "@/lib/format";
import type { LedgerRow, VoucherType } from "@/lib/types";

const PHASE3_TYPES: VoucherType[] = ["receipt", "payment", "journal", "contra"];

interface Line {
  key: string;
  ledgerId: string | null;
  debit: string;
  credit: string;
}

function nextKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
}

function blankLine(): Line {
  return { key: nextKey(), ledgerId: null, debit: "", credit: "" };
}

export function VoucherForm({
  companyId,
  fyId,
  ledgers,
}: {
  companyId: string;
  fyId: string;
  ledgers: LedgerRow[];
}) {
  const router = useRouter();
  const [type, setType] = useState<VoucherType>("receipt");
  const [date, setDate] = useState(todayISO());
  const [narration, setNarration] = useState("");
  const [lines, setLines] = useState<Line[]>([blankLine(), blankLine()]);
  const [submitting, setSubmitting] = useState(false);

  const totals = lines.reduce(
    (acc, line) => {
      const d = parseFloat(line.debit) || 0;
      const c = parseFloat(line.credit) || 0;
      return { debit: acc.debit + d, credit: acc.credit + c, count: acc.count + 1 };
    },
    { debit: 0, credit: 0, count: 0 }
  );
  const difference = Math.abs(totals.debit - totals.credit);
  const balanced = difference < 0.005;

  function setLine(key: string, patch: Partial<Line>) {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  }

  function addLine() {
    setLines((prev) => [...prev, blankLine()]);
  }

  function removeLine(key: string) {
    setLines((prev) => (prev.length > 2 ? prev.filter((l) => l.key !== key) : prev));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const entries = lines.flatMap((line, index) => {
      if (!line.ledgerId) return [];
      const debit = parseFloat(line.debit) || 0;
      const credit = parseFloat(line.credit) || 0;
      if (debit === 0 && credit === 0) return [];
      return { entry_no: index + 1, ledger_id: line.ledgerId, debit, credit };
    });

    if (entries.length < 2) {
      toast.error("A voucher needs at least two entries");
      return;
    }
    if (!balanced) {
      toast.error("Debit and credit totals must match", {
        description: `Difference of ${formatAmount(difference)}`,
      });
      return;
    }
    if (!date) {
      toast.error("Voucher date is required");
      return;
    }

    setSubmitting(true);
    try {
      const voucherId = await postVoucher({
        companyId,
        fyId,
        type,
        date,
        narration,
        entries,
      });
      toast.success(`${VOUCHER_TYPE_LABELS[type]} ${voucherId} posted`);
      router.push(`/vouchers/${voucherId}`);
      router.refresh();
    } catch (err) {
      toast.error("Could not post voucher", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">New voucher</CardTitle>
        <CardDescription>
          Enter at least two lines. Every account involved must have a debit and
          an equal credit total.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} id="voucher-form">
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="voucher-type">Voucher type</Label>
              <Select value={type} onValueChange={(v) => setType(v as VoucherType)}>
                <SelectTrigger id="voucher-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PHASE3_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {VOUCHER_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="voucher-date">Date</Label>
              <Input
                id="voucher-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="voucher-narration">Narration</Label>
              <Input
                id="voucher-narration"
                placeholder="e.g. Cash received from Ramesh"
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                  <th className="w-1/2 px-3 py-2.5 font-medium">Ledger</th>
                  <th className="w-[24%] px-3 py-2.5 text-right font-medium">Debit</th>
                  <th className="w-[24%] px-3 py-2.5 text-right font-medium">Credit</th>
                  <th className="w-9 px-1 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.key} className="border-b last:border-0">
                    <td className="px-2 py-1.5 sm:px-3">
                      <LedgerPicker
                        ledgers={ledgers}
                        value={line.ledgerId}
                        onChange={(id) => setLine(line.key, { ledgerId: id })}
                        placeholder="Choose ledger…"
                      />
                    </td>
                    <td className="px-1 py-1.5 sm:px-2">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        className="h-9 text-right tabular-nums"
                        placeholder="0.00"
                        value={line.debit}
                        onChange={(e) =>
                          setLine(line.key, { debit: e.target.value, credit: e.target.value ? "" : line.credit })
                        }
                      />
                    </td>
                    <td className="px-1 py-1.5 sm:px-2">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        className="h-9 text-right tabular-nums"
                        placeholder="0.00"
                        value={line.credit}
                        onChange={(e) =>
                          setLine(line.key, { credit: e.target.value, debit: e.target.value ? "" : line.debit })
                        }
                      />
                    </td>
                    <td className="px-1 py-1.5 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="size-8 px-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeLine(line.key)}
                        disabled={lines.length <= 2}
                        aria-label="Remove line"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t bg-muted/20 text-sm">
                  <td className="px-3 py-2.5 font-medium">Total</td>
                  <td className="px-3 py-2.5 text-right font-semibold tabular-nums">
                    {formatAmount(totals.debit)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold tabular-nums">
                    {formatAmount(totals.credit)}
                  </td>
                  <td />
                </tr>
                <tr>
                  <td className="px-3 py-2" colSpan={4}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={addLine}
                    >
                      <Plus className="size-4" />
                      Add line
                    </Button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {!balanced && (
            <div className="flex items-center justify-between rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              <span>Out of balance</span>
              <span className="tabular-nums">{formatAmount(difference)}</span>
            </div>
          )}
          {balanced && totals.debit > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-emerald-600">
                Balanced
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatAmount(totals.debit)} on each side
              </span>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/vouchers")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="animate-spin" />}
              Post voucher
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}