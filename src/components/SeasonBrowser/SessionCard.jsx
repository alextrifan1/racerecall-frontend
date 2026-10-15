import styles from './SeasonBrowser.module.css';
import TrackMap from '../TrackMap.jsx';
import { formatDateTime } from './seasonHelpers';

export default function SessionCard({ session, isMainRace, isNext, circuitName, onClick }) {
    // The API types sprints as "Race" too: only the Grand Prix itself is "the race"
    const isGrandPrix = session.session_type === 'Race' && session.session_name === 'Race';
    const typeLabel = session.session_name === 'Sprint' ? 'Sprint' : session.session_type;

    // Status tag after the type: the next session to start, or any later one
    const status = isNext ? 'Next' : session.upcoming ? 'Upcoming' : null;

    const classes = [
        styles.sessionCard,
        isMainRace && styles.featuredCard,
        session.upcoming && styles.upcomingCard,
        isNext && styles.nextCard,
    ].filter(Boolean).join(' ');

    return (
        <button type="button" className={classes} onClick={() => onClick(session)}>
            <span className={styles.sessionType}>
                {/* Dots as data: a filled red dot for a finished Grand Prix,
                    a hollow ring for the next session */}
                {isNext && <span className={styles.nextRing} aria-hidden="true" />}
                {!isNext && isGrandPrix && !session.upcoming && (
                    <span className={styles.raceDot} aria-hidden="true" />
                )}
                {typeLabel}
                {status && (
                    <>
                        <span className={styles.sep}>//</span>
                        <span className={isNext ? styles.statusNext : undefined}>{status}</span>
                    </>
                )}
            </span>
            <span className={styles.sessionName}>{session.session_name}</span>
            <span className={styles.sessionDate}>{formatDateTime(session.date_start)}</span>

            {isMainRace && circuitName && (
                <TrackMap
                    circuitName={circuitName}
                    className={styles.trackWatermark}
                />
            )}
        </button>
    );
}
