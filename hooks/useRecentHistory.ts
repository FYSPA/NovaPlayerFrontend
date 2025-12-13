import { useState, useEffect } from "react";
import api from "@/utils/api";

export function useRecentHistory() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const { data } = await api.get('/spotify/recently-played', { 
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (Array.isArray(data)) {
                    setItems(data);
                }
            } catch (error) {
                console.error("Error cargando historial", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return { items, loading };
}