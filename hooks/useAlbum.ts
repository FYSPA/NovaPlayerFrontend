import { useState, useEffect } from "react";
import api from "@/utils/api";

export function useAlbum(albumId: string | null) {
    const [album, setAlbum] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!albumId) return;
        setLoading(true);

        const fetchAlbum = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const { data } = await api.get(`/spotify/album/${albumId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAlbum(data);
            } catch (error) {
                console.error("Error loading album", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbum();
    }, [albumId]);

    return { album, loading };
}