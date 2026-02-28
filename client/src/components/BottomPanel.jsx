import React from 'react';

export default function BottomPanel({ trades = [] }) {
    return (
        <div className="panel bottom-panel">
            <div className="panel-header" style={{ gap: '24px' }}>
                <span className="nav-link active">Trade History</span>
                <span className="nav-link">Open Orders</span>
                <span className="nav-link">Margin Positions</span>
                <span className="nav-link">Balances</span>
            </div>
            <div className="panel-content">
                {trades && trades.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr><th>Time</th><th>Action</th><th>Opportunity</th><th>P&L</th></tr>
                        </thead>
                        <tbody>
                            {trades.map(t => (
                                <tr key={t.id}>
                                    <td>{new Date(t.timestamp).toLocaleTimeString()}</td>
                                    <td className={t.action === 'BUY' ? 'text-buy' : 'text-sell'}>{t.action}</td>
                                    <td>{t.opportunityId}</td>
                                    <td className={t.pnl >= 0 ? 'text-buy' : 'text-sell'}>{t.pnl >= 0 ? '+' : ''}${t.pnl}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        No recent trades
                    </div>
                )}
            </div>
        </div>
    );
}
