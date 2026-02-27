const fs = require('fs');
const path = require('path');

const MOCK_DIR = path.join(__dirname, '..', 'data', 'mock');

/**
 * Load all mock platform data from JSON files.
 * Each file is named after the platform (e.g., opinion.json).
 */
function loadMockMarkets() {
    const files = fs.readdirSync(MOCK_DIR).filter(f => f.endsWith('.json'));
    const allMarkets = [];

    for (const file of files) {
        try {
            const raw = fs.readFileSync(path.join(MOCK_DIR, file), 'utf-8');
            const markets = JSON.parse(raw);
            allMarkets.push(...markets);
        } catch (err) {
            console.error(`⚠️  Failed to load mock file ${file}:`, err.message);
        }
    }

    return allMarkets;
}

module.exports = { loadMockMarkets };
