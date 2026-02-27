const express = require('express');
const router = express.Router();
const { fetchManifoldMarkets } = require('../services/manifold');
const { loadMockMarkets } = require('../services/mockLoader');
const { detectArbitrage } = require('../logic/arbitrage');

// In-memory trade log & P&L
const trades = [];
let totalPnL = 0;

// GET /api/markets/live
router.get('/markets/live', async (req, res) => {
    try {
        const markets = await fetchManifoldMarkets();
        res.json({ source: 'live', count: markets.length, markets });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/markets/mock
router.get('/markets/mock', (req, res) => {
    try {
        const markets = loadMockMarkets();
        res.json({ source: 'mock', count: markets.length, markets });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/markets/all
router.get('/markets/all', async (req, res) => {
    try {
        const [live, mock] = await Promise.all([
            fetchManifoldMarkets(),
            Promise.resolve(loadMockMarkets()),
        ]);
        const all = [...live, ...mock];
        res.json({ count: all.length, markets: all });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/arb
router.get('/arb', async (req, res) => {
    try {
        const [live, mock] = await Promise.all([
            fetchManifoldMarkets(),
            Promise.resolve(loadMockMarkets()),
        ]);
        const allMarkets = [...live, ...mock];
        const opportunities = detectArbitrage(allMarkets);
        res.json({
            scannedMarkets: allMarkets.length,
            opportunitiesFound: opportunities.length,
            opportunities,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/trade — simulate a trade
router.post('/trade', (req, res) => {
    const { opportunityId, action, stake = 100, edgePercent = 0 } = req.body;

    if (!opportunityId || !action) {
        return res.status(400).json({ error: 'opportunityId and action are required' });
    }

    // Simulate P&L: assume we capture ~60-80% of the theoretical edge
    const captureRate = 0.6 + Math.random() * 0.2;
    const pnl = Math.round(stake * (edgePercent / 100) * captureRate * 100) / 100;
    totalPnL += pnl;

    const trade = {
        id: `trade-${Date.now()}`,
        opportunityId,
        action,
        stake,
        edgePercent,
        pnl,
        totalPnL: Math.round(totalPnL * 100) / 100,
        timestamp: new Date().toISOString(),
    };

    trades.push(trade);
    res.json({ success: true, trade, portfolio: { totalPnL: trade.totalPnL, tradeCount: trades.length } });
});

// GET /api/portfolio
router.get('/portfolio', (req, res) => {
    res.json({
        totalPnL: Math.round(totalPnL * 100) / 100,
        tradeCount: trades.length,
        trades: trades.slice().reverse(),
    });
});

module.exports = router;
