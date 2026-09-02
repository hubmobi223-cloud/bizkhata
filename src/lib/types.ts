export interface Company {
  id: string;
  name: string;
  legal_name: string | null;
  gstin: string | null;
  pan: string | null;
  address_line1: string | null;
  city: string | null;
  state: string | null;
  state_code: string | null;
  pincode: string | null;
  phone: string | null;
  email: string | null;
  currency: string;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  role: string;
}

export interface FinancialYear {
  id: string;
  company_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_locked: boolean;
}

export interface CompanyCounts {
  ledgers: number;
  items: number;
  vouchers: number;
}

export type GroupType = "assets" | "liabilities" | "income" | "expense";

export interface AccountGroup {
  id: string;
  company_id: string;
  parent_id: string | null;
  name: string;
  group_type: GroupType;
  is_summary: boolean;
  sort_order: number;
}

export interface LedgerRow {
  id: string;
  company_id: string;
  account_group_id: string;
  code: string | null;
  name: string;
  opening_debit: number;
  opening_credit: number;
  is_party: boolean;
  is_cash_bank: boolean;
  is_tax_ledger: boolean;
  tax_rate: number;
  gstin: string | null;
  state_code: string | null;
  is_active: boolean;
}

export interface TrialBalanceRow {
  company_id: string;
  ledger_id: string;
  ledger_name: string;
  code: string | null;
  group_name: string;
  group_type: GroupType;
  opening_debit: number;
  opening_credit: number;
  period_debit: number;
  period_credit: number;
  net_balance: number;
}

export type VoucherTypeMap = {
  receipt: "Receipt";
  payment: "Payment";
  journal: "Journal";
  contra: "Contra";
  sales: "Sales";
  purchase: "Purchase";
  credit_note: "Credit Note";
  debit_note: "Debit Note";
  opening_balance: "Opening Balance";
};

export type VoucherType = keyof VoucherTypeMap;
export type VoucherStatus = "posted" | "cancelled";

export interface DayBookRow {
  id: string;
  company_id: string;
  fy_id: string;
  voucher_type: VoucherType;
  voucher_number: string;
  voucher_date: string;
  narration: string | null;
  party_name: string | null;
  debit: number;
  credit: number;
  status: VoucherStatus;
}

export interface VoucherEntryRow {
  entry_id: string;
  company_id: string;
  voucher_id: string;
  ledger_id: string;
  entry_no: number;
  debit: number;
  credit: number;
  ledger_name: string;
  group_name: string;
  voucher_date: string;
  voucher_number: string;
  voucher_type: VoucherType;
  narration: string | null;
  status: VoucherStatus;
}

export interface VoucherItemRow {
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
  item?: { name: string; hsn_sac: string | null } | null;
}

export interface VoucherInputEntry {
  ledger_id: string;
  debit: number;
  credit: number;
}

export interface Unit {
  id: string;
  company_id: string;
  name: string;
  uqc: string | null;
  is_base: boolean;
}

export interface ItemCategory {
  id: string;
  company_id: string;
  name: string;
}

export type ItemType = "goods" | "service";
export type ValuationMethod = "weighted_average" | "fifo";
export type BatchStatus = "open" | "closed";

export interface ItemRow {
  id: string;
  company_id: string;
  category_id: string | null;
  unit_id: string;
  name: string;
  code: string | null;
  hsn_sac: string | null;
  gst_rate: number;
  item_type: ItemType;
  batch_tracking: boolean;
  expiry_tracking: boolean;
  valuation_method: ValuationMethod;
  is_sellable: boolean;
  is_purchasable: boolean;
  is_active: boolean;
  category?: ItemCategory | null;
  unit?: Unit | null;
}

export interface BatchRow {
  id: string;
  company_id: string;
  item_id: string;
  batch_no: string;
  mfg_date: string | null;
  expiry_date: string | null;
  status: BatchStatus;
}

export interface StockBalanceRow {
  id: string;
  company_id: string;
  item_id: string;
  batch_id: string | null;
  qty: number;
  value: number;
  item?: { id: string; name: string; gst_rate: number; hsn_sac: string | null } | null;
  batch?: { id: string; batch_no: string } | null;
}

export interface StockBookRow {
  id: string;
  company_id: string;
  item_id: string;
  item_name: string;
  hsn_sac: string | null;
  batch_id: string | null;
  batch_no: string | null;
  stock_date: string;
  voucher_item_id: string;
  voucher_id: string | null;
  voucher_type: VoucherType | null;
  movement: "in" | "out";
  inward_qty: number;
  outward_qty: number;
  rate: number;
  value: number;
  balance_qty: number;
  balance_value: number;
}

export interface BillItemInput {
  item_id: string;
  unit_id?: string;
  qty: number;
  rate: number;
  discount: number;
  taxable_value: number;
  gst_rate: number;
  cgst: number;
  sgst: number;
  igst: number;
}

export interface BillingLedgers {
  parties: LedgerRow[];
  cashBanks: LedgerRow[];
  sales: LedgerRow | null;
  purchase: LedgerRow | null;
  cgstOut: LedgerRow | null;
  sgstOut: LedgerRow | null;
  igstOut: LedgerRow | null;
  cgstIn: LedgerRow | null;
  sgstIn: LedgerRow | null;
  igstIn: LedgerRow | null;
}