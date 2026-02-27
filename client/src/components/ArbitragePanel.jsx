import { useState } from 'react';

export default function ArbitragePanel({ opportunities, loading, onTrade }) {
    const [executedIds, setExecutedIds] = useState(new Set());

    const handleTrade = async (opp) => {
        if (executedIds.has(opp.id)) return;

        try {
            const res = await fetch('/api/trade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    opportunityId: opp.id,
                    action: opp.suggestedAction,
                    stake: 100,
                    edgePercent: opp.edgePercent,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setExecutedIds(prev => new Set([...prev, opp.id]));
                onTrade?.(data.trade);
            }
        } catch (err) {
            console.error('Trade failed:', err);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <div className="card-title">
                    🤖 AI Arbitrage Agent
                    <span
                        className="card-badge"
                        style={{
                            background: opportunities?.length ? 'rgba(0,255,136,0.15)' : 'rgba(100,116,139,0.15)',
                            color: opportunities?.length ? '#00ff88' : '#64748b',
                        }}
                    >
                        {opportunities?.length || 0} opportunities
                    </span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                    Threshold: 5%
                </span>
            </div>

            <div className="card-body arb-list">
                {loading ? (
                    <div className="loading">
                        <div className="spinner" />
                        Scanning for arbitrage…
                    </div>
                ) : opportunities?.length ? (
                    opportunities.map(opp => (
                        <div key={opp.id} className={`arb-card ${opp.confidence.toLowerCase()}`}>
                            <div className="arb-question">{opp.question}</div>

                            <div className="arb-platforms">
                                <div className="arb-platform">
                                    <div className="arb-platform-name">{opp.platformA}</div>
                                    <div className="arb-platform-price price-yes">
                                        {(opp.priceA * 100).toFixed(1)}¢
                                    </div>
                                </div>
                                <div className="arb-vs">VS</div>
                                <div className="arb-platform">
                                    <div className="arb-platform-name">{opp.platformB}</div>
                                    <div className="arb-platform-price price-no">
                                        {(opp.priceB * 100).toFixed(1)}¢
                                    </div>
                                </div>
                            </div>

                            <div className="arb-meta">
                                <div>
                                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>EDGE </span>
                                    <span className={`arb-edge ${opp.confidence.toLowerCase()}`}>
                                        +{opp.edgePercent.toFixed(1)}%
                                    </span>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>EST. PROFIT </span>
                                    <span style={{ fontFamily: 'var(--font-mono)', color: '#00ff88', fontWeight: 600 }}>
                                        ${opp.estimatedProfit.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div className="arb-action">{opp.suggestedAction}</div>

                            <button
                                className={`btn-trade ${executedIds.has(opp.id) ? 'executed' : ''}`}
                                onClick={() => handleTrade(opp)}
                                style={{ marginTop: '12px' }}
                            >
                                {executedIds.has(opp.id) ? '✓ Trade Executed' : '⚡ Execute Simulated Trade'}
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <p>No arbitrage opportunities detected.</p>
                        <p style={{ fontSize: '0.75rem', marginTop: '8px' }}>
                            The agent scans for price discrepancies ≥5% across platforms.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
