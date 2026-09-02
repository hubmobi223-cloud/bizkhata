import type { ReactNode } from "react";
import { BookOpen, ShieldCheck, TrendingUp } from "lucide-react";
import { Brand } from "@/components/brand";

function FloatingIcon({
  icon: Icon,
  className,
  animation = "float",
  duration = "6s",
}: {
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
  animation?: "float" | "floatSlow";
  duration?: string;
}) {
  return (
    <div
      className={className}
      style={{
        animation: `${animation} ${duration} ease-in-out infinite`,
      }}
    >
      <Icon className="size-full" />
    </div>
  );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-slate-950 lg:grid lg:grid-cols-2">
      {/* Animated mesh gradient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "linear-gradient(135deg, #0b1f3a 0%, #142c5c 30%, #3b1d6e 55%, #0f3d3a 80%, #0b1f3a 100%)",
            backgroundSize: "250% 250%",
            animation: "meshGradient 18s ease-in-out infinite",
          }}
        />
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-sky-500/25 blur-3xl" />
        <div className="absolute top-1/3 -right-24 size-96 rounded-full bg-purple-600/25 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 size-96 rounded-full bg-emerald-500/20 blur-3xl" />
      </div>

      {/* Left: Branding */}
      <div className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex">
        {/* Floating decorative 3D-like icons */}
        <div className="pointer-events-none absolute inset-0 select-none">
          <FloatingIcon
            icon={BookOpen}
            className="absolute left-1/6 top-24 size-16 text-white/15"
            duration="7s"
          />
          <FloatingIcon
            icon={TrendingUp}
            className="absolute right-1/5 top-1/2 size-20 text-white/10"
            animation="floatSlow"
            duration="8s"
          />
          <FloatingIcon
            icon={ShieldCheck}
            className="absolute bottom-1/4 left-1/3 size-14 text-white/15"
            duration="9s"
          />
        </div>

        <div className="relative">
          <div className="flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/5 p-2 backdrop-blur-xl">
            <Brand className="text-white" />
          </div>
        </div>

        <div className="relative max-w-sm space-y-3">
          <h2
            className="text-4xl font-bold leading-tight tracking-tight text-white"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.35)" }}
          >
            Accounting, billing &amp; inventory, GST-ready.
          </h2>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Double-entry accounting engine with real-time trial balance
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-sky-400" />
              Indian GST compliance — CGST / SGST / IGST, GSTR-1 &amp; GSTR-3B
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-purple-400" />
              Multi-company and multi financial-year support
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Web and Android, powered by Pramod Kumar
            </li>
          </ul>
        </div>

        <p className="relative text-sm text-white/50">
          © {new Date().getFullYear()} BizKhata
        </p>
      </div>

      {/* Right: Form */}
      <div className="relative flex items-center justify-center p-6 lg:p-12">
        {children}
      </div>
    </div>
  );
}
