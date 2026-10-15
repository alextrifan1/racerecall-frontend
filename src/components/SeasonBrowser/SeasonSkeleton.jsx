import styles from './SeasonBrowser.module.css';

// Grey placeholder weekends shown while a season loads, shaped like the real
// ones (heading, four tiles on the left, one race tile on the right) so the
// page doesn't jump when the data arrives.
export default function SeasonSkeleton({ weekends = 2 }) {
    return (
        <div role="status">
            <span className={styles.srOnly}>Loading season data...</span>
            {Array.from({ length: weekends }, (_, i) => (
                <div key={i} className={styles.weekendGroup} aria-hidden="true">
                    <div className={styles.skeletonHeading}>
                        <span className={`${styles.skeleton} ${styles.skeletonLine}`} />
                        <span className={`${styles.skeleton} ${styles.skeletonLineShort}`} />
                    </div>
                    <div className={styles.sessionStrip}>
                        <div className={styles.sessionStack}>
                            {Array.from({ length: 4 }, (_, j) => (
                                <span key={j} className={`${styles.skeleton} ${styles.skeletonTile}`} />
                            ))}
                        </div>
                        <div className={styles.sessionStack}>
                            <span className={`${styles.skeleton} ${styles.skeletonFeatured}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
