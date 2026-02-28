import React, { useState } from 'react';
import { useBNBTestnet } from '../hooks/useBNBTestnet';

const MOCK_PREDICTION_CONTRACT = '0x1234567890123456789012345678901234567890'; // Replace with real deployment

export default function Web3PredictionDemo() {
    const {
        account,
        balance,
        isConnecting,
        error,
        connectWallet,
        sendBNB,
        resolveMarket
    } = useBNBTestnet(MOCK_PREDICTION_CONTRACT);

    const [txStatus, setTxStatus] = useState('');

    const handleTransfer = async () => {
        setTxStatus('Initiating transfer...');
        const receipt = await sendBNB('0x000000000000000000000000000000000000dead', '0.01');
        if (receipt) setTxStatus(`Transfer Success! TxHash: ${receipt.hash}`);
        else setTxStatus('Transfer Failed.');
    };

    const handleResolve = async () => {
        setTxStatus('Resolving market on-chain...');
        // Example: Resolve market ID 1 with outcome 0 (YES)
        const receipt = await resolveMarket(1, 0);
        if (receipt) setTxStatus(`Market Resolved! TxHash: ${receipt.hash}`);
        else setTxStatus('Resolution Failed.');
    };

    return (
        <div className="panel" style={{ padding: '24px', maxWidth: '600px', margin: '24px auto', background: 'var(--bg-elevated)', borderRadius: '8px' }}>
            <h2 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>BNB Testnet Wallet</h2>

            {error && <div style={{ color: 'var(--text-sell)', background: 'rgba(255, 71, 87, 0.1)', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>{error}</div>}

            {!account ? (
                <button
                    onClick={connectWallet}
                    disabled={isConnecting}
                    style={{ background: 'var(--neon-green)', color: 'black', padding: '12px 24px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {isConnecting ? 'Connecting...' : 'Connect Web3 Wallet'}
                </button>
            ) : (
                <div>
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Connected Account</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--text-primary)' }}>{account}</div>

                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Balance</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--neon-green)' }}>{balance} tBNB</div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                        <button
                            onClick={handleTransfer}
                            style={{ flex: 1, background: 'var(--bg-main)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Send 0.01 tBNB
                        </button>
                        <button
                            onClick={handleResolve}
                            style={{ flex: 1, background: 'var(--neon-cyan)', color: 'black', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Resolve Test Market
                        </button>
                    </div>

                    {txStatus && <div style={{ fontSize: '12px', color: 'var(--text-primary)', background: 'var(--bg-main)', padding: '12px', borderRadius: '4px', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{txStatus}</div>}
                </div>
            )}
        </div>
    );
}
