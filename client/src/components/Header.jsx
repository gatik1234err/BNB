import { useState, useEffect } from 'react';

export default function Header({ onRefresh, loading }) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const id = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <header className="header">
            <div className="header-left">
                <h1 className="logo">BNB Terminal</h1>
                <span className="logo-sub">Prediction Market Arbitrage</span>
            </div>
            <div className="header-right">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div className="status-dot" />
                    <span className="status-text">LIVE</span>
                </div>
                <div className="clock">
                    {time.toLocaleTimeString('en-US', { hour12: false })}
                </div>
                <button
                    className={`btn-refresh ${loading ? 'loading' : ''}`}
                    onClick={onRefresh}
                    disabled={loading}
                >
                    {loading ? '⟳ Syncing…' : '⟳ Refresh'}
                </button>
            </div>
        </header>
    );
}
