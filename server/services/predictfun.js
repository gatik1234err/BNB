const MAINNET_API = 'https://api.predict.fun/v1';
const API_KEY = 'd09ddfc4-0287-4a5e-97d7-b734dab12b35';

/**
 * Fetch live markets from Predict.fun Mainnet.
 * Includes all markets (OPEN, CLOSED, RESOLVED) as requested.
 */
async function fetchPredictFunMarkets() {
    const pLimitCreator = (await import('p-limit')).default;
    const limit = pLimitCreator(5);

    try {
        // Fetch a standard page of 150 markets (no status filter)
        const res = await fetch(`${MAINNET_API}/markets?first=150`, {
            headers: { 'x-api-key': API_KEY }
        });
        if (!res.ok) throw new Error(`API ${res.status}`);
        const { success, data } = await res.json();
        if (!success || !data?.length) return [];

        // Filter out BTC/USD Up or Down markets and deduplicate repeated markets with changed dates
        const seenQuestions = new Set();
        const filteredData = data.filter(m => {
            const rawQ = m.question || m.title || '';
            if (rawQ.toLowerCase().includes('btc/usd up or down')) return false;

            // Strip common date/time formats to find the "base" question
            const baseQ = rawQ
                .replace(/\b(?:on\s+)?(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?\b/gi, '')
                .replace(/\b\d{4}-\d{2}-\d{2}\b/g, '')
                .replace(/\b\d{1,2}:\d{2}(?:-\d{1,2}:\d{2})?(?:[AaPp][Mm])?\s*(?:ET|EST|EDT|PT|PST|PDT|CT|CST|CDT|MT|MST|MDT|UTC)?\b/gi, '')
                .replace(/[-_@,]/g, '')
                .replace(/\s+/g, ' ')
                .trim()
                .toLowerCase();

            if (seenQuestions.has(baseQ)) return false;
            seenQuestions.add(baseQ);
            return true;
        });

        const processedMarkets = await Promise.all(
            filteredData.map(m => limit(async () => {
                let yesPrice = 0.5;
                let resolution = null;

                if (m.tradingStatus === 'OPEN') {
                    try {
                        const obRes = await fetch(`${MAINNET_API}/markets/${m.id}/orderbook`, {
                            headers: { 'x-api-key': API_KEY }
                        });
                        const { success: obSuccess, data: obData } = await obRes.json();
                        if (obSuccess && obData) {
                            const ask = obData.asks?.filter(a => a[0] === 0)[0]?.[1];
                            const bid = obData.bids?.filter(b => b[0] === 0)[0]?.[1];
                            if (ask && bid) yesPrice = (parseFloat(ask) + parseFloat(bid)) / 2;
                            else if (ask) yesPrice = parseFloat(ask);
                            else if (bid) yesPrice = parseFloat(bid);
                        }
                    } catch (e) { }
                } else if (m.resolution?.status === 'WON') {
                    // For resolved/closed markets, show the winning outcome as 1 (100%) or 0 (0%)
                    yesPrice = m.resolution.indexSet === 1 ? 1 : 0;
                    resolution = m.resolution.name;
                }

                return {
                    id: `pf-mn-${m.id}`,
                    source: 'Predict.fun',
                    question: m.question || m.title,
                    yesPrice: round(yesPrice),
                    noPrice: round(1 - yesPrice),
                    probability: round(yesPrice * 100),
                    volume: Math.round(m.shareThreshold || 0),
                    resolution,
                    tradingStatus: m.tradingStatus,
                    createdAt: m.createdAt
                };
            }))
        );

        return processedMarkets.filter(Boolean).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (err) {
        console.error('❌ Predict.fun Mainnet fetch failed:', err.message);
        return [];
    }
}

function round(n) { return Math.round(n * 1000) / 1000; }

module.exports = { fetchPredictFunMarkets };
