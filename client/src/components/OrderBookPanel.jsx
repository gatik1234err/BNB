import React, { useState } from 'react';

export default function OrderBookPanel({ markets }) {
    const [filter, setFilter] = useState('All');

    // Get unique sources
    const sources = ['All', ...new Set((markets || []).map(m => m.source).filter(Boolean))];

    // Filter by source and sort by volume descending, then take top 30
    const displayMarkets = (markets || [])
        .filter(m => filter === 'All' || m.source === filter)
        .sort((a, b) => (b.volume || 0) - (a.volume || 0))
        .slice(0, 30);

    return (
        <div className="panel order-book">
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Order Book</span>
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
                        <tr><th>Probability</th><th>Market</th><th>Source</th><th>Volume</th></tr>
                    </thead>
                    <tbody>
                        {displayMarkets.length > 0 ? (
                            displayMarkets.map((m, i) => (
                                <tr key={m.id + i}>
                                    <td className={m.probability >= 50 ? 'text-buy' : 'text-sell'}>
                                        {m.probability.toFixed(1)}%
                                    </td>
                                    <td
                                        title={m.question}
                                    >
                                        {m.question}
                                    </td>
                                    <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                        {m.source}
                                    </td>
                                    <td>${m.volume?.toLocaleString() || 0}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)' }}>Loading...</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
}
