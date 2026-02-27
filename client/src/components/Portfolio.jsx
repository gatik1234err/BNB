import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Portfolio({ trades, totalPnL }) {
    // Build chart data from cumulative P&L
    const chartData = trades
        .slice()
        .reverse()
        .reduce((acc, t, i) => {
            const prev = acc[i - 1]?.pnl || 0;
            acc.push({
                trade: i + 1,
                pnl: Math.round((prev + t.pnl) * 100) / 100,
            });
            return acc;
        }, []);

    return (
        <div className="portfolio-grid">
            {/* Stats + Chart */}
            <div className="card">
                <div className="card-header">
                    <div className="card-title">
                        💰 Portfolio
                        <span
                            className="card-badge"
                            style={{
                                background: totalPnL >= 0 ? 'rgba(0,255,136,0.15)' : 'rgba(255,71,87,0.15)',
                                color: totalPnL >= 0 ? '#00ff88' : '#ff4757',
                            }}
                        >
                            Paper Trading
                        </span>
                    </div>
                </div>

                <div className="stat-cards">
                    <div className="stat-card">
                        <div className="stat-label">Total P&L</div>
                        <div className={`stat-value ${totalPnL >= 0 ? 'positive' : 'negative'}`}>
                            {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Trades</div>
                        <div className="stat-value" style={{ color: '#00d4ff' }}>
                            {trades.length}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Win Rate</div>
                        <div className="stat-value" style={{ color: '#a855f7' }}>
                            {trades.length
                                ? `${((trades.filter(t => t.pnl > 0).length / trades.length) * 100).toFixed(0)}%`
                                : '—'}
                        </div>
                    </div>
                </div>

                {chartData.length > 0 && (
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis
                                    dataKey="trade"
                                    stroke="#64748b"
                                    fontSize={11}
                                    tickLine={false}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={11}
                                    tickLine={false}
                                    tickFormatter={v => `$${v}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: '#1a1f2e',
                                        border: '1px solid #1e293b',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                    }}
                                    formatter={(value) => [`$${value.toFixed(2)}`, 'P&L']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="pnl"
                                    stroke="#00ff88"
                                    strokeWidth={2}
                                    dot={{ fill: '#00ff88', r: 4 }}
                                    activeDot={{ r: 6, fill: '#00d4ff' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Trade History */}
            <div className="card">
                <div className="card-header">
                    <div className="card-title">📋 Trade History</div>
                </div>
                <div className="card-body trades-list">
                    {trades.length === 0 ? (
                        <div className="empty-state">
                            <p>No trades executed yet.</p>
                            <p style={{ fontSize: '0.75rem', marginTop: '8px' }}>
                                Click "Execute Simulated Trade" on an arbitrage opportunity.
                            </p>
                        </div>
                    ) : (
                        trades.map((t) => (
                            <div key={t.id} className="trade-item">
                                <span className="trade-action">
                                    {t.action.length > 50 ? t.action.slice(0, 50) + '…' : t.action}
                                </span>
                                <span
                                    className="trade-pnl"
                                    style={{ color: t.pnl >= 0 ? '#00ff88' : '#ff4757' }}
                                >
                                    {t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)}
                                </span>
                                <span className="trade-time">
                                    {new Date(t.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
