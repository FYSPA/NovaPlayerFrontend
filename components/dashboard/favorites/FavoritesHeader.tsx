"use client";
import { useEffect, useState, useRef } from "react";
import { Play, Loader2 } from "lucide-react";
import SongCard from "@/components/dashboard/collection/SongCard";
import api from "@/utils/api";
import Image from "next/image";
import useUser from "@/hooks/useUser";
import { usePlayer } from "@/context/PlayerContext";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
    const [tracks, setTracks] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const { user } = useUser();
    const router = useRouter();
    const { playSong } = usePlayer(); 

    const fetchTracks = async (offset: number) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            setIsLoading(true);
            const { data } = await api.get(`/spotify/saved-tracks?offset=${offset}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // --- PROTECCIÓN DE DATOS (BLINDAJE) ---
            // Verificamos que 'data.items' exista y sea un Array antes de intentar leerlo.
            if (data && data.items && Array.isArray(data.items)) {
                
                if (data.items.length > 0) {
                    setTracks((prev) => {
                        const newTracks = [...prev, ...data.items];
                        // Filtramos duplicados por ID para evitar errores de claves en React
                        return Array.from(new Map(newTracks.map(item => [item.track.id, item])).values());
                    });
                }

                // Si devuelve menos de 50, llegamos al final
                if (data.items.length < 50) {
                    setHasMore(false);
                }

            } else {
                // Si la respuesta no tiene el formato esperado, detenemos la paginación para evitar bucles
                console.warn("Respuesta inesperada de API Favoritos:", data);
                setHasMore(false);
            }

        } catch (error: any) {
            console.error("Error cargando favoritos", error);

            // CORRECCIÓN ERROR 401
            if (error.response && error.response.status === 401) {
                console.error("Token vencido, redirigiendo...");
                localStorage.removeItem("token");
                router.push("/");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTracks(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const currentElement = loadMoreRef.current;
        if (isLoading || !hasMore) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                fetchTracks(tracks.length);
            }
        }, { threshold: 0.5 });

        if (currentElement) observerRef.current.observe(currentElement);
        return () => { if (observerRef.current) observerRef.current.disconnect(); };
    }, [tracks.length, isLoading, hasMore]);

    // --- PLAY GLOBAL (Botón Verde) ---
    const handlePlayAll = () => {
        if (tracks.length === 0) return;
        const firstTrack = tracks[0].track;
        // Creamos la cola con las primeras 50 canciones para no saturar la petición
        const queue = tracks.slice(0, 50).map(t => t.track.uri);
        playSong(firstTrack.uri, undefined, queue);
    };

    if (!user) return null;

    return (
        <div className="flex flex-col pb-20 text-white font-saira">
            {/* HEADER */}
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
                <button 
                    onClick={handlePlayAll}
                    className="bg-green-500 rounded-full p-4 hover:scale-105 transition text-black shadow-lg"
                >
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

                        // CALCULAMOS LA COLA PARA ESTA FILA
                        // Enviamos la canción actual + las siguientes 50
                        const queue = tracks
                            .slice(index, index + 50)
                            .map((t) => t.track.uri);

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
                                // Pasamos la cola calculada
                                queue={queue}
                            />
                        );
                    })}
                </div>

                {hasMore && (
                    <div ref={loadMoreRef} className="flex justify-center items-center py-8 w-full h-20">
                        {isLoading && <Loader2 className="animate-spin text-green-500" size={32} />}
                    </div>
                )}

                {!hasMore && tracks.length > 0 && (
                    <p className="text-center text-gray-500 mt-8 mb-10">You've reached the end of your likes.</p>
                )}
            </div>
        </div>
    );
}