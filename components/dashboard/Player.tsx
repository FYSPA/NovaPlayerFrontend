"use client";
import { Play, Pause, SkipBack, SkipForward, Volume2, MicVocal, Check, AudioLines, VolumeX, Volume1 } from "lucide-react";
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

        // Si viene el ID directo (de la API), lo usamos
        if (artist.id) return artist.id;

        // Si viene del SDK, viene como URI "spotify:artist:12345" -> cortamos el string
        if (artist.uri) return artist.uri.split(':')[2];

        return null;
    };

    const artistId = getArtistId();


    if (!currentTrack) {
        return (
            <div className="w-full h-full flex items-center justify-center px-4 bg-[#090909] text-gray-500 border-t border-[#282828]">
                Select a song
            </div>
        );
    }

    return (
        <div className="relative w-full h-full bg-[#090909] border-t border-[#282828] overflow-hidden group">

            {currentTrack && (
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="relative w-[70%] h-full">
                        <Image
                            src={currentTrack.album.images[0].url}
                            alt="Background"
                            fill
                            className="object-cover blur-sm opacity-20"
                        />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-[#090909]/20 via-[#090909]/90 to-[#090909]"></div>
                </div>
            )}

            <div className="relative z-10 w-full h-full flex items-center justify-between px-4 text-white">

                <div className="flex items-center gap-4 w-1/3">
                    <div className="relative w-14 h-14 bg-gray-700 rounded shadow-md overflow-hidden flex-shrink-0">
                        {currentTrack && (
                            <Image src={currentTrack.album.images[0].url} alt="Cover" fill className="object-cover" />
                        )}
                    </div>
                    <div className="hidden sm:block">
                        <h4 className="text-sm font-bold truncate max-w-[150px] drop-shadow-md">{currentTrack.name}</h4>
                        {artistId ? (
                            <Link href={`/dashboard/artist/${artistId}`} className="hover:underline">
                                <p className="text-xs text-gray-400 truncate max-w-[150px]">
                                    {currentTrack.artists.map(a => a.name).join(', ')}
                                </p>
                            </Link>
                        ) : (
                            <p className="text-xs text-gray-400 truncate max-w-[150px]">
                                {currentTrack.artists.map(a => a.name).join(', ')}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={toggleSave}
                        className={`transition p-1 rounded-full ${isSaved
                            ? "text-green-500 hover:text-white"
                            : "text-gray-300 hover:text-white"
                            }`}
                    >
                        <Check size={18} strokeWidth={3} className="drop-shadow-md" />
                    </button>
                </div>

                <div className="flex flex-col items-center gap-2 w-1/3">
                    <div className="flex items-center gap-4 lg:gap-6">
                        <button onClick={prevTrack} className="text-gray-300 hover:text-white transition drop-shadow-md"><SkipBack size={20} /></button>
                        <button onClick={togglePlay} className="bg-white text-black rounded-full p-2 hover:scale-105 transition shadow-lg">
                            {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" />}
                        </button>
                        <button onClick={nextTrack} className="text-gray-300 hover:text-white transition drop-shadow-md"><SkipForward size={20} /></button>
                    </div>

                    <div className="w-full flex items-center gap-2 text-xs font-mono text-gray-300 drop-shadow-md">
                        <span>{formatTime(position)}</span>

                        <div
                            className="flex-1 h-1 bg-gray-600/50 rounded-full cursor-pointer group/progress relative"
                            onClick={handleSeek}
                        >
                            <div
                                className="h-full bg-white rounded-full group-hover/progress:bg-green-500 transition-all shadow"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                            <div
                                className="absolute h-3 w-3 bg-white rounded-full top-1/2 -translate-y-1/2 opacity-0 group-hover/progress:opacity-100 shadow ml-[-6px]"
                                style={{ left: `${progressPercent}%` }}
                            ></div>
                        </div>

                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 w-1/3">
                    <button onClick={toggleRightSidebar} className={`transition-colors hover:text-white drop-shadow-md ${isRightSidebarOpen ? "text-green-500" : "text-gray-300"}`}>
                        <AudioLines size={20} />
                    </button>
                    <button onClick={() => changeVolume(volume === 0 ? 50 : 0)} className="text-gray-300 hover:text-white drop-shadow-md">
                        <VolumeIcon />
                    </button>

                    <div
                        className="w-24 h-1 bg-gray-600/50 rounded-full cursor-pointer overflow-hidden group/volume relative"
                        onClick={handleVolumeClick}
                    >
                        <div
                            className="h-full bg-gray-300 rounded-full group-hover/volume:bg-green-500 transition-all"
                            style={{ width: `${volume}%` }}
                        ></div>
                    </div>
                </div>

            </div>
        </div>
    );
}