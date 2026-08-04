/**
 * Great Outdoor — lead capture into Google Sheets.
 *
 * SETUP
 *   1. Open the sheet, then Extensions -> Apps Script.
 *   2. Delete whatever is in Code.gs and paste this file in.
 *   3. Set SECRET below to any random string, and keep a copy.
 *   4. Deploy -> New deployment -> type "Web app".
 *        Execute as:      Me
 *        Who has access:  Anyone
 *
 *      "Anyone" is required, and "Anyone with a Google account" is NOT enough:
 *      the site calls this from its server, which is not signed in to Google.
 *      With the wrong setting the URL answers a Google sign-in page instead of
 *      running the script, and every lead is silently dropped.
 *
 *      Verify with: node scripts/test-sheet-webhook.mjs
 *      An HTML response means the access setting is still wrong.
 *
 *      After changing it: Deploy -> Manage deployments -> pencil icon ->
 *      Version: "New version" -> Deploy. Editing without a new version keeps
 *      serving the old one.
 *   5. Copy the /exec URL it gives you.
 *   6. Add both values to the site's environment:
 *        GOOGLE_SHEETS_WEBHOOK_URL = the /exec URL
 *        GOOGLE_SHEETS_SECRET      = the same SECRET you set below
 *
 * Re-deploy (Deploy -> Manage deployments -> edit -> Version: New) after any
 * change to this file, otherwise the old version keeps serving.
 */

/** Must match GOOGLE_SHEETS_SECRET in the site's environment. */
var SECRET = "CHANGE-ME-to-a-long-random-string";

/** Tab to append to. Created automatically if missing. */
var SHEET_NAME = "Leads";

var HEADERS = [
  "Received at",
  "Source",
  "Name",
  "Phone",
  "Email",
  "Company",
  "City",
  "Who they are",
  "Looking for",
  "Product",
  "Message",
];

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);

    // Reject anything without the shared secret. The endpoint is public
    // because it has to be, so this is what stops it being spammed.
    if (!SECRET || body.secret !== SECRET) {
      return json({ ok: false, error: "Unauthorized" });
    }

    var sheet = getSheet();

    sheet.appendRow([
      body.received_at ? new Date(body.received_at) : new Date(),
      body.source || "",
      body.name || "",
      // Leading apostrophe keeps Sheets from mangling a phone number into a
      // number and dropping the leading +, or worse, reformatting it.
      body.phone ? "'" + body.phone : "",
      body.email || "",
      body.company || "",
      body.city || "",
      body.role || "",
      body.looking_for || "",
      body.product || "",
      body.message || "",
    ]);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

/** Returns the Leads tab, creating it with a frozen header row if needed. */
function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160); // timestamp
    sheet.setColumnWidth(11, 420); // message
  }

  return sheet;
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/**
 * Run this once from the Apps Script editor to check the sheet end to end —
 * it appends a row exactly as a real lead would.
 */
function testAppend() {
  var res = doPost({
    postData: {
      contents: JSON.stringify({
        secret: SECRET,
        received_at: new Date().toISOString(),
        source: "b2b",
        name: "Test Lead",
        phone: "+91 98290 12090",
        email: "test@example.com",
        company: "Test Hotel",
        city: "Jaipur",
        message: "This is a test row — delete it.",
      }),
    },
  });
  Logger.log(res.getContent());
}
