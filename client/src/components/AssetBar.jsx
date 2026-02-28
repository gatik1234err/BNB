import React from 'react';

export default function AssetBar({ loading }) {
    return (
        <div className="panel asset-bar">
            <div className="asset-title">
                BTC/USD <i>&#9733;</i>
            </div>
            <div className="asset-info-group">
                <span className="asset-label">Last price</span>
                <span className="asset-value down">95,432.10</span>
            </div>
            <div className="asset-info-group">
                <span className="asset-label">24h change</span>
                <span className="asset-value up">+1.24%</span>
            </div>
            <div className="asset-info-group">
                <span className="asset-label">24h volume</span>
                <span className="asset-value">14.2M</span>
            </div>
            <div className="asset-info-group">
                <span className="asset-label">Market connection</span>
                <span className="asset-value" style={{ color: loading ? 'var(--text-secondary)' : 'var(--color-buy)' }}>
                    {loading ? 'Reconnecting...' : 'Live Connected'}
                </span>
            </div>
        </div>
    );
}
