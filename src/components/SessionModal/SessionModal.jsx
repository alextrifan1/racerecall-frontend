import { useState, useEffect } from 'react';
import styles from './SessionModal.module.css';
import ModalFrame from "./ModalFrame.jsx";
import WeatherSnapshot from "./WeatherSnapshot.jsx";
import PodiumList from "./PodiumList.jsx";

export default function SessionModal({ session, onClose }) {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

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
        <ModalFrame isOpen={!!session} onClose={onClose}>
            <h2>{session.session_name}</h2>
            <p><strong>Circuit:</strong> {session.circuit_short_name} ({session.country_name})</p>

            <hr style={{ margin: '15px 0', border: '0.5px solid #eee' }} />

            {loading ? (
                <div className={styles.loader}>Loading session details...</div>
            ) : details ? (
                <>
                    <WeatherSnapshot weather={details.weatherSnapshot} />
                    <PodiumList podium={details.podium} />
                </>
            ) : (
                <div className={styles.loader}>Failed to load details.</div>
            )}
        </ModalFrame>
    );
}