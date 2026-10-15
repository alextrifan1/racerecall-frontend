import { useState, useEffect } from 'react';
import styles from './SessionModal.module.css';
import ModalFrame from "./ModalFrame.jsx";
import WeatherSnapshot from "./WeatherSnapshot.jsx";
import PodiumList from "./PodiumList.jsx";
import StartingGrid from "./StartingGrid.jsx";
import { formatShortDate, formatDateTime } from '../SeasonBrowser/seasonHelpers';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function SessionModal({ session, onClose }) {
    // The result is tagged with the session it belongs to, so a slow or failed
    // request can never show another session's data.
    const [result, setResult] = useState({ key: null, details: null, error: null });

    useEffect(() => {
        // Nothing to load for a closed modal or a session that hasn't run yet
        if (!session || session.upcoming) return undefined;

        const key = session.session_key;
        const controller = new AbortController();

        fetch(`${API_BASE_URL}/api/sessions/${key}/details`, { signal: controller.signal })
            .then((response) => {
                if (!response.ok) throw new Error(`Request failed (${response.status})`);
                return response.json();
            })
            .then((details) => setResult({ key, details, error: null }))
            .catch((error) => {
                if (error.name === 'AbortError') return; // another session was opened
                console.error("Error fetching session details:", error);
                setResult({ key, details: null, error: error.message });
            });

        return () => controller.abort();
    }, [session]);

    if (!session) return null;

    const isCurrent = result.key === session.session_key;
    const loading = !session.upcoming && !isCurrent;
    const details = isCurrent ? result.details : null;

    let body;
    if (session.upcoming) {
        body = (
            <p className={styles.status}>
                Not run yet. Starts {formatDateTime(session.date_start)}.
            </p>
        );
    } else if (loading) {
        body = <p className={styles.status}>Loading session details...</p>;
    } else if (details) {
        body = (
            <>
                <WeatherSnapshot weather={details.weatherSnapshot} />
                <PodiumList podium={details.podium} />
                <StartingGrid grid={details.startingGrid} />
            </>
        );
    } else {
        body = <p className={styles.status}>Failed to load details.</p>;
    }

    return (
        <ModalFrame isOpen={!!session} onClose={onClose}>
            <div className={styles.head}>
                <p className={styles.eyebrow}>
                    {formatShortDate(session.date_start)} // {session.country_name}
                </p>
                <h2 className={styles.title}>{session.session_name}</h2>
                <p className={styles.circuit}>{session.circuit_short_name}</p>
            </div>

            <div className={styles.body}>{body}</div>
        </ModalFrame>
    );
}
