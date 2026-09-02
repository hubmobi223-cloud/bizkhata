import { createClient } from "@/lib/supabase/client";
import type { TrialBalanceRow, VoucherType } from "@/lib/types";

export interface ProfitLossRow {
  group_name: string;
  ledger_name: string;
  amount: number;
}

export interface BalanceSheetRow {
  section: "ASSETS" | "LIABILITIES";
  group_name: string;
  ledger_name: string;
  amount: number;
}

export interface LedgerStatementRow {
  voucher_date: string;
  voucher_number: string;
  voucher_type: VoucherType;
  narration: string | null;
  debit: number;
  credit: number;
  running_balance: number;
}

export interface StockSummaryRow {
  item_id: string;
  name: string;
  code: string | null;
  hsn_sac: string | null;
  category: string | null;
  unit: string | null;
  qty: number;
  value: number;
  gst_rate: number;
}

export async function fetchTrialBalanceReport(
  companyId: string
): Promise<TrialBalanceRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("v_trial_balance")
    .select("*")
    .eq("company_id", companyId)
    .order("group_name", { ascending: true })
    .order("ledger_name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as TrialBalanceRow[];
}

export async function fetchProfitLoss(
  companyId: string,
  from?: string | null,
  to?: string | null
): Promise<ProfitLossRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("fn_profit_loss", {
    p_company: companyId,
    p_from: from || null,
    p_to: to || null,
  });
  if (error) throw error;
  return (data ?? []) as ProfitLossRow[];
}

export async function fetchBalanceSheet(
  companyId: string,
  asOn?: string | null
): Promise<BalanceSheetRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("fn_balance_sheet", {
    p_company: companyId,
    p_as_on: asOn || null,
  });
  if (error) throw error;
  return (data ?? []) as BalanceSheetRow[];
}

export async function fetchLedgerStatement(
  companyId: string,
  ledgerId: string,
  from: string,
  to: string
): Promise<LedgerStatementRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("fn_ledger_statement", {
    p_company: companyId,
    p_ledger: ledgerId,
    p_from: from,
    p_to: to,
  });
  if (error) throw error;
  return (data ?? []) as LedgerStatementRow[];
}

export async function fetchStockSummary(companyId: string): Promise<StockSummaryRow[]> {
  const supabase = createClient();
  const [stockRes, itemsRes] = await Promise.all([
    supabase
      .from("stock_balances")
      .select(
        "item_id, qty, value, item:items(id, name, code, hsn_sac, gst_rate, category_id, unit_id)"
      )
      .eq("company_id", companyId),
    supabase
      .from("items")
      .select(
        "id, name, code, hsn_sac, gst_rate, category:item_categories(id, name), unit:units(id, name)"
      )
      .eq("company_id", companyId),
  ]);
  if (stockRes.error) throw stockRes.error;
  if (itemsRes.error) throw itemsRes.error;

  const byItem = new Map<
    string,
    { qty: number; value: number }
  >();
  (stockRes.data ?? []).forEach((row: { item_id: string; qty: number; value: number }) => {
    const cur = byItem.get(row.item_id) ?? { qty: 0, value: 0 };
    byItem.set(row.item_id, {
      qty: cur.qty + (row.qty ?? 0),
      value: cur.value + (row.value ?? 0),
    });
  });

  const itemRows = (itemsRes.data ?? []) as Array<{
    id: string;
    name: string;
    code: string | null;
    hsn_sac: string | null;
    gst_rate: number;
    category: Array<{ id: string; name: string }> | { id: string; name: string } | null;
    unit: Array<{ id: string; name: string }> | { id: string; name: string } | null;
  }>;

  return itemRows.map((row) => {
    const cat = Array.isArray(row.category) ? (row.category[0] ?? null) : (row.category ?? null);
    const unit = Array.isArray(row.unit) ? (row.unit[0] ?? null) : (row.unit ?? null);
    const st = byItem.get(row.id) ?? { qty: 0, value: 0 };
    return {
      item_id: row.id,
      name: row.name,
      code: row.code,
      hsn_sac: row.hsn_sac,
      category: cat?.name ?? null,
      unit: unit?.name ?? null,
      qty: st.qty,
      value: st.value,
      gst_rate: row.gst_rate,
    };
  });
}
