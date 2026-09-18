import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export const Navbar = () => {
    const { isAuthenticated, username, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.brandGroup}>
                <span className={styles.brandDot} />
                <Link to="/" className={styles.brandLink}>
                    RaceRecall
                </Link>
            </div>

            <div className={styles.navLinks}>
                <Link to="/" className={styles.link}>
                    Seasons
                </Link>

                {isAuthenticated ? (
                    <>
                        <div className={styles.userBadge}>
                            <span>Driver:</span>
                            <span className={styles.userName}>{username}</span>
                        </div>
                        <button onClick={handleLogout} className={styles.logoutBtn}>
                            Sign out
                        </button>
                    </>
                ) : (
                    <div className={styles.authGroup}>
                        <Link to="/login" className={styles.signInLink}>
                            Sign in
                        </Link>
                        <Link to="/register" className={styles.registerBtn}>
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};