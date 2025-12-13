import { useState, useEffect } from "react";
import api from "@/utils/api";

export function useTrackLike(trackId: string) {
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(true);

    // 1. Verificar estado inicial
    useEffect(() => {
        const checkStatus = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const { data } = await api.get(`/spotify/check-saved/${trackId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsLiked(data);
            } catch (error) {
                console.error("Error verificando like", error);
            } finally {
                setLoading(false);
            }
        };
        checkStatus();
    }, [trackId]);

    // 2. Función para alternar el Like
    const toggleLike = async (e?: React.MouseEvent) => {
        // Si se pasa el evento (click), detenemos la propagación para no reproducir la canción
        if (e) e.stopPropagation();

        const token = localStorage.getItem("token");
        if (!token) return;

        // Cambio optimista
        const newState = !isLiked;
        setIsLiked(newState);

        try {
            if (newState) {
                await api.put(`/spotify/save-track/${trackId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await api.delete(`/spotify/remove-track/${trackId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (error) {
            console.error("Error cambiando like", error);
            setIsLiked(!newState); // Revertir cambios si falla
        }
    };

    return { isLiked, loading, toggleLike };
}