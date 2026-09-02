import { createClient } from "@/lib/supabase/client";
import type {
  AccountGroup,
  GroupType,
  LedgerRow,
  TrialBalanceRow,
} from "@/lib/types";

export async function fetchAccountGroups(
  companyId: string
): Promise<AccountGroup[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("account_groups")
    .select("*")
    .eq("company_id", companyId)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as AccountGroup[];
}

export async function fetchLedgers(
  companyId: string
): Promise<LedgerRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ledgers")
    .select("*")
    .eq("company_id", companyId)
    .eq("is_active", true)
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as LedgerRow[];
}

export async function fetchTrialBalance(
  companyId: string
): Promise<TrialBalanceRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("v_trial_balance")
    .select("*")
    .eq("company_id", companyId);
  if (error) throw error;
  return (data ?? []) as TrialBalanceRow[];
}

export async function createAccountGroup(input: {
  company_id: string;
  name: string;
  group_type: GroupType;
  parent_id?: string;
  is_summary?: boolean;
}): Promise<AccountGroup> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("account_groups")
    .insert({
      company_id: input.company_id,
      name: input.name,
      group_type: input.group_type,
      parent_id: input.parent_id ?? null,
      is_summary: input.is_summary ?? false,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as AccountGroup;
}

export async function createLedger(input: {
  company_id: string;
  account_group_id: string;
  name: string;
  code?: string;
  opening_debit: number;
  opening_credit: number;
  is_party: boolean;
  is_cash_bank: boolean;
  is_tax_ledger: boolean;
  tax_rate: number;
  gstin?: string;
  state_code?: string;
}): Promise<LedgerRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ledgers")
    .insert({
      company_id: input.company_id,
      account_group_id: input.account_group_id,
      name: input.name,
      code: input.code?.trim() || null,
      opening_debit: input.opening_debit,
      opening_credit: input.opening_credit,
      is_party: input.is_party,
      is_cash_bank: input.is_cash_bank,
      is_tax_ledger: input.is_tax_ledger,
      tax_rate: input.tax_rate,
      gstin: input.is_party && input.gstin ? input.gstin.trim() : null,
      state_code: input.is_party && input.state_code ? input.state_code : null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as LedgerRow;
}

export const GROUP_TYPE_LABELS: Record<GroupType, string> = {
  assets: "Assets",
  liabilities: "Liabilities",
  income: "Income",
  expense: "Expenses",
};