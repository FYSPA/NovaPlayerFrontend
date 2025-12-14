"use client";
import { useEffect, useState, useRef } from "react";
import { Play, Loader2 } from "lucide-react";
import SongCard from "@/components/dashboard/collection/SongCard";
import api from "@/utils/api";
import Image from "next/image";
import useUser from "@/hooks/useUser";
import { usePlayer } from "@/context/PlayerContext";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/hooks/useFavorites";

export default function FavoritesPage() {
    const { tracks, hasMore, isLoading, loadMore } = useFavorites();
    
    const { user } = useUser();
    const { playSong } = usePlayer();

    // Refs para el scroll infinito (Esto se queda en la UI porque es del DOM)
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const handlePlayTrack = (startIndex: number) => {
        const rawQueue = tracks.slice(startIndex, startIndex + 50);
        const queue = rawQueue.map(item => item.track.uri);
        if (queue.length <= 1) {
            console.error("⚠️ ALERTA: La lista de 'tracks' parece vacía o el índice está mal.", tracks);
        }
        playSong(queue); 
    };

    const handlePlayAll = () => {
        if (tracks.length === 0) return;
        handlePlayTrack(0);
    };

    // Observer simplificado (solo llama a loadMore)
    useEffect(() => {
        const currentElement = loadMoreRef.current;
        if (isLoading || !hasMore) return;
        
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMore(); // <--- Llamamos a la función del hook
            }
        }, { threshold: 0.5 });

        if (currentElement) observerRef.current.observe(currentElement);
        return () => { if (observerRef.current) observerRef.current.disconnect(); };
    }, [tracks.length, isLoading, hasMore, loadMore]);

    if (!user) return null;


    return (
        <div className="flex flex-col pb-40 text-white font-saira"> 
            {/* Nota: aumenté pb-20 a pb-40 para asegurar que el Player móvil no tape el final */}

            {/* --- HEADER CORREGIDO --- */}
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-end px-6 pt-6">
                
                {/* 1. CAJA DEL CORAZÓN (Ahora responsiva) */}
                {/* w-48 en móvil, w-56 en escritorio. Sombra fuerte. */}
                <div className="w-48 h-48 md:w-56 md:h-56 flex-shrink-0 bg-gradient-to-br from-[#450af5] to-[#c4efd9] flex items-center justify-center rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                    <span className="text-white text-7xl md:text-9xl">♥</span>
                </div>

                {/* 2. TEXTOS (Centrados en móvil, izquierda en PC) */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left justify-end flex-1">
                    <span className="text-sm font-bold uppercase mb-2">Playlist</span>
                    
                    {/* Título más pequeño en móvil para que no se rompa */}
                    <h1 className="text-4xl md:text-8xl font-black mb-4 md:mb-6 leading-tight">
                        Liked Songs
                    </h1>
                    
                    <div className="flex items-center gap-2 text-sm">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-green-500">
                            {user.image ? (
                                <Image src={user.image} alt={user.name} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-700 flex items-center justify-center text-xs">{user.name?.charAt(0)}</div>
                            )}
                        </div>
                        <span className="font-bold">{user.name}</span>
                        {/* El punto separador lo ocultamos en móvil si queda muy apretado, o lo dejamos */}
                        <span className="w-1 h-1 bg-white rounded-full mx-1"></span>
                        <span>{tracks.length} songs</span>
                    </div>
                </div>
            </div>

            {/* BOTONES */}
            <div className="flex items-center justify-center md:justify-start gap-4 px-6 mt-6 mb-6">
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

                        // OJO: Tu lógica de queue estaba bien, la mantengo
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
                                // Aquí tenías un pequeño bug en onPlay, la función handlePlayTrack esperaba un index, no uri
                                // Si tu handlePlayTrack espera index:
                                onPlay={() => handlePlayTrack(index)} 
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