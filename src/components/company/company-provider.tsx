"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { ACTIVE_COMPANY_STORAGE_KEY } from "@/lib/constants";
import type { Company, FinancialYear } from "@/lib/types";

interface CompanyContextValue {
  companies: Company[];
  activeCompany: Company | null;
  activeFY: FinancialYear | null;
  isLoadingFY: boolean;
  setActiveCompany: (id: string) => void;
  refreshCompanies: () => Promise<Company[]>;
  createCompany: (input: {
    name: string;
    gstin?: string;
    state_code?: string;
  }) => Promise<Company | null>;
}

const CompanyContext = createContext<CompanyContextValue | null>(null);

function readStoredCompanyId(companies: Company[]): string | null {
  if (typeof window === "undefined") return companies[0]?.id ?? null;
  const stored = window.localStorage.getItem(ACTIVE_COMPANY_STORAGE_KEY);
  return companies.some((c) => c.id === stored)
    ? stored
    : (companies[0]?.id ?? null);
}

export function CompanyProvider({
  initialCompanies,
  children,
}: {
  initialCompanies: Company[];
  children: ReactNode;
}) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(() =>
    readStoredCompanyId(initialCompanies)
  );
  const [activeFY, setActiveFY] = useState<FinancialYear | null>(null);
  const [isLoadingFY, setIsLoadingFY] = useState(false);

  const activeCompany =
    companies.find((c) => c.id === activeCompanyId) ?? companies[0] ?? null;

  useEffect(() => {
    if (typeof window !== "undefined" && activeCompany) {
      window.localStorage.setItem(ACTIVE_COMPANY_STORAGE_KEY, activeCompany.id);
    }
  }, [activeCompany]);

  useEffect(() => {
    let cancelled = false;

    void Promise.resolve().then(async () => {
      if (cancelled) return;
      if (!activeCompany) {
        setActiveFY(null);
        return;
      }
      setIsLoadingFY(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc("fn_current_fy", {
          p_company: activeCompany.id,
        });
        if (!cancelled && !error) {
          setActiveFY((data as FinancialYear | null) ?? null);
        }
      } catch {
        if (!cancelled) setActiveFY(null);
      } finally {
        if (!cancelled) setIsLoadingFY(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [activeCompany]);

  const refreshCompanies = useCallback(async (): Promise<Company[]> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("company_members")
      .select("role, company:companies(*)")
      .eq("user_id", user.id);

    if (error) return [];

    const mapped: Company[] = ((data ?? []) as unknown as Array<{
      role: string;
      company: Omit<Company, "role">;
    }>).map((row) => ({
      ...row.company,
      role: row.role,
    }));

    setCompanies(mapped);
    return mapped;
  }, []);

  const companiesRef = useRef(companies);
  useEffect(() => {
    companiesRef.current = companies;
  }, [companies]);

  const createCompany = useCallback(
    async (input: {
      name: string;
      gstin?: string;
      state_code?: string;
    }): Promise<Company | null> => {
      const supabase = createClient();
      const { data: createdId, error } = await supabase.rpc(
        "sp_create_company",
        {
          p_name: input.name,
          p_gstin: input.gstin?.trim() || null,
          p_state_code: input.state_code ?? null,
        }
      );

      if (error) throw error;

      const list = await refreshCompanies();
      const created = list.find((c) => c.id === createdId) ?? null;
      if (created) {
        setActiveCompanyId(created.id);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(ACTIVE_COMPANY_STORAGE_KEY, created.id);
        }
      }
      return created;
    },
    [refreshCompanies]
  );

  const value = useMemo<CompanyContextValue>(
    () => ({
      companies,
      activeCompany,
      activeFY,
      isLoadingFY,
      setActiveCompany: (id: string) => setActiveCompanyId(id),
      refreshCompanies,
      createCompany,
    }),
    [companies, activeCompany, activeFY, isLoadingFY, refreshCompanies, createCompany]
  );

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
}

export function useCompany(): CompanyContextValue {
  const ctx = useContext(CompanyContext);
  if (!ctx) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return ctx;
}