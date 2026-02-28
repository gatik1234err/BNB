import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Portfolio({ trades, totalPnL, account, balance, sendBNB }) {
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

            {/* tBNB Transfer Widget */}
            <div className="card">
                <div className="card-header">
                    <div className="card-title">💸 Transfer tBNB</div>
                </div>
                <div className="card-body">
                    <div style={{ marginBottom: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        Send Testnet BNB from your connected Web3 wallet to another address.
                    </div>

                    <div style={{ marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Connected Account: <span style={{ fontFamily: 'var(--font-mono)' }}>{account}</span>
                    </div>
                    <div style={{ marginBottom: '24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Available Balance: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--neon-green)' }}>{balance} tBNB</span>
                    </div>

                    <TransferForm sendBNB={sendBNB} />
                </div>
            </div>
        </div>
    );
}

function TransferForm({ sendBNB }) {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleTransfer = async (e) => {
        e.preventDefault();
        if (!recipient || !amount) return;

        setIsSending(true);
        setStatus('Confirming in Wallet...');

        try {
            const receipt = await sendBNB(recipient, amount);
            if (receipt) {
                setStatus(`Success! TxHash: ${receipt.hash}`);
                setRecipient('');
                setAmount('');
            } else {
                setStatus('Transfer failed.');
            }
        } catch (err) {
            setStatus('Error processing transfer.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <form onSubmit={handleTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
                type="text"
                placeholder="Recipient Address (0x...)"
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                style={{ background: 'var(--bg-main)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}
                required
            />
            <div style={{ display: 'flex', gap: '12px' }}>
                <input
                    type="number"
                    step="0.0001"
                    placeholder="Amount (tBNB)"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    style={{ flex: 1, background: 'var(--bg-main)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}
                    required
                />
                <button
                    type="submit"
                    disabled={isSending}
                    style={{ background: isSending ? 'var(--text-muted)' : 'var(--neon-cyan)', color: 'black', border: 'none', padding: '0 24px', borderRadius: '4px', fontWeight: 'bold', cursor: isSending ? 'wait' : 'pointer' }}
                >
                    {isSending ? 'Sending...' : 'Send'}
                </button>
            </div>
            {status && (
                <div style={{ marginTop: '8px', fontSize: '13px', background: 'var(--bg-main)', padding: '12px', borderRadius: '4px', fontFamily: 'var(--font-mono)', wordBreak: 'break-all', color: status.includes('Success') ? 'var(--neon-green)' : 'var(--text-primary)' }}>
                    {status}
                </div>
            )}
        </form>
    );
}
