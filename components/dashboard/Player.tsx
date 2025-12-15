"use client";
import { Play, Pause, SkipBack, SkipForward, Volume2, Check, AudioLines, VolumeX, Volume1, Heart } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import Image from "next/image";
import Link from "next/link";

interface PlayerProps {
    toggleRightSidebar: () => void;
    isRightSidebarOpen: boolean;
}

export default function Player({ toggleRightSidebar, isRightSidebarOpen }: PlayerProps) {
    const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack, position, duration, seek, volume, changeVolume, isSaved, toggleSave } = usePlayer();

    const progressPercent = duration ? (position / duration) * 100 : 0;

    const formatTime = (ms: number) => {
        if (!ms) return "0:00";
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!duration) return;
        const width = e.currentTarget.clientWidth;
        const clickX = e.nativeEvent.offsetX;
        const newTime = (clickX / width) * duration;
        seek(Math.floor(newTime));
    };

    const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const width = e.currentTarget.clientWidth;
        const clickX = e.nativeEvent.offsetX;
        const newVolume = (clickX / width) * 100;
        changeVolume(newVolume);
    };

    const VolumeIcon = () => {
        if (volume === 0) return <VolumeX size={20} className="text-gray-400" />;
        if (volume < 50) return <Volume1 size={20} className="text-gray-400" />;
        return <Volume2 size={20} className="text-gray-400" />;
    };

    const getArtistId = () => {
        if (!currentTrack || !currentTrack.artists || currentTrack.artists.length === 0) return null;
        const artist = currentTrack.artists[0];
        if (artist.id) return artist.id;
        if (artist.uri) return artist.uri.split(':')[2];
        return null;
    };

    const artistId = getArtistId();

    if (!currentTrack) {
        return (
            <div className="w-full h-full flex items-center justify-center px-4 bg-[#090909] text-gray-500 border-t border-[#282828] text-sm">
                Select a song to play
            </div>
        );
    }

    return (
        <div className="relative w-full h-20 md:h-24 bg-[#090909] border-t border-[#282828] overflow-hidden group shadow-2xl z-50">

            {/* --- FONDO BLURREADO --- */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="relative w-full h-full opacity-20">
                    <Image
                        src={currentTrack.album.images[0].url}
                        alt="Background"
                        fill
                        className="object-cover blur-xl scale-110"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/80 to-transparent"></div>
            </div>

            {/* --- BARRA DE PROGRESO MÓVIL (Solo visible en pantallas pequeñas, pegada arriba) --- */}
            <div 
                className="absolute top-0 left-0 w-full h-[2px] bg-gray-800 md:hidden z-50 cursor-pointer"
                onClick={handleSeek}
            >
                <div 
                    className="h-full bg-green-500 transition-all duration-100 ease-linear"
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>

            <div className="relative z-10 w-full h-full flex items-center justify-between px-4 text-white">

                {/* --- SECCIÓN 1: INFO TRACK (Izquierda) --- */}
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                    {/* Imagen: Más pequeña en móvil */}
                    <div className="relative w-10 h-10 md:w-14 md:h-14 bg-gray-800 rounded-md shadow-lg overflow-hidden flex-shrink-0">
                        <Image src={currentTrack.album.images[0].url} alt="Cover" fill className="object-cover" />
                    </div>
                    
                    {/* Texto: Ahora visible en móvil, pero truncado */}
                    <div className="flex flex-col justify-center min-w-0">
                        <h4 className="text-sm font-bold truncate pr-2 md:text-base text-white drop-shadow-sm leading-tight">
                            {currentTrack.name}
                        </h4>
                        <div className="text-xs text-gray-400 truncate hover:text-white transition-colors">
                            {artistId ? (
                                <Link href={`/dashboard/artist/${artistId}`}>
                                    {currentTrack.artists.map(a => a.name).join(', ')}
                                </Link>
                            ) : (
                                <span>{currentTrack.artists.map(a => a.name).join(', ')}</span>
                            )}
                        </div>
                    </div>

                    {/* Botón Like: Oculto en móviles muy pequeños si quieres, o visible */}
                    <button
                        onClick={toggleSave}
                        className={`hidden sm:block ml-2 transition p-1.5 rounded-full hover:bg-white/10 ${isSaved ? "text-green-500" : "text-gray-400"}`}
                    >
                        {isSaved ? <Check size={18} /> : <Heart size={18} />}
                    </button>
                </div>

                {/* --- SECCIÓN 2: CONTROLES MÓVIL (Solo visible < md) --- */}
                <div className="flex md:hidden items-center gap-3">
                    <button 
                        onClick={toggleSave}
                        className={`text-gray-300 ${isSaved ? 'text-green-500' : ''}`}
                    >
                         {isSaved ? <Check size={20} /> : <Heart size={20} />}
                    </button>
                    <button onClick={togglePlay} className="text-white p-2">
                        {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
                    </button>
                    {/* El botón next es opcional en móvil si hay poco espacio, pero suele ser útil */}
                    <button onClick={nextTrack} className="text-gray-300">
                        <SkipForward size={24} />
                    </button>
                </div>


                {/* --- SECCIÓN 3: CONTROLES DESKTOP (Centro - Solo visible >= md) --- */}
                <div className="hidden md:flex flex-col items-center gap-1 w-1/3 max-w-[40%]">
                    <div className="flex items-center gap-6">
                        <button onClick={prevTrack} className="text-gray-400 hover:text-white transition active:scale-95"><SkipBack size={20} /></button>
                        <button 
                            onClick={togglePlay} 
                            className="bg-white text-black rounded-full p-2 hover:scale-105 transition shadow-lg flex items-center justify-center w-8 h-8"
                        >
                            {isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" className="ml-0.5" />}
                        </button>
                        <button onClick={nextTrack} className="text-gray-400 hover:text-white transition active:scale-95"><SkipForward size={20} /></button>
                    </div>

                    {/* Barra de Progreso Desktop */}
                    <div className="w-full flex items-center gap-2 text-xs font-mono text-gray-400">
                        <span className="min-w-[40px] text-right">{formatTime(position)}</span>
                        <div
                            className="flex-1 h-1 rounded-full cursor-pointer group/progress relative py-2" // py-2 aumenta el área de click
                            onClick={handleSeek}
                        >
                            {/* Línea base */}
                            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-gray-900 rounded-full"></div>
                            {/* Línea progreso */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-white rounded-full group-hover/progress:bg-green-500 transition-all"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                            {/* Bolita (Thumb) */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full shadow opacity-0 group-hover/progress:opacity-100 transition-opacity ml-[-6px]"
                                style={{ left: `${progressPercent}%` }}
                            ></div>
                        </div>
                        <span className="min-w-[40px]">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* --- SECCIÓN 4: VOLUMEN & EXTRAS (Derecha - Solo visible >= md) --- */}
                <div className="hidden md:flex items-center justify-end gap-3 w-1/3">
                    <button onClick={toggleRightSidebar} className={`hover:text-white transition ${isRightSidebarOpen ? "text-green-500" : "text-gray-400"}`}>
                        <AudioLines size={18} />
                    </button>
                    
                    <div className="flex items-center gap-2 group/vol">
                        <button onClick={() => changeVolume(volume === 0 ? 50 : 0)} className="text-gray-400 hover:text-white">
                            <VolumeIcon />
                        </button>
                        <div
                            className="w-20 h-1 rounded-full cursor-pointer relative py-2"
                            onClick={handleVolumeClick}
                        >
                             <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-gray-600/50 rounded-full"></div>
                            <div
                                className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-gray-300 rounded-full group-hover/vol:bg-green-500"
                                style={{ width: `${volume}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}