import React from 'react';

export default function OrderBookPanel({ markets }) {
    // Use first 30 markets to simulate a dense order book
    const displayMarkets = markets ? markets.slice(0, 30) : [];

    return (
        <div className="panel order-book">
            <div className="panel-header">Order Book</div>
            <div className="panel-content">
                <table className="table">
                    <thead>
                        <tr><th>Probability</th><th>Market</th><th>Volume</th></tr>
                    </thead>
                    <tbody>
                        {displayMarkets.length > 0 ? (
                            displayMarkets.map((m, i) => (
                                <tr key={m.id + i}>
                                    <td className={m.probability >= 50 ? 'text-buy' : 'text-sell'}>
                                        {m.probability.toFixed(1)}%
                                    </td>
                                    <td
                                        style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}
                                        title={m.question}
                                    >
                                        {m.question}
                                    </td>
                                    <td>${m.volume?.toLocaleString() || 0}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="3" style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)' }}>Loading...</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
