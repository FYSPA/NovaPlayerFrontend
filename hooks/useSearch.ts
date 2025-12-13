import { useState, useEffect, useRef } from "react";
import api from "@/utils/api";

export interface SearchResults {
    tracks?: { items: any[] };
    artists?: { items: any[] };
}

export function useSearch(initialQuery: string = "") {
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<SearchResults | null>(null);
    const [loading, setLoading] = useState(false);
    
    // Referencia interna para cancelar peticiones
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        // Si cambia la query y está vacía, limpiar
        if (!query.trim()) {
            setResults(null);
            setLoading(false);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");

            // Cancelar petición anterior
            if (abortControllerRef.current) abortControllerRef.current.abort();
            abortControllerRef.current = new AbortController();

            try {
                const { data } = await api.get(`/spotify/search?q=${encodeURIComponent(query)}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    signal: abortControllerRef.current.signal
                });
                setResults(data);
            } catch (error: any) {
                if (error.name !== "CanceledError") console.error(error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce de 500ms
        const timeoutId = setTimeout(() => {
            fetchResults();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [query]);

    return { query, setQuery, results, loading };
}