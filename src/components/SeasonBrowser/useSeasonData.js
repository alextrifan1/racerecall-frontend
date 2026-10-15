import { useState, useEffect } from 'react';
import { buildSeason } from './seasonHelpers';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Large enough to get every weekend of a season in one request
const WHOLE_SEASON = 100;

/*
 * Loads a whole season once per year. The page splits it into pages itself,
 * so it can number the rounds and open on the current one.
 */
export function useSeasonData(year) {
    // The result is tagged with the year it belongs to: while it doesn't match
    // the requested year, we're loading. No setState calls in the effect body.
    const [result, setResult] = useState({ year: null, weekends: [], nextSessionKey: null, error: null });

    useEffect(() => {
        const controller = new AbortController();

        fetch(`${API_BASE_URL}/api/sessions?year=${year}&page=0&size=${WHOLE_SEASON}`, { signal: controller.signal })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to fetch data');
                return response.json();
            })
            .then((data) => {
                const sessions = Array.isArray(data) ? data : [];
                const { weekends, nextSessionKey } = buildSeason(sessions, new Date());
                setResult({ year, weekends, nextSessionKey, error: null });
            })
            .catch((err) => {
                if (err.name === 'AbortError') return; // year changed before this finished
                setResult({ year, weekends: [], nextSessionKey: null, error: err.message });
            });

        return () => controller.abort();
    }, [year]);

    const loading = result.year !== year;

    return {
        weekends: loading ? [] : result.weekends,
        nextSessionKey: loading ? null : result.nextSessionKey,
        loading,
        error: loading ? null : result.error,
    };
}
