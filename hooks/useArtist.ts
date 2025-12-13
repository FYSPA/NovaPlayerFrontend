import { useState, useEffect } from "react";
import api from "@/utils/api";

// Definimos los tipos aquí para reutilizarlos
export interface Artist {
    id: string;
    name: string;
    images: { url: string }[];
    followers: { total: number };
    genres: string[];
}

export function useArtist(artistId: string | null) {
    const [artist, setArtist] = useState<Artist | null>(null);
    const [topTracks, setTopTracks] = useState<any[]>([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 1. CARGAR DATOS
    useEffect(() => {
        if (!artistId) return;
        
        let isMounted = true;
        setLoading(true);

        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                // Hacemos las 3 peticiones en paralelo
                const [artistRes, tracksRes, followRes] = await Promise.allSettled([
                    api.get(`/spotify/artist/${artistId}`, { headers: { Authorization: `Bearer ${token}` } }),
                    api.get(`/spotify/artist/${artistId}/top-tracks`, { headers: { Authorization: `Bearer ${token}` } }),
                    api.get(`/spotify/artist/${artistId}/is-following`, { headers: { Authorization: `Bearer ${token}` } })
                ]);

                if (!isMounted) return;

                // Procesamos Artista
                if (artistRes.status === "fulfilled") setArtist(artistRes.value.data);
                else throw new Error("No se pudo cargar el artista");

                // Procesamos Tracks
                if (tracksRes.status === "fulfilled") setTopTracks(tracksRes.value.data);

                // Procesamos Follow
                if (followRes.status === "fulfilled") setIsFollowing(followRes.value.data);

            } catch (err) {
                console.error(err);
                setError("Error al cargar datos del artista");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();

        return () => { isMounted = false; };
    }, [artistId]);

    // 2. FUNCIÓN SEGUIR/DEJAR DE SEGUIR
    const toggleFollow = async () => {
        const token = localStorage.getItem("token");
        if (!token || !artistId) return;

        const newState = !isFollowing;
        setIsFollowing(newState); // Optimista

        try {
            if (newState) {
                await api.put(`/spotify/artist/${artistId}/follow`, {}, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await api.delete(`/spotify/artist/${artistId}/follow`, { headers: { Authorization: `Bearer ${token}` } });
            }
        } catch (error) {
            console.error("Error follow", error);
            setIsFollowing(!newState); // Revertir
        }
    };

    return { artist, topTracks, isFollowing, loading, error, toggleFollow };
}