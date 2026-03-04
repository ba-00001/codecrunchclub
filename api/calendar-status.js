const CALENDAR_ID =
  "ODRjNGQ2NTA0NTA1OTdjNTkyZTc0ZThmNWZlODUxMzAxZjYwYTkyZjMwYmI1OTM2ODA5OTk3ODFkZmFjYWIxMkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t";

const GOOGLE_API_BASE = "https://www.googleapis.com/calendar/v3/calendars";

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
  const windowStart = new Date(now.getTime() - 12 * 60 * 60 * 1000);
  const windowEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const params = new URLSearchParams({
    key: apiKey,
    singleEvents: "true",
    orderBy: "startTime",
    timeMin: windowStart.toISOString(),
    timeMax: windowEnd.toISOString(),
    maxResults: "25"
  });

  const endpoint = `${GOOGLE_API_BASE}/${encodeURIComponent(CALENDAR_ID)}/events?${params.toString()}`;

  try {
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
    const items = Array.isArray(data.items) ? data.items : [];
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
      upcomingEvents: debugMode ? timedEvents.slice(0, 10).map(toEventSummary) : undefined,
      checkedAt: now.toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      error: "Unable to read calendar status",
      details: error instanceof Error ? error.message : String(error)
    });
  }
};
