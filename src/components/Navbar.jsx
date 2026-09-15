import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
    const { isAuthenticated, username, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            borderBottom: '1px solid #333',
            backgroundColor: '#1a1a1a',
            color: '#fff'
        }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
                    RaceRecall
                </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <Link to="/" style={{ color: '#ccc', textDecoration: 'none' }}>
                    Seasons
                </Link>

                {isAuthenticated ? (
                    <>
            <span style={{ color: '#888' }}>
              User: <strong style={{ color: '#fff' }}>{username}</strong>
            </span>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '6px 12px',
                                backgroundColor: '#e10600',
                                border: 'none',
                                borderRadius: '4px',
                                color: '#fff',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Sign Out
                        </button>
                    </>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>
                            Sign In
                        </Link>
                        <Link to="/register" style={{ color: '#e10600', textDecoration: 'none', fontWeight: 'bold' }}>
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};