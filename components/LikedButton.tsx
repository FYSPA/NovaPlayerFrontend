"use client";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import api from "@/utils/api";

export default function LikeButton({ trackId }: { trackId: string }) {
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(true);

    // 1. Al cargar el botón, verificamos si ya le diste like
    useEffect(() => {
        const checkStatus = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const { data } = await api.get(`/spotify/check-saved/${trackId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsLiked(data); // true o false
            } catch (error) {
                console.error("Error verificando like", error);
            } finally {
                setLoading(false);
            }
        };
        checkStatus();
    }, [trackId]);

    // 2. Función para dar/quitar Like
    const handleToggleLike = async (e: React.MouseEvent) => {
        e.stopPropagation(); // ¡IMPORTANTE! Para que no reproduzca la canción al dar like

        const token = localStorage.getItem("token");
        if (!token) return;

        // Cambio optimista (Visualmente instantáneo)
        const newState = !isLiked;
        setIsLiked(newState);

        try {
            if (newState) {
                // Guardar (PUT)
                await api.put(`/spotify/save-track/${trackId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // Borrar (DELETE)
                await api.delete(`/spotify/remove-track/${trackId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (error) {
            console.error("Error cambiando like", error);
            setIsLiked(!newState); // Revertir si falló
        }
    };

    if (loading) return <div className="w-5 h-5" />; // Espacio vacío mientras carga

    return (
        <button
            onClick={handleToggleLike}
            className="hover:scale-110 transition-transform focus:outline-none"
        >
            <Heart
                size={20}
                className={`transition-colors ${isLiked
                        ? "fill-green-500 text-green-500" // Rojo si tiene like
                        : "text-gray-400 hover:text-white" // Gris si no
                    }`}
            />
        </button>
    );
}