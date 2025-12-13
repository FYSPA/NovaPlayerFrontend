import { useState, useEffect } from "react";
import api from "@/utils/api";

export function useCategoryTracks(categoryId: string) {
    const [tracks, setTracks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!categoryId) return;

        const fetchTracks = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            try {
                // Llamamos al nuevo endpoint de tracks
                const { data } = await api.get(`/spotify/category/${categoryId}/tracks`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTracks(data);
            } catch (err) {
                console.error("Error fetching category tracks", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTracks();
    }, [categoryId]);

    return { tracks, loading };
}