import { createClient } from "@/lib/supabase/client";
import type { Company, FinancialYear, LedgerRow, TaxMaster } from "@/lib/types";

export type MemberRole = "owner" | "admin" | "accountant" | "viewer";

export interface CompanyMember {
  id: string;
  user_id: string;
  email: string | null;
  role: MemberRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const MEMBER_ROLES: { value: MemberRole; label: string; hint: string }[] = [
  { value: "owner", label: "Owner", hint: "Full control: manage members, settings, financial years" },
  { value: "admin", label: "Admin", hint: "Company settings, financial years, add members" },
  { value: "accountant", label: "Accountant", hint: "Day-to-day entry: ledgers, items, vouchers, billing" },
  { value: "viewer", label: "Viewer", hint: "Read-only access to all reports and data" },
];

// ---------------------------------------------------------------- members

export async function listMembers(companyId: string): Promise<CompanyMember[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("fn_list_members", {
    p_company: companyId,
  });
  if (error) throw error;
  return (data ?? []) as CompanyMember[];
}

export async function addMember(
  companyId: string,
  email: string,
  role: MemberRole
): Promise<CompanyMember> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("fn_add_member", {
    p_company: companyId,
    p_email: email,
    p_role: role,
  });
  if (error) throw error;
  return data as CompanyMember;
}

export async function updateMember(
  companyId: string,
  memberId: string,
  role: MemberRole,
  isActive: boolean
): Promise<CompanyMember> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("fn_update_member", {
    p_company: companyId,
    p_member_id: memberId,
    p_role: role,
    p_is_active: isActive,
  });
  if (error) throw error;
  return data as CompanyMember;
}

export async function removeMember(
  companyId: string,
  memberId: string
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("fn_remove_member", {
    p_company: companyId,
    p_member_id: memberId,
  });
  if (error) throw error;
}

// -------------------------------------------------------------- financial years

export interface FinancialYearInput {
  name: string;
  start_date: string;
  end_date: string;
}

export async function listFinancialYears(
  companyId: string
): Promise<FinancialYear[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("financial_years")
    .select("*")
    .eq("company_id", companyId)
    .order("start_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as FinancialYear[];
}

async function setActiveFy(companyId: string, fyId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("sp_set_active_fy", {
    p_company: companyId,
    p_fy_id: fyId,
  });
  if (error) throw error;
}

export async function createFinancialYear(
  companyId: string,
  input: FinancialYearInput
): Promise<FinancialYear> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("financial_years")
    .insert({
      company_id: companyId,
      name: input.name,
      start_date: input.start_date,
      end_date: input.end_date,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as FinancialYear;
}

export async function setFinancialYearActive(
  companyId: string,
  fy: FinancialYear
): Promise<void> {
  await setActiveFy(companyId, fy.id);
}

export async function toggleFinancialYearLock(
  fy: FinancialYear
): Promise<FinancialYear> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("financial_years")
    .update({ is_locked: !fy.is_locked })
    .eq("id", fy.id)
    .select("*")
    .single();
  if (error) throw error;
  return data as FinancialYear;
}

// -------------------------------------------------------------------- company

export interface CompanyAdminInput {
  name: string;
  legal_name?: string | null;
  gstin?: string | null;
  pan?: string | null;
  address_line1?: string | null;
  city?: string | null;
  state?: string | null;
  state_code?: string | null;
  pincode?: string | null;
  phone?: string | null;
  email?: string | null;
  currency: string;
  logo_url?: string | null;
}

export const CURRENCIES = [
  { code: "INR", label: "Indian Rupee (₹)" },
  { code: "USD", label: "US Dollar ($)" },
  { code: "EUR", label: "Euro (€)" },
  { code: "GBP", label: "British Pound (£)" },
  { code: "AED", label: "UAE Dirham (د.إ)" },
  { code: "SGD", label: "Singapore Dollar (S$)" },
  { code: "AUD", label: "Australian Dollar (A$)" },
];

export async function updateCompanyAdmin(
  companyId: string,
  input: CompanyAdminInput
): Promise<Company> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("companies")
    .update({
      name: input.name?.trim() || null,
      legal_name: input.legal_name?.trim() || null,
      gstin: input.gstin?.trim().toUpperCase() || null,
      pan: input.pan?.trim().toUpperCase() || null,
      address_line1: input.address_line1?.trim() || null,
      city: input.city?.trim() || null,
      state: input.state?.trim() || null,
      state_code: input.state_code || null,
      pincode: input.pincode?.trim() || null,
      phone: input.phone?.trim() || null,
      email: input.email?.trim() || null,
      currency: input.currency,
      logo_url: input.logo_url?.trim() || null,
    })
    .eq("id", companyId)
    .select("*")
    .single();
  if (error) throw error;
  return data as Company;
}

// ------------------------------------------------------------------ tax masters

export async function listTaxMasters(companyId: string): Promise<TaxMaster[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tax_masters")
    .select(
      "id, company_id, name, rate_pct, output_ledger_id, input_ledger_id, is_active, created_at, updated_at, output_ledger:ledgers!output_ledger_id(id, name), input_ledger:ledgers!input_ledger_id(id, name)"
    )
    .eq("company_id", companyId)
    .order("rate_pct", { ascending: true });
  if (error) throw error;
  return normalizeTaxMasters(data ?? []);
}

type LedgerRef = Array<{ id: string; name: string }> | { id: string; name: string } | null;

function normalizeTaxMasters(
  rows: unknown
): TaxMaster[] {
  const data = (rows ?? []) as Array<{
    output_ledger: LedgerRef;
    input_ledger: LedgerRef;
  }>;
  return data.map((row) => ({
    ...row,
    output_ledger: Array.isArray(row.output_ledger)
      ? (row.output_ledger[0] ?? null)
      : (row.output_ledger ?? null),
    input_ledger: Array.isArray(row.input_ledger)
      ? (row.input_ledger[0] ?? null)
      : (row.input_ledger ?? null),
  })) as unknown as TaxMaster[];
}

export async function createTaxMaster(input: {
  company_id: string;
  name: string;
  rate_pct: number;
  output_ledger_id?: string;
  input_ledger_id?: string;
}): Promise<TaxMaster> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tax_masters")
    .insert({
      company_id: input.company_id,
      name: input.name,
      rate_pct: input.rate_pct,
      output_ledger_id: input.output_ledger_id ?? null,
      input_ledger_id: input.input_ledger_id ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as TaxMaster;
}

export async function updateTaxMaster(
  id: string,
  input: {
    name: string;
    rate_pct: number;
    output_ledger_id?: string | null;
    input_ledger_id?: string | null;
    is_active: boolean;
  }
): Promise<TaxMaster> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tax_masters")
    .update({
      name: input.name,
      rate_pct: input.rate_pct,
      output_ledger_id: input.output_ledger_id ?? null,
      input_ledger_id: input.input_ledger_id ?? null,
      is_active: input.is_active,
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as TaxMaster;
}

export async function fetchTaxLedgers(
  companyId: string
): Promise<LedgerRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ledgers")
    .select("*")
    .eq("company_id", companyId)
    .eq("is_tax_ledger", true)
    .eq("is_active", true)
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as LedgerRow[];
}
