import React from 'react';

export default function TerminalHeader({ activeTab, setActiveTab }) {
    return (
        <div className="panel top-nav">
            <div className="top-nav-left">
                <div className="nav-logo">BNB <span>PRO</span></div>
                <span className={`nav-link ${activeTab === 'Trade' ? 'active' : ''}`} onClick={() => setActiveTab('Trade')}>Trade</span>
                <span className={`nav-link ${activeTab === 'Portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('Portfolio')}>Portfolio</span>
                <span className={`nav-link ${activeTab === 'History' ? 'active' : ''}`} onClick={() => setActiveTab('History')}>History</span>
                <span className={`nav-link ${activeTab === 'Custom Market' ? 'active' : ''}`} onClick={() => setActiveTab('Custom Market')}>Custom Market</span>
                <span className={`nav-link ${activeTab === 'Bet Custom' ? 'active' : ''}`} onClick={() => setActiveTab('Bet Custom')}>Bet Custom</span>
            </div>
            <div className="top-nav-right">
                <div className="portfolio-value" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Portfolio value <span style={{ color: 'var(--text-primary)' }}>******** USD</span>
                </div>
                <span className="nav-link">Account</span>
            </div>
        </div>
    );
}
