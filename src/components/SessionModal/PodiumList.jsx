import styles from './SessionModal.module.css';

export default function PodiumList({podium}) {
    if (!podium || podium.length === 0) return null;

    return (
        <>
            <h3 className={styles.sectionTitle}>Top 3 Finishers</h3>
            <ul className={styles.podiumList}>
                {podium.map((driver) => (
                    <li key={driver.driver_number} className={styles.podiumItem}>
                        <div>
                            <span className={styles.position}>P{driver.position} </span>
                            <strong>{driver.broadcast_name}</strong>
                        </div>
                        <span style={{ color: '#666', fontSize: '0.9rem' }}>{driver.team_name}</span>
                    </li>
                ))}
            </ul>
        </>
    )
}