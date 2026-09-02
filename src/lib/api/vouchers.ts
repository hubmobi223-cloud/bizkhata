import { createClient } from "@/lib/supabase/client";
import type {
  DayBookRow,
  VoucherEntryRow,
  VoucherInputEntry,
  VoucherItemRow,
  VoucherType,
} from "@/lib/types";

export const VOUCHER_TYPE_LABELS: Record<VoucherType, string> = {
  receipt: "Receipt",
  payment: "Payment",
  journal: "Journal",
  contra: "Contra",
  sales: "Sales",
  purchase: "Purchase",
  credit_note: "Credit Note",
  debit_note: "Debit Note",
  opening_balance: "Opening Balance",
};

export async function fetchDayBook(options: {
  companyId: string;
  fyId?: string | null;
  type?: VoucherType | "";
  limit?: number;
}): Promise<DayBookRow[]> {
  const supabase = createClient();
  let query = supabase
    .from("v_day_book")
    .select("*")
    .eq("company_id", options.companyId)
    .order("voucher_date", { ascending: false })
    .order("voucher_number", { ascending: false })
    .limit(options.limit ?? 50);
  if (options.fyId) query = query.eq("fy_id", options.fyId);
  if (options.type) query = query.eq("voucher_type", options.type);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as DayBookRow[];
}

export async function fetchVoucherDetail(options: {
  companyId: string;
  voucherId: string;
}): Promise<{
  voucher: DayBookRow;
  entries: VoucherEntryRow[];
  items: VoucherItemRow[];
}> {
  const supabase = createClient();
  const [voucherRes, entriesRes, itemsRes] = await Promise.all([
    supabase
      .from("v_day_book")
      .select("*")
      .eq("company_id", options.companyId)
      .eq("id", options.voucherId)
      .single(),
    supabase
      .from("v_ledger_postings")
      .select("*")
      .eq("company_id", options.companyId)
      .eq("voucher_id", options.voucherId)
      .order("entry_no", { ascending: true }),
    supabase
      .from("voucher_items")
      .select(
        "id, description, qty, rate, discount, taxable_value, gst_rate, cgst, sgst, igst, cess, item:items(id, name, hsn_sac)"
      )
      .eq("company_id", options.companyId)
      .eq("voucher_id", options.voucherId)
      .order("sort_order", { ascending: true }),
  ]);

  if (voucherRes.error) throw voucherRes.error;
  if (entriesRes.error) throw entriesRes.error;
  if (itemsRes.error) throw itemsRes.error;

  const rawItems = (itemsRes.data ?? []) as unknown as Array<{
    id: string;
    company_id: string;
    voucher_id: string;
    item_id: string;
    description: string | null;
    qty: number;
    rate: number;
    discount: number;
    taxable_value: number;
    gst_rate: number;
    cgst: number;
    sgst: number;
    igst: number;
    cess: number;
    item: Array<{ id: string; name: string; hsn_sac: string | null }> | { id: string; name: string; hsn_sac: string | null } | null;
  }>;

  return {
    voucher: voucherRes.data as DayBookRow,
    entries: (entriesRes.data ?? []) as VoucherEntryRow[],
    items: rawItems.map((row) => ({
      id: row.id,
      company_id: row.company_id,
      voucher_id: row.voucher_id,
      item_id: row.item_id,
      description: row.description,
      qty: row.qty,
      rate: row.rate,
      discount: row.discount,
      taxable_value: row.taxable_value,
      gst_rate: row.gst_rate,
      cgst: row.cgst,
      sgst: row.sgst,
      igst: row.igst,
      cess: row.cess,
      item: Array.isArray(row.item) ? (row.item[0] ?? null) : (row.item ?? null),
    })),
  };
}

export async function postVoucher(input: {
  companyId: string;
  fyId: string;
  type: VoucherType;
  date: string;
  narration: string;
  entries: VoucherInputEntry[];
}): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("sp_post_voucher", {
    p_company: input.companyId,
    p_fy: input.fyId,
    p_type: input.type,
    p_date: input.date,
    p_narration: input.narration.trim() || null,
    p_entries: input.entries,
    p_party_ledger: null,
  });
  if (error) throw error;
  return data as string;
}

export async function cancelVoucher(voucherId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("sp_cancel_voucher", {
    p_voucher_id: voucherId,
  });
  if (error) throw error;
}

export async function fetchPartyDetail(
  companyId: string,
  partyName: string
): Promise<{
  name: string;
  gstin: string | null;
  state_code: string | null;
  address: string | null;
  city: string | null;
} | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ledgers")
    .select("name, gstin, state_code, address_line1, city")
    .eq("company_id", companyId)
    .eq("is_party", true)
    .ilike("name", partyName)
    .order("is_active", { ascending: false })
    .limit(1)
    .single();
  if (error || !data) return null;
  return {
    name: data.name,
    gstin: data.gstin,
    state_code: data.state_code,
    address: (data as { address_line1?: string | null }).address_line1 ?? null,
    city: (data as { city?: string | null }).city ?? null,
  };
}