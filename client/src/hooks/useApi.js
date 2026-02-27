import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for API data fetching with loading/error states.
 * @param {string} url - API endpoint
 * @param {object} options - { autoFetch, interval }
 */
export function useApi(url, options = {}) {
    const { autoFetch = true, interval = null } = options;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`API error: ${res.status}`);
            const json = await res.json();
            setData(json);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        if (autoFetch) fetchData();
    }, [autoFetch, fetchData]);

    // Polling
    useEffect(() => {
        if (!interval) return;
        const id = setInterval(fetchData, interval);
        return () => clearInterval(id);
    }, [interval, fetchData]);

    return { data, loading, error, refetch: fetchData };
}
