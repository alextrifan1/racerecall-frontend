import styles from './SeasonBrowser.module.css';
import SessionCard from './SessionCard';
import { getCountryCode, formatWeekendRange, formatRound, isMainEvent } from './seasonHelpers';

export default function WeekendGroup({ weekend, nextSessionKey, onSessionClick }) {
    const supportSessions = weekend.sessions.filter((session) => !isMainEvent(session));
    const mainEvents = weekend.sessions.filter(isMainEvent);
    const flagCode = getCountryCode(weekend.countryName);

    const card = (session, extra = {}) => (
        <SessionCard
            key={session.session_key}
            session={session}
            isNext={session.session_key === nextSessionKey}
            onClick={onSessionClick}
            {...extra}
        />
    );

    return (
        <section className={styles.weekendGroup}>
            {/* Listing header: R03 // DATES // COUNTRY, then the event name */}
            <div className={styles.weekendHeader}>
                <p className={styles.weekendHead}>
                    {weekend.round && (
                        <>
                            <span className={styles.round}>{formatRound(weekend.round)}</span>
                            <span className={styles.sep}>//</span>
                        </>
                    )}
                    <span>{formatWeekendRange(weekend.sessions)}</span>
                    <span className={styles.sep}>//</span>
                    <span>{weekend.countryName}</span>
                </p>
                <p className={styles.weekendDetail}>
                    {flagCode && (
                        <img
                            src={`https://flagcdn.com/24x18/${flagCode}.png`}
                            alt=""
                            className={styles.flag}
                        />
                    )}
                    {weekend.isTesting
                        ? `Pre-season testing at ${weekend.circuitName}`
                        : `${weekend.circuitName} Grand Prix`}
                </p>
            </div>

            {weekend.isTesting ? (
                /* Testing: all sessions in one row, full width */
                <div className={styles.testingStrip}>
                    {supportSessions.map((session) => card(session))}
                </div>
            ) : (
                <div className={styles.sessionStrip}>
                    {/* left side: practice and qualifying */}
                    <div className={styles.sessionStack}>
                        {supportSessions.map((session) => card(session))}
                    </div>

                    {/* right side: sprint and race */}
                    <div className={styles.sessionStack}>
                        {mainEvents.map((session) =>
                            card(session, { isMainRace: true, circuitName: weekend.circuitName })
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
