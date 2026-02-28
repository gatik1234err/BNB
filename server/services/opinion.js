const OPINION_API = 'https://proxy.opinion.trade:8443/openapi/market?status=activated&sortBy=5&limit=20';

/**
 * Fetch live markets from Opinion Testnet (BNB Chain).
 */
async function fetchOpinionMarkets() {
    try {
        const res = await fetch(OPINION_API);
        if (!res.ok) return [];
        const { data } = await res.json();
        if (!data || !Array.isArray(data)) return [];

        return data.map(m => {
            const yesPrice = m.price || 0.5;
            return {
                id: `op-${m.id}`,
                source: 'Opinion',
                question: m.question,
                yesPrice: round(yesPrice),
                noPrice: round(1 - yesPrice),
                probability: round(yesPrice * 100),
                volume: Math.round(m.volume || 0),
                createdAt: m.createdAt
            };
        });
    } catch (e) {
        console.error('❌ Opinion fetch failed:', e.message);
        return [];
    }
}

function round(n) {
    return Math.round(n * 1000) / 1000;
}

module.exports = { fetchOpinionMarkets };
