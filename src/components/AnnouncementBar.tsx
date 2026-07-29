"use client";

import { useEffect, useState } from "react";

type Props = { text: string };

const STORAGE_KEY = "go-announcement-dismissed";

/**
 * Orange promo band pinned above the page.
 *
 * Dismissal is remembered in sessionStorage rather than localStorage — the bar
 * returns on the visitor's next session, so a promo is not silenced forever
 * after one click.
 *
 * Rendered only after mount because the dismissed state lives in the browser;
 * server-rendering it would cause a hydration mismatch.
 */
export default function AnnouncementBar({ text }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) !== "1") setVisible(true);
  }, []);

  if (!text || !visible) return null;

  return (
    // Fixed above the mobile header (which is itself fixed at top-0), so the
    // two never overlap. The shell offsets its content to match.
    <div className="fixed inset-x-0 top-0 z-50 bg-accent px-10 py-2 text-center">
      <p
        className="font-body text-white"
        style={{ fontSize: "var(--text-body-sm)" }}
      >
        {text}
      </p>
      <button
        type="button"
        onClick={() => {
          sessionStorage.setItem(STORAGE_KEY, "1");
          setVisible(false);
        }}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white transition-opacity hover:opacity-70"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          className="h-4 w-4"
        >
          <path d="M5 5l14 14M19 5L5 19" />
        </svg>
      </button>
    </div>
  );
}
