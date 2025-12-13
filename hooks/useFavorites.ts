import { useState, useEffect, useCallback } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";

export function useFavorites() {
    const [tracks, setTracks] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const fetchTracks = useCallback(async (offset: number) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            setIsLoading(true);
            const { data } = await api.get(`/spotify/saved-tracks?offset=${offset}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data && data.items && Array.isArray(data.items)) {
                if (data.items.length > 0) {
                    setTracks((prev) => {
                        // Lógica de filtrado de duplicados encapsulada aquí
                        const newTracks = offset === 0 ? data.items : [...prev, ...data.items];
                        return Array.from(new Map(newTracks.map((item: any) => [item.track.id, item])).values());
                    });
                }
                // Si devuelve menos de 50, llegamos al final
                if (data.items.length < 50) setHasMore(false);
            } else {
                setHasMore(false);
            }
        } catch (error: any) {
            console.error("Error cargando favoritos", error);
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                router.push("/");
            }
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    // Carga inicial
    useEffect(() => {
        fetchTracks(0);
    }, [fetchTracks]);

    // Función pública para pedir más
    const loadMore = () => {
        if (!isLoading && hasMore) {
            fetchTracks(tracks.length);
        }
    };

    return { tracks, hasMore, isLoading, loadMore };
}