export default function About() {
    return (
        <div className="card about-card">
            <div className="card-header">
                <div className="card-title">ℹ️ How It Works</div>
            </div>
            <div className="about-content">
                <div className="about-item">
                    <div className="about-icon">📡</div>
                    <h3>Multi-Platform Aggregation</h3>
                    <p>
                        BNB Terminal pulls live data from Manifold Markets and aggregates it with feeds from
                        Opinion, Predict.fun, Probable, and XO — giving you a unified view of prediction
                        markets across the entire ecosystem.
                    </p>
                </div>
                <div className="about-item">
                    <div className="about-icon">🤖</div>
                    <h3>AI Arbitrage Detection</h3>
                    <p>
                        Our rule-based arbitrage agent continuously scans for price discrepancies across platforms
                        for the same event. When YES prices diverge by ≥5%, it flags the opportunity with a clear
                        suggested trade and estimated edge.
                    </p>
                </div>
                <div className="about-item">
                    <div className="about-icon">⚡</div>
                    <h3>Paper Trading & P&L</h3>
                    <p>
                        Execute simulated trades with one click. Track your paper portfolio P&L in real-time with
                        charts and trade history. No real money — perfect for strategy testing and hackathon demos.
                        Extensible to any platform with an API.
                    </p>
                </div>
            </div>
        </div>
    );
}
