import { useState, useCallback } from 'react';
import { useApi } from './hooks/useApi';
import Header from './components/Header';
import MarketsTable from './components/MarketsTable';
import ArbitragePanel from './components/ArbitragePanel';
import Portfolio from './components/Portfolio';
import About from './components/About';

export default function App() {
    const [trades, setTrades] = useState([]);
    const [totalPnL, setTotalPnL] = useState(0);
    const [toast, setToast] = useState(null);

    // Fetch markets and arbitrage data
    const marketsApi = useApi('/api/markets/all', { interval: 30000 });
    const arbApi = useApi('/api/arb', { interval: 30000 });

    const loading = marketsApi.loading || arbApi.loading;

    const handleRefresh = useCallback(() => {
        marketsApi.refetch();
        arbApi.refetch();
    }, [marketsApi, arbApi]);

    const handleTrade = useCallback((trade) => {
        setTrades(prev => [trade, ...prev]);
        setTotalPnL(trade.totalPnL);

        // Show toast
        setToast(`Trade executed! P&L: ${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toFixed(2)}`);
        setTimeout(() => setToast(null), 3000);
    }, []);

    return (
        <div className="app">
            <Header onRefresh={handleRefresh} loading={loading} />

            {/* Unified Markets Table */}
            <MarketsTable
                markets={marketsApi.data?.markets}
                loading={marketsApi.loading}
            />

            {/* Arb + Portfolio Grid */}
            <div className="main-grid" style={{ marginTop: '24px' }}>
                <ArbitragePanel
                    opportunities={arbApi.data?.opportunities}
                    loading={arbApi.loading}
                    onTrade={handleTrade}
                />
                <Portfolio trades={trades} totalPnL={totalPnL} />
            </div>

            {/* About Section */}
            <About />

            {/* Toast notification */}
            {toast && <div className="toast">{toast}</div>}
        </div>
    );
}
