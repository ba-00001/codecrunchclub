/**************************************************************
 * HACK UNIVERSITY — MEMBERSHIP API (v2)
 * - Updated for the newer sheet layout you shared
 * - Secure referer allowlist
 * - Membership profile + clubs + hackathons
 * - Event access links with time-window gating
 **************************************************************/

const CONFIG = {
  TAB_NAME: "Sheet1",
  DEBUG_MODE: true,
  ALLOWED_DOMAINS: [
    "https://codecrunchglobal.vercel.app",
    "https://ba-00001.github.io"
  ],
  CLUB_NAME_ORDER: [
    "Hack University Worldwide",
    "Code Crunch Global",
    "ColorStack at FIU",
    "CAHSI at FIU",
    "Google Developer Group at FIU",
    "Raspberry Pi Code Crunch"
  ],
  CLUB_ALIASES: {
    "Code Crunch Worldwide": "Code Crunch Global",
    "Rasberry Pi Code Crunch at FIU": "Raspberry Pi Code Crunch",
    "Raspberry Pi Code Crunch at FIU": "Raspberry Pi Code Crunch",
    "Google Developer Group at Florida International University": "Google Developer Group at FIU"
  },
  CLUBS: {
    "Hack University Worldwide": {
      logo: "https://hackuniversity.vercel.app/favicon.ico",
      description: "Umbrella membership across Hack University partners"
    },
    "Code Crunch Global": {
      logo: "https://codecrunchglobal-logo.vercel.app/",
      description: "Main coding and hackathon community"
    },
    "ColorStack at FIU": {
      logo: "https://colorstackatfiu-logo.vercel.app/",
      description: "Career development in tech"
    },
    "CAHSI at FIU": {
      logo: "https://cahsiatfiu-logo.vercel.app/",
      description: "Advancement and support for computing pathways"
    },
    "Google Developer Group at FIU": {
      logo: "https://gdgatfiu-logo.vercel.app/",
      description: "Google technologies and development"
    },
    "Raspberry Pi Code Crunch": {
      logo: "https://raspberrypicodecrunch-logo.vercel.app/",
      description: "Hardware programming and IoT projects"
    }
  }
};

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isTruthyYes(value) {
  const v = String(value || "").trim().toLowerCase();
  if (!v) return false;
  return /^yes\b/.test(v) || v === "true" || v === "1" || v === "y";
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch (err) {
    return value;
  }
}

function isValidReferer(referer) {
  if (!referer) return false;
  return CONFIG.ALLOWED_DOMAINS.some(function (domain) {
    return String(referer).indexOf(domain) === 0;
  });
}

function asJson(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}

function errorJson(message) {
  return asJson({ success: false, error: message });
}

function formatDate(value) {
  if (!value) return "";
  try {
    return Utilities.formatDate(new Date(value), Session.getScriptTimeZone(), "MMMM d, yyyy");
  } catch (err) {
    return String(value);
  }
}

function parseDate(value) {
  if (!value) return null;
  if (Object.prototype.toString.call(value) === "[object Date]") {
    return isNaN(value.getTime()) ? null : value;
  }

  const raw = String(value).trim();
  if (!raw) return null;

  // Try native parsing first (ISO and other standard formats).
  var d = new Date(raw);
  if (!isNaN(d.getTime())) return d;

  // Supported custom format examples:
  // 3.5.2026 @ 6 am est
  // 3/5/2026 @ 6:30 pm edt
  // 3-5-2026 6 am
  var m = raw.match(
    /^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})(?:\s*@?\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*([a-z]{2,4})?)?$/i
  );
  if (!m) return null;

  var month = parseInt(m[1], 10);
  var day = parseInt(m[2], 10);
  var year = parseInt(m[3], 10);
  var hour = m[4] ? parseInt(m[4], 10) : 0;
  var minute = m[5] ? parseInt(m[5], 10) : 0;
  var meridiem = String(m[6] || "").toLowerCase();
  var tz = String(m[7] || "").toLowerCase();

  if (meridiem) {
    if (hour === 12) hour = 0;
    if (meridiem === "pm") hour += 12;
  }

  // If timezone is specified, convert from that timezone to UTC.
  // EST = UTC-5, EDT = UTC-4.
  if (tz === "est" || tz === "edt") {
    var offset = tz === "est" ? -5 : -4;
    return new Date(Date.UTC(year, month - 1, day, hour - offset, minute, 0, 0));
  }

  // No explicit timezone: interpret in script local timezone.
  return new Date(year, month - 1, day, hour, minute, 0, 0);
}

function canonicalClubName(name) {
  const n = String(name || "").trim();
  if (!n) return "";
  return CONFIG.CLUB_ALIASES[n] || n;
}

function findHeaderIndex(headers, matcher) {
  for (var i = 0; i < headers.length; i++) {
    var header = String(headers[i] || "").trim();
    if (!header) continue;
    if (matcher(header)) return i;
  }
  return -1;
}

