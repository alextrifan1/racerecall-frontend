import styles from './SessionModal.module.css';

export default function WeatherSnapshot({weather}) {
    if (!weather) return null;

    return (
        <>
            <h3 className={styles.sectionTitle}>Conditions at Start</h3>
            <div className={styles.weatherGrid}>
                <div className={styles.weatherItem}>
                    <span className={styles.weatherValue}>{weather.air_temperature}°C</span>
                    <span className={styles.weatherLabel}>Air Temp</span>
                </div>
                <div className={styles.weatherItem}>
                    <span className={styles.weatherValue}>{weather.track_temperature}°C</span>
                    <span className={styles.weatherLabel}>Track Temp</span>
                </div>
                <div className={styles.weatherItem}>
                    <span className={styles.weatherValue}>{weather.rainfall === 1 ? 'Yes' : 'No'}</span>
                    <span className={styles.weatherLabel}>Rain</span>
                </div>
            </div>
        </>
    )
}