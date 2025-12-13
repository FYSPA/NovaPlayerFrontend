import { useState, useEffect } from "react";
import api from "@/utils/api";

export function useLibrary() {
    const [playlists, setPlaylists] = useState<any[]>([]);
    
    // Función para recargar (privada)
    const fetchPlaylists = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const { data } = await api.get('/spotify/playlists', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPlaylists(data);
        } catch (error) {
            console.error("Error cargando playlists", error);
        }
    };

    useEffect(() => {
        fetchPlaylists();
        // Sincronizar al volver a la pestaña
        const onFocus = () => fetchPlaylists();
        window.addEventListener("focus", onFocus);
        return () => window.removeEventListener("focus", onFocus);
    }, []);

    // ACCIONES
    const createPlaylist = async (data: any) => {
        const token = localStorage.getItem('token');
        await api.post('/spotify/playlist', data, { headers: { Authorization: `Bearer ${token}` } });
        fetchPlaylists(); // Recarga automática
    };

    const deletePlaylist = async (id: string) => {
        const token = localStorage.getItem('token');
        // Optimista
        setPlaylists(prev => prev.filter(p => p.id !== id));
        await api.delete(`/spotify/playlist/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchPlaylists(); // Confirmación
    };

    const editPlaylist = async (id: string, data: any) => {
        const token = localStorage.getItem('token');
        await api.put(`/spotify/playlist/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
        fetchPlaylists();
    };

    return { playlists, createPlaylist, deletePlaylist, editPlaylist };
}