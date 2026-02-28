import { useState, useMemo } from 'react';

const SOURCES = ['All', 'Manifold', 'Opinion', 'Predict.fun', 'Probable', 'XO'];

function getSourceClass(source) {
    const map = {
        'Manifold': 'source-manifold',
        'Opinion': 'source-opinion',
        'Predict.fun': 'source-predictfun',
        'Probable': 'source-probable',
        'XO': 'source-xo',
    };
    return map[source] || '';
}

function getProbColor(prob) {
    if (prob >= 70) return '#00ff88';
    if (prob >= 40) return '#fbbf24';
    return '#ff4757';
}

function formatVolume(vol) {
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `$${(vol / 1000).toFixed(1)}K`;
    return `$${vol}`;
}

export default function MarketsTable({ markets, loading }) {
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('volume');
    const [sortDir, setSortDir] = useState('desc');

    const handleSort = (col) => {
        if (sortBy === col) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(col);
            setSortDir('desc');
        }
    };

    const filtered = useMemo(() => {
        if (!markets) return [];
        let list = [...markets];
        if (filter !== 'All') list = list.filter(m => m.source === filter);
        if (search) list = list.filter(m => m.question.toLowerCase().includes(search.toLowerCase()));
        list.sort((a, b) => {
            const mul = sortDir === 'asc' ? 1 : -1;
            if (sortBy === 'source') return mul * a.source.localeCompare(b.source);
            if (sortBy === 'question') return mul * a.question.localeCompare(b.question);
            return mul * ((a[sortBy] || 0) - (b[sortBy] || 0));
        });
        return list;
    }, [markets, filter, search, sortBy, sortDir]);

    const arrow = (col) => sortBy === col ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

    return (
        <div className="card markets-card">
            <div className="card-header">
                <div className="card-title">
                    📊 Unified Markets
                    <span className="card-badge" style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff' }}>
                        {filtered.length} markets
                    </span>
                </div>
            </div>

            <div className="filters-bar">
                {SOURCES.map(s => (
                    <button
                        key={s}
                        className={`filter-chip ${filter === s ? 'active' : ''}`}
                        onClick={() => setFilter(s)}
                    >
                        {s}
                    </button>
                ))}
                <input
                    className="search-input"
                    placeholder="Search markets…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className="card-body" style={{ overflowX: 'auto' }}>
                {loading ? (
                    <div className="loading">
                        <div className="spinner" />
                        Fetching markets…
                    </div>
                ) : (
                    <table className="markets-table">
                        <thead>
                            <tr>
                                <th className={sortBy === 'source' ? 'sorted' : ''} onClick={() => handleSort('source')}>
                                    Source{arrow('source')}
                                </th>
                                <th className={sortBy === 'question' ? 'sorted' : ''} onClick={() => handleSort('question')}>
                                    Question{arrow('question')}
                                </th>
                                <th className={sortBy === 'yesPrice' ? 'sorted' : ''} onClick={() => handleSort('yesPrice')}>
                                    YES{arrow('yesPrice')}
                                </th>
                                <th className={sortBy === 'noPrice' ? 'sorted' : ''} onClick={() => handleSort('noPrice')}>
                                    NO{arrow('noPrice')}
                                </th>
                                <th className={sortBy === 'probability' ? 'sorted' : ''} onClick={() => handleSort('probability')}>
                                    Implied Prob{arrow('probability')}
                                </th>
                                <th className={sortBy === 'volume' ? 'sorted' : ''} onClick={() => handleSort('volume')}>
                                    Volume{arrow('volume')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((m, i) => (
                                <tr key={m.id || i}>
                                    <td>
                                        <span className={`source-badge ${getSourceClass(m.source)}`}>
                                            <span className="dot" />
                                            {m.source}
                                        </span>
                                    </td>
                                    <td style={{ maxWidth: '320px' }}>{m.question}</td>
                                    <td className="price-yes">{(m.yesPrice * 100).toFixed(1)}¢</td>
                                    <td className="price-no">{(m.noPrice * 100).toFixed(1)}¢</td>
                                    <td>
                                        <div className="prob-bar">
                                            <div className="prob-track">
                                                <div
                                                    className="prob-fill"
                                                    style={{
                                                        width: `${m.probability}%`,
                                                        background: `linear-gradient(90deg, ${getProbColor(m.probability)}, ${getProbColor(m.probability)}88)`,
                                                    }}
                                                />
                                            </div>
                                            <span className="prob-value" style={{ color: getProbColor(m.probability) }}>
                                                {m.probability.toFixed(1)}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="volume">{formatVolume(m.volume)}</td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="empty-state">No markets match your filters.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
