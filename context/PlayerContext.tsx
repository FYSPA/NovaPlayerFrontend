"use client";
import { createContext, useContext, ReactNode } from "react";
// Importamos el hook y la interfaz (ajusta la ruta según donde lo guardes)
import { useSpotifyPlayer, Track } from "@/hooks/useSpotifyPlayer"; 

interface PlayerContextType {
    currentTrack: Track | null;
    isPlaying: boolean;
    isActive: boolean;
    togglePlay: () => void;
    nextTrack: () => void;
    prevTrack: () => void;
    playSong: (uris: string[], contextUri?: string) => void;
    deviceId: string | null;
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
    // TODA la lógica viene del hook
    const playerLogic = useSpotifyPlayer();

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