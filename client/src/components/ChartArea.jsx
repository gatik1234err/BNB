import React from 'react';

export default function ChartArea() {
    return (
        <div className="panel chart-area">
            <div className="panel-header">Market Chart</div>
            <div className="panel-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f141a' }}>
                <div style={{ color: 'var(--text-muted)' }}>TradingView Advanced Chart Placeholder</div>
            </div>
        </div>
    );
}
