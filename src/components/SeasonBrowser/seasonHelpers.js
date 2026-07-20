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

export const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const timePart = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${datePart} • ${timePart}`;
};

export const getSessionColor = (sessionType) => {
    if (!sessionType) return '#219EBC';
    if (sessionType === 'Race') return '#FFB703';
    if (sessionType.includes('Qualifying')) return '#023047';
    if (sessionType.includes('Practice')) return '#219EBC';
    if (sessionType.includes('Sprint')) return '#8ECAE6';
    return '#219EBC';
};