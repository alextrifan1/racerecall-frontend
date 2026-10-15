import { useCallback, useState } from 'react';
import SessionModal from '../SessionModal/SessionModal.jsx';
import DotField from '../DotField/DotField.jsx';
import WeekendGroup from './WeekendGroup.jsx';
import SeasonSkeleton from './SeasonSkeleton.jsx';
import styles from './SeasonBrowser.module.css';
import {useSeasonData} from "./useSeasonData.js";

const WEEKENDS_PER_PAGE = 4;

// Seasons in the picker: from the first year OpenF1 has data up to this year,
// newest first. Worked out once when the file loads.
const FIRST_SEASON = 2023;
const CURRENT_SEASON = new Date().getFullYear();
const SEASONS = Array.from(
    { length: CURRENT_SEASON - FIRST_SEASON + 1 },
    (_, i) => CURRENT_SEASON - i
);

// Session times are shown in the visitor's time zone: say which one.
// e.g. "Europe/Bucharest" -> "Bucharest", plus the offset, e.g. "GMT+3"
const TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
const TIME_ZONE_CITY = TIME_ZONE.split('/').pop().replace(/_/g, ' ');
const TIME_ZONE_OFFSET = new Intl.DateTimeFormat('en-US', { timeZoneName: 'shortOffset' })
    .formatToParts(new Date())
    .find((part) => part.type === 'timeZoneName')?.value;
const TIME_ZONE_LABEL = [TIME_ZONE_CITY, TIME_ZONE_OFFSET].filter(Boolean).join(', ');

export default function SeasonBrowser() {
    const [year, setYear] = useState(CURRENT_SEASON);
    // null = no page picked yet: open on the page with the next session
    const [pickedPage, setPickedPage] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);

    const { weekends, nextSessionKey, loading, error } = useSeasonData(year);

    const totalPages = Math.max(1, Math.ceil(weekends.length / WEEKENDS_PER_PAGE));
    const nextWeekendIndex = weekends.findIndex((weekend) =>
        weekend.sessions.some((session) => session.session_key === nextSessionKey)
    );
    const currentRoundPage = nextWeekendIndex >= 0 ? Math.floor(nextWeekendIndex / WEEKENDS_PER_PAGE) : 0;
    const page = Math.min(pickedPage ?? currentRoundPage, totalPages - 1);

    const pageWeekends = weekends.slice(page * WEEKENDS_PER_PAGE, (page + 1) * WEEKENDS_PER_PAGE);

    // Stable function, so the modal's keyboard/focus effect doesn't re-run on every render
    const closeModal = useCallback(() => setSelectedSession(null), []);

    const handleYearChange = (e) => {
        setYear(parseInt(e.target.value));
        setPickedPage(null);
    };


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <p className={styles.eyebrow}>Formula 1 // Season</p>
                    <h1 className={styles.year}>{year}</h1>
                    <p className={styles.timeNote}>
                        Times // Your local time{TIME_ZONE_LABEL && ` (${TIME_ZONE_LABEL})`}
                    </p>
                </div>
                <label className={styles.selectWrap}>
                    <span className={styles.srOnly}>Season</span>
                    <select value={year} onChange={handleYearChange} className={styles.select}>
                        {SEASONS.map((season) => (
                            <option key={season} value={season}>{season}</option>
                        ))}
                    </select>
                </label>
            </div>

            {error && (
                <div className={styles.errorText}>
                    Failed to connect to the telemetry server. Please try again later.
                </div>
            )}

            {!loading && !error && weekends.length === 0 && (
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
                    {loading && <SeasonSkeleton />}

                    {!loading && !error && (
                        <div className={styles.weekendList}>
                            {pageWeekends.map((weekend) => (
                                <WeekendGroup
                                    key={weekend.key}
                                    weekend={weekend}
                                    nextSessionKey={nextSessionKey}
                                    onSessionClick={setSelectedSession}
                                />
                            ))}
                        </div>
                    )}

                    <div className={styles.pagination}>
                        <button
                            onClick={() => setPickedPage(page - 1)}
                            disabled={page === 0 || loading}
                            className={styles.button}
                        >
                            Previous
                        </button>
                        <span className={styles.pageInfo}>Page // {page + 1} of {totalPages}</span>
                        <button
                            onClick={() => setPickedPage(page + 1)}
                            disabled={page >= totalPages - 1 || loading}
                            className={styles.button}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <SessionModal
                session={selectedSession}
                onClose={closeModal}
            />
        </div>
    );
}
