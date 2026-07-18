import { useState, useEffect } from 'react';
import styles from './SeasonBrowser.module.css'

export default function SeasonBrowser() {
    const [sessions, setSessions] = useState([]);
    const [year, setYear] = useState(2023);
    const [page, setPage] = useState(0);

    useEffect(() => {
        fetch(`http://localhost:8080/api/sessions?year=${year}&page=${page}&size=10`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setSessions(data);
                } else {
                    setSessions([]);
                }
            })
            .catch(error => console.error("Error fetching data:", error))
    }, [year, page]);

    const handleYearchange = (e) => {
        setYear(parseInt(e.target.value));
        setPage(0);
    }

    return (
        <div className={styles.container}>

            <div className={styles.header}>
                <h2>Formula 1 - {year} Season</h2>
                <select value={year} onChange={handleYearchange} className={styles.select}>
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                </select>
            </div>

            {sessions.length === 0 && (
                <p className={styles.errorText}>
                    No sessions available right now. The API is likely locked due to an active F1 race weekend. Try again later!
                </p>
            )}

            <div className={styles.grid}>
                {sessions.map((session) => (
                    <div key={session.session_key} className={styles.card}>
                        <h3 className={styles.title}>{session.session_name}</h3>
                        <p className={styles.detail}><strong>Country:</strong> {session.country_name}</p>
                        <p className={styles.detail}><strong>Date:</strong> {new Date(session.date_start).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>

            <div className={styles.pagination}>
                <button
                    onClick={() => setPage(page -1)}
                    disabled={page === 0}
                    className={styles.button}
                >
                    Previous
                </button>

                <span className={styles.pageInfo}>Page {page + 1}</span>

                <button
                    onClick={() => setPage(page + 1)}
                    disabled={sessions.length < 10}
                    className={styles.button}
                >
                    Next
                </button>
            </div>

        </div>
    )
}