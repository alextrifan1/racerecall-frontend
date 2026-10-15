import { createContext, useContext } from 'react';

// The auth context object and its useAuth hook live here, apart from the
// AuthProvider component in AuthContext.jsx, so Vite's fast refresh keeps
// working (it needs files that export only components).
export const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
