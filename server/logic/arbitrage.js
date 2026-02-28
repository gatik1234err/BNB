/**
 * Arbitrage Detection Engine
 * 
 * Maps markets across platforms to the same logical event,
 * then flags price discrepancies above a configurable threshold.
 */

const THRESHOLD = 0.05; // 5% minimum edge to flag

// Hardcoded event mapping: eventId → array of { source, idPattern }
// idPattern is a substring match against market id fields
const EVENT_MAP = {
    'evt-ai-turing': { question: 'Will AI pass the Turing test by 2030?', keywords: ['ai', 'turing', 'test'] },
    'evt-btc-100k': { question: 'Will Bitcoin reach $100k by end of 2026?', keywords: ['bitcoin', 'btc', '100k', 'price'] },
    'evt-spacex-mars': { question: 'Will SpaceX land humans on Mars by 2030?', keywords: ['spacex', 'mars', 'land'] },
    'evt-us-recession': { question: 'Will the US enter a recession in 2026?', keywords: ['recession', 'us', 'economy'] },
    'evt-gpt5-2026': { question: 'Will GPT-5 be released in 2026?', keywords: ['gpt-5', 'gpt5', 'openai', 'released'] },
    'evt-dem-2028': { question: 'Will Democrats win the 2028 presidential election?', keywords: ['democrat', '2028', 'presidential', 'election'] },
    'evt-tsla-500': { question: 'Will Tesla stock reach $500 by end of 2026?', keywords: ['tesla', 'tsla', '500', 'stock'] },
    'evt-ukraine-ceasefire': { question: 'Will there be a ceasefire in Ukraine by end of 2026?', keywords: ['ukraine', 'ceasefire', 'war'] },
    'evt-nba-2026': { question: 'NBA 2026 Champion', keywords: ['nba', 'champion', 'finals', '2026'] },
};

/**
 * Match a market to an event using keyword matching on the question text.
 */
function matchMarketToEvent(market) {
    const q = market.question.toLowerCase();
    for (const [eventId, { keywords }] of Object.entries(EVENT_MAP)) {
        const matchCount = keywords.filter(kw => q.includes(kw)).length;
        if (matchCount >= 2) return eventId;
    }
    // Also check direct id match
    for (const eventId of Object.keys(EVENT_MAP)) {
        if (market.id && market.id.includes(eventId.replace('evt-', ''))) return eventId;
    }
    return null;
}

/**
 * Detect arbitrage opportunities across all markets.
 * @param {Array} allMarkets - Combined live + mock markets
 * @returns {Array} opportunities
 */
function detectArbitrage(allMarkets) {
    // Group markets by event
    const eventGroups = {};

    for (const market of allMarkets) {
        const eventId = matchMarketToEvent(market);
        if (!eventId) continue;
        if (!eventGroups[eventId]) eventGroups[eventId] = [];
        eventGroups[eventId].push(market);
    }

    const opportunities = [];
    let oppId = 1;

    for (const [eventId, markets] of Object.entries(eventGroups)) {
        if (markets.length < 2) continue;

        // Compare all pairs
        for (let i = 0; i < markets.length; i++) {
            for (let j = i + 1; j < markets.length; j++) {
                const a = markets[i];
                const b = markets[j];

                // Only consider cross-platform arbitrage
                if (a.source === b.source) continue;

                const diff = Math.abs(a.yesPrice - b.yesPrice);

                if (diff >= THRESHOLD) {
                    const [low, high] = a.yesPrice < b.yesPrice ? [a, b] : [b, a];
                    const edgePercent = round((diff) * 100);
                    const stake = 100; // default $100 stake for edge calc

                    opportunities.push({
                        id: `arb-${oppId++}`,
                        eventId,
                        question: EVENT_MAP[eventId].question,
                        platformA: low.source,
                        priceA: low.yesPrice,
                        platformB: high.source,
                        priceB: high.yesPrice,
                        edgePercent,
                        estimatedProfit: round(edgePercent * stake / 100),
                        suggestedAction: `Buy YES on ${low.source} @ ${(low.yesPrice * 100).toFixed(1)}¢, Sell YES on ${high.source} @ ${(high.yesPrice * 100).toFixed(1)}¢`,
                        confidence: edgePercent >= 10 ? 'HIGH' : 'MEDIUM',
                        timestamp: new Date().toISOString(),
                    });
                }
            }
        }
    }

    // Sort by edge descending
    opportunities.sort((a, b) => b.edgePercent - a.edgePercent);
    return opportunities;
}

function round(n) {
    return Math.round(n * 100) / 100;
}

module.exports = { detectArbitrage };
