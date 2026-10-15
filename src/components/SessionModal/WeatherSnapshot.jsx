import styles from './SessionModal.module.css';

export default function WeatherSnapshot({ weather }) {
    if (!weather) return null;

    return (
        <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Conditions at start</h3>
            <div className={styles.weatherGrid}>
                <div className={styles.weatherItem}>
                    <span className={styles.weatherValue}>{weather.air_temperature}°</span>
                    <span className={styles.weatherLabel}>Air °C</span>
                </div>
                <div className={styles.weatherItem}>
                    <span className={styles.weatherValue}>{weather.track_temperature}°</span>
                    <span className={styles.weatherLabel}>Track °C</span>
                </div>
                <div className={styles.weatherItem}>
                    <span className={styles.weatherValue}>{weather.rainfall === 1 ? 'Yes' : 'No'}</span>
                    <span className={styles.weatherLabel}>Rain</span>
                </div>
            </div>
        </section>
    );
}
