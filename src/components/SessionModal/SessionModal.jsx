import { useState, useEffect } from 'react';
import styles from './SessionModal.module.css';
import ModalFrame from "./ModalFrame.jsx";
import WeatherSnapshot from "./WeatherSnapshot.jsx";
import PodiumList from "./PodiumList.jsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// "2025-09-21T12:00:00+00:00" -> "09/21"
const formatShortDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });

export default function SessionModal({ session, onClose }) {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!session) return;

        setLoading(true);
        fetch(`${API_BASE_URL}/api/sessions/${session.session_key}/details`)
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
            <div className={styles.head}>
                <p className={styles.eyebrow}>
                    {formatShortDate(session.date_start)} // {session.country_name}
                </p>
                <h2 className={styles.title}>{session.session_name}</h2>
                <p className={styles.circuit}>{session.circuit_short_name}</p>
            </div>

            <div className={styles.body}>
                {loading ? (
                    <p className={styles.status}>Loading session details...</p>
                ) : details ? (
                    <>
                        <WeatherSnapshot weather={details.weatherSnapshot} />
                        <PodiumList podium={details.podium} />
                    </>
                ) : (
                    <p className={styles.status}>Failed to load details.</p>
                )}
            </div>
        </ModalFrame>
    );
}
