import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { CompanyProvider } from "@/components/company/company-provider";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";
import type { Company } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  if (!supabase) {
    redirect("/auth/sign-in");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: memberRows } = await supabase
    .from("company_members")
    .select("role, company:companies(*)")
    .eq("user_id", user.id);

  const companies: Company[] = (
    (memberRows ?? []) as unknown as Array<{
      role: string;
      company: Omit<Company, "role">;
    }>
  ).map((row) => ({
    ...row.company,
    role: row.role,
  }));

  return (
    <CompanyProvider initialCompanies={companies}>
      <AppShell user={user}>{children}</AppShell>
    </CompanyProvider>
  );
}