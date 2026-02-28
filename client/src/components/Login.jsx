import React from 'react';

export default function Login({ connectWallet, isConnecting, error }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--bg-main)' }}>
            <div className="panel" style={{ padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                <h1 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '28px' }}>BNB <span style={{ color: 'var(--neon-green)' }}>PRO</span></h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px', lineHeight: '1.5' }}>Connect your Web3 wallet to access the AI Arbitrage Terminal on BNB Smart Chain Testnet.</p>

                {error && (
                    <div style={{ marginBottom: '24px', padding: '12px', background: 'rgba(255, 71, 87, 0.1)', border: '1px solid rgba(255, 71, 87, 0.2)', color: 'var(--text-sell)', borderRadius: '6px', fontSize: '13px' }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <button
                        onClick={() => connectWallet('METAMASK')}
                        disabled={isConnecting}
                        style={{
                            background: '#F6851B',
                            color: '#fff',
                            padding: '14px',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            cursor: isConnecting ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            opacity: isConnecting ? 0.7 : 1,
                            transition: 'transform 0.1s'
                        }}
                    >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" height="24" />
                        Continue with MetaMask
                    </button>

                    <button
                        onClick={() => connectWallet('BINANCE')}
                        disabled={isConnecting}
                        style={{
                            background: '#F0B90B',
                            color: '#000',
                            padding: '14px',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            cursor: isConnecting ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            opacity: isConnecting ? 0.7 : 1,
                            transition: 'transform 0.1s'
                        }}
                    >
                        <img src="https://cryptologos.cc/logos/bnb-bnb-logo.svg" alt="BNB" height="24" />
                        Continue with Binance
                    </button>
                </div>
            </div>
        </div>
    );
}
