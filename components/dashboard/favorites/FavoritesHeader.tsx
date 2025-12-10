"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { Play, Loader2 } from "lucide-react";
import SongCard from "@/components/dashboard/collection/SongCard";
import api from "@/utils/api";
import Image from "next/image";
import useUser from "@/hooks/useUser";

export default function FavoritesPage() {
    const [tracks, setTracks] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Referencia para el observador
    const observerRef = useRef<IntersectionObserver | null>(null);
    // Referencia al elemento HTML invisible del final
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const { user } = useUser();

    // --- FUNCIÓN PARA CARGAR CANCIONES ---
    const fetchTracks = async (offset: number) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            setIsLoading(true);
            console.log(`Cargando desde ${offset}...`); // Debug

            const { data } = await api.get(`/spotify/saved-tracks?offset=${offset}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Si devuelve canciones, las agregamos
            if (data.items.length > 0) {
                setTracks((prev) => {
                    // Evitamos duplicados por si acaso React monta doble
                    const newTracks = [...prev, ...data.items];
                    // Un truco sucio pero efectivo para filtrar duplicados por ID
                    return Array.from(new Map(newTracks.map(item => [item.track.id, item])).values());
                });
            }

            // Si devolvió menos de 50, se acabó la lista
            if (data.items.length < 50) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error cargando favoritos", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 1. CARGA INICIAL
    useEffect(() => {
        fetchTracks(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 2. OBSERVADOR DE SCROLL (Lógica corregida)
    useEffect(() => {
        const currentElement = loadMoreRef.current;

        if (isLoading) return; // Si ya carga, no observar
        if (!hasMore) return;  // Si no hay más, no observar

        // Desconectar observador previo si existe
        if (observerRef.current) observerRef.current.disconnect();

        // Crear nuevo observador
        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                // AQUÍ ESTÁ EL TRUCO: Usamos tracks.length como offset
                console.log("¡Llegaste al fondo! Cargando más...");
                fetchTracks(tracks.length);
            }
        }, { threshold: 0.5 }); // 0.5 significa "cuando se vea la mitad del spinner"

        if (currentElement) {
            observerRef.current.observe(currentElement);
        }

        // Limpieza
        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [tracks.length, isLoading, hasMore]); // Se recrea cada vez que cambia la lista

    if (!user) return null;

    return (
        <div className="flex flex-col pb-20 text-white font-saira">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row gap-6 items-end px-6 pt-6">
                <div className="w-56 h-56 min-w-[224px] bg-gradient-to-br from-[#450af5] to-[#c4efd9] flex items-center justify-center rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                    <span className="text-white text-9xl">♥</span>
                </div>
                <div className="flex flex-col justify-end">
                    <span className="text-sm font-bold uppercase mb-2">Playlist</span>
                    <h1 className="text-5xl md:text-8xl font-black mb-6">Liked Songs</h1>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-green-500">
                            {user.image ? (
                                <Image src={user.image} alt={user.name} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-700 flex items-center justify-center text-xs">{user.name?.charAt(0)}</div>
                            )}
                        </div>
                        <span className="font-bold">{user.name}</span>
                        <span className="w-1 h-1 bg-white rounded-full mx-1"></span>
                        <span>{tracks.length} songs</span>
                    </div>
                </div>
            </div>

            {/* BOTONES */}
            <div className="flex items-center gap-4 px-6 mt-6 mb-6">
                <button className="bg-green-500 rounded-full p-4 hover:scale-105 transition text-black shadow-lg">
                    <Play size={28} fill="black" className="ml-1" />
                </button>
            </div>

            {/* LISTA */}
            <div className="px-6">
                <div className="flex w-full text-gray-400 text-sm border-b border-gray-700 pb-2 px-4 mb-2">
                    <span className="w-10">#</span>
                    <span className="flex-1">Title</span>
                    <span className="w-1/3 hidden md:block">Album</span>
                    <span className="w-20 text-right">Time</span>
                </div>

                <div className="flex flex-col">
                    {tracks.map((item, index) => {
                        const track = item.track;
                        if (!track) return null;
                        return (
                            <SongCard
                                key={`${track.id}-${index}`}
                                index={index + 1}
                                image={track.album.images[2]?.url || track.album.images[0]?.url}
                                name={track.name}
                                artistName={track.artists?.map((a: any) => a.name).join(", ") || "Desconocido"}
                                artistId={track.artists?.[0]?.id || ""}
                                uri={track.uri}
                                trackId={track.id}
                                album={track.album.name}
                                duration={track.duration_ms}
                            />
                        );
                    })}
                </div>

                {/* --- ELEMENTO OBSERVADO (EL TRIGGER) --- */}
                {hasMore && (
                    <div
                        ref={loadMoreRef}
                        className="flex justify-center items-center py-8 w-full h-20"
                    >
                        {isLoading && <Loader2 className="animate-spin text-green-500" size={32} />}
                    </div>
                )}

                {!hasMore && tracks.length > 0 && (
                    <p className="text-center text-gray-500 mt-8 mb-10">Has llegado al final de tus favoritos.</p>
                )}
            </div>
        </div>
    );
}