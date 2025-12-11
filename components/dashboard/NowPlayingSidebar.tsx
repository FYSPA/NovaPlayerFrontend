"use client";
import { useEffect, useState, useRef } from "react";
import { Music, Image as ImageIcon, MonitorPlay } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";
import api from "@/utils/api";

export default function NowPlayingSidebar() {
    const { currentTrack } = usePlayer();

    const [videoId, setVideoId] = useState<string | null>(null);
    const [artistInfo, setArtistInfo] = useState<any>(null);
    const [isFollowing, setIsFollowing] = useState(false);

    const [showVideo, setShowVideo] = useState(true);
    const [iframeLoaded, setIframeLoaded] = useState(false);

    const abortController = useRef<AbortController | null>(null);
    const lastTrackId = useRef<string>("");

    useEffect(() => {
        if (!currentTrack) return;
        const trackIdentifier = currentTrack.id || currentTrack.uri || currentTrack.name;

        if (trackIdentifier === lastTrackId.current) return;

        lastTrackId.current = trackIdentifier;
        setIframeLoaded(false);
        setShowVideo(true);

        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            if (abortController.current) abortController.current.abort();
            abortController.current = new AbortController();

            const artistName = currentTrack.artists[0].name;
            const trackName = currentTrack.name;
            const artistId = currentTrack.artists[0].id || (currentTrack.artists[0] as any).uri?.split(':')[2];

            try {
                const query = `${trackName} ${artistName} official video`;
                const { data } = await api.get(`/spotify/video?q=${encodeURIComponent(query)}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    signal: abortController.current.signal
                });

                if (data?.videoId) setVideoId(data.videoId);
                else setVideoId(null);

                if (artistId) {
                    const [infoRes, followRes] = await Promise.all([
                        api.get(`/spotify/artist/${artistId}`, { headers: { Authorization: `Bearer ${token}` } }),
                        api.get(`/spotify/artist/${artistId}/is-following`, { headers: { Authorization: `Bearer ${token}` } })
                    ]);
                    setArtistInfo(infoRes.data);
                    setIsFollowing(followRes.data);
                }
            } catch (error: any) {
                if (error.name !== "CanceledError") console.error("Error sidebar", error);
            }
        };
        fetchData();
    }, [currentTrack?.id, currentTrack?.name, currentTrack?.uri]);

    const handleFollow = async () => {
        const token = localStorage.getItem("token");
        const artistId = artistInfo?.id;
        if (!token || !artistId) return;
        const newState = !isFollowing;
        setIsFollowing(newState);
        try {
            if (newState) await api.put(`/spotify/artist/${artistId}/follow`, {}, { headers: { Authorization: `Bearer ${token}` } });
            else await api.delete(`/spotify/artist/${artistId}/follow`, { headers: { Authorization: `Bearer ${token}` } });
        } catch (e) { setIsFollowing(!newState); }
    };

    const formatNumber = (num: number) => new Intl.NumberFormat("es-ES").format(num);

    if (!currentTrack) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4 p-4 text-center bg-[#121212]">
                <div className="w-16 h-16 bg-[#1f1f1f] rounded-lg flex items-center justify-center"><Music size={32} /></div>
                <p>Play music to get started.</p>
            </div>
        );
    }

    const albumCover = currentTrack.album.images[0]?.url;
    const artistImage = artistInfo?.images?.[0]?.url || albumCover;
    const artistName = currentTrack.artists[0].name;
    const artistId = artistInfo?.id;

    const youtubeSrc = videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&disablekb=1&fs=0&loop=1&playlist=${videoId}&playsinline=1&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&html5=1&vq=hd1080`
        : "";

    return (
        // CONTENEDOR PRINCIPAL
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#121212] shadow-xl group h-full">

            {/* 1. CAPA DE FONDO (Z-0) */}
            <div className="absolute top-0 left-0 w-full h-[60%] z-0 bg-black overflow-hidden">
                <div className="absolute inset-0 w-full h-full z-0">
                    <Image src={albumCover || "/placeholder.png"} alt="Cover" fill className="object-cover" priority />
                </div>

                {videoId && showVideo && (
                    <div className={`absolute inset-0 w-full h-full pointer-events-none z-10 transition-opacity duration-1000 ease-in-out ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="relative w-full h-full overflow-hidden">
                            <iframe
                                key={videoId}
                                src={youtubeSrc}
                                title="Background Video"
                                loading="eager"
                                className="absolute top-1/2 left-1/2 w-[500%] h-[200%] -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                onLoad={() => setIframeLoaded(true)}
                            />
                        </div>
                    </div>
                )}
                <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-[#121212]/30 to-[#121212]"></div>
            </div>

            {/* 2. CAPA DE CONTENIDO/SCROLL (Z-20) */}
            <div className="absolute inset-0 z-20 overflow-y-auto custom-scrollbar">
                <div className="h-[45%] w-full bg-transparent"></div>
                <div className="relative flex flex-col px-6 pb-6 gap-6 bg-gradient-to-b from-transparent via-[#121212] to-[#121212]">
                    <div className="flex flex-col gap-3 pt-4">
                        <Link href={artistId ? `/dashboard/artist/${artistId}` : "#"}>
                            <h2 className="font-bold text-white text-4xl leading-tight drop-shadow-lg hover:underline cursor-pointer">{currentTrack.name}</h2>
                        </Link>

                        <Link href={artistId ? `/dashboard/artist/${artistId}` : "#"}>
                            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-lg border border-white/10">
                                    <Image src={artistImage || "/placeholder.png"} alt="Artist" fill className="object-cover" />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Artist</span>
                                    <span className="font-bold text-white text-base leading-none">{artistName}</span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="w-full bg-[#1A1A1A] rounded-xl overflow-hidden p-1 shadow-inner">
                        <Link href={artistId ? `/dashboard/artist/${artistId}` : "#"}>
                            <div className="relative overflow-hidden rounded-lg group/card cursor-pointer h-40">
                                <Image src={artistImage || albumCover || "/placeholder.png"} alt="Promo" fill className="object-cover opacity-60 group-hover/card:opacity-100 transition-opacity duration-500 hover:scale-105" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                                    <span className="text-white px-4 py-2 rounded-full font-bold text-sm border border-white">See profile</span>
                                </div>
                            </div>
                        </Link>
                        <div className="p-4">
                            <h3 className="text-white font-bold mb-1">{artistName}</h3>
                            <div className="flex items-center justify-between pb-4">
                                <span className="text-gray-400 text-sm">{artistInfo ? formatNumber(artistInfo.followers.total) : "..."} followers</span>
                                <button onClick={handleFollow} className={`font-bold px-4 py-1.5 rounded-full text-xs transition flex items-center gap-2 ${isFollowing ? "border border-gray-500 text-white hover:border-white bg-transparent" : "bg-white text-black hover:scale-105"}`}>{isFollowing ? "Siguiendo" : "Seguir"}</button>
                            </div>
                            <p className="text-gray-400 text-xs line-clamp-3">Listening to {artistName} in NovaPlayer.</p>
                        </div>
                    </div>
                    <div className="h-10"></div>
                </div>
            </div>

            {/* 3. BOTÓN FLOTANTE (Z-50) */}
            {/* CORRECCIÓN: Ahora está FUERA de las capas z-0 y z-20, y tiene z-50. Es clickeable siempre. */}
            {videoId && (
                <div className="absolute top-4 right-4 z-50">
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevenir cualquier propagación rara
                            setShowVideo(!showVideo);
                        }}
                        className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white/80 hover:text-white transition-all duration-300 border border-white/10 hover:scale-105 shadow-lg active:scale-95 group/btn cursor-pointer"
                        title={showVideo ? "Ver portada" : "Ver video"}
                    >
                        {showVideo ? (
                            <ImageIcon size={20} className="drop-shadow-md" />
                        ) : (
                            <MonitorPlay size={20} className="drop-shadow-md" />
                        )}
                    </button>
                </div>
            )}

        </div>
    );
}