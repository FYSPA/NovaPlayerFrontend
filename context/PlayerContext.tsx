"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from "react";
import api from "@/utils/api";

interface Track {
    id: string;
    name: string;
    album: { images: { url: string }[] };
    artists: { name: string; uri: string; id?: string }[];
    uri: string;
}

interface PlayerContextType {
    currentTrack: Track | null;
    isPlaying: boolean;
    isActive: boolean;
    togglePlay: () => void;
    nextTrack: () => void;
    prevTrack: () => void;
    // --- CAMBIO 1: Actualizar firma de playSong ---
    playSong: (uri: string, contextUri?: string, queue?: string[]) => void;
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
    const [player, setPlayer] = useState<any>(null);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const lastUserAction = useRef<number>(0);

    const [volume, setVolume] = useState(50);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const changeVolume = (percent: number) => {
        const newVolume = Math.max(0, Math.min(100, percent));
        setVolume(newVolume);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
            if (!deviceId) return;
            const token = localStorage.getItem("token");
            try {
                await api.put('/spotify/volume',
                    { volumePercent: Math.round(newVolume), deviceId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (error) { console.error(error); }
        }, 300);
    };

    const seek = async (ms: number) => {
        if (!deviceId) return;
        const token = localStorage.getItem("token");
        setPosition(ms);
        try {
            await api.put('/spotify/seek',
                { positionMs: ms, deviceId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) { console.error(error); }
    };

    const syncState = useCallback(async () => {
        if (document.hidden) return; 
        if (Date.now() - lastUserAction.current < 2000) return;
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const { data } = await api.get('/spotify/currently-playing', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data && data.item) {
                setCurrentTrack(data.item);
                setIsPaused(!data.is_playing);
                if (data.progress_ms) setPosition(data.progress_ms);
                if (data.item.duration_ms) setDuration(data.item.duration_ms);
            }
        } catch (error) { }
    }, []);

    useEffect(() => {
        if (!currentTrack || !currentTrack.id) return;

        const checkSavedStatus = async () => {
            const token = localStorage.getItem("token");
            try {
                const { data } = await api.get(`/spotify/check-saved/${currentTrack.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsSaved(data);
            } catch (e) { setIsSaved(false); }
        };

        checkSavedStatus();
    }, [currentTrack?.id]);

    const toggleSave = async () => {
        if (!currentTrack || !currentTrack.id) return;
        const token = localStorage.getItem("token");

        const newState = !isSaved;
        setIsSaved(newState);

        try {
            if (newState) {
                await api.put(`/spotify/save-track/${currentTrack.id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await api.delete(`/spotify/remove-track/${currentTrack.id}`, { headers: { Authorization: `Bearer ${token}` } });
            }
        } catch (error) {
            console.error("Error cambiando like", error);
            setIsSaved(!newState);
        }
    };


    useEffect(() => {
        syncState();
        const interval = setInterval(syncState, 6000);
        return () => clearInterval(interval);
    }, [syncState]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (!isPaused) {
            interval = setInterval(() => {
                setPosition((prev) => {
                    if (prev >= duration) return prev;
                    return prev + 1000;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPaused, duration]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        (window as any).onSpotifyWebPlaybackSDKReady = () => {
            const player = new (window as any).Spotify.Player({
                name: 'NovaPlayer Web',
                getOAuthToken: async (cb: any) => {
                    try {
                        const appToken = localStorage.getItem("token");
                        const { data } = await api.get('/spotify/token', {
                            headers: { Authorization: `Bearer ${appToken}` }
                        });
                        cb(data.token);
                    } catch (error) { console.error("Error token spotify", error); }
                },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }: any) => {
                setDeviceId(device_id);
            });

            player.addListener('player_state_changed', (state: any) => {
                if (!state) return;
                setCurrentTrack(state.track_window.current_track);
                setIsPaused(state.paused);
                setPosition(state.position);
                setDuration(state.duration);
                player.getCurrentState().then((state: any) => { setIsActive(!!state); });
            });

            player.connect();
        };
    }, []);

    // --- CONTROL ---
    const transferPlayback = async (id: string) => {
        const token = localStorage.getItem("token");
        try {
            await api.put('/spotify/transfer',
                { deviceId: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) { console.error("Error transfer", error); }
    };

    const togglePlay = async () => {
        if (!deviceId) return;
        const token = localStorage.getItem("token");
        lastUserAction.current = Date.now();

        if (!isPaused) {
            setIsPaused(true);
            try {
                await api.put('/spotify/pause',
                    { deviceId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (error) {
                console.error("Error al pausar", error);
                setIsPaused(false);
            }
            return;
        }

        setIsPaused(false);

        try {
            if (isActive) {
                await api.put('/spotify/resume',
                    { deviceId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            else {
                await api.put('/spotify/transfer',
                    { deviceId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setIsActive(true);
            }
        } catch (error) {
            console.error("Error al reproducir", error);
            setIsPaused(true);
        }
    };

    const nextTrack = async () => {
        if (!deviceId) return;
        const token = localStorage.getItem("token");
        setPosition(0);
        await api.post('/spotify/next', { deviceId }, { headers: { Authorization: `Bearer ${token}` } });
        setTimeout(syncState, 500);
    };

    const prevTrack = async () => {
        if (!deviceId) return;
        const token = localStorage.getItem("token");
        setPosition(0);
        await api.post('/spotify/previous', { deviceId }, { headers: { Authorization: `Bearer ${token}` } });
        setTimeout(syncState, 500);
    };

    // --- CAMBIO 2: Lógica inteligente en playSong ---
    const playSong = async (uri: string, contextUri?: string, queue?: string[]) => {
        if (!deviceId) {
            console.error("⚠️ Player no listo");
            return;
        }
        const token = localStorage.getItem("token");

        // LÓGICA:
        // 1. Si hay contextUri (Playlist/Album), Spotify usa 'offset' para saber dónde empezar.
        //    Solo mandamos [uriActual] en 'uris'.
        // 2. Si NO hay contextUri (Favoritos/Busqueda), mandamos la cola manual en 'uris'.
        
        let urisToSend = [uri];

        if (!contextUri && queue && queue.length > 0) {
            // Estamos en modo lista suelta, enviamos la cola
            urisToSend = queue;
        }

        const body = { 
            deviceId: deviceId, 
            uris: urisToSend, 
            contextUri: contextUri 
        };

        try {
            await api.put('/spotify/play', body, { headers: { Authorization: `Bearer ${token}` } });
        } catch (error) {
            // Intento de recuperación si el dispositivo estaba inactivo
            await transferPlayback(deviceId);
            setTimeout(async () => {
                try {
                    await api.put('/spotify/play', body, { headers: { Authorization: `Bearer ${token}` } });
                } catch (e) { }
            }, 1000);
        }
    };

    return (
        <PlayerContext.Provider value={{
            currentTrack,
            isPlaying: !isPaused,
            isActive,
            deviceId,
            togglePlay,
            nextTrack,
            prevTrack,
            playSong,
            position,
            duration,
            seek,
            volume,
            changeVolume,
            isSaved,
            toggleSave,
        }}>
            {children}
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) throw new Error("usePlayer debe usarse dentro de PlayerProvider");
    return context;
};