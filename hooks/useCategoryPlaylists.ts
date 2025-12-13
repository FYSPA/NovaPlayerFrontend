import { useState, useEffect } from "react";
import api from "@/utils/api";

export function useCategoryPlaylists(categoryId: string) {
const [playlists, setPlaylists] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);

useEffect(() => {
    if (!categoryId) return;

    const fetchPlaylists = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            // Llamamos a TU backend
            const { data } = await api.get(`/spotify/category/${categoryId}/playlists`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPlaylists(data);
        } catch (err) {
            console.error("Error fetching category playlists", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    fetchPlaylists();
}, [categoryId]);

return { playlists, loading, error };

}