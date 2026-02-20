/**
 * Hack University - Community Platforms API (Google Apps Script)
 *
 * Setup:
 * 1) Create a Google Sheet and copy its Spreadsheet ID.
 * 2) Set SPREADSHEET_ID below.
 * 3) Create two sheets:
 *    - Signups
 *    - Config
 * 4) In Config sheet, add key/value rows (A=key, B=value):
 *    discord_url, groupme_url, instagram_private_url, mailing_list_url
 * 5) Deploy as Web App:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6) Paste Web App URL into API_URL in hackuniversity-community-platforms.html.
 */

const SPREADSHEET_ID = "REPLACE_WITH_YOUR_SPREADSHEET_ID";
const SIGNUPS_SHEET = "Signups";
const CONFIG_SHEET = "Config";

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) ? String(e.parameter.action) : "";

  if (action === "links") {
    return jsonOutput_({ ok: true, links: getJoinLinks_() });
  }

  return jsonOutput_({
    ok: true,
    message: "Community Platforms API is running.",
    usage: [
      "POST action=register with firstName,lastName,school,graduationYear,email",
      "GET action=links"
    ]
  });
}

function doPost(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    const action = String(params.action || "").trim();

    if (action !== "register") {
      return jsonOutput_({ ok: false, error: "Invalid action." });
    }

    const firstName = normalize_(params.firstName);
    const lastName = normalize_(params.lastName);
    const school = normalize_(params.school);
    const graduationYear = normalize_(params.graduationYear);
    const email = normalize_(params.email).toLowerCase();
    const pageUrl = normalize_(params.pageUrl);

    const validationError = validateInput_(firstName, lastName, school, graduationYear, email);
    if (validationError) {
      return jsonOutput_({ ok: false, error: validationError });
    }

    appendSignupRow_({
      firstName: firstName,
      lastName: lastName,
      school: school,
      graduationYear: graduationYear,
      email: email,
      pageUrl: pageUrl,
      userAgent: normalize_(params.userAgent)
    });

    return jsonOutput_({
      ok: true,
      message: "Saved successfully.",
      links: getJoinLinks_()
    });
  } catch (error) {
    return jsonOutput_({ ok: false, error: "Server error", details: String(error) });
  }
}

function validateInput_(firstName, lastName, school, graduationYear, email) {
  if (!firstName || !lastName || !school || !graduationYear || !email) {
    return "All fields are required.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format.";
  }

  return "";
}

function appendSignupRow_(payload) {
  const sheet = getOrCreateSheet_(SIGNUPS_SHEET);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "timestamp",
      "first_name",
      "last_name",
      "full_name",
      "school",
      "graduation_year",
      "email",
      "source_page",
      "user_agent"
    ]);
  }

  const fullName = (payload.firstName + " " + payload.lastName).trim();
  sheet.appendRow([
    new Date(),
    payload.firstName,
    payload.lastName,
    fullName,
    payload.school,
    payload.graduationYear,
    payload.email,
    payload.pageUrl || "",
    payload.userAgent || ""
  ]);
}

function getJoinLinks_() {
  const sheet = getOrCreateSheet_(CONFIG_SHEET);
  const values = sheet.getDataRange().getValues();
  const map = {};

  for (let i = 0; i < values.length; i++) {
    const key = normalize_(values[i][0]).toLowerCase();
    const value = normalize_(values[i][1]);
    if (key) map[key] = value;
  }

  return {
    discord: map.discord_url || "",
    groupme: map.groupme_url || "",
    instagramPrivate: map.instagram_private_url || "",
    mailingList: map.mailing_list_url || ""
  };
}

function getOrCreateSheet_(sheetName) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);
  return sheet;
}

function normalize_(value) {
  return String(value == null ? "" : value).trim();
}

function jsonOutput_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}


