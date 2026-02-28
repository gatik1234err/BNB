import React, { useState, useCallback } from 'react';
import { useApi } from './hooks/useApi';
import TerminalHeader from './components/TerminalHeader';
import AssetBar from './components/AssetBar';
import LeftPanel from './components/LeftPanel';
import OrderBookPanel from './components/OrderBookPanel';
import MarketTradesPanel from './components/MarketTradesPanel';
import ChartArea from './components/ChartArea';
import BottomPanel from './components/BottomPanel';
import Portfolio from './components/Portfolio';

export default function App() {
    const [activeTab, setActiveTab] = useState('Trade');
    const [trades, setTrades] = useState([]);
    const [totalPnL, setTotalPnL] = useState(0);

    // Fetch live market data and arbitrage opportunities
    const marketsApi = useApi('/api/markets/all', { interval: 30000 });
    const arbApi = useApi('/api/arb', { interval: 30000 });

    const loading = marketsApi.loading || arbApi.loading;

    const handleTrade = useCallback((trade) => {
        setTrades(prev => [trade, ...prev]);
        setTotalPnL(trade.totalPnL);
    }, []);

    return (
        <>
            {activeTab === 'Trade' && (
                <div className="terminal-layout">
                    <TerminalHeader activeTab={activeTab} setActiveTab={setActiveTab} />
                    <AssetBar loading={loading} />
                    <LeftPanel
                        opportunities={arbApi.data?.opportunities}
                        onTrade={handleTrade}
                    />
                    <OrderBookPanel markets={marketsApi.data?.markets} />
                    <MarketTradesPanel markets={marketsApi.data?.markets} />
                    <ChartArea />
                    <BottomPanel trades={trades} />
                </div>
            )}

            {activeTab === 'Portfolio' && (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-main)' }}>
                    <div style={{ height: '56px', minHeight: '56px', borderBottom: '1px solid var(--border-color)' }}>
                        <TerminalHeader activeTab={activeTab} setActiveTab={setActiveTab} />
                    </div>
                    <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                        <Portfolio trades={trades} totalPnL={totalPnL} />
                    </div>
                </div>
            )}
        </>
    );
}
