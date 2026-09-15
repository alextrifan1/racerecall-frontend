import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import SeasonBrowser from './components/SeasonBrowser/SeasonBrowser.jsx';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <main style={{ padding: '1rem 2rem' }}>
                <Routes>
                    {/* Public Season Browser */}
                    <Route path="/" element={<SeasonBrowser />} />

                    {/* Auth Pages */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;