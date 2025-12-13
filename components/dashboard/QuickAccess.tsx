"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import api from "@/utils/api";
import { usePlayer } from "@/context/PlayerContext";
import { useRecentHistory } from "@/hooks/useRecentHistory";

export default function QuickAccess() {
    const { items, loading } = useRecentHistory();
    const { playSong } = usePlayer();

    // ... (La función handlePlayItem se queda aquí porque es interacción UI) ...
    const handlePlayItem = (item: any) => {
        if (!item.uri) return;
        const isTrack = item.uri.includes(":track:");
        if (isTrack) playSong([item.uri]); 
        else playSong([], item.uri); 
    };

    return (
        <div className="flex flex-col gap-6">

            {/* FILTROS VISUALES */}
            <div className="flex gap-2">
                <button className="px-4 py-1.5 bg-white text-black text-sm font-medium rounded-full transition hover:scale-105">All</button>
                <button className="px-4 py-1.5 bg-[#2A2A2A] text-white text-sm font-medium rounded-full hover:bg-[#3E3E3E] transition hover:scale-105">Music</button>
                <button className="px-4 py-1.5 bg-[#2A2A2A] text-white text-sm font-medium rounded-full hover:bg-[#3E3E3E] transition hover:scale-105">Podcasts</button>
            </div>

            {/* GRILLA DE 8 ELEMENTOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                {/* 1. LIKED SONGS (Fija) */}
                <QuickCard
                    title="Liked Songs"
                    image={null} 
                    href="/dashboard/favorites"
                    isLikedSongs={true}
                    onPlay={() => window.location.href = "/dashboard/favorites"}
                />

                {/* 2. RECIÉN ESCUCHADOS */}
                {!loading && items.map((item) => {
                    // LÓGICA DE EXTRACCIÓN DE ID SEGURA
                    const id = item.uri.split(':').pop(); 

                    return (
                        <QuickCard
                            key={item.id}
                            title={item.name}
                            image={item.image}
                            
                            // Lógica de Enlaces Mejorada
                            href={
                                item.type === 'playlist' 
                                    ? `/dashboard/collection/${id}` 
                                : item.type === 'artist' 
                                    ? `/dashboard/artist/${id}`
                                : item.type === 'album' 
                                    ? `/dashboard/album/${id}`
                                : "#" // Los álbumes se quedan aquí por ahora
                            }
                            
                            onPlay={() => handlePlayItem(item)}
                        />
                    );
                })}

            </div>
        </div>
    );
}

// --- COMPONENTE CARD ---
function QuickCard({ title, image, href, isLikedSongs = false, onPlay }: any) {
    return (
        <Link
            href={href}
            className="group relative flex items-center rounded-md overflow-hidden transition-all duration-300 pr-4 gap-4 shadow-sm h-16 hover:shadow-md bg-[#2A2A2A]/40 hover:bg-[#2A2A2A]"
        >
            <div className="relative h-16 w-16 flex-shrink-0 shadow-xl">
                {isLikedSongs ? (
                    <div className="w-full h-full bg-gradient-to-br from-[#450af5] to-[#c4efd9] flex items-center justify-center opacity-100">
                        <span className="text-white text-2xl">♥</span>
                    </div>
                ) : (
                    <Image
                        src={image || "/placeholder.png"}
                        alt={title || "Cover"}
                        fill
                        className="object-cover shadow-lg"
                        sizes="64px"
                    />
                )}
            </div>

            <span className="relative z-10 font-bold text-white text-sm line-clamp-2 leading-tight flex-1 pr-8">
                {title}
            </span>

            {/* Botón Play */}
            <div 
                className="absolute right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 shadow-xl rounded-full"
                onClick={(e) => {
                    e.preventDefault(); 
                    e.stopPropagation();
                    if (onPlay) onPlay();
                }}
            >
                <div className="bg-green-500 rounded-full p-2.5 hover:scale-105 hover:bg-green-400 transition text-black cursor-pointer shadow-lg">
                    <Play size={18} fill="black" className="ml-0.5" />
                </div>
            </div>
        </Link>
    )
}