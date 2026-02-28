import React from 'react';

export default function LeftPanel({ opportunities, onTrade }) {
    const opps = opportunities || [];

    return (
        <div className="panel left-panel">
            <div className="panel-header" style={{ justifyContent: 'space-between' }}>
                <span>Order Form / Arb</span>
                <span style={{ color: 'var(--text-muted)' }}>Performance x</span>
            </div>
            <div className="panel-content" style={{ padding: '16px' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
                    Simulated Arbitrage Execution
                </div>

                {/* Arb List */}
                <div style={{ marginBottom: '24px' }}>
                    {opps.length > 0 ? opps.map(opp => (
                        <div key={opp.id} style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '12px', marginBottom: '8px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>{opp.question}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                <span>{opp.platformA}: <span className="text-buy">{(opp.priceA * 100).toFixed(1)}%</span></span>
                                <span>{opp.platformB}: <span className="text-sell">{(opp.priceB * 100).toFixed(1)}%</span></span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className={opp.edgePercent > 5 ? 'text-buy' : 'text-primary'} style={{ fontSize: '13px', fontWeight: 'bold' }}>Edge: {opp.edgePercent}%</span>
                                <button
                                    onClick={() => onTrade({ id: Date.now(), opportunityId: opp.id, action: 'ARB_EXECUTE', pnl: opp.edgePercent, timestamp: new Date(), totalPnL: opp.edgePercent })}
                                    style={{ background: 'var(--text-primary)', color: 'var(--bg-main)', border: 'none', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', transition: 'transform 0.1s' }}
                                >Execute</button>
                            </div>
                        </div>
                    )) : (
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px' }}>No arbitrage opportunities detected.</div>
                    )}
                </div>

                <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '24px 0' }}></div>

                <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '12px' }}>Global performance</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                    <span>Active Opportunities</span><span className="text-buy">{opps.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                    <span>System Status</span><span className="text-buy">ONLINE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                    <span>Server Time</span><span>{new Date().toISOString().split('T')[1].split('.')[0]} UTC</span>
                </div>
            </div>
        </div>
    );
}
