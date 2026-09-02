import { createClient } from "@/lib/supabase/client";
import { fetchLedgers } from "@/lib/api/ledgers";
import type {
  BillingLedgers,
  BillItemInput,
  VoucherInputEntry,
  VoucherType,
} from "@/lib/types";

export async function fetchBillingLedgers(
  companyId: string
): Promise<BillingLedgers> {
  const ledgers = await fetchLedgers(companyId);
  const byName = (name: string) =>
    ledgers.find((l) => l.name.trim().toLowerCase() === name.toLowerCase()) ?? null;

  return {
    parties: ledgers.filter(
      (l) => l.is_party || /sundry debtor|sundry creditor/i.test(l.name)
    ),
    cashBanks: ledgers.filter((l) => l.is_cash_bank),
    sales: byName("Sales A/c"),
    purchase: byName("Purchase A/c"),
    cgstOut: byName("CGST Output A/c"),
    sgstOut: byName("SGST Output A/c"),
    igstOut: byName("IGST Output A/c"),
    cgstIn: byName("CGST Input A/c"),
    sgstIn: byName("SGST Input A/c"),
    igstIn: byName("IGST Input A/c"),
  };
}

export async function postBill(input: {
  companyId: string;
  fyId: string;
  type: VoucherType;
  date: string;
  invoiceNo?: string;
  invoiceDate?: string;
  placeOfSupply: string;
  narration?: string;
  partyLedgerId: string;
  entries: VoucherInputEntry[];
  items: BillItemInput[];
}): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("sp_post_voucher", {
    p_company: input.companyId,
    p_fy: input.fyId,
    p_type: input.type,
    p_date: input.date,
    p_entries: input.entries,
    p_party_ledger: input.partyLedgerId,
    p_invoice_no: input.invoiceNo?.trim() || null,
    p_invoice_date: input.invoiceDate || null,
    p_place_of_supply: input.placeOfSupply || null,
    p_narration: input.narration?.trim() || null,
    p_items: input.items,
  });
  if (error) throw error;
  return data as string;
}