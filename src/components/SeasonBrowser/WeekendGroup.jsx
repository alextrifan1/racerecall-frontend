import styles from './SeasonBrowser.module.css';
import SessionCard from './SessionCard';
import { getCountryCode, formatWeekendRange } from './seasonHelpers';

export default function WeekendGroup({ weekend, onSessionClick }) {
    const supportSessions = weekend.sessions.filter(session => {
        const type = session.session_type || '';
        const name = session.session_name || '';
        return type !== 'Race' && name !== 'Sprint';
    });

    const mainEvents = weekend.sessions.filter(session => {
        const type = session.session_type || '';
        const name = session.session_name || '';
        return type === 'Race' || name === 'Sprint';
    });

    // No race and no sprint: a testing event (e.g. pre-season testing, Day 1–3)
    const isTesting = mainEvents.length === 0;

    return (
        <section className={styles.weekendGroup}>
            {/* Listing header: DATES // COUNTRY, then the event name */}
            <div className={styles.weekendHeader}>
                <p className={styles.weekendHead}>
                    <span>{formatWeekendRange(weekend.sessions)}</span>
                    <span className={styles.sep}>//</span>
                    <span>{weekend.countryName}</span>
                </p>
                <p className={styles.weekendDetail}>
                    <img
                        src={`https://flagcdn.com/24x18/${getCountryCode(weekend.countryName)}.png`}
                        alt=""
                        className={styles.flag}
                    />
                    {isTesting
                        ? `Pre-season testing at ${weekend.circuitName}`
                        : `${weekend.circuitName} Grand Prix`}
                </p>
            </div>

            {isTesting ? (
                /* Testing: all sessions in one row, full width */
                <div className={styles.testingStrip}>
                    {supportSessions.map((session) => (
                        <SessionCard
                            key={session.session_key}
                            session={session}
                            onClick={onSessionClick}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.sessionStrip}>
                    {/* left side */}
                    <div className={styles.sessionStack}>
                        {supportSessions.map((session) => (
                            <SessionCard
                                key={session.session_key}
                                session={session}
                                onClick={onSessionClick}
                            />
                        ))}
                    </div>

                    {/* right side */}
                    <div className={styles.sessionStack}>
                        {mainEvents.map((session) => (
                            <SessionCard
                                key={session.session_key}
                                session={session}
                                isMainRace={session.session_type === 'Race'}
                                circuitName={weekend.circuitName}
                                onClick={onSessionClick}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
