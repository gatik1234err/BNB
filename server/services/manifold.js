const MANIFOLD_API = 'https://api.manifold.markets/v0/markets';

/**
 * Fetch live binary markets from Manifold Markets.
 * Public API — no key needed.
 */
async function fetchManifoldMarkets() {
    try {
        const res = await fetch(`${MANIFOLD_API}?limit=50`);
        if (!res.ok) throw new Error(`Manifold API ${res.status}`);
        const raw = await res.json();

        return raw
            .filter(m => m.outcomeType === 'BINARY' && m.volume > 50)
            .map(m => ({
                id: m.id,
                slug: m.slug || '',
                source: 'Manifold',
                question: m.question,
                yesPrice: round(m.probability),
                noPrice: round(1 - m.probability),
                probability: round(m.probability * 100),
                volume: Math.round(m.volume),
            }));
    } catch (err) {
        console.error('❌ Manifold fetch failed:', err.message);
        // Return fallback data so the demo always works
        return getFallbackMarkets();
    }
}

function round(n) {
    return Math.round(n * 1000) / 1000;
}

function getFallbackMarkets() {
    return [
        { id: 'mf-ai-turing', slug: 'ai-turing-test-2030', source: 'Manifold', question: 'Will AI pass the Turing test by 2030?', yesPrice: 0.72, noPrice: 0.28, probability: 72, volume: 15420 },
        { id: 'mf-btc-100k', slug: 'bitcoin-100k-2026', source: 'Manifold', question: 'Will Bitcoin reach $100k by end of 2026?', yesPrice: 0.45, noPrice: 0.55, probability: 45, volume: 32100 },
        { id: 'mf-spacex-mars', slug: 'spacex-mars-2030', source: 'Manifold', question: 'Will SpaceX land humans on Mars by 2030?', yesPrice: 0.18, noPrice: 0.82, probability: 18, volume: 8900 },
        { id: 'mf-us-recession', slug: 'us-recession-2026', source: 'Manifold', question: 'Will the US enter a recession in 2026?', yesPrice: 0.35, noPrice: 0.65, probability: 35, volume: 21000 },
        { id: 'mf-gpt5-2026', slug: 'gpt5-release-2026', source: 'Manifold', question: 'Will GPT-5 be released in 2026?', yesPrice: 0.62, noPrice: 0.38, probability: 62, volume: 18750 },
        { id: 'mf-dem-2028', slug: 'democrats-win-2028', source: 'Manifold', question: 'Will Democrats win the 2028 presidential election?', yesPrice: 0.48, noPrice: 0.52, probability: 48, volume: 45200 },
        { id: 'mf-tsla-500', slug: 'tesla-500-2026', source: 'Manifold', question: 'Will Tesla stock reach $500 by end of 2026?', yesPrice: 0.30, noPrice: 0.70, probability: 30, volume: 12800 },
        { id: 'mf-ukraine-ceasefire', slug: 'ukraine-ceasefire-2026', source: 'Manifold', question: 'Will there be a ceasefire in Ukraine by end of 2026?', yesPrice: 0.40, noPrice: 0.60, probability: 40, volume: 27600 },
    ];
}

module.exports = { fetchManifoldMarkets };