function extractClubs(row, headers) {
  const clubs = [];
  for (var i = 0; i < 6; i++) {
    var header = String(headers[i + 1] || "").trim(); // Col 2..7 headers
    if (!header) continue; // Skip empty row-2 headers

    const value = String(row[i + 1] || "").trim(); // Col 2..7
    if (!value || /^no information$/i.test(value)) continue;

    const canonical = canonicalClubName(value) || CONFIG.CLUB_NAME_ORDER[i] || value;
    clubs.push({
      name: canonical,
      status: "Active",
      logo: CONFIG.CLUBS[canonical] ? CONFIG.CLUBS[canonical].logo : "",
      description: CONFIG.CLUBS[canonical] ? CONFIG.CLUBS[canonical].description : ""
    });
  }

  // Ensure umbrella org always present.
  if (!clubs.some(function (c) { return c.name === "Hack University Worldwide"; })) {
    clubs.unshift({
      name: "Hack University Worldwide",
      status: "Active",
      logo: CONFIG.CLUBS["Hack University Worldwide"].logo,
      description: CONFIG.CLUBS["Hack University Worldwide"].description
    });
  }

  return clubs;
}

function isHackathonHeader(header) {
  const h = String(header || "").trim();
  if (!h) return false;
  if (/(participant of event|event\s*link|apis|subscriptions|start date|end date|would you like to volunteer|organization rules|mlh partnered events)/i.test(h)) {
    return false;
  }
  return /(hackathon|do you want to register|register for)/i.test(h);
}

function cleanEventName(header) {
  return String(header || "")
    .replace(/\s+/g, " ")
    .replace(/^["']|["']$/g, "")
    .trim();
}

function extractHackathons(row, headers) {
  const out = [];
  for (var i = 0; i < headers.length; i++) {
    if (!String(headers[i] || "").trim()) continue; // Skip empty row-2 headers
    if (!isHackathonHeader(headers[i])) continue;
    const value = String(row[i] || "").trim();
    if (!value) continue;
    out.push({
      name: cleanEventName(headers[i]),
      level: value,
      isRegistered: isTruthyYes(value)
    });
  }
  return out;
}

function isMissingInfo(value) {
  var v = String(value || "").trim().toLowerCase();
  return !v || v === "-" || v === "no information" || v === "not updated";
}

function extractVolunteerStatus(row, headers) {
  var idx = findHeaderIndex(headers, function (h) {
    return /(^c2\.1|would you like to volunteer)/i.test(h);
  });
  if (idx < 0) {
    return { status: "Not information available / Not updated", answer: "" };
  }

  var raw = String(row[idx] || "").trim();
  if (isMissingInfo(raw)) {
    return { status: "Not information available / Not updated", answer: "" };
  }

  return { status: "Answered", answer: raw };
}

function parseEventLinks(raw) {
  const source = String(raw || "").trim();
  if (!source) return [];
  const list = [];

  // Expected format: (NAME BENEFIT:LINK1), (NAME BENEFIT:LINK2)
  const pattern = /\(([^:()]+):([^()]+)\)/g;
  var match;
  while ((match = pattern.exec(source)) !== null) {
    list.push({
      label: String(match[1] || "").trim(),
      url: String(match[2] || "").trim()
    });
  }

  // Fallback: if not in "(label:url)" format, keep raw text as single label.
  if (!list.length) {
    list.push({ label: "Event Link", url: source });
  }
  return list;
}

function extractEventAccess(row, headers) {
  const participantCols = [];
  for (var i = 0; i < headers.length; i++) {
    const h = String(headers[i] || "").trim();
    if (!h) continue; // Skip empty row-2 headers
    if (/^participant of event/i.test(h)) {
      participantCols.push({ idx: i, header: h });
    }
  }

  const now = new Date();
  const events = [];

  if (!participantCols.length) {
    events.push({
      eventKey: "Unknown Event",
      participantRaw: "",
      isParticipant: false,
      startAt: "",
      endAt: "",
      isActive: false,
      statusText: "ERROR 1: Missing 'Participant of event' column",
      errorCode: "ERROR_1",
      links: []
    });
    return events;
  }

  participantCols.forEach(function (col) {
    var suffix = "";
    var m = col.header.match(/#\s*([A-Za-z0-9.\-_]+)/);
    if (m) suffix = m[1];

    var linksIdx = -1;
    var startIdx = -1;
    var endIdx = -1;

    for (var j = 0; j < headers.length; j++) {
      var hRaw = String(headers[j] || "").trim();
      if (!hRaw) continue; // Skip empty row-2 headers
      var h = hRaw.toLowerCase();
      if (suffix && h.indexOf("#" + suffix.toLowerCase()) === -1) continue;

      if (linksIdx === -1 && /event\s*link|apis|subscriptions/.test(h)) linksIdx = j;
      if (startIdx === -1 && /start date|start date and time/.test(h)) startIdx = j;
      if (endIdx === -1 && /end date|end date and time/.test(h)) endIdx = j;
    }

    var participantValue = String(row[col.idx] || "").trim();
    var isParticipant = isTruthyYes(participantValue);
    var linksRaw = linksIdx >= 0 ? row[linksIdx] : "";
    var links = parseEventLinks(linksRaw);
    var start = startIdx >= 0 ? parseDate(row[startIdx]) : null;
    var end = endIdx >= 0 ? parseDate(row[endIdx]) : null;
    var isActive = !!(isParticipant && start && end && now >= start && now <= end);

    var statusText = "Not registered for this event";
    var errorCode = "";
    if (linksIdx === -1) {
      statusText = "ERROR 2: Missing event links column";
      errorCode = "ERROR_2";
    } else if (!start) {
      statusText = "ERROR 3: Missing start date/time";
      errorCode = "ERROR_3";
    } else if (!end) {
      statusText = "ERROR 4: Missing end date/time";
      errorCode = "ERROR_4";
    } else if (isParticipant) {
      if (now < start) statusText = "Registered - event link unlocks when the event starts";
      else if (now > end) statusText = "Event ended — links closed";
      else statusText = "Event live — links active";
    }

    if (isParticipant && start && end && !errorCode) {
      if (now > end) statusText = "Registered - event ended, links closed";
      else if (now >= start && now <= end) statusText = "Registered - event live, link enabled";
    }

    events.push({
      eventKey: suffix || col.header,
      participantRaw: participantValue,
      isParticipant: isParticipant,
      startAt: start ? start.toISOString() : "",
      endAt: end ? end.toISOString() : "",
      isActive: isActive,
      statusText: statusText,
      errorCode: errorCode,
      links: links
    });
  });

  return events;
}

function resolveColumnIndexes(headers) {
  var idx = {
    membershipID: findHeaderIndex(headers, function (h) { return /^membership id$/i.test(h); }),
    timestamp: findHeaderIndex(headers, function (h) { return /^timestamp$/i.test(h); }),
    email: findHeaderIndex(headers, function (h) { return /^(email address|a3\..*school email)/i.test(h); }),
    participantName: findHeaderIndex(headers, function (h) { return /^(a2\..*first and last name|participant name|full name)/i.test(h); })
  };

  return idx;
}

function createMembershipObject(row, headers, idx) {
  var membershipID = idx.membershipID >= 0 ? String(row[idx.membershipID] || "").trim() : "";
  var timestamp = idx.timestamp >= 0 ? row[idx.timestamp] : "";
  var email = idx.email >= 0 ? normalizeEmail(row[idx.email]) : "";
  var participantName = idx.participantName >= 0
    ? String(row[idx.participantName] || "").trim() || "Member"
    : "Member";

  var clubs = extractClubs(row, headers);
  var hackathons = extractHackathons(row, headers);
  var eventAccess = extractEventAccess(row, headers);
  var volunteer = extractVolunteerStatus(row, headers);

  return {
    email: email,
    status: "READY",
    message: "Membership verified.",
    certificateData: {
      participantName: participantName,
      memberDateSince: formatDate(timestamp),
      membershipID: membershipID || "No ID Assigned",
      submitDate: formatDate(timestamp),
      clubText: "Hack University Initiative",
      signatureClubText: "Hack University Initiative",
      clubs: clubs,
      hackathons: hackathons,
      eventAccess: eventAccess,
      volunteerStatus: volunteer.status,
      volunteerAnswer: volunteer.answer
    }
  };
}

function searchMembershipData(email) {
  var ws = SpreadsheetApp.getActive().getSheetByName(CONFIG.TAB_NAME);
  if (!ws) throw new Error("Sheet not found: " + CONFIG.TAB_NAME);

  var rows = ws.getDataRange().getDisplayValues();
  if (!rows || rows.length < 3) return [];

  // Row 2 contains actual field headers.
  var headers = rows[1] || [];
  var idx = resolveColumnIndexes(headers);
  if (idx.email < 0) {
    throw new Error("Email Address column not found in row 2 headers");
  }

  var out = [];

  // Data starts on row 3.
  for (var i = 2; i < rows.length; i++) {
    if (normalizeEmail(rows[i][idx.email]) === email) {
      out.push(createMembershipObject(rows[i], headers, idx));
    }
  }

  return out;
}

function doGet(e) {
  try {
    var email = normalizeEmail(e && e.parameter ? e.parameter.email : "");
    var referer = safeDecode(e && e.parameter ? e.parameter.referer : "");

    if (!email) return errorJson("Missing email address");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return errorJson("Invalid email format");
    if (!isValidReferer(referer)) {
      return errorJson("Access denied. Allowed domains: " + CONFIG.ALLOWED_DOMAINS.join(", "));
    }

    var certs = searchMembershipData(email);
    var payload = {
      success: true,
      certificates: certs,
      message: certs.length
        ? "Found " + certs.length + " record(s) for " + email
        : "No membership found for email: " + email,
      timestamp: new Date().toISOString(),
      debugMode: CONFIG.DEBUG_MODE
    };

    if (CONFIG.DEBUG_MODE) {
      console.log("HU API", { email: email, matches: certs.length });
    }

    return asJson(payload);
  } catch (err) {
    console.error("HU API Error", err);
    return errorJson("Internal server error: " + err.message);
  }
}
