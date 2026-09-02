"use client";

import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { CreateCompanyDialog } from "./create-company-dialog";

export function Onboarding() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Building2 className="size-6" />
          </div>
          <CardTitle className="text-2xl">Welcome to BizKhata</CardTitle>
          <CardDescription className="text-base">
            {isSupabaseConfigured() ? (
              <>
                You do not have any companies yet. Create your first company to
                get a seeded chart of accounts, default ledgers and the current
                financial year.
              </>
            ) : (
              <>
                Supabase is not configured yet. Add{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                  NEXT_PUBLIC_SUPABASE_URL
                </code>{" "}
                and{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                  NEXT_PUBLIC_SUPABASE_ANON_KEY
                </code>{" "}
                to <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">.env.local</code>,
                then run the Phase 1 SQL scripts in the Supabase SQL editor
                before continuing.
              </>
            )}
          </CardDescription>
          {isSupabaseConfigured() && (
            <div className="pt-3">
              <CreateCompanyDialog
                trigger={
                  <Button size="lg" className="w-full">
                    <Building2 />
                    Create your first company
                  </Button>
                }
              />
            </div>
          )}
        </CardHeader>
      </Card>
    </div>
  );
}