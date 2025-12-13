import { useState, useEffect, useRef } from "react";
import { usePlayer } from "@/context/PlayerContext";
import api from "@/utils/api";

export function useNowPlaying() {
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

    return {
        currentTrack,
        videoId,
        artistInfo,
        isFollowing,
        showVideo,
        iframeLoaded,
        setShowVideo,
        setIframeLoaded,
        handleFollow,
        formatNumber
    };
}