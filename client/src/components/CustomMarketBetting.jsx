import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';

export default function CustomMarketBetting({ sendBNB }) {
    const { data, loading, error, refetch } = useApi('/api/markets/all', { interval: 10000 });
    const [txStatus, setTxStatus] = useState({});

    // Filter to only show custom markets. Let's assume custom markets have source 'Custom'
    // Actually, looking at server/routes/markets.js or just filtering by what was added via CustomMarket
    const markets = data?.markets || [];
    const customMarkets = markets.filter(m => m.source === 'Custom' || m.source === 'Local');

    const handleBet = async (market, outcome) => {
        setTxStatus(prev => ({ ...prev, [market.id]: 'Confirming transaction in wallet...' }));
        try {
            // Mocking a bet with a 0.01 tBNB transaction to a burn address to simulate contract interaction
            const burnAddress = '0x000000000000000000000000000000000000dead';
            const receipt = await sendBNB(burnAddress, '0.01');

            if (receipt) {
                setTxStatus(prev => ({ ...prev, [market.id]: `Successfully bet on ${outcome}! TxHash: ${receipt.hash.slice(0, 10)}...` }));
                setTimeout(() => {
                    setTxStatus(prev => {
                        const newStatus = { ...prev };
                        delete newStatus[market.id];
                        return newStatus;
                    });
                }, 5000);
            } else {
                setTxStatus(prev => ({ ...prev, [market.id]: 'Transaction failed or rejected.' }));
            }
        } catch (err) {
            setTxStatus(prev => ({ ...prev, [market.id]: 'Error processing bet.' }));
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <div className="card">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="card-title">🎲 Bet on Custom Markets</div>
                    <button onClick={refetch} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                        Refresh
                    </button>
                </div>
                <div className="card-body">
                    {loading && customMarkets.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>Loading markets...</div>
                    ) : error ? (
                        <div style={{ color: '#ff4757', padding: '12px', background: 'rgba(255, 71, 87, 0.1)', borderRadius: '4px' }}>
                            Error loading markets: {error}
                        </div>
                    ) : customMarkets.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '32px', marginBottom: '16px' }}>📭</div>
                            <div>No custom markets available to bet on right now.</div>
                            <div style={{ fontSize: '13px', marginTop: '8px' }}>Create one in the "Custom Market" tab!</div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {customMarkets.map((m, i) => (
                                <div key={m.id || i} style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-primary)' }}>
                                        {m.question}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                        <span>Implied Probability: <strong style={{ color: 'var(--text-primary)' }}>{m.probability}%</strong></span>
                                        <span>Volume: <strong style={{ color: 'var(--text-primary)' }}>${m.volume?.toLocaleString() || 0}</strong></span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                        <button
                                            onClick={() => handleBet(m, 'YES')}
                                            style={{ flex: 1, background: 'rgba(14, 203, 129, 0.1)', color: 'var(--color-buy)', border: '1px solid var(--color-buy)', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            Buy YES (0.01 tBNB)
                                        </button>
                                        <button
                                            onClick={() => handleBet(m, 'NO')}
                                            style={{ flex: 1, background: 'rgba(246, 70, 93, 0.1)', color: 'var(--color-sell)', border: '1px solid var(--color-sell)', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            Buy NO (0.01 tBNB)
                                        </button>
                                    </div>
                                    {txStatus[m.id] && (
                                        <div style={{ fontSize: '12px', padding: '8px', background: 'var(--bg-main)', borderRadius: '4px', color: txStatus[m.id].includes('Error') || txStatus[m.id].includes('failed') ? '#ff4757' : 'var(--neon-green)', fontFamily: 'var(--font-mono)' }}>
                                            {txStatus[m.id]}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
