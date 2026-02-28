import React, { useState } from 'react';

export default function MarketTradesPanel({ markets }) {
    const [filter, setFilter] = useState('All');

    // Get unique sources
    const sources = ['All', ...new Set((markets || []).map(m => m.source).filter(Boolean))];

    const filteredMarkets = markets
        ? markets.filter(m => filter === 'All' || m.source === filter)
        : [];

    // Display recent 50 trades of the selected source
    const displayMarkets = filteredMarkets.slice(0, 50);

    return (
        <div className="panel market-trades">
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Market Trades</span>
                <select
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    style={{
                        background: 'var(--bg-main)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        padding: '2px 8px',
                        fontSize: '11px',
                        outline: 'none',
                        cursor: 'pointer'
                    }}
                >
                    {sources.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div className="panel-content">
                <table className="table">
                    <thead>
                        <tr><th>Price(USD)</th><th>Source</th><th>Time</th></tr>
                    </thead>
                    <tbody>
                        {displayMarkets.length > 0 ? (
                            displayMarkets.map((m, i) => {
                                const date = m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--';
                                return (
                                    <tr key={m.id + i}>
                                        <td className={m.probability >= 50 ? 'text-buy' : 'text-sell'}>
                                            ${(m.probability / 100).toFixed(4)}
                                        </td>
                                        <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.source}</td>
                                        <td style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{date}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan="3" style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)' }}>No markets found for {filter}</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
