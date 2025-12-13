"use client";

import { useEffect, useState } from "react";
import PlaylistCard from "@/components/dashboard/collection/PlaylistCard";
import SongCard from "@/components/dashboard/collection/SongCard"; 
import api from "@/utils/api";
import useUser from "@/hooks/useUser"
import { usePlayer } from "@/context/PlayerContext";
import { usePlaylist } from "@/hooks/usePlaylist";


interface PlaylistViewClientProps {
    playlistId: string;
}

export default function PlaylistViewClient({ playlistId }: PlaylistViewClientProps) {
    const { playlistData, loading } = usePlaylist(playlistId);
    
    const { user } = useUser();
    const { playSong } = usePlayer();

    const handlePlayTrack = (trackUri: string) => {
       playSong([trackUri], `spotify:playlist:${playlistId}`);
    };

    if (loading) return <div className="text-white p-10">Cargando...</div>;
    if (!playlistData) return <div className="text-white p-10">No encontrada</div>;

    let ownerImage = null;
    if (user && playlistData.owner.id === user.spotifyId) {
        ownerImage = user.image; 
    } else {
        ownerImage = playlistData.owner.images?.[0]?.url;
    }
    

    // --- CONTEXT URI PARA PLAYLIST ---
    const contextUri = `spotify:playlist:${playlistData.id}`;

    return (
        <div className="pb-20"> 
            <PlaylistCard
                id={playlistData.id}
                title={playlistData.name}
                cover={playlistData.images?.[0]?.url}
                author={playlistData.owner.display_name}
                description={playlistData.description || ""}
                authorImg={ownerImage}
            />

            <div className="px-6 mt-6 flex flex-col gap-1">
                <div className="flex w-full text-gray-400 text-sm border-b border-gray-700 pb-2 px-4 mb-2">
                    <span className="w-10">#</span>
                    <span className="flex-1">Title</span>
                    <span className="w-1/3 hidden md:block">Album</span>
                    <span className="w-20 text-right">Time</span>
                </div>

                {playlistData.tracks.items.map((item: any, index: number) => {
                    const track = item.track;
                    if (!track) return null; 

                    return (
                        <SongCard
                            key={track.id + index}
                            index={index + 1}
                            image={track.album.images[2]?.url || track.album.images[0]?.url}
                            name={track.name}
                            artistName={track.artists?.map((a: any) => a.name).join(", ") || "Desconocido"}
                            artistId={track.artists?.[0]?.id || ""}
                            uri={track.uri}
                            trackId={track.id}
                            album={track.album.name}
                            duration={track.duration_ms}
                             onPlay={() => handlePlayTrack(track.uri)}
                            contextUri={contextUri}
                        />
                    );
                })}
            </div>
        </div>
    );
}