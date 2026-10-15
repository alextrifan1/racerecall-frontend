import { useState } from 'react';
import styles from './ThemeToggle.module.css';

// Same key the inline script in index.html reads before the page draws
const STORAGE_KEY = 'theme';

export const ThemeToggle = () => {
    // index.html has already set data-theme on <html> (saved choice, or the device setting)
    const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');
    const next = theme === 'dark' ? 'light' : 'dark';

    const handleClick = () => {
        document.documentElement.dataset.theme = next; // every token updates at once
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // Storage can be blocked (private mode): the switch still works for this visit
        }
        setTheme(next);
    };

    return (
        <button
            type="button"
            className={styles.toggle}
            onClick={handleClick}
            aria-label={`Switch to ${next} theme`}
            title={`Switch to ${next} theme`}
        >
            {theme === 'dark' ? (
                // Sun: shown in dark mode, switches to light
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
                </svg>
            ) : (
                // Moon: shown in light mode, switches to dark
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />
                </svg>
            )}
        </button>
    );
};
