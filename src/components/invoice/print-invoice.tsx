"use client";

import { useEffect, useState } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchPartyDetail, VOUCHER_TYPE_LABELS } from "@/lib/api/vouchers";
import { INDIAN_STATES } from "@/lib/states";
import { formatAmount, formatDate } from "@/lib/format";
import type { Company } from "@/lib/types";
import type { DayBookRow, VoucherItemRow } from "@/lib/types";

interface Party {
  name: string;
  gstin: string | null;
  state_code: string | null;
  address: string | null;
  city: string | null;
}

const stateName = (code: string | null | undefined) =>
  INDIAN_STATES.find((s) => s.code === code)?.name ?? code ?? "";

const isIntra = (a: string | null | undefined, b: string | null | undefined) =>
  !!a && a === b;

function TaxSummary({ items }: { items: VoucherItemRow[] }) {
  const rows = new Map<number, { taxable: number; cgst: number; sgst: number; igst: number }>();
  for (const it of items) {
    const r = rows.get(it.gst_rate) ?? { taxable: 0, cgst: 0, sgst: 0, igst: 0 };
    r.taxable += it.taxable_value;
    r.cgst += it.cgst;
    r.sgst += it.sgst;
    r.igst += it.igst;
    rows.set(it.gst_rate, r);
  }
  return (
    <table className="w-full border-collapse text-xs">
      <thead>
        <tr>
          <th className="border border-slate-300 px-2 py-1 text-left font-medium">Rate</th>
          <th className="border border-slate-300 px-2 py-1 text-right font-medium">Taxable</th>
          <th className="border border-slate-300 px-2 py-1 text-right font-medium">CGST</th>
          <th className="border border-slate-300 px-2 py-1 text-right font-medium">SGST</th>
          <th className="border border-slate-300 px-2 py-1 text-right font-medium">IGST</th>
          <th className="border border-slate-300 px-2 py-1 text-right font-medium">Total Tax</th>
        </tr>
      </thead>
      <tbody>
        {Array.from(rows.entries()).map(([rate, r]) => (
          <tr key={rate}>
            <td className="border border-slate-300 px-2 py-1">{rate}%</td>
            <td className="border border-slate-300 px-2 py-1 text-right tabular-nums">{formatAmount(r.taxable)}</td>
            <td className="border border-slate-300 px-2 py-1 text-right tabular-nums">{formatAmount(r.cgst)}</td>
            <td className="border border-slate-300 px-2 py-1 text-right tabular-nums">{formatAmount(r.sgst)}</td>
            <td className="border border-slate-300 px-2 py-1 text-right tabular-nums">{formatAmount(r.igst)}</td>
            <td className="border border-slate-300 px-2 py-1 text-right tabular-nums">{formatAmount(r.cgst + r.sgst + r.igst)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function InvoiceContent({
  company,
  voucher,
  items,
}: {
  company: Company;
  voucher: DayBookRow;
  items: VoucherItemRow[];
}) {
  const [party, setParty] = useState<Party | null>(null);

  useEffect(() => {
    if (!voucher.party_name) return;
    let cancelled = false;
    fetchPartyDetail(company.id, voucher.party_name)
      .then((p) => {
        if (!cancelled) setParty(p);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [company.id, voucher.party_name]);

  const taxableTotal = items.reduce((s, i) => s + i.taxable_value, 0);
  const taxTotal = items.reduce((s, i) => s + i.cgst + i.sgst + i.igst + i.cess, 0);
  const grandTotal = taxableTotal + taxTotal;
  const intra = isIntra(company.state_code, party?.state_code);
  const title = VOUCHER_TYPE_LABELS[voucher.voucher_type];

  return (
    <div id="invoice-print" className="rounded-lg border border-slate-300 bg-white p-6 text-slate-900">
      <div className="flex items-start justify-between gap-4 border-b border-slate-300 pb-4">
        <div>
          <h2 className="text-lg font-bold">{company.name}</h2>
          {company.legal_name && (
            <p className="text-sm text-slate-600">{company.legal_name}</p>
          )}
          {company.address_line1 && (
            <p className="mt-1 text-sm text-slate-700">
              {company.address_line1}
              {company.city ? `, ${company.city}` : ""}{" "}
              {company.pincode ? ` - ${company.pincode}` : ""}
            </p>
          )}
          <p className="text-sm text-slate-700">
            {company.state ? stateName(company.state_code) : "State"} ·
            GSTIN: <span className="font-mono">{company.gstin ?? "—"}</span>
          </p>
          {company.phone && <p className="text-sm text-slate-700">Phone: {company.phone}</p>}
        </div>
        <div className="text-right">
          <div className="rounded-md border border-slate-300 px-4 py-2">
            <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
            <p className="text-lg font-bold">{voucher.voucher_number}</p>
          </div>
          <p className="mt-2 text-sm">Date: <span className="font-medium">{formatDate(voucher.voucher_date)}</span></p>
          <p className="mt-1 text-sm">{intra ? "Intra-state (CGST + SGST)" : "Inter-state (IGST)"}</p>
        </div>
      </div>

      <div className="flex items-start justify-between gap-4 py-4">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Billed to</p>
          <p className="mt-1 text-sm font-medium">{party?.name ?? voucher.party_name ?? "—"}</p>
          {party?.address && <p className="text-sm text-slate-700">{party.address}</p>}
          {party?.city && <p className="text-sm text-slate-700">{party.city}</p>}
          <p className="text-sm text-slate-700">
            {party ? stateName(party.state_code) : ""} · GSTIN:{" "}
            <span className="font-mono">{party?.gstin ?? "—"}</span>
          </p>
        </div>
        <div className="text-right text-sm text-slate-700">
          <p>State: {company.state ? stateName(company.state_code) : "—"}</p>
          {voucher.narration && <p className="mt-1 max-w-56 text-xs">Ref: {voucher.narration}</p>}
        </div>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-300 px-2 py-1.5 text-left font-medium">#</th>
            <th className="border border-slate-300 px-2 py-1.5 text-left font-medium">Item</th>
            <th className="border border-slate-300 px-2 py-1.5 text-left font-medium">HSN/SAC</th>
            <th className="border border-slate-300 px-2 py-1.5 text-right font-medium">Qty</th>
            <th className="border border-slate-300 px-2 py-1.5 text-right font-medium">Rate</th>
            <th className="border border-slate-300 px-2 py-1.5 text-right font-medium">GST%</th>
            <th className="border border-slate-300 px-2 py-1.5 text-right font-medium">Taxable</th>
            <th className="border border-slate-300 px-2 py-1.5 text-right font-medium">Tax</th>
            <th className="border border-slate-300 px-2 py-1.5 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={9} className="border border-slate-300 px-2 py-3 text-center text-slate-500">
                No itemized lines for this voucher.
              </td>
            </tr>
          ) : (
            items.map((it, i) => {
              const lineTax = it.cgst + it.sgst + it.igst + it.cess;
              return (
                <tr key={it.id}>
                  <td className="border border-slate-300 px-2 py-1.5">{i + 1}</td>
                  <td className="border border-slate-300 px-2 py-1.5">
                    {it.item?.name ?? "—"}
                    {it.description && (
                      <div className="text-xs text-slate-500">{it.description}</div>
                    )}
                  </td>
                  <td className="border border-slate-300 px-2 py-1.5 font-mono text-xs">{it.item?.hsn_sac ?? "—"}</td>
                  <td className="border border-slate-300 px-2 py-1.5 text-right tabular-nums">{it.qty}</td>
                  <td className="border border-slate-300 px-2 py-1.5 text-right tabular-nums">{formatAmount(it.rate)}</td>
                  <td className="border border-slate-300 px-2 py-1.5 text-right tabular-nums">{it.gst_rate}%</td>
                  <td className="border border-slate-300 px-2 py-1.5 text-right tabular-nums">{formatAmount(it.taxable_value)}</td>
                  <td className="border border-slate-300 px-2 py-1.5 text-right tabular-nums">{formatAmount(lineTax)}</td>
                  <td className="border border-slate-300 px-2 py-1.5 text-right tabular-nums">{formatAmount(it.taxable_value + lineTax)}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <div className="mt-4 grid grid-cols-2 gap-6">
        <div>
          {items.length > 0 && (
            <>
              <p className="mb-1 text-xs font-semibold uppercase text-slate-500">Tax summary</p>
              <TaxSummary items={items} />
            </>
          )}
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Taxable value</span>
            <span className="tabular-nums">{formatAmount(taxableTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">
              Tax ({intra ? "CGST+SGST" : "IGST"})
            </span>
            <span className="tabular-nums">{formatAmount(taxTotal)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-300 pt-1 text-base font-bold">
            <span>Grand total</span>
            <span className="tabular-nums">{formatAmount(grandTotal)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-2 text-center text-[10px] text-slate-400">
        {intra
          ? `This is a computer generated ${title.toLowerCase()} for ${company.name}, ${stateName(company.state_code)}.`
          : `This is a computer generated ${title.toLowerCase()} for ${company.name}.`}
      </div>
    </div>
  );
}

export function PrintInvoiceDialog({
  company,
  voucher,
  items,
  open,
  onOpenChange,
}: {
  company: Company;
  voucher: DayBookRow;
  items: VoucherItemRow[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [generating, setGenerating] = useState(false);

  function handlePrint() {
    setGenerating(true);
    requestAnimationFrame(() => {
      window.print();
      setGenerating(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {VOUCHER_TYPE_LABELS[voucher.voucher_type]} {voucher.voucher_number}
          </DialogTitle>
          <DialogDescription>Print-ready invoice for this voucher.</DialogDescription>
        </DialogHeader>

        <div className="no-print flex justify-end">
          <Button onClick={handlePrint} disabled={generating}>
            <Printer className="size-4" />
            Print / Save as PDF
          </Button>
        </div>

        <InvoiceContent
          key={`${company.id}-${voucher.party_name ?? "none"}`}
          company={company}
          voucher={voucher}
          items={items}
        />
      </DialogContent>
    </Dialog>
  );
}
