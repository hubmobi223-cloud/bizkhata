"use client";

import { CalendarClock, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCompany } from "@/components/company/company-provider";

export function FinancialYearBadge() {
  const { activeFY, isLoadingFY } = useCompany();

  if (isLoadingFY) {
    return (
      <Badge variant="outline" className="hidden sm:inline-flex">
        <Loader2 className="animate-spin" />
        FY&#8230;
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="hidden sm:inline-flex">
      <CalendarClock />
      {activeFY ? activeFY.name : "No active FY"}
    </Badge>
  );
}