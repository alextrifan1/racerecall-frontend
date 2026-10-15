import styles from './SessionModal.module.css';

export default function PodiumList({ podium }) {
    if (!podium || podium.length === 0) return null;

    return (
        <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Top 3 finishers</h3>
            <ul className={styles.podiumList}>
                {podium.map((driver) => (
                    <li key={driver.driver_number} className={styles.podiumItem}>
                        <div className={styles.podiumHead}>
                            <span>P{driver.position}</span>
                            <span className={styles.sep}>//</span>
                            <span>{driver.broadcast_name}</span>
                        </div>
                        <div className={styles.podiumDetail}>
                            {/* Dots as data: one red dot per finishing position */}
                            <span className={styles.dots} aria-hidden="true">
                                {Array.from({ length: driver.position }, (_, i) => (
                                    <i key={i} />
                                ))}
                            </span>
                            <span>{driver.team_name}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}
