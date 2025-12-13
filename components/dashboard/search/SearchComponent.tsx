"use client";
import { Suspense } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link"; // <--- 1. IMPORTANTE: Faltaba importar Link
import SongCard from "@/components/dashboard/collection/SongCard";
import ArtistCard from "@/components/dashboard/search/ArtistCard";
import GenreCard from "@/components/dashboard/search/GenreCard";
import { useSearchPage } from "@/hooks/useSearchPage"; 
// 2. IMPORTANTE: Usamos useCategories, no useCategoryPlaylists
import { useCategories } from "@/hooks/useCategories"; 

function SearchContent() {
    const { 
        query, 
        setQuery, 
        results, 
        loading, 
        handlePlayTrack, 
        clearQuery 
    } = useSearchPage();

    // 3. Traemos las categorías (Pop, Rock, etc)
    const { categories } = useCategories(); 

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
                        <button onClick={clearQuery} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* CONTENIDO */}
            {query ? (
                // --- VISTA DE RESULTADOS DE BÚSQUEDA ---
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {loading && !results && <div className="text-gray-400 text-center">Searching...</div>}

                    {!loading && (!results?.tracks?.items?.length && !results?.artists?.items?.length) && (
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
                                {results.tracks.items.map((track: any, index: number) => (
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
                <div className="animate-in fade-in duration-500">
                    <h2 className="text-xl font-bold text-white mb-4">Explore all</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {/* 5. Iteramos sobre categories, que ahora SÍ existe */}
                        {categories.map((cat) => (
                            <Link key={cat.id} href={`/dashboard/category/${cat.id}`}>
                                <GenreCard
                                    title={cat.name}
                                    image={cat.icons[0]?.url}
                                    // Pasamos una función vacía al onClick porque el Link maneja la navegación
                                    onClick={() => {}} 
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}