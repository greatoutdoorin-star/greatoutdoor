"use client";

import { useActionState } from "react";
import { SaveStatus, type SaveState } from "./SaveButton";

/**
 * Wraps a server action in `useActionState` so the outcome can be shown.
 *
 * The admin pages are server components, and hooks cannot live there — this is
 * the thin client boundary that lets them report a save. Actions return
 * `{ ok, message }` rather than throwing, per the Next.js error-handling guide:
 * a thrown error in a server action reaches the client as a generic message in
 * production, which is exactly what made these forms feel silent.
 */

type Props = {
  action: (state: SaveState, formData: FormData) => Promise<SaveState>;
  children: React.ReactNode;
  className?: string;
  /** Show the banner above the fields instead of below. */
  statusFirst?: boolean;
};

export default function StatefulForm({
  action,
  children,
  className,
  statusFirst = false,
}: Props) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className={className}>
      {statusFirst && <SaveStatus state={state} />}
      {children}
      {!statusFirst && <SaveStatus state={state} />}
    </form>
  );
}
