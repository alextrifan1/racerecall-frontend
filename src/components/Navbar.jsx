import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { ThemeToggle } from './ThemeToggle';
import { Mark } from './Mark';
import styles from './Navbar.module.css';

export const Navbar = () => {
    const { isAuthenticated, username, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinkClass = ({ isActive }) =>
        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;

    return (
        <header className={styles.header}>
            <div className={styles.bar}>
                <Link to="/" className={styles.brand}>
                    <Mark size={24} decorative className={styles.mark} />
                    RaceRecall
                </Link>

                <nav className={styles.nav} aria-label="Main">
                    <NavLink to="/" end className={navLinkClass}>
                        <span className={styles.index}>01</span>
                        Seasons
                    </NavLink>
                </nav>

                <div className={styles.end}>
                    <ThemeToggle />
                    {isAuthenticated ? (
                        <>
                            <span className={styles.user}>
                                <span className={styles.userLabel}>Driver //</span>
                                <span className={styles.userName} title={username}>{username}</span>
                            </span>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className={`${styles.btn} ${styles.btnRaised}`}
                            >
                                Sign out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={`${styles.btn} ${styles.btnGhost}`}>
                                Sign in
                            </Link>
                            <Link to="/register" className={`${styles.btn} ${styles.btnSignal}`}>
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};
