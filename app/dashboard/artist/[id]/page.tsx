"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Play, MoreHorizontal, Check } from "lucide-react";
import Image from "next/image";
import api from "@/utils/api";
import { usePlayer } from "@/context/PlayerContext";
import LikeButton from "@/components/LikedButton";

interface Artist {
    id: string;
    name: string;
    images: { url: string }[];
    followers: { total: number };
    genres: string[];
}

export default function ArtistDynamicPage() {
    const params = useParams();
    const artistId = params.id as string;

    const [artist, setArtist] = useState<Artist | null>(null);
    const [topTracks, setTopTracks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    // 2. USAR EL HOOK PARA OBTENER LA FUNCIÓN DE REPRODUCIR
    const { playSong } = usePlayer();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token || !artistId) return;

            try {
                const [artistRes, tracksRes, followRes] = await Promise.all([
                    api.get(`/spotify/artist/${artistId}`, { headers: { Authorization: `Bearer ${token}` } }),
                    api.get(`/spotify/artist/${artistId}/top-tracks`, { headers: { Authorization: `Bearer ${token}` } }),
                    api.get(`/spotify/artist/${artistId}/is-following`, { headers: { Authorization: `Bearer ${token}` } })
                ]);

                setArtist(artistRes.data);
                setTopTracks(tracksRes.data);
                setIsFollowing(followRes.data);
            } catch (error) {
                console.error("Error cargando datos", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [artistId]);

    const handleFollowToggle = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        const newState = !isFollowing;
        setIsFollowing(newState);
        try {
            if (newState) {
                await api.put(`/spotify/artist/${artistId}/follow`, {}, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await api.delete(`/spotify/artist/${artistId}/follow`, { headers: { Authorization: `Bearer ${token}` } });
            }
        } catch (error) {
            setIsFollowing(!newState);
            alert("Error al seguir/dejar de seguir.");
        }
    };

    const formatNumber = (num: number) => new Intl.NumberFormat("es-ES").format(num);
    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
    };

    if (loading) return <div className="text-white p-10">Loading artist...</div>;
    if (!artist) return <div className="text-white p-10">Artist not found</div>;

    const bannerImage = artist.images[0]?.url || "/assets/default-artist.jpg";

    return (
        <div className="flex flex-col min-h-full -m-6 pb-20 font-saira">
            {/* HERO SECTION */}
            <div className="relative w-full h-[40vh] min-h-[340px] flex items-end p-8">
                <div className="absolute inset-0 z-0">
                    <Image src={bannerImage} alt={artist.name} fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-white mb-2">
                        <div className="bg-blue-500 rounded-full p-1 w-6 h-6 flex items-center justify-center">
                            <Check size={14} strokeWidth={4} className="text-white" />
                        </div>
                        <span className="text-sm font-medium">Artist Verified</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight drop-shadow-lg">{artist.name}</h1>
                    <p className="text-white font-medium text-lg drop-shadow-md mt-2">{formatNumber(artist.followers.total)} monthly listeners</p>
                </div>
            </div>

            {/* CONTROLES */}
            <div className="p-8 h-full">
                <div className="flex items-center gap-6 mb-8">
                    {/* Botón Grande de Play (Reproduce la primera canción) */}
                    <button
                        onClick={() => topTracks.length > 0 && playSong(topTracks[0].uri)}
                        className="bg-green-500 rounded-full p-4 hover:scale-105 hover:bg-green-400 transition text-black shadow-lg shadow-green-900/20"
                    >
                        <Play size={32} fill="black" className="ml-1" />
                    </button>

                    <button
                        onClick={handleFollowToggle}
                        className={`
                            px-6 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest transition flex items-center gap-2
                            ${isFollowing
                                ? "border border-gray-500 text-white hover:border-white"
                                : "border border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
                            }
                        `}
                    >
                        {isFollowing ? "Following" : "Follow"}
                    </button>

                    <button className="text-gray-400 hover:text-white transition">
                        <MoreHorizontal size={32} />
                    </button>
                </div>

                {/* LISTA DE CANCIONES */}
                <div className="mt-4">
                    <h2 className="text-2xl font-bold text-white mb-6">Populares</h2>

                    <div className="flex flex-col">
                        {topTracks.map((track, index) => (
                            <div
                                key={track.id}
                                // 3. AGREGAR EL EVENTO DOUBLE CLICK AQUÍ
                                onDoubleClick={() => playSong(track.uri)}
                                className="group flex items-center justify-between p-3 rounded-md hover:bg-white/10 transition cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-400 w-4 text-center font-medium group-hover:hidden">{index + 1}</span>

                                    {/* 4. TAMBIÉN AGREGAMOS CLICK AL BOTÓN PEQUEÑO DE PLAY */}
                                    <span
                                        className="w-4 hidden group-hover:block text-white"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Evita conflicto con el div
                                            playSong(track.uri);
                                        }}
                                    >
                                        <Play size={16} fill="white" />
                                    </span>

                                    <div className="relative w-10 h-10 bg-gray-800 rounded overflow-hidden">
                                        <Image
                                            src={track.album.images[2]?.url || track.album.images[0]?.url}
                                            alt="Track"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-white font-medium hover:underline">{track.name}</span>
                                        {track.explicit && (
                                            <span className="bg-gray-400 text-black text-[10px] px-1 rounded w-fit font-bold">E</span>
                                        )}
                                    </div>
                                </div>

                                <span className="text-gray-400 text-sm font-medium hidden md:block">
                                    {track.popularity}% pop
                                </span>

                                <div className="flex items-center gap-4 text-gray-400 text-sm font-medium w-12 justify-end">
                                    <div className="mr-2">
                                        <LikeButton trackId={track.id} />
                                    </div>
                                    <span>{formatDuration(track.duration_ms)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}