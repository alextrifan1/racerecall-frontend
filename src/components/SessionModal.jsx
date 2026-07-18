import styles from './SessionModal.module.css';

export default function SessionModal({ session, onClose} ) {

    if (!session) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>

                <h2>{session.session_name}</h2>
                <hr style={{ margin: '15px 0', border: '0.5px solid #eee' }} />

                <p><strong>Circuit:</strong> {session.circuit_short_name}</p>
                <p><strong>Location:</strong> {session.location}, {session.country_name}</p>
                <p><strong>Session Type:</strong> {session.session_type}</p>
                <p><strong>Start Time:</strong> {new Date(session.date_start).toLocaleString()}</p>
                <p><strong>End Time:</strong> {new Date(session.date_end).toLocaleString()}</p>
                <p><strong>Session Key:</strong> {session.session_key}</p>

                <button
                    className={styles.button}
                    onClick={() => alert(`Next step: Fetch drivers for session ${session.session_key}!`)}
                >
                    Analyze Pace Duel
                </button>
            </div>
        </div>
    )
}