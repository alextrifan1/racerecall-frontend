import { useState, useEffect } from 'react';
import styles from './SessionModal.module.css';

export default function SessionModal({ session, onClose }) {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch the enriched data whenever a new session is passed in
    useEffect(() => {
        if (!session) return;

        setLoading(true);
        fetch(`http://localhost:8080/api/sessions/${session.session_key}/details`)
            .then(response => response.json())
            .then(data => {
                setDetails(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching session details:", error);
                setLoading(false);
            });
    }, [session]);

    if (!session) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>

                {/* Basic info loads instantly from the prop */}
                <h2>{session.session_name}</h2>
                <p><strong>Circuit:</strong> {session.circuit_short_name} ({session.country_name})</p>

                <hr style={{ margin: '15px 0', border: '0.5px solid #eee' }} />

                {/* Show a loading state while fetching the deep data */}
                {loading ? (
                    <div className={styles.loader}>Loading session details...</div>
                ) : details ? (
                    <>
                        {/* Weather Section */}
                        {details.weatherSnapshot && (
                            <>
                                <h3 className={styles.sectionTitle}>Conditions at Start</h3>
                                <div className={styles.weatherGrid}>
                                    <div className={styles.weatherItem}>
                                        <span className={styles.weatherValue}>{details.weatherSnapshot.air_temperature}°C</span>
                                        <span className={styles.weatherLabel}>Air Temp</span>
                                    </div>
                                    <div className={styles.weatherItem}>
                                        <span className={styles.weatherValue}>{details.weatherSnapshot.track_temperature}°C</span>
                                        <span className={styles.weatherLabel}>Track Temp</span>
                                    </div>
                                    <div className={styles.weatherItem}>
                                        <span className={styles.weatherValue}>{details.weatherSnapshot.rainfall === 1 ? 'Yes' : 'No'}</span>
                                        <span className={styles.weatherLabel}>Rain</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Podium Section */}
                        {details.podium && details.podium.length > 0 && (
                            <>
                                <h3 className={styles.sectionTitle}>Top 3 Finishers</h3>
                                <ul className={styles.podiumList}>
                                    {details.podium.map((driver) => (
                                        <li key={driver.driver_number} className={styles.podiumItem}>
                                            <div>
                                                <span className={styles.position}>P{driver.position}</span>
                                                <strong>{driver.broadcast_name}</strong>
                                            </div>
                                            <span style={{ color: '#666', fontSize: '0.9rem' }}>{driver.team_name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </>
                ) : (
                    <div className={styles.loader}>Failed to load details.</div>
                )}

                <button
                    className={styles.button}
                    onClick={() => alert(`Next step: Build the Pace Duel for session ${session.session_key}!`)}
                >
                    Analyze Pace Duel
                </button>
            </div>
        </div>
    );
}