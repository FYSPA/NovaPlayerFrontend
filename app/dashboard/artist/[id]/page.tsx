"use client";

import { useParams, useRouter } from "next/navigation";
import { Play, MoreHorizontal, Check, RefreshCcw } from "lucide-react";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import LikeButton from "@/components/dashboard/collection/LikedButton";
import SongCard from "@/components/dashboard/collection/SongCard"; // Asegúrate de importar esto
// 1. IMPORTAMOS NUESTRO NUEVO HOOK
import { useArtist } from "@/hooks/useArtist";

export default function ArtistDynamicPage() {
    const params = useParams();
    const router = useRouter();
    const artistId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : null;

    // 2. USAMOS EL HOOK (Toda la lógica compleja está aquí adentro)
    const { artist, topTracks, isFollowing, loading, error, toggleFollow } = useArtist(artistId);
    
    const { playSong } = usePlayer();

    // --- FUNCIONES PURAMENTE VISUALES O DE EVENTOS ---

    const handlePlayAll = () => {
        if (topTracks.length === 0) return;
        const queue = topTracks.map(t => t.uri);
        playSong(queue);
    };

    const formatNumber = (num: number) => new Intl.NumberFormat("es-ES").format(num);

    // --- RENDERIZADO (IGUAL QUE ANTES) ---

    if (loading) return <div className="flex items-center justify-center h-[60vh] text-white"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div></div>;
    
    if (error || !artist) return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400 gap-4">
            <p className="text-xl text-white font-bold">Artista no encontrado</p>
            <button onClick={() => router.back()} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition">Atrás</button>
        </div>
    );

    const bannerImage = artist.images[0]?.url || "/assets/default-artist.jpg";

    return (
        <div className="flex flex-col min-h-full -m-6 pb-20 font-saira animate-in fade-in duration-500">
            {/* HERO */}
            <div className="relative w-full h-[40vh] min-h-[340px] flex items-end p-8">
                <div className="absolute inset-0 z-0">
                    <Image src={bannerImage} alt={artist.name} fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
                </div>
                <div className="relative z-10 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-white mb-2">
                        <div className="bg-blue-500 rounded-full p-1 w-6 h-6 flex items-center justify-center"><Check size={14} strokeWidth={4} className="text-white" /></div>
                        <span className="text-sm font-medium">Artist Verified</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight drop-shadow-lg">{artist.name}</h1>
                    <p className="text-white font-medium text-lg drop-shadow-md mt-2">{formatNumber(artist.followers.total)} monthly listeners</p>
                </div>
            </div>

            {/* CONTROLES */}
            <div className="p-8 h-full">
                <div className="flex items-center gap-6 mb-8">
                    <button onClick={handlePlayAll} className="bg-green-500 rounded-full p-4 hover:scale-105 transition text-black shadow-lg"><Play size={32} fill="black" className="ml-1" /></button>
                    
                    {/* Botón Follow conectado al Hook */}
                    <button onClick={toggleFollow} className={`px-6 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest transition ${isFollowing ? "border border-gray-500 text-white" : "bg-white text-black"}`}>
                        {isFollowing ? "Following" : "Follow"}
                    </button>
                    
                    <button className="text-gray-400 hover:text-white transition"><MoreHorizontal size={32} /></button>
                </div>

                {/* LISTA */}
                <div className="mt-4">
                    <h2 className="text-2xl font-bold text-white mb-6">Populares</h2>
                    <div className="flex flex-col">
                        {topTracks.map((track, index) => (
                            <SongCard
                                key={track.id}
                                index={index + 1}
                                image={track.album.images[2]?.url || track.album.images[0]?.url}
                                name={track.name}
                                artistName={track.artists?.map((a: any) => a.name).join(", ")}
                                artistId={track.artists?.[0]?.id || ""}
                                uri={track.uri}
                                trackId={track.id}
                                album={track.album.name}
                                duration={track.duration_ms}
                                // Lógica de cola
                                onPlay={() => {
                                    const queue = topTracks.slice(index).map((t: any) => t.uri);
                                    playSong(queue);
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}