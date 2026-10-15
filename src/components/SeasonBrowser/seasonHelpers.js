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

// First and last session of a weekend -> "10/03–10/05"
export const formatWeekendRange = (sessions) => {
    const dates = sessions.map((s) => s.date_start).filter(Boolean).sort();
    if (dates.length === 0) return '';
    const first = formatShortDate(dates[0]);
    const last = formatShortDate(dates[dates.length - 1]);
    return first === last ? first : `${first}–${last}`;
};
