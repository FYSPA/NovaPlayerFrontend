"use client";
import { Heart } from "lucide-react";
// Asegúrate de importar desde donde guardaste el hook
import { useTrackLike } from "@/hooks/useTrackLike"; 

export default function LikeButton({ trackId }: { trackId: string }) {
    const { isLiked, loading, toggleLike } = useTrackLike(trackId);

    if (loading) return <div className="w-5 h-5" />; // Placeholder mientras carga

    return (
        <button
            onClick={toggleLike}
            className="hover:scale-110 transition-transform focus:outline-none"
            aria-label={isLiked ? "Remove like" : "Add like"}
        >
            <Heart
                size={20}
                className={`transition-colors ${isLiked
                        ? "fill-green-500 text-green-500" // Verde/Relleno si tiene like
                        : "text-gray-400 hover:text-white" // Gris si no
                    }`}
            />
        </button>
    );
}