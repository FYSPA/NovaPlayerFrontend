import { useState, useEffect } from "react";
import api from "@/utils/api";

export function usePlaylist(playlistId: string) {
    const [playlistData, setPlaylistData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!playlistId) return;
        setLoading(true);

        const fetchDetails = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const { data } = await api.get(`/spotify/playlist/${playlistId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPlaylistData(data);
            } catch (error) {
                console.error("Error loading playlist", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [playlistId]);

    return { playlistData, loading };
}