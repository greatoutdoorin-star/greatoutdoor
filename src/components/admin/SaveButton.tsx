"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

/**
 * Submit button that reports what happened.
 *
 * Admin forms previously saved silently — the page re-rendered identically
 * whether the write succeeded or the action threw, so there was no way to tell
 * a save from a swallowed error. `useFormStatus` gives the pending state and
 * the action's returned status gives the outcome.
 */

export type SaveState = { ok?: boolean; message?: string };

export function SaveButton({
  children = "Save changes",
  pendingLabel = "Saving…",
  className = "",
}: {
  children?: React.ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`bg-ink px-8 py-4 font-display font-semibold text-white transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

/**
 * Confirmation banner. Success messages clear themselves after a few seconds;
 * errors stay until the next submit, since those need reading.
 */
export function SaveStatus({ state }: { state: SaveState }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!state?.message) return;
    setVisible(true);
    if (!state.ok) return;

    const t = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(t);
  }, [state]);

  if (!state?.message || !visible) return null;

  return (
    <p
      aria-live="polite"
      role="status"
      className={`mt-4 border px-4 py-3 font-body ${
        state.ok
          ? "border-green-300 bg-green-50 text-green-800"
          : "border-red-300 bg-red-50 text-red-800"
      }`}
    >
      {state.ok ? "✓ " : ""}
      {state.message}
    </p>
  );
}
