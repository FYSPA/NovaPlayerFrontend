"use client";
import { useEffect, useState, useRef } from "react";
import { Play, Pause, ListMusic } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";
import api from "@/utils/api";

// --- OPTIMIZACIÓN 1: CACHÉ GLOBAL ---
// Esta variable vive fuera del componente. Si desmontas el sidebar y lo vuelves a abrir,
// recordará la última cola descargada para no pedirla de nuevo si la canción no ha cambiado.
let queueCache: { trackId: string; data: any[] } | null = null;

export default function MusicQueueSidebar() {
    const { currentTrack, isPlaying, togglePlay, playSong } = usePlayer();
    
    // Inicializamos el estado con la caché si coincide con la canción actual
    const [queue, setQueue] = useState<any[]>(() => {
        if (currentTrack?.id && queueCache?.trackId === currentTrack.id) {
            return queueCache.data;
        }
        return [];
    });
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!currentTrack || !currentTrack.id) return;

        // Si ya tenemos los datos en caché para ESTA canción, no hacemos nada (Carga instantánea)
        if (queueCache?.trackId === currentTrack.id) {
            setQueue(queueCache.data);
            return;
        }

        // --- OPTIMIZACIÓN 2: ABORT CONTROLLER ---
        // Nos permite cancelar la "intención" de pedir datos si el usuario cambia de canción rápido
        const controller = new AbortController();

        const fetchQueue = async () => {
            // Esperamos un poco para no saturar Spotify si el usuario está haciendo "skip" rápido
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Si el componente se desmontó o cambió la canción durante la espera, paramos aquí.
            if (controller.signal.aborted) return;

            console.log("📥 Pidiendo cola a Spotify...");
            setLoading(true);
            
            try {
                const { data } = await api.get('/spotify/queue');
                
                // Verificamos de nuevo si se canceló antes de actualizar el estado
                if (controller.signal.aborted) return;

                if (data && data.queue) {
                    const cleanQueue = data.queue.filter((t: any) => t).slice(0, 20);
                    
                    setQueue(cleanQueue);
                    
                    // Actualizamos la caché global
                    queueCache = {
                        trackId: currentTrack.id,
                        data: cleanQueue
                    };
                }
            } catch (error) {
                if (!controller.signal.aborted) console.error("Error cola:", error);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        fetchQueue();

        // Función de limpieza: Se ejecuta si currentTrack cambia o el componente muere
        return () => {
            controller.abort(); 
        };

    }, [currentTrack?.id]);

    const handlePlayFromQueue = (uri: string) => {
        playSong([uri]);
    };

    if (!currentTrack) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4 p-4 text-center">
                <ListMusic size={48} opacity={0.5} />
                <p>Play music for the queue.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full px-2">

            {/* SECCIÓN "NOW PLAYING" */}
            <div className="mb-6 mt-4 flex-shrink-0">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Now Playing</h3>

                <div className="relative group w-full aspect-square bg-[#282828] rounded-xl overflow-hidden shadow-2xl mb-4">
                    <Image
                        src={currentTrack.album.images[0]?.url || "/placeholder.png"}
                        alt={currentTrack.name}
                        fill
                        className="object-cover"
                        priority // Prioridad alta para la imagen principal
                        sizes="(max-width: 568px) 30vw, 60px"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                        <button 
                            onClick={togglePlay}
                            className="bg-white p-4 rounded-full text-black hover:scale-110 transition shadow-lg"
                        >
                            {isPlaying ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" className="ml-1" />}
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-start">
                    <div className="flex flex-col min-w-0 pr-2">
                        {/* Enlaces comentados por si no tienes las rutas listas */}
                        {/* <Link href={`/dashboard/album/${currentTrack.album.id}`} className="hover:underline"> */}
                            <h2 className="text-xl font-bold text-white truncate leading-tight mb-1 cursor-default">
                                {currentTrack.name}
                            </h2>
                        {/* </Link> */}
                        <div className="flex flex-wrap gap-1 text-sm text-gray-400">
                            {currentTrack.artists.map((artist, i) => (
                                <span key={i}>
                                    {artist.name}{i < currentTrack.artists.length - 1 ? ", " : ""}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN "NEXT UP" */}
            <div className="flex-1 min-h-0 flex flex-col">
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Next Up</h3>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 -mr-1">
                    <div className="flex flex-col gap-2 pb-4">
                        {loading && queue.length === 0 && <p className="text-gray-500 text-xs text-center py-4">Loading the queue...</p>}
                        
                        {!loading && queue.length === 0 && (
                            <div className="text-center py-4">
                                <p className="text-gray-500 text-sm">The queue is empty.</p>
                                <p className="text-gray-600 text-xs mt-1">Spotify sometimes takes a while to update it.</p>
                            </div>
                        )}

                        {queue.map((track, i) => (
                            <div 
                                key={`${track.id}-${i}`} 
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2A2A2A] group cursor-pointer transition-colors"
                                onClick={() => handlePlayFromQueue(track.uri)}
                            >
                                <div className="relative w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-[#333]">
                                    {track.album?.images?.[0]?.url && (
                                        <Image 
                                            src={track.album.images[0].url} 
                                            fill 
                                            className="object-cover" 
                                            alt={track.name} 
                                            sizes="40px" // Optimización de imagen pequeña
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center">
                                        <Play size={12} fill="white" className="ml-0.5" />
                                    </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-white truncate group-hover:text-green-400 transition">{track.name}</p>
                                    <p className="text-xs text-gray-400 truncate">
                                        {track.artists?.map((a:any) => a.name).join(", ")}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}