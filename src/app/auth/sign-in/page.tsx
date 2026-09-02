"use client";

import { Suspense, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

function SignInCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom") ?? "/";

  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const configured = isSupabaseConfigured();
  const supabase = useMemo(
    () => (configured ? createClient() : null),
    [configured]
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;

    setLoading(true);
    try {
      if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Signed in");
        router.replace(redirectedFrom);
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Account created");
          router.replace(redirectedFrom);
          router.refresh();
        } else {
          toast.success("Verification email sent", {
            description:
              "Check your inbox and click the link to confirm your account, then sign in.",
          });
        }
      }
    } catch (err) {
      toast.error(
        mode === "sign-in"
          ? "Could not sign in"
          : "Could not create account",
        {
          description:
            err instanceof Error ? err.message : "Unknown error",
        }
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            redirectedFrom
          )}`,
        },
      });
      if (error) throw error;
    } catch (err) {
      toast.error("Could not start Google sign in", {
        description:
          err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  const glassCard = "w-full max-w-md rounded-2xl border border-white/20 bg-white/70 p-8 shadow-2xl shadow-indigo-950/30 backdrop-blur-md dark:bg-slate-900/60";

  if (!configured) {
    return (
      <div className={glassCard}>
        <div className="mb-4 flex justify-center">
          <Brand showText={false} />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">
            Supabase not configured
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Create a project at{" "}
            <span className="font-medium text-foreground">supabase.com</span>,
            run the Phase 1 SQL scripts in its SQL editor, then add{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              NEXT_PUBLIC_SUPABASE_URL
            </code>{" "}
            and{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>{" "}
            to{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              .env.local
            </code>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={glassCard}
      style={{ animation: "fadeInUp 0.5s ease-out both" }}
    >
      <div className="mb-6 flex justify-center">
        <Brand showText={false} />
      </div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {mode === "sign-in" ? "Sign in to BizKhata" : "Create your account"}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {mode === "sign-in"
            ? "Enter your credentials to continue."
            : "Sign up to start keeping books with BizKhata."}
        </p>
      </div>

      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-lg border-slate-300 bg-white/70 px-3 transition-shadow focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:border-slate-700 dark:bg-slate-800/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-lg border-slate-300 bg-white/70 px-3 pr-10 transition-shadow focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:border-slate-700 dark:bg-slate-800/50"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-9 -translate-y-1/2 text-muted-foreground hover:bg-transparent"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 transition-transform duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-600/40 disabled:hover:scale-100"
          >
            {loading && <Loader2 className="animate-spin" />}
            {mode === "sign-in" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <div className="flex items-center gap-3 py-1">
          <Separator className="flex-1 bg-slate-300/70 dark:bg-slate-700" />
          <span className="text-xs text-muted-foreground">or</span>
          <Separator className="flex-1 bg-slate-300/70 dark:bg-slate-700" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-lg border-slate-300 bg-white/60 text-foreground transition-all duration-200 hover:border-indigo-400 hover:bg-white hover:shadow-md hover:shadow-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/40"
          onClick={handleGoogleSignIn}
        >
          <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </Button>

        <p className="pt-1 text-center text-sm text-muted-foreground">
          {mode === "sign-in" ? (
            <>
              New to BizKhata?{" "}
              <button
                type="button"
                className="font-semibold text-indigo-600 underline underline-offset-4 transition-colors hover:text-indigo-500 dark:text-indigo-400"
                onClick={() => setMode("sign-up")}
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="font-semibold text-indigo-600 underline underline-offset-4 transition-colors hover:text-indigo-500 dark:text-indigo-400"
                onClick={() => setMode("sign-in")}
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInCard />
    </Suspense>
  );
}