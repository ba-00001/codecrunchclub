const CALENDAR_ID =
  "84c4d650450597c592e74e8f5fe851301f60a92f30bb593680999781dfacab12@group.calendar.google.com";

const GOOGLE_API_BASE = "https://www.googleapis.com/calendar/v3/calendars";
const LOOKAHEAD_DAYS = 548;
const DEFAULT_HISTORY_START = "2024-08-01T00:00:00-04:00";
const PAGE_SIZE = 2500;

function toIsoString(value) {
  if (!value) return null;
  return value.dateTime || value.date || null;
}

function isTimedEvent(event) {
  return Boolean(event?.start?.dateTime && event?.end?.dateTime);
}

function toEventSummary(event) {
  return {
    summary: event.summary || "Untitled event",
    start: toIsoString(event.start),
    end: toIsoString(event.end),
    location: event.location || "",
    htmlLink: event.htmlLink || ""
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing GOOGLE_CALENDAR_API_KEY" });
  }

  const debugMode = req.query?.debug === "1";
  const now = new Date();
  const requestedSince = typeof req.query?.since === "string" ? req.query.since : "";
  const parsedSince = requestedSince ? new Date(requestedSince) : new Date(DEFAULT_HISTORY_START);
  const windowStart = Number.isNaN(parsedSince.getTime())
    ? new Date(DEFAULT_HISTORY_START)
    : parsedSince;
  const windowEnd = new Date(now.getTime() + LOOKAHEAD_DAYS * 24 * 60 * 60 * 1000);

  try {
    const items = [];
    let pageToken = "";

    while (true) {
      const params = new URLSearchParams({
        key: apiKey,
        singleEvents: "true",
        orderBy: "startTime",
        timeMin: windowStart.toISOString(),
        timeMax: windowEnd.toISOString(),
        maxResults: String(PAGE_SIZE)
      });

      if (pageToken) {
        params.set("pageToken", pageToken);
      }

      const endpoint = `${GOOGLE_API_BASE}/${encodeURIComponent(CALENDAR_ID)}/events?${params.toString()}`;
      const response = await fetch(endpoint, {
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          error: "Google Calendar request failed",
          details: errorText
        });
      }

      const data = await response.json();
      const pageItems = Array.isArray(data.items) ? data.items : [];
      items.push(...pageItems);

      if (!data.nextPageToken) {
        break;
      }

      pageToken = data.nextPageToken;
    }

    const timedEvents = items.filter(isTimedEvent);

    let activeEvent = null;
    let nextEvent = null;

    for (const event of timedEvents) {
      const start = new Date(event.start.dateTime);
      const end = new Date(event.end.dateTime);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) continue;

      if (start <= now && end >= now) {
        activeEvent = event;
        break;
      }

      if (!nextEvent && start > now) {
        nextEvent = event;
      }
    }

    return res.status(200).json({
      ok: true,
      calendarId: CALENDAR_ID,
      hasLiveEvent: Boolean(activeEvent),
      activeEvent: activeEvent ? toEventSummary(activeEvent) : null,
      nextEvent: nextEvent ? toEventSummary(nextEvent) : null,
      upcomingEvents: debugMode ? timedEvents.map(toEventSummary) : undefined,
      eventCount: timedEvents.length,
      checkedAt: now.toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      error: "Unable to read calendar status",
      details: error instanceof Error ? error.message : String(error)
    });
  }
};
