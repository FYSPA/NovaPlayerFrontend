"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PlaylistCard from "@/components/dashboard/collection/PlaylistCard";
import SongCard from "@/components/dashboard/collection/SongCard";
import api from "@/utils/api";
import { usePlayer } from "@/context/PlayerContext";
import { useAlbum } from "@/hooks/useAlbum";

export default function AlbumPage() {
    const params = useParams();
    const albumId = params.id as string;

    const { album, loading } = useAlbum(albumId);
    const { playSong } = usePlayer();

    // Función para reproducir el álbum
    const handlePlayTrack = (trackUri: string) => {
        // Al ser álbum, usamos contexto + offset (array de 1 elemento)
        playSong([trackUri], `spotify:album:${albumId}`);
    };

    if (loading) return <div className="text-white p-10">Cargando álbum...</div>;
    if (!album) return <div className="text-white p-10">Álbum no encontrado</div>;

    return (
        <div className="pb-20 font-saira">
            {/* 1. HEADER */}
            <PlaylistCard
                id={album.id}
                title={album.name}
                cover={album.images?.[0]?.url}
                author={album.artists?.map((a: any) => a.name).join(", ")} 
                description={`Álbum • ${album.release_date?.split('-')[0]} • ${album.total_tracks} canciones`}
                
                // CORRECCIÓN: Pasamos null explícitamente (ahora PlaylistCard lo acepta)
                authorImg={null} 
            />

            {/* 2. LISTA DE CANCIONES */}
            <div className="px-6 mt-6 flex flex-col gap-1">
                <div className="flex w-full text-gray-400 text-sm border-b border-gray-700 pb-2 px-4 mb-2">
                    <span className="w-10">#</span>
                    <span className="flex-1">Title</span>
                    <span className="w-20 text-right">Time</span>
                </div>

                {album.tracks.items.map((track: any, index: number) => {
                    return (
                        <SongCard
                            key={track.id}
                            index={index + 1}
                            // Usamos la imagen del álbum porque los tracks de álbum no tienen imagen propia
                            image={album.images?.[2]?.url || album.images?.[0]?.url}
                            
                            name={track.name}
                            
                            // Validamos artistas con ?.
                            artistName={track.artists?.map((a: any) => a.name).join(", ") || "Artista"}
                            artistId={track.artists?.[0]?.id || ""}
                            
                            // CORRECCIÓN: Pasamos el uri que faltaba
                            uri={track.uri} 
                            
                            trackId={track.id}
                            album={album.name}
                            duration={track.duration_ms}
                            
                            // CORRECCIÓN: Pasamos la función onPlay
                            onPlay={() => handlePlayTrack(track.uri)}
                        />
                    );
                })}
            </div>
        </div>
    );
}