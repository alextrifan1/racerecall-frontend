import styles from './SeasonBrowser.module.css';
import TrackMap from '../TrackMap.jsx';
import { formatDateTime } from './seasonHelpers';

export default function SessionCard({ session, isMainRace, circuitName, onClick }) {
    // The API types sprints as "Race" too: only the Grand Prix itself gets the red dot
    const isGrandPrix = session.session_type === 'Race' && session.session_name === 'Race';
    const typeLabel = session.session_name === 'Sprint' ? 'Sprint' : session.session_type;

    return (
        <button
            type="button"
            className={`${styles.sessionCard} ${isMainRace ? styles.featuredCard : ''}`}
            onClick={() => onClick(session)}
        >
            <span className={styles.sessionType}>
                {isGrandPrix && <span className={styles.raceDot} aria-hidden="true" />}
                {typeLabel}
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
