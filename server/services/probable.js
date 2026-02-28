const MARKET_API = 'https://market-api.probable.markets/public/api/v1/markets/';
const PRICE_API = 'https://api.probable.markets/public/api/v1/prices';

/**
 * Fetch live markets from Probable with real-time prices.
 * Two-stage fetch: 
 * 1. Metadata from MARKET_API
 * 2. Prices from PRICE_API (bulk POST)
 */
async function fetchProbableMarkets() {
    try {
        // Step 1: Fetch active markets metadata
        const params = new URLSearchParams({ active: 'true', limit: '50' });
        const res = await fetch(`${MARKET_API}?${params}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Origin': 'https://probable.markets',
                'Referer': 'https://probable.markets/',
                'Accept': 'application/json'
            }
        });

        if (!res.ok) {
            console.error(`⚠️ Probable Market API: ${res.status} ${res.statusText}`);
            return [];
        }

        const marketData = await res.json();
        const rawMarkets = marketData.markets || [];
        if (!rawMarkets.length) return [];

        // Collect all token IDs for the bulk price request
        const tokenIds = [];
        rawMarkets.forEach(m => {
            if (m.clobTokenIds) {
                try {
                    const ids = JSON.parse(m.clobTokenIds);
                    if (Array.isArray(ids)) tokenIds.push(...ids);
                } catch (e) { }
            }
            if (m.tokens) {
                m.tokens.forEach(t => {
                    if (t.token_id) tokenIds.push(t.token_id);
                });
            }
        });

        // Step 2: Fetch real-time prices for these tokens
        let priceMap = {};
        if (tokenIds.length > 0) {
            try {
                // Remove duplicates and format for the API
                const uniqueTokenIds = [...new Set(tokenIds)];
                const pricePayload = uniqueTokenIds.map(id => ({ token_id: id, side: "BUY" }));

                const priceRes = await fetch(PRICE_API, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Origin': 'https://probable.markets',
                        'Referer': 'https://probable.markets/',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(pricePayload)
                });

                if (priceRes.ok) {
                    priceMap = await priceRes.json();
                } else {
                    console.error(`⚠️ Probable Price API: ${priceRes.status}`);
                }
            } catch (pErr) {
                console.error('❌ Failed to fetch Probable prices:', pErr.message);
            }
        }

        // Step 3: Map prices back to markets
        return rawMarkets
            .map(m => {
                // Find the "Yes" token or the first token ID
                let tokenId = null;
                if (m.tokens) {
                    const yesToken = m.tokens.find(t => t.outcome === 'Yes' || t.outcome === 'Nets' || t.outcome === 'Celtics');
                    tokenId = yesToken ? yesToken.token_id : m.tokens[0]?.token_id;
                }
                if (!tokenId && m.clobTokenIds) {
                    try {
                        const ids = JSON.parse(m.clobTokenIds);
                        tokenId = ids[0];
                    } catch (e) { }
                }

                // Get price from map, default to 0.5 if not found
                const priceData = tokenId ? priceMap[tokenId] : null;
                const price = priceData && priceData.BUY ? parseFloat(priceData.BUY) : 0.5;

                return {
                    id: `pr-${m.id || m.market_id || m.slug}`,
                    source: 'Probable',
                    question: m.question || m.title || m.market_slug || 'Unnamed Bet',
                    yesPrice: round(price),
                    noPrice: round(1 - price),
                    probability: round(price * 100),
                    volume: Math.round(parseFloat(m.volume24hr || m.liquidity || 0)),
                    active: m.active !== false && !m.closed,
                    closed: !!m.closed || !!m.resolved,
                    slug: m.slug || m.market_slug
                };
            })
            .filter(m => m.active);
    } catch (err) {
        console.error('❌ Probable fetch failed:', err.message);
        return [];
    }
}

function round(n) {
    return Math.round(n * 1000) / 1000;
}

module.exports = { fetchProbableMarkets };
