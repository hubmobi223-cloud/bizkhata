import type { ReactNode } from "react";
import { Brand } from "@/components/brand";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="hidden flex-col justify-between border-r bg-muted/40 p-10 lg:flex">
        <Brand />
        <div className="max-w-sm space-y-3">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight">
            Accounting, billing &amp; inventory, GST-ready.
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Double-entry accounting engine with real-time trial balance</li>
            <li>Indian GST compliance — CGST / SGST / IGST, GSTR-1 &amp; GSTR-3B</li>
            <li>Multi-company and multi financial-year support</li>
            <li>Web and Android, powered by Supabase</li>
          </ul>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} BizKhata
        </p>
      </div>
      <div className="flex items-center justify-center p-6">{children}</div>
    </div>
  );
}