const express = require('express');
const router = express.Router();
const { fetchManifoldMarkets } = require('../services/manifold');
const { fetchPredictFunMarkets } = require('../services/predictfun');
const { fetchOpinionMarkets } = require('../services/opinion');
const { fetchProbableMarkets } = require('../services/probable');
const { fetchXOMarkets } = require('../services/xo');
const { detectArbitrage } = require('../logic/arbitrage');

// In-memory trade log & P&L
const trades = [];
let totalPnL = 0;

// In-memory custom markets
const customMarkets = [];

// GET /api/markets/live
router.get('/markets/live', async (req, res) => {
    try {
        const [manifold, predictfun, opinion, probable, xo] = await Promise.all([
            fetchManifoldMarkets(),
            fetchPredictFunMarkets(),
            fetchOpinionMarkets(),
            fetchProbableMarkets(),
            fetchXOMarkets()
        ]);
        const markets = [...manifold, ...predictfun, ...opinion, ...probable, ...xo, ...customMarkets];
        res.json({ source: 'live', count: markets.length, markets });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/markets/all
router.get('/markets/all', async (req, res) => {
    try {
        const [manifold, predictfun, opinion, probable, xo] = await Promise.all([
            fetchManifoldMarkets(),
            fetchPredictFunMarkets(),
            fetchOpinionMarkets(),
            fetchProbableMarkets(),
            fetchXOMarkets(),
        ]);
        const all = [...manifold, ...predictfun, ...opinion, ...probable, ...xo, ...customMarkets];
        res.json({ count: all.length, markets: all });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/arb
router.get('/arb', async (req, res) => {
    try {
        const [manifold, predictfun, opinion, probable, xo] = await Promise.all([
            fetchManifoldMarkets(),
            fetchPredictFunMarkets(),
            fetchOpinionMarkets(),
            fetchProbableMarkets(),
            fetchXOMarkets(),
        ]);
        const allMarkets = [...manifold, ...predictfun, ...opinion, ...probable, ...xo, ...customMarkets];
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

// POST /api/markets/custom — manually add a market
router.post('/markets/custom', (req, res) => {
    const { question, probability = 50, volume = 0, url = '' } = req.body;

    if (!question) {
        return res.status(400).json({ error: 'question is required' });
    }

    const yesPrice = Math.round((probability / 100) * 1000) / 1000;
    const noPrice = Math.round((1 - yesPrice) * 1000) / 1000;

    const newMarket = {
        id: `custom-${Date.now()}`,
        source: 'Custom',
        question,
        yesPrice,
        noPrice,
        probability: Number(probability),
        volume: Number(volume),
        url,
    };

    customMarkets.push(newMarket);
    res.json({ success: true, market: newMarket });
});

module.exports = router;
