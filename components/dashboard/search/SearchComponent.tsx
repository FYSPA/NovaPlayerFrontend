 "use client";
import { useState, useEffect, useRef, Suspense } from "react"; // <--- Agregamos Suspense
import { Search, X } from "lucide-react";
import api from "@/utils/api";
import SongCard from "@/components/dashboard/collection/SongCard";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { usePlayer } from "@/context/PlayerContext";

// --- TIPOS ---
interface SearchResults {
    tracks?: { items: any[] };
    artists?: { items: any[] };
}

// --- 1. LÓGICA PRINCIPAL (Donde ocurre la magia) ---
function SearchContent() {
    const { playSong } = usePlayer();
    const searchParams = useSearchParams();
    const queryFromUrl = searchParams.get("q");

    // Inicializamos con lo que venga en la URL
    const [query, setQuery] = useState(queryFromUrl || "");
    const [results, setResults] = useState<SearchResults | null>(null);
    const [loading, setLoading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const handlePlayTrack = (uri: string) => {
        // En búsqueda, mandamos la canción como una lista de 1 elemento
        playSong([uri]); 
    };

    // Efecto: Si cambia la URL (por el Header), actualizamos el input
    useEffect(() => {
        if (queryFromUrl) {
            setQuery(queryFromUrl);
        }
    }, [queryFromUrl]);

    // Efecto: Buscador con Debounce
    useEffect(() => {
        if (!query.trim()) {
            setResults(null);
            setLoading(false);
            return;
        }
        const timeoutId = setTimeout(() => fetchResults(query), 500);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const fetchResults = async (searchTerm: string) => {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();

        try {
            const { data } = await api.get(`/spotify/search?q=${encodeURIComponent(searchTerm)}`, {
                headers: { Authorization: `Bearer ${token}` },
                signal: abortControllerRef.current.signal
            });
            setResults(data);
        } catch (error: any) {
            if (error.name !== "CanceledError") console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 pb-20 px-4 md:px-8 font-saira bg-transparent">
            {/* BARRA DE BÚSQUEDA */}
            <div className="sticky top-0 z-20 pt-4 pb-2">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className={`h-5 w-5 ${loading ? "text-white animate-pulse" : "text-gray-400"}`} />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-10 py-3 rounded-full bg-[#2A2A2A] text-white placeholder-gray-400 focus:outline-none focus:bg-[#3E3E3E] focus:ring-2 focus:ring-white/20 transition-all text-lg"
                        placeholder="What are you listening to?"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    {query && (
                        <button onClick={() => setQuery("")} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* CONTENIDO */}
            {query ? (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {loading && !results && <div className="text-gray-400 text-center">Searching...</div>}

                    {!loading && (!results?.tracks?.items.length && !results?.artists?.items.length) && (
                        <div className="text-center text-white mt-10">
                            <p className="text-xl font-bold">No results found for "{query}"</p>
                        </div>
                    )}

                    {/* ARTISTAS */}
                    {results?.artists?.items && results.artists.items.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">Artists</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {results.artists.items.slice(0, 5).map((artist: any) => (
                                    <ArtistCard key={artist.id} artist={artist} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CANCIONES */}
                    {results?.tracks?.items && results.tracks.items.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">Songs</h2>
                            <div className="flex flex-col">
                                {results.tracks.items.map((track, index) => (
                                    <SongCard
                                        key={track.id}
                                        index={index + 1}
                                        image={track.album.images[2]?.url || track.album.images[0]?.url}
                                        name={track.name}
                                        artistName={track.artists?.map((a: any) => a.name).join(", ") || "Desconocido"}
                                        artistId={track.artists?.[0]?.id || ""}
                                        uri={track.uri}
                                        trackId={track.id}
                                        album={track.album.name}
                                        duration={track.duration_ms}
                                        onPlay={() => handlePlayTrack(track.uri)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                // GÉNEROS
                <div className="animate-in fade-in duration-500">
                    <h2 className="text-xl font-bold text-white mb-4">Explore all</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        <GenreCard title="Pop" color="bg-[#8D67AB]" />
                        <GenreCard title="Rock" color="bg-[#E91429]" />
                        <GenreCard title="Hip-Hop" color="bg-[#BA5D07]" />
                        <GenreCard title="Latino" color="bg-[#E1118C]" />
                        <GenreCard title="Indie" color="bg-[#608108]" />
                        <GenreCard title="Relax" color="bg-[#477D95]" />
                        <GenreCard title="Entrenamiento" color="bg-[#777777]" />
                        <GenreCard title="Podcast" color="bg-[#27856A]" />
                    </div>
                </div>
            )}
        </div>
    );
}

// --- 2. COMPONENTE WRAPPER (Necesario para evitar errores de Build) ---
export default function SearchPage() {
    return (
        <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}

// --- SUB-COMPONENTES ---
function ArtistCard({ artist }: { artist: any }) {
    const imageUrl = artist.images?.[0]?.url;
    return (
        <Link href={`/dashboard/artist/${artist.id}`}>
            <div className="relative p-4 rounded-lg overflow-hidden hover:bg-[#282828] transition-colors cursor-pointer group flex flex-col items-center h-full">

                <div className="absolute inset-0 z-0">
                    {imageUrl && (
                        <Image
                            src={imageUrl}
                            alt="Background"
                            fill
                            className="object-cover blur opacity-40 scale-125 group-hover:opacity-90 transition-opacity duration-300"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/40 to-transparent"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center w-full">

                    <div className="relative w-32 h-32 mb-4 ">
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt={artist.name}
                                fill
                                className="object-cover rounded-full group-hover:scale-105 transition-transform duration-300 border-2 border-white/10"
                            />
                        ) : (
                            <div className="w-full h-full bg-[#333] rounded-full flex items-center justify-center text-gray-500 font-bold text-2xl">
                                {artist.name.charAt(0)}
                            </div>
                        )}
                    </div>

                    <div className="text-center w-full">
                        <h3 className="text-white font-bold truncate w-full px-2 drop-shadow-md text-lg">
                            {artist.name}
                        </h3>
                        <p className="text-gray-300 text-sm mt-1 drop-shadow-md font-medium">
                            Artist
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    )
}

function GenreCard({ title, color }: { title: string, color: string }) {
    return (
        <div className={`${color} h-40 rounded-lg p-4 relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity`}>
            <span className="font-bold text-xl text-white font-saira absolute top-4 left-4 max-w-[80%] z-10 break-words leading-tight">{title}</span>
            <div className="absolute -bottom-2 -right-4 w-24 h-24 bg-black/20 rotate-[25deg] rounded-lg shadow-lg transform translate-x-2 translate-y-2"></div>
        </div>
    )
}