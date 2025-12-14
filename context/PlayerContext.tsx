"use client";
import { createContext, useContext, ReactNode } from "react";
// IMPORTANTE: Importamos el hook que SÍ tiene los logs y la lógica arreglada
import { useSpotifyPlayer, Track } from "@/hooks/useSpotifyPlayer"; 

// Definimos la forma de los datos
interface PlayerContextType {
    currentTrack: Track | null;
    isPlaying: boolean;
    isActive: boolean;
    deviceId: string | null;
    togglePlay: () => void;
    nextTrack: () => void;
    prevTrack: () => void;
    playSong: (uris: string[], contextUri?: string) => void;
    position: number;
    duration: number;
    seek: (ms: number) => void;
    volume: number;
    changeVolume: (volume: number) => void;
    isSaved: boolean;
    toggleSave: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
    // 1. Ejecutamos el hook MAESTRO que tiene toda la lógica
    const playerLogic = useSpotifyPlayer();

    // 2. Pasamos todo hacia abajo a la aplicación
    return (
        <PlayerContext.Provider value={playerLogic}>
            {children}
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) throw new Error("usePlayer debe usarse dentro de PlayerProvider");
    return context;
};