export const getCountryCode = (countryName) => {
    const map = {
        "Bahrain": "bh", "Saudi Arabia": "sa", "Australia": "au",
        "Japan": "jp", "China": "cn", "United States": "us",
        "Italy": "it", "Monaco": "mc", "Canada": "ca",
        "Spain": "es", "Austria": "at", "Great Britain": "gb",
        "Hungary": "hu", "Belgium": "be", "Netherlands": "nl",
        "Singapore": "sg", "Azerbaijan": "az", "Mexico": "mx",
        "Brazil": "br", "Qatar": "qa", "United Arab Emirates": "ae"
    };
    return map[countryName] || "un";
};

// "2025-10-03T09:30:00+00:00" -> "10/03"
export const formatShortDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });

// "2025-10-03T09:30:00+00:00" -> "10/03 // 12:30" (in the visitor's time zone)
export const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const timePart = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${formatShortDate(dateString)} // ${timePart}`;
};

// Race or sprint: the sessions shown on the right of a weekend.
// (The API types sprints as "Race" too.)
export const isMainEvent = (session) =>
    session.session_type === 'Race' || session.session_name === 'Sprint';

// Round number for display: 3 -> "R03"
export const formatRound = (round) => `R${String(round).padStart(2, '0')}`;

/*
 * Turns the flat session list from the API into ordered weekends:
 * - sessions grouped by meeting and sorted by start time
 * - weekends sorted by their first session
 * - isTesting: no race and no sprint (e.g. pre-season testing)
 * - round: 1, 2, 3... for race weekends only (testing has no round)
 * - each session gets `upcoming` (starts after `now`)
 * Also returns the key of the next session to start, or null.
 */
export const buildSeason = (sessions, now) => {
    const byMeeting = new Map();
    for (const session of sessions) {
        const key = session.meeting_key ?? session.circuit_short_name ?? 'unknown';
        if (!byMeeting.has(key)) {
            byMeeting.set(key, {
                key,
                circuitName: session.circuit_short_name,
                countryName: session.country_name,
                sessions: [],
            });
        }
        byMeeting.get(key).sessions.push({
            ...session,
            upcoming: new Date(session.date_start) > now,
        });
    }

    const weekends = [...byMeeting.values()];
    for (const weekend of weekends) {
        weekend.sessions.sort((a, b) => a.date_start.localeCompare(b.date_start));
        weekend.isTesting = !weekend.sessions.some(isMainEvent);
    }
    weekends.sort((a, b) => a.sessions[0].date_start.localeCompare(b.sessions[0].date_start));

    let round = 0;
    for (const weekend of weekends) {
        weekend.round = weekend.isTesting ? null : ++round;
    }

    const next = weekends
        .flatMap((weekend) => weekend.sessions)
        .find((session) => session.upcoming);

    return { weekends, nextSessionKey: next ? next.session_key : null };
};

// First and last session of a weekend -> "10/03–10/05"
export const formatWeekendRange = (sessions) => {
    const dates = sessions.map((s) => s.date_start).filter(Boolean).sort();
    if (dates.length === 0) return '';
    const first = formatShortDate(dates[0]);
    const last = formatShortDate(dates[dates.length - 1]);
    return first === last ? first : `${first}–${last}`;
};
