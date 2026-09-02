import { createClient } from "@/lib/supabase/client";
import type {
  BatchRow,
  ItemCategory,
  ItemRow,
  ItemType,
  StockBalanceRow,
  StockBookRow,
  Unit,
  ValuationMethod,
} from "@/lib/types";

export async function fetchUnits(companyId: string): Promise<Unit[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("units")
    .select("*")
    .eq("company_id", companyId)
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Unit[];
}

export async function createUnit(input: {
  company_id: string;
  name: string;
  uqc?: string;
}): Promise<Unit> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("units")
    .insert({
      company_id: input.company_id,
      name: input.name,
      uqc: input.uqc?.trim() || null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as Unit;
}

export async function fetchCategories(companyId: string): Promise<ItemCategory[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("item_categories")
    .select("*")
    .eq("company_id", companyId)
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ItemCategory[];
}

export async function createCategory(input: {
  company_id: string;
  name: string;
}): Promise<ItemCategory> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("item_categories")
    .insert({ company_id: input.company_id, name: input.name })
    .select("*")
    .single();
  if (error) throw error;
  return data as ItemCategory;
}

export async function fetchItems(companyId: string): Promise<ItemRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("items")
    .select(
      "id, company_id, category_id, unit_id, name, code, hsn_sac, gst_rate, item_type, batch_tracking, expiry_tracking, valuation_method, is_sellable, is_purchasable, is_active, category:item_categories(id, name), unit:units(id, name, uqc)"
    )
    .eq("company_id", companyId)
    .order("name", { ascending: true });
  if (error) throw error;
  return normalizeItems(data);
}

function normalizeItems(data: unknown): ItemRow[] {
  const rows = (data ?? []) as Array<{
    category: Array<{ id: string; name: string }> | { id: string; name: string } | null;
    unit: Array<{ id: string; name: string; uqc: string | null }> | { id: string; name: string; uqc: string | null } | null;
  }>;
  return rows.map((row) => ({
    ...row,
    category: Array.isArray(row.category) ? (row.category[0] ?? null) : (row.category ?? null),
    unit: Array.isArray(row.unit) ? (row.unit[0] ?? null) : (row.unit ?? null),
  })) as ItemRow[];
}

export async function createItem(input: {
  company_id: string;
  category_id?: string;
  unit_id: string;
  name: string;
  code?: string;
  hsn_sac?: string;
  gst_rate: number;
  item_type: ItemType;
  batch_tracking: boolean;
  expiry_tracking: boolean;
  valuation_method: ValuationMethod;
  is_sellable: boolean;
  is_purchasable: boolean;
}): Promise<ItemRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("items")
    .insert({
      company_id: input.company_id,
      category_id: input.category_id ?? null,
      unit_id: input.unit_id,
      name: input.name,
      code: input.code?.trim() || null,
      hsn_sac: input.hsn_sac?.trim() || null,
      gst_rate: input.gst_rate,
      item_type: input.item_type,
      batch_tracking: input.batch_tracking,
      expiry_tracking: input.expiry_tracking,
      valuation_method: input.valuation_method,
      is_sellable: input.is_sellable,
      is_purchasable: input.is_purchasable,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as ItemRow;
}

export async function updateItem(
  id: string,
  input: {
    category_id?: string;
    unit_id: string;
    name: string;
    code?: string;
    hsn_sac?: string;
    gst_rate: number;
    item_type: ItemType;
    batch_tracking: boolean;
    expiry_tracking: boolean;
    valuation_method: ValuationMethod;
    is_sellable: boolean;
    is_purchasable: boolean;
  }
): Promise<ItemRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("items")
    .update({
      category_id: input.category_id ?? null,
      unit_id: input.unit_id,
      name: input.name,
      code: input.code?.trim() || null,
      hsn_sac: input.hsn_sac?.trim() || null,
      gst_rate: input.gst_rate,
      item_type: input.item_type,
      batch_tracking: input.batch_tracking,
      expiry_tracking: input.expiry_tracking,
      valuation_method: input.valuation_method,
      is_sellable: input.is_sellable,
      is_purchasable: input.is_purchasable,
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as ItemRow;
}

export async function deactivateItem(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("items")
    .update({ is_active: false })
    .eq("id", id);
  if (error) throw error;
}

export async function fetchStockBalance(
  companyId: string,
  itemId: string
): Promise<StockBalanceRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stock_balances")
    .select(
      "id, company_id, item_id, batch_id, qty, value, item:items(id, name, gst_rate, hsn_sac), batch:batches(id, batch_no)"
    )
    .eq("company_id", companyId)
    .eq("item_id", itemId)
    .order("value", { ascending: false });
  if (error) throw error;
  const rows = (data ?? []) as Array<{
    batch: Array<{ id: string; batch_no: string }> | { id: string; batch_no: string } | null;
  }>;
  return rows.map((row) => ({
    ...row,
    batch: Array.isArray(row.batch) ? (row.batch[0] ?? null) : (row.batch ?? null),
  })) as StockBalanceRow[];
}

export async function fetchStockBook(
  companyId: string,
  itemId: string
): Promise<StockBookRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("v_stock_book")
    .select("*")
    .eq("company_id", companyId)
    .eq("item_id", itemId)
    .order("stock_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as StockBookRow[];
}

export async function fetchBatches(
  companyId: string,
  itemId: string
): Promise<BatchRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("batches")
    .select("*")
    .eq("company_id", companyId)
    .eq("item_id", itemId)
    .order("batch_no", { ascending: true });
  if (error) throw error;
  return (data ?? []) as BatchRow[];
}

export async function fetchAllStock(
  companyId: string
): Promise<Map<string, { qty: number; value: number }>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stock_balances")
    .select("item_id, qty, value")
    .eq("company_id", companyId);
  if (error) throw error;
  const map = new Map<string, { qty: number; value: number }>();
  (data ?? []).forEach((row) => {
    const current = map.get(row.item_id) ?? { qty: 0, value: 0 };
    map.set(row.item_id, {
      qty: current.qty + (row.qty ?? 0),
      value: current.value + (row.value ?? 0),
    });
  });
  return map;
}

export const COMMON_UQCS = [
  "BAG",
  "BAL",
  "BKT",
  "BOX",
  "BTL",
  "CAN",
  "CTN",
  "DOZ",
  "DRM",
  "GMS",
  "KG",
  "KGS",
  "LTR",
  "MTR",
  "NOS",
  "PAC",
  "PKT",
  "QTL",
  "QTY",
  "ROL",
  "SET",
  "SQF",
  "SQM",
  "TON",
  "TBS",
];

export const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  goods: "Goods",
  service: "Service",
};