import { useState, useEffect } from 'react';
import SessionModal from './SessionModal';
import styles from './SeasonBrowser.module.css'

const getCountryCode = (countryName) => {
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

const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timePart = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${datePart} • ${timePart}`;
};

const getPillColor = (sessionType) => {
    if (!sessionType) return '#023047';
    if (sessionType === 'Race') return '#FFB703';
    if (sessionType.includes('Qualifying')) return '#023047';
    if (sessionType.includes('Practice')) return '#219EBC';
    if (sessionType.includes('Sprint')) return '#8ECAE6';
    return '#023047';
};


export default function SeasonBrowser() {
    const [sessions, setSessions] = useState([]);
    const [year, setYear] = useState(2023);
    const [page, setPage] = useState(0);
    const [selectedSession, setSelectedSession] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/sessions?year=${year}&page=${page}&size=10`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setSessions(data);
                } else {
                    setSessions([]);
                }
            })
            .catch(error => console.error("Error fetching data:", error))
    }, [year, page]);

    const handleYearchange = (e) => {
        setYear(parseInt(e.target.value));
        setPage(0);
    }

    return (
        <div className={styles.container}>

            <div className={styles.header}>
                <h2>Formula 1 - {year} Season</h2>
                <select value={year} onChange={handleYearchange} className={styles.select}>
                    <option value={2023}>2023</option>
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                </select>
            </div>

            {sessions.length === 0 && (
                <p className={styles.errorText}>
                    No sessions available right now. The API is likely locked due to an active F1 race weekend. Try again later!
                </p>
            )}

            <div className={styles.grid}>
                {sessions.map((session) => (
                    <div
                        key={session.session_key}
                        className={styles.card}
                        onClick={() => setSelectedSession(session)}
                    >
                        <div className={styles.cardLocation}>
                            <img
                                src={`https://flagcdn.com/24x18/${getCountryCode(session.country_name)}.png`}
                                alt={`${session.country_name} flag`}
                                className={styles.flag}
                            />
                            {session.circuit_short_name}
                        </div>

                        <h3 className={styles.cardTitle}>{session.session_name}</h3>

                        <div className={styles.cardDate}>
                            {formatDateTime(session.date_start)}
                        </div>

                        <div
                            className={styles.sessionPill}
                            style={{ backgroundColor: getPillColor(session.session_type) }}
                        >
                            {session.session_type}
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.pagination}>
                <button
                    onClick={() => setPage(page -1)}
                    disabled={page === 0}
                    className={styles.button}
                >
                    Previous
                </button>

                <span className={styles.pageInfo}>Page {page + 1}</span>

                <button
                    onClick={() => setPage(page + 1)}
                    disabled={sessions.length < 10}
                    className={styles.button}
                >
                    Next
                </button>
            </div>

            <SessionModal
                session={selectedSession}
                onClose={() => setSelectedSession(null)}
            />

        </div>
    )
}