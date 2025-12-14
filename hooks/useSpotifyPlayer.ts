import { useState, useEffect, useRef, useCallback } from "react";
import api from "@/utils/api";

export interface Track {
    id: string;
    name: string;
    album: { images: { url: string }[] };
    artists: { name: string; uri: string; id?: string }[];
    uri: string;
}

export function useSpotifyPlayer() {
    const [player, setPlayer] = useState<any>(null);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isActive, setIsActive] = useState(false); // Indica si el SDK web está controlando la música
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [volume, setVolume] = useState(50);
    let localDeviceId = "";
    
    // Refs para evitar re-renderizados y manejar temporizadores
    const lastUserAction = useRef<number>(0);
    const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const seekTimeoutRef = useRef<NodeJS.Timeout | null>(null); // <--- NUEVO: Para el seek

    // --- 1. Volumen (Con Debounce 500ms) ---
    const changeVolume = (percent: number) => {
        const newVolume = Math.max(0, Math.min(100, percent));
        setVolume(newVolume); // Actualización visual inmediata

        if (volumeTimeoutRef.current) clearTimeout(volumeTimeoutRef.current);

        volumeTimeoutRef.current = setTimeout(async () => {
            if (!deviceId) return;
            const token = localStorage.getItem("token");
            try {
                await api.put('/spotify/volume',
                    { volumePercent: Math.round(newVolume), deviceId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (error) { console.error("Error volumen", error); }
        }, 500); // <--- AUMENTADO A 500ms
    };

    // --- 2. Seek (AHORA CON DEBOUNCE - CRÍTICO PARA EVITAR 429) ---
    const seek = (ms: number) => {
        if (!deviceId) return;
        setPosition(ms); // Actualización visual inmediata (UI optimista)
        
        // Cancelamos la petición anterior si el usuario sigue arrastrando
        if (seekTimeoutRef.current) clearTimeout(seekTimeoutRef.current);

        // Esperamos 500ms a que el usuario deje de mover la barra
        seekTimeoutRef.current = setTimeout(async () => {
            const token = localStorage.getItem("token");
            try {
                await api.put('/spotify/seek',
                    { positionMs: ms, deviceId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (error) { console.error("Error seek", error); }
        }, 500);
    };

    // --- 3. Sincronización (Polling Inteligente) ---
    const syncState = useCallback(async () => {
        // A. Si la pestaña está oculta, no gastamos recursos
        if (typeof document !== "undefined" && document.hidden) return;
        
        // B. Si el usuario acaba de tocar algo, esperamos
        if (Date.now() - lastUserAction.current < 2000) return;

        // C. OPTIMIZACIÓN: Si el SDK Web está activo (sonando en este navegador),
        // CONFIAMOS en los eventos del SDK y NO llamamos a la API.
        // Solo llamamos a la API si estamos controlando otro dispositivo (celular, etc).
        if (isActive) return; 
        
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const { data } = await api.get('/spotify/currently-playing', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data && data.item) {
                // Solo actualizamos si realmente cambió algo para evitar re-renders
                if (currentTrack?.id !== data.item.id) setCurrentTrack(data.item);
                setIsPaused(!data.is_playing);
                
                // Sincronizamos tiempo solo si la diferencia es grande (>2s) para evitar saltos visuales
                if (Math.abs(position - data.progress_ms) > 2000) {
                    setPosition(data.progress_ms);
                }
                
                if (data.item.duration_ms) setDuration(data.item.duration_ms);
            }
        } catch (error) { }
    }, [isActive, currentTrack?.id, position]); // Agregamos dependencias

    // --- 4. Check Saved Status ---
    // Esto está bien, solo se ejecuta al cambiar de canción
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
            if (newState) await api.put(`/spotify/save-track/${currentTrack.id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            else await api.delete(`/spotify/remove-track/${currentTrack.id}`, { headers: { Authorization: `Bearer ${token}` } });
        } catch (error) {
            console.error("Error cambiando like", error);
            setIsSaved(!newState);
        }
    };

    // --- 5. Intervalos ---
    useEffect(() => {
        syncState();
        // Aumentamos a 6 segundos para ser más amables con la API
        const interval = setInterval(syncState, 6000); 
        return () => clearInterval(interval);
    }, [syncState]);

    // Intervalo local para mover la barra de progreso suavemente (sin API)
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
        setPosition(0);
        // Opcional: También podrías poner setDuration(0) si quieres que se limpie el total
    }, [currentTrack?.id]); 

    // --- 6. Inicializar SDK (Esto maneja el estado local sin API) ---
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        if (!document.getElementById("spotify-player-script")) {
            const script = document.createElement("script");
            script.id = "spotify-player-script";
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;
            document.body.appendChild(script);
        }

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
                localDeviceId = device_id;
            });

            // EVENTOS DEL SDK: Actualizan el estado GRATIS (sin llamar a tu backend)
            player.addListener('player_state_changed', async (state: any) => {
                if (!state) {
                    setIsActive(false);
                    return;
                }
                
                setIsActive(true); 
                setCurrentTrack(state.track_window.current_track);
                setIsPaused(state.paused);
                
                // Sincronización visual suave
                if (Math.abs(state.position - position) > 2000) {
                     setPosition(state.position);
                }
                setDuration(state.duration);

                // --- LÓGICA DE AUTO-NEXT CORREGIDA ---
                // Si está pausado + posición 0 + no cargando + ya sonó algo antes
                if (
                    state.paused && 
                    state.position === 0 && 
                    !state.loading && 
                    state.track_window.previous_tracks.length > 0
                ) {
                    // 1. Revisamos si Spotify tiene algo en la cola siguiente
                    if (state.track_window.next_tracks.length > 0) {
                        console.log("⚠️ Canción terminada. Forzando siguiente...");
                        
                        // FORZAMOS EL SALTO
                        try {
                            // Usamos el ID local que guardamos al principio
                            await api.post('/spotify/next', { deviceId: localDeviceId });
                        } catch (e) {
                            console.error("Error forzando next:", e);
                        }
                    } else {
                        console.log("✅ Fin de la playlist. No hay más canciones.");
                    }
                }
            });


            player.connect();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // --- 7. Controles (Actualizan lastUserAction para pausar polling) ---
    const transferPlayback = async (id: string) => {
        const token = localStorage.getItem("token");
        try {
            await api.put('/spotify/transfer', { deviceId: id }, { headers: { Authorization: `Bearer ${token}` } });
        } catch (error) { console.error("Error transfer", error); }
    };

    const togglePlay = async () => {
        if (!deviceId) {
            console.log("El player no está listo aún.");
            return
        };
        const token = localStorage.getItem("token");
        lastUserAction.current = Date.now(); // Pausamos polling

        // Lógica optimista
        const newPausedState = !isPaused;
        setIsPaused(newPausedState);

        try {
            if (!newPausedState) { // Si vamos a reproducir
                 if (isActive) {
                    await api.put('/spotify/resume', { deviceId }, { headers: { Authorization: `Bearer ${token}` } });
                } else {
                    await api.put('/spotify/transfer', { deviceId }, { headers: { Authorization: `Bearer ${token}` } });
                    setIsActive(true);
                }
            } else { // Si vamos a pausar
                await api.put('/spotify/pause', { deviceId }, { headers: { Authorization: `Bearer ${token}` } });
            }
        } catch (error) {
            setIsPaused(!newPausedState); // Revertir en error
        }
    };

    const nextTrack = async () => {
        if (!deviceId) return;
        const token = localStorage.getItem("token");
        lastUserAction.current = Date.now();
        setPosition(0);
        await api.post('/spotify/next', { deviceId }, { headers: { Authorization: `Bearer ${token}` } });
    };

    const prevTrack = async () => {
        if (!deviceId) return;
        const token = localStorage.getItem("token");
        lastUserAction.current = Date.now();
        setPosition(0);
        await api.post('/spotify/previous', { deviceId }, { headers: { Authorization: `Bearer ${token}` } });
    };

    const playSong = async (uris: string[], contextUri?: string) => {
        if (!deviceId) return;
        
        const token = localStorage.getItem("token");
        setPosition(0);
        // 1. PRIMERO: Activamos el dispositivo (Transfer Playback)
        // Esto le dice a Spotify "Oye, este navegador es el que manda ahora"
        try {
            await api.put('/spotify/transfer', { deviceId }, { headers: { Authorization: `Bearer ${token}` } });
        } catch (e) { console.warn("Transfer warning:", e); }

        // 2. SEGUNDO: Esperamos 300ms y mandamos el Play
        setTimeout(async () => {
            try {
                const body = { deviceId, uris, contextUri };
                await api.put('/spotify/play', body, { headers: { Authorization: `Bearer ${token}` } });
                setIsPaused(false);
            } catch (error: any) {
                console.error("❌ Error Play:", error.response?.data || error.message);
            }
        }, 300);
    };

    return {
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
    };
}