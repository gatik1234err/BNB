/**
 * Fetch live markets from Manifold Markets.
 * Public API — no key needed.
 */
async function fetchManifoldMarkets() {
    try {
        const res = await fetch('https://api.manifold.markets/v0/markets?limit=50');
        if (!res.ok) return [];
        const markets = await res.json();

        return markets.map(m => ({
            id: `mf-${m.id}`,
            source: 'Manifold',
            question: m.question,
            yesPrice: round(m.probability || 0.5),
            noPrice: round(1 - (m.probability || 0.5)),
            probability: round((m.probability || 0.5) * 100),
            volume: Math.round(m.volume || 0),
            createdAt: new Date(m.createdTime).toISOString()
        }));
    } catch (e) {
        console.error('❌ Manifold fetch failed:', e.message);
        return [];
    }
}

function round(n) {
    return Math.round(n * 1000) / 1000;
}

module.exports = { fetchManifoldMarkets };
