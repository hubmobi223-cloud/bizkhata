"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Ban, Loader2, Plus, Trash2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Picker } from "@/components/ledger-picker";
import { postBill } from "@/lib/api/billing";
import { round2, splitTax, taxableValue } from "@/lib/gst";
import { formatAmount } from "@/lib/format";
import type { BillingLedgers, ItemRow } from "@/lib/types";

interface BillLine {
  key: string;
  itemId: string | null;
  qty: string;
  rate: string;
  discount: string;
}

function newLine(): BillLine {
  return {
    key: typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`,
    itemId: null,
    qty: "1",
    rate: "",
    discount: "0",
  };
}

export function BillForm({
  companyId,
  fyId,
  companyStateCode,
  mode,
  ledgers,
  items,
}: {
  companyId: string;
  fyId: string;
  companyStateCode: string | null;
  mode: "sales" | "purchase";
  ledgers: BillingLedgers;
  items: ItemRow[];
}) {
  const router = useRouter();
  const [date, setDate] = useState(() => {
    const d = new Date();
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
  });
  const [invoiceNo, setInvoiceNo] = useState("");
  const [partyId, setPartyId] = useState<string | null>(null);
  const [placeOfSupply, setPlaceOfSupply] = useState("");
  const [narration, setNarration] = useState("");
  const [lines, setLines] = useState<BillLine[]>([newLine()]);
  const [settleAmount, setSettleAmount] = useState("0");
  const [settleLedgerId, setSettleLedgerId] = useState<string | null>(
    ledgers.cashBanks[0]?.id ?? null
  );
  const [submitting, setSubmitting] = useState(false);

  const party = ledgers.parties.find((p) => p.id === partyId) ?? null;
  const effectiveState = party?.state_code || companyStateCode || "";
  const supplyState = placeOfSupply || effectiveState;
  const intra = supplyState === (companyStateCode ?? "") && supplyState !== "";

  const itemById = new Map(items.map((i) => [i.id, i]));
  const lineTotal = (line: BillLine) => {
    const item = line.itemId ? itemById.get(line.itemId) : undefined;
    const qty = parseFloat(line.qty) || 0;
    const rate = parseFloat(line.rate) || 0;
    const discount = parseFloat(line.discount) || 0;
    const taxable = taxableValue(qty, rate, discount);
    const split = splitTax(taxable, item?.gst_rate ?? 0, intra);
    return { item, qty, rate, discount, taxable, split, total: round2(taxable + split.cgst + split.sgst + split.igst) };
  };

  const computed = lines.map(lineTotal);
  const totals = computed.reduce(
    (acc, row) => ({
      taxable: round2(acc.taxable + row.taxable),
      cgst: round2(acc.cgst + row.split.cgst),
      sgst: round2(acc.sgst + row.split.sgst),
      igst: round2(acc.igst + row.split.igst),
    }),
    { taxable: 0, cgst: 0, sgst: 0, igst: 0 }
  );
  const grand = round2(totals.taxable + totals.cgst + totals.sgst + totals.igst);
  const settled = parseFloat(settleAmount) || 0;
  const balanceSettle = round2(grand - settled);

  function setLine(key: string, patch: Partial<BillLine>) {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  }

  function removeLine(key: string) {
    if (lines.length > 1) setLines((prev) => prev.filter((l) => l.key !== key));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!partyId) {
      toast.error("Please select a party");
      return;
    }
    if (supplyState.length !== 2) {
      toast.error("Place of supply must be a 2-letter state code");
      return;
    }
    const hasValidLine = computed.some((row) => row.item && row.qty > 0 && row.rate >= 0);
    if (!hasValidLine) {
      toast.error("Add at least one line with quantity and rate");
      return;
    }
    const badRate = computed.some((row) => row.rate < 0);
    if (badRate) {
      toast.error("Rate cannot be negative");
      return;
    }
    const badDiscount = computed.some((row) => row.discount > row.qty * row.rate + 0.005);
    if (badDiscount) {
      toast.error("Discount on a line cannot exceed its value");
      return;
    }
    if (totals.taxable <= 0) {
      toast.error("Taxable value should be greater than zero");
      return;
    }
    if (grand <= 0) {
      toast.error("Bill total must be greater than zero");
      return;
    }
    if (settled && !settleLedgerId) {
      toast.error("Select a cash/bank ledger for the settlement");
      return;
    }
    if (settled > grand + 0.005) {
      toast.error("Settlement amount cannot exceed the bill total");
      return;
    }

    const salesA = mode === "sales" ? ledgers.sales : null;
    const purchaseA = mode === "purchase" ? ledgers.purchase : null;
    const taxLedgers = ledgers;
    if (mode === "sales" && (!salesA || !taxLedgers.cgstOut || !taxLedgers.sgstOut || !taxLedgers.igstOut)) {
      toast.error("Missing billing ledgers. Ensure Sales A/c and GST output ledgers exist.");
      return;
    }
    if (mode === "purchase" && (!purchaseA || !taxLedgers.cgstIn || !taxLedgers.sgstIn || !taxLedgers.igstIn)) {
      toast.error("Missing billing ledgers. Ensure Purchase A/c and GST input ledgers exist.");
      return;
    }

    const itemsPayload = lines
      .map((line) => lineTotal(line))
      .filter((row) => row.item && row.qty > 0)
      .map((row) => ({
        item_id: row.item!.id,
        unit_id: row.item!.unit_id,
        qty: row.qty,
        rate: row.rate,
        discount: row.discount,
        taxable_value: row.taxable,
        gst_rate: row.item!.gst_rate,
        cgst: row.split.cgst,
        sgst: row.split.sgst,
        igst: row.split.igst,
      }));

    const isSales = mode === "sales";
    const entries = buildEntries({
      isSales,
      partyId,
      grand,
      settled,
      balanceSettle,
      settleLedgerId: settleLedgerId ?? undefined,
      taxable: totals.taxable,
      cgst: totals.cgst,
      sgst: totals.sgst,
      igst: totals.igst,
      salesA: salesA!.id,
      purchaseA: purchaseA!.id,
      cgstOut: taxLedgers.cgstOut!.id,
      sgstOut: taxLedgers.sgstOut!.id,
      igstOut: taxLedgers.igstOut!.id,
      cgstIn: taxLedgers.cgstIn!.id,
      sgstIn: taxLedgers.sgstIn!.id,
      igstIn: taxLedgers.igstIn!.id,
    });

    setSubmitting(true);
    try {
      const voucherId = await postBill({
        companyId,
        fyId,
        type: isSales ? "sales" : "purchase",
        date,
        invoiceNo,
        placeOfSupply: supplyState,
        narration,
        partyLedgerId: partyId,
        entries,
        items: itemsPayload,
      });
      toast.success(`${isSales ? "Sales" : "Purchase"} bill ${invoiceNo || voucherId} posted`);
      router.push(`/vouchers/${voucherId}`);
      router.refresh();
    } catch (err) {
      toast.error("Could not post bill", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {mode === "sales" ? "New sales invoice" : "New purchase bill"}
          <Badge variant={mode === "sales" ? "default" : "secondary"}>{mode}</Badge>
        </CardTitle>
        <CardDescription>
          Lines create stock postings, GST is computed against the place of
          supply and posted to the right tax ledgers.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Party</Label>
              <Picker
                options={ledgers.parties.map((p) => ({ id: p.id, name: p.name, code: p.state_code ?? undefined }))}
                value={partyId}
                onChange={(id) => {
                  setPartyId(id);
                  setPlaceOfSupply("");
                }}
                placeholder="Select party"
                searchPlaceholder="Search parties…"
              />
              {party && (
                <p className="text-xs text-muted-foreground">
                  State: {party.state_code ?? "—"} · GSTIN: {party.gstin ?? "—"}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Place of supply</Label>
              <Input
                value={supplyState}
                maxLength={2}
                placeholder="e.g. 27"
                onChange={(e) => setPlaceOfSupply(e.target.value.toUpperCase())}
                className="uppercase"
              />
              <p className="text-xs text-muted-foreground">
                {intra ? "Intra-state → CGST + SGST" : "Inter-state → IGST"}
              </p>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="bill-no">
                  {mode === "sales" ? "Invoice no." : "Bill no."}
                </Label>
                <Input
                  id="bill-no"
                  placeholder="e.g. BILL-0001"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                  <th className="min-w-56 px-3 py-2.5 font-medium">Item</th>
                  <th className="min-w-20 px-2 py-2.5 text-right font-medium">Qty</th>
                  <th className="min-w-28 px-2 py-2.5 text-right font-medium">Rate</th>
                  <th className="min-w-24 px-2 py-2.5 text-right font-medium">Discount</th>
                  <th className="min-w-28 px-2 py-2.5 text-right font-medium">Taxable</th>
                  <th className="min-w-20 px-2 py-2.5 text-right font-medium">GST</th>
                  <th className="min-w-28 px-2 py-2.5 text-right font-medium">Tax</th>
                  <th className="min-w-28 px-2 py-2.5 text-right font-medium">Total</th>
                  <th className="w-9 px-1 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => {
                  const row = lineTotal(line);
                  const item = row.item;
                  return (
                    <tr key={line.key} className="border-b last:border-0">
                      <td className="px-2 py-1.5 sm:px-3">
                        <Picker
                          options={items
                            .filter((i) => (mode === "sales" ? i.is_sellable : i.is_purchasable))
                            .map((i) => ({ id: i.id, name: i.name, code: i.hsn_sac ?? undefined }))}
                          value={line.itemId}
                          onChange={(id) => setLine(line.key, { itemId: id })}
                          placeholder="Add item…"
                          searchPlaceholder="Search items…"
                        />
                        {item && (
                          <p className="mt-1 px-1 text-xs text-muted-foreground">
                            {item.unit?.name ?? ""}
                            {item.batch_tracking ? " · batch tracked" : ""}
                          </p>
                        )}
                      </td>
                      <td className="px-1 py-1.5">
                        <Input
                          type="number"
                          min="0"
                          step="any"
                          className="h-9 text-right tabular-nums"
                          value={line.qty}
                          onChange={(e) => setLine(line.key, { qty: e.target.value })}
                        />
                      </td>
                      <td className="px-1 py-1.5">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          className="h-9 text-right tabular-nums"
                          placeholder="0.00"
                          value={line.rate}
                          onChange={(e) => setLine(line.key, { rate: e.target.value })}
                        />
                      </td>
                      <td className="px-1 py-1.5">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          className="h-9 text-right tabular-nums"
                          placeholder="0.00"
                          value={line.discount}
                          onChange={(e) => setLine(line.key, { discount: e.target.value })}
                        />
                      </td>
                      <td className="px-2 py-1.5 text-right tabular-nums">
                        {formatAmount(row.taxable)}
                      </td>
                      <td className="px-2 py-1.5 text-right">
                        {item ? (
                          <Badge variant="outline">{item.gst_rate}%</Badge>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-2 py-1.5 text-right tabular-nums text-muted-foreground">
                        {formatAmount(row.split.cgst + row.split.sgst + row.split.igst)}
                      </td>
                      <td className="px-2 py-1.5 text-right font-medium tabular-nums">
                        {formatAmount(row.total)}
                      </td>
                      <td className="px-1 py-1.5 text-center">
                        {lines.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="size-8 px-0 text-muted-foreground hover:text-destructive"
                            onClick={() => removeLine(line.key)}
                            aria-label="Remove line"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex items-center gap-2 border-t p-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setLines((p) => [...p, newLine()])}>
                <Plus className="size-4" />
                Add another item
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bill-narration">Narration (optional)</Label>
              <Input
                id="bill-narration"
                placeholder={mode === "sales" ? "e.g. Sold goods as per invoice" : "e.g. Purchased goods"}
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{mode === "sales" ? "Payment received" : "Payment made"}</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-32 tabular-nums"
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(e.target.value)}
                />
                <Picker
                  options={ledgers.cashBanks.map((l) => ({ id: l.id, name: l.name }))}
                  value={settleLedgerId}
                  onChange={setSettleLedgerId}
                  placeholder="Cash/Bank"
                  searchPlaceholder="Search cash/bank…"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-6 rounded-lg border bg-muted/20 p-4 text-sm">
            <div>
              <p className="text-muted-foreground">Taxable</p>
              <p className="font-semibold tabular-nums">{formatAmount(totals.taxable)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">CGST</p>
              <p className="tabular-nums">{formatAmount(totals.cgst)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">SGST</p>
              <p className="tabular-nums">{formatAmount(totals.sgst)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">IGST</p>
              <p className="tabular-nums">{formatAmount(totals.igst)}</p>
            </div>
            <div className="min-w-32 text-right">
              <p className="text-muted-foreground">Grand total</p>
              <p className="text-xl font-semibold tabular-nums">{formatAmount(grand)}</p>
            </div>
          </div>

          {settled > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Ban className="size-3.5" />
              {formatAmount(settled)} settled via {ledgers.cashBanks.find((l) => l.id === settleLedgerId)?.name ?? "cash/bank"};
              balance {formatAmount(balanceSettle)} on the party account.
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push("/billing")}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="animate-spin" />}
              Post {mode === "sales" ? "sales invoice" : "purchase bill"}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}

function buildEntries(input: {
  isSales: boolean;
  partyId: string;
  grand: number;
  settled: number;
  balanceSettle: number;
  settleLedgerId?: string;
  taxable: number;
  cgst: number;
  sgst: number;
  igst: number;
  salesA: string;
  purchaseA: string;
  cgstOut: string;
  sgstOut: string;
  igstOut: string;
  cgstIn: string;
  sgstIn: string;
  igstIn: string;
}): Array<{ ledger_id: string; debit: number; credit: number }> {
  const entries: Array<{ ledger_id: string; debit: number; credit: number }> = [];
  const push = (ledgerId: string, debit: number, credit: number) => {
    if (debit > 0 || credit > 0) entries.push({ ledger_id: ledgerId, debit, credit });
  };

  if (input.isSales) {
    if (input.settled > 0 && input.settleLedgerId) {
      push(input.settleLedgerId, input.settled, 0);
    }
    push(input.partyId, input.balanceSettle, 0);
    push(input.salesA, 0, input.taxable);
    push(input.cgstOut, 0, input.cgst);
    push(input.sgstOut, 0, input.sgst);
    push(input.igstOut, 0, input.igst);
  } else {
    push(input.purchaseA, input.taxable, 0);
    push(input.cgstIn, input.cgst, 0);
    push(input.sgstIn, input.sgst, 0);
    push(input.igstIn, input.igst, 0);
    if (input.settled > 0 && input.settleLedgerId) {
      push(input.settleLedgerId, 0, input.settled);
    }
    push(input.partyId, 0, input.balanceSettle);
  }
  return entries;
}