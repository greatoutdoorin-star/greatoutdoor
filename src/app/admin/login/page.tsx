"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setBusy(false);
      return;
    }

    // Full navigation so middleware re-runs with the new session cookie.
    router.push(params.get("next") || "/admin");
    router.refresh();
  }

  const field =
    "w-full border border-hairline bg-canvas px-4 py-3 font-body outline-none transition-colors focus:border-ink";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <Image
        src="/logo.webp"
        alt="Great Outdoor"
        width={1008}
        height={472}
        priority
        className="mb-12 h-auto w-[170px]"
      />

      <h1 style={{ fontSize: "var(--text-h1)" }}>Admin sign in</h1>

      <div className="mt-8 space-y-4">
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          aria-label="Email"
          autoComplete="email"
          className={field}
        />
        <div className="relative">
          <input
            required
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            aria-label="Password"
            autoComplete="current-password"
            className={`${field} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-ink-muted transition-colors hover:text-ink"
          >
            {showPassword ? (
              // Eye with a slash through it
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
                className="h-5 w-5"
              >
                <path d="M3 3l18 18" strokeLinecap="round" />
                <path d="M10.6 10.6a2 2 0 002.8 2.8" strokeLinecap="round" />
                <path
                  d="M9.4 5.2A9.5 9.5 0 0112 5c5 0 9 4.5 9 7 0 .9-.5 2-1.4 3.1M6.2 6.8C3.9 8.3 3 10.3 3 12c0 2.5 4 7 9 7 1.4 0 2.6-.3 3.7-.8"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
                className="h-5 w-5"
              >
                <path d="M3 12c0-2.5 4-7 9-7s9 4.5 9 7-4 7-9 7-9-4.5-9-7z" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 font-body text-red-600"
          style={{ fontSize: "var(--text-body-sm)" }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-6 w-full bg-ink px-8 py-4 font-display font-semibold text-white transition-colors hover:bg-accent disabled:opacity-50"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
