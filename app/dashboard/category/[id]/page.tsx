"use client";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Play } from "lucide-react";
import { useCategoryTracks } from "@/hooks/useCategoryTracks"; // <--- Hook nuevo
import SongCard from "@/components/dashboard/collection/SongCard"; // <--- Componente de canción
import { usePlayer } from "@/context/PlayerContext";

export default function CategoryPage() {
    const params = useParams();
    const router = useRouter();
    const categoryId = params.id as string;
    
    // Usamos el hook de tracks
    const { tracks, loading } = useCategoryTracks(categoryId);
    const { playSong } = usePlayer();

    // Función para reproducir todo desde el botón grande
    const playAll = () => {
        if (tracks.length > 0) {
            const uris = tracks.map(t => t.uri);
            playSong(uris);
        }
    };

    // Título formateado (Capitalizado)
    const title = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);

    return (
        <div className="p-8 min-h-full font-saira pb-24">
            {/* HEADER */}
            <div className="flex flex-col gap-6 mb-8">
                <button 
                    onClick={() => router.back()} 
                    className="w-fit bg-black/50 p-2 rounded-full hover:bg-black/80 transition"
                >
                    <ArrowLeft size={24} className="text-white" />
                </button>
                
                <div className="flex items-end justify-between">
                    <div>
                        <span className="text-sm font-bold uppercase tracking-wider text-gray-400">Category Mix</span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mt-2">{title}</h1>
                    </div>
                    
                    {/* Botón Play Grande */}
                    {!loading && tracks.length > 0 && (
                        <button 
                            onClick={playAll}
                            className="bg-green-500 text-black p-4 rounded-full hover:scale-105 hover:bg-green-400 transition shadow-xl mb-2"
                        >
                            <Play fill="black" size={32} />
                        </button>
                    )}
                </div>
            </div>

            {loading && <div className="text-white">Loading songs...</div>}

            {/* LISTA DE CANCIONES */}
            <div className="flex flex-col">
                {!loading && tracks.map((track, index) => (
                    <SongCard
                        key={track.id}
                        index={index + 1}
                        image={track.album.images[2]?.url || track.album.images[0]?.url}
                        name={track.name}
                        artistName={track.artists?.map((a: any) => a.name).join(", ") || "Unknown"}
                        artistId={track.artists?.[0]?.id}
                        uri={track.uri}
                        trackId={track.id}
                        album={track.album.name}
                        duration={track.duration_ms}
                        onPlay={() => playSong([track.uri])} // Play solo esta canción
                    />
                ))}
                
                {!loading && tracks.length === 0 && (
                    <div className="text-gray-400 text-2xl">No songs found for this category.</div>
                )}
            </div>
        </div>
    );
}