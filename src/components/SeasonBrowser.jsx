import { useState, useEffect } from 'react';
import styles from './SeasonBrowser.module.css'

export default function SeasonBrowser() {
    const [session, setSession] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/sessions?year=2023&page=0&size=10')
            .then(response => response.json())
            .then(data => setSession(data))
            .catch(error => console.error("Error fetching data:", error))
    }, []);

    return (
        <div className={styles.container}>
            <h2>Formula 1 - 2023 Season</h2>

            <div className={styles.grid}>
                {session.map((session) => (
                    <div key={session.session_key} className={styles.card}>
                        <h3 className={styles.title}>{session.session_name}</h3>
                        <p className={styles.detail}><strong>Country:</strong> {session.country_name}</p>
                        <p className={styles.detail}><strong>Date:</strong> {new Date(session.date_start).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>

        </div>
    )
}