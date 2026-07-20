import styles from './SeasonBrowser.module.css';
import TrackMap from '../TrackMap.jsx';
import { formatDateTime, getSessionColor } from './seasonHelpers';

export default function SessionCard({ session, isMainRace, circuitName, onClick }) {
    return (
        <div
            className={`${styles.sessionCard} ${isMainRace ? styles.featuredCard : ''}`}
            style={{ '--accent-color': getSessionColor(session.session_type) }}
            onClick={() => onClick(session)}
        >
            <div className={styles.sessionName}>{session.session_name}</div>
            <div className={styles.sessionDate}>{formatDateTime(session.date_start)}</div>

            {isMainRace && circuitName && (
                <TrackMap
                    circuitName={circuitName}
                    className={styles.trackWatermark}
                />
            )}
        </div>
    );
}