import { useState, useEffect } from 'react';
import SessionModal from '../SessionModal/SessionModal.jsx';
import WeekendGroup from './WeekendGroup.jsx';
import styles from './SeasonBrowser.module.css';
import {useSeasonData} from "./useSeasonData.js";

export default function SeasonBrowser() {
    const [year, setYear] = useState(2026);
    const [page, setPage] = useState(0);
    const [selectedSession, setSelectedSession] = useState(null);


    const { sessions, groupedWeekends, loading, error } = useSeasonData(year, page);

    const handleYearChange = (e) => {
        setYear(parseInt(e.target.value));
        setPage(0);
    };


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Formula 1 - {year} Season</h2>
                <select value={year} onChange={handleYearChange} className={styles.select}>
                    <option value={2023}>2023</option>
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                </select>
            </div>

            {loading && <div className={styles.loader}>Loading season data...</div>}

            {error && (
                <div className={styles.errorText}>
                    Failed to connect to the telemetry server. Please try again later.
                </div>
            )}

            {!loading && !error && sessions.length === 0 && (
                <p className={styles.errorText}>
                    No sessions available right now. The API is likely locked due to an active F1 race weekend. Try again later!
                </p>
            )}

            {!loading && !error && (
                <div className={styles.weekendList}>
                    {Object.entries(groupedWeekends).map(([location, weekend]) => (
                        <WeekendGroup
                            key={location}
                            weekend={weekend}
                            onSessionClick={setSelectedSession}
                        />
                    ))}
                </div>
            )}

            <div className={styles.pagination}>
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 0 || loading}
                    className={styles.button}
                >
                    Previous
                </button>
                <span className={styles.pageInfo}>Page {page + 1}</span>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={Object.keys(groupedWeekends).length < 4 || loading}
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
    );
}