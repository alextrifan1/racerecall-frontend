import { useState, useEffect } from 'react';

export function useSeasonData(year, page) {
    const [sessions, setSessions] = useState([]);
    const [groupedWeekends, setGroupedWeekends] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        fetch(`http://localhost:8080/api/sessions?year=${year}&page=${page}&size=4`)
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch data");
                return response.json();
            })
            .then(data => {
                const rawSessions = Array.isArray(data) ? data : [];
                setSessions(rawSessions);

                const grouped = rawSessions.reduce((acc, session) => {
                    const key = session.meeting_key || session.circuit_short_name || "Unknown Circuit";
                    if (!acc[key]) {
                        acc[key] = {
                            circuitName: session.circuit_short_name,
                            countryName: session.country_name,
                            sessions: []
                        };
                    }
                    acc[key].sessions.push(session);
                    return acc;
                }, {});

                setGroupedWeekends(grouped);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [year, page]);

    return { sessions, groupedWeekends, loading, error };
}