import { useState } from 'react';
import SessionModal from '../SessionModal/SessionModal.jsx';
import DotField from '../DotField/DotField.jsx';
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
                <div>
                    <p className={styles.eyebrow}>Formula 1 // Season</p>
                    <h1 className={styles.year}>{year}</h1>
                </div>
                <label className={styles.selectWrap}>
                    <span className={styles.srOnly}>Season</span>
                    <select value={year} onChange={handleYearChange} className={styles.select}>
                        <option value={2023}>2023</option>
                        <option value={2024}>2024</option>
                        <option value={2025}>2025</option>
                        <option value={2026}>2026</option>
                    </select>
                </label>
            </div>

            {loading && <p className={styles.status}>Loading season data...</p>}

            {error && (
                <div className={styles.errorText}>
                    Failed to connect to the telemetry server. Please try again later.
                </div>
            )}

            {!loading && !error && sessions.length === 0 && (
                <p className={styles.status}>
                    No sessions available right now. The API is likely locked due to an active F1 race weekend. Try again later!
                </p>
            )}

            <div className={styles.listArea}>
                {/* Dotline dot wave behind the lower part of the list, full screen width */}
                <div className={styles.listBackdrop}>
                    <DotField height="100%" />
                </div>

                <div className={styles.listContent}>
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
                        <span className={styles.pageInfo}>Page // {page + 1}</span>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={Object.keys(groupedWeekends).length < 4 || loading}
                            className={styles.button}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <SessionModal
                session={selectedSession}
                onClose={() => setSelectedSession(null)}
            />
        </div>
    );
}
