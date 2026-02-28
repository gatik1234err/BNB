import React, { useState } from 'react';

export default function CustomMarket() {
    const [formData, setFormData] = useState({
        question: '',
        probability: 50,
        volume: 0,
        url: ''
    });
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Submitting...');
        try {
            const res = await fetch('/api/markets/custom', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                setStatus('Market added successfully!');
                setFormData({ question: '', probability: 50, volume: 0, url: '' });
                setTimeout(() => setStatus(''), 3000);
            } else {
                setStatus(`Error: ${data.error}`);
            }
        } catch (err) {
            setStatus('Error adding market.');
        }
    };

    return (
        <div className="portfolio-grid" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <div className="card">
                <div className="card-header">
                    <div className="card-title">📝 Add Custom Market</div>
                </div>
                <div className="card-body">
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                        Create a mock prediction market to test the AI Arbitrage Agent.
                        Once added, it will be included in the unified feed and scanned for mispricings against other platforms.
                    </p>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>Question (Event)</label>
                            <input
                                type="text"
                                placeholder="e.g. Will ETH reach $4000 by May?"
                                value={formData.question}
                                onChange={e => setFormData({ ...formData, question: e.target.value })}
                                style={{ width: '100%', background: 'var(--bg-main)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '4px' }}
                                required
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>YES Probability (%)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="99"
                                    value={formData.probability}
                                    onChange={e => setFormData({ ...formData, probability: e.target.value })}
                                    style={{ width: '100%', background: 'var(--bg-main)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '4px' }}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>Volume (optional)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.volume}
                                    onChange={e => setFormData({ ...formData, volume: e.target.value })}
                                    style={{ width: '100%', background: 'var(--bg-main)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '4px' }}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>URL (optional)</label>
                            <input
                                type="url"
                                placeholder="https://..."
                                value={formData.url}
                                onChange={e => setFormData({ ...formData, url: e.target.value })}
                                style={{ width: '100%', background: 'var(--bg-main)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '4px' }}
                            />
                        </div>
                        <button
                            type="submit"
                            style={{ background: 'var(--neon-cyan)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}
                        >
                            Add Market
                        </button>
                        {status && (
                            <div style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: '4px', color: status.includes('Error') ? '#ff4757' : '#00ff88', fontSize: '13px', border: `1px solid ${status.includes('Error') ? 'rgba(255,71,87,0.3)' : 'rgba(0,255,136,0.3)'}` }}>
                                {status}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
