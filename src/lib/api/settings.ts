import { createClient } from "@/lib/supabase/client";
import type { Company } from "@/lib/types";

export interface CompanySettings {
  name: string | null;
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
}

export async function updateCompanySettings(
  companyId: string,
  input: CompanySettings
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
    })
    .eq("id", companyId)
    .select("*")
    .single();
  if (error) throw error;
  return data as Company;
}
