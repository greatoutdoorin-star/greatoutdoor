/**
 * Verify the Google Sheets webhook end to end.
 *
 *   node scripts/test-sheet-webhook.mjs
 *
 * Reads GOOGLE_SHEETS_WEBHOOK_URL and GOOGLE_SHEETS_SECRET from .env.local and
 * appends one test row, reporting exactly which part failed if it does not
 * land. Delete the test row from the sheet afterwards.
 */

import { readFileSync } from "node:fs";

function loadEnv() {
  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) process.env[m[1]] ??= m[2].trim();
    }
  } catch {
    // No .env.local — fall through to whatever is already in the environment.
  }
}

loadEnv();

const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
const secret = process.env.GOOGLE_SHEETS_SECRET;

if (!url) {
  console.error("GOOGLE_SHEETS_WEBHOOK_URL is not set in .env.local");
  process.exit(1);
}

const payload = {
  secret: secret ?? "",
  received_at: new Date().toISOString(),
  source: "b2b",
  name: "Webhook test",
  phone: "+91 98290 12090",
  email: "test@example.com",
  company: "Test Hotel",
  city: "Jaipur",
  message: "Automated connection test — safe to delete this row.",
};

console.log("POST", url.replace(/\/[^/]+\/exec$/, "/…/exec"));

const res = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
  redirect: "follow",
  signal: AbortSignal.timeout(20000),
});

const text = await res.text();
console.log("HTTP", res.status);

// Apps Script answers JSON when it runs, and HTML when it never got there —
// which is the usual symptom of a deployment that is not public.
if (text.trimStart().startsWith("<")) {
  console.error("\nGot HTML instead of JSON — the script did not run.");
  console.error(
    "Fix: Deploy → Manage deployments → edit → Who has access: Anyone → " +
      "Version: New version → Deploy.",
  );
  console.error('"Anyone with a Google account" is not enough: the site calls');
  console.error("this from its server, which is not signed in to Google.");
  process.exit(1);
}

let body;
try {
  body = JSON.parse(text);
} catch {
  console.error("Unparseable response:", text.slice(0, 300));
  process.exit(1);
}

if (body.ok) {
  console.log("\nRow appended. Check the Leads tab of the sheet.");
} else if (String(body.error).includes("Unauthorized")) {
  console.error("\nRejected: secret mismatch.");
  console.error(
    "GOOGLE_SHEETS_SECRET in .env.local must equal SECRET in the Apps Script.",
  );
  process.exit(1);
} else {
  console.error("\nScript returned an error:", body.error);
  process.exit(1);
}
