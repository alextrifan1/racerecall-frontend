import styles from './SessionModal.module.css';

export default function StartingGrid({ grid }) {
    if (!grid || grid.length === 0) return null;

    // By grid slot; drivers without a slot (e.g. pit-lane starts) go last
    const sorted = [...grid].sort((a, b) => (a.position ?? 99) - (b.position ?? 99));

    return (
        <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Starting grid</h3>
            <ol className={styles.gridList}>
                {sorted.map((driver) => (
                    <li key={driver.driver_number} className={styles.gridItem}>
                        <span className={styles.gridPos}>
                            {driver.position ? `P${String(driver.position).padStart(2, '0')}` : 'PIT'}
                        </span>
                        <span className={styles.gridName}>{driver.broadcast_name}</span>
                        <span className={styles.gridTeam}>{driver.team_name}</span>
                    </li>
                ))}
            </ol>
        </section>
    );
}
