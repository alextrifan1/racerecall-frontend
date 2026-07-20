import styles from './SeasonBrowser.module.css';
import SessionCard from './SessionCard';
import { getCountryCode } from './seasonHelpers';

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

    return (
        <div className={styles.weekendGroup}>
            <div className={styles.weekendHeader}>
                <img
                    src={`https://flagcdn.com/24x18/${getCountryCode(weekend.countryName)}.png`}
                    alt={`${weekend.countryName} flag`}
                    className={styles.flag}
                />
                <span>{weekend.circuitName} Grand Prix</span>
            </div>

            <div className={styles.sessionStrip}>
                {/* left side */}
                <div className={styles.practiceQualiStack}>
                    {supportSessions.map((session) => (
                        <SessionCard
                            key={session.session_key}
                            session={session}
                            onClick={onSessionClick}
                        />
                    ))}
                </div>

                {/* right side */}
                <div className={styles.practiceQualiStack}>
                    {mainEvents.map((session) => (
                        <SessionCard
                            key={session.session_key}
                            session={session}
                            isMainRace={session.session_type === 'Race'}
                            circuitName={weekend.location || weekend.circuit_short_name}
                            onClick={onSessionClick}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}