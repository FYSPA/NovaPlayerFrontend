"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Music } from "lucide-react";
import api from "@/utils/api";

interface Playlist {
    id: string;
    name: string;
    images: { url: string }[];
    owner: {
        display_name: string;
        id: string; // <--- IMPORTANTE: El ID del dueño
    };
}

interface CarrouselProps {
    title: string;
    type: "user" | "featured";
    // artistId?: string; <--- BORRAR ESTO, no se usa aquí
}

export default function CarrouselMusic({ title, type }: CarrouselProps) {

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                let url = "";
                if (type === "user") url = "/spotify/playlists";
                else if (type === "featured") url = "/spotify/featured";

                const { data } = await api.get(url, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setPlaylists(data);
            } catch (error) {
                console.error(`Error cargando carrusel ${type}`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [type]);

    if (loading) return <div className="text-white px-4">Cargando {title}...</div>;

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-white mb-4 px-2">{title}</h2>

            <div className="flex overflow-x-auto custom-scrollbar gap-6 pb-4 px-2">

                {playlists.length === 0 && !loading && (
                    <div className="text-gray-500 italic p-4">No se encontraron playlists.</div>
                )}

                {playlists.map((playlist) => {
                    if (!playlist || !playlist.id) return null;

                    // --- OBTENER EL ID DEL DUEÑO AQUÍ ---
                    const ownerId = playlist.owner?.id;
                    const ownerName = playlist.owner?.display_name || "Spotify";

                    return (
                        <div key={playlist.id} className="flex-shrink-0 w-[200px] group cursor-pointer">
                            <QuickCard
                                title={playlist.name || "Sin nombre"}
                                image={playlist.images?.[0]?.url}
                                href={`/dashboard/collection/${playlist.id}`}
                            />
                            <div className="mt-3">
                                <h3 className="text-base font-bold text-white truncate hover:underline">
                                    {playlist.name}
                                </h3>

                                {/* ENLACE AL PERFIL DEL DUEÑO */}
                                {ownerId ? (
                                    <Link
                                        // Nota: Si el dueño es un usuario normal y no un artista, 
                                        // la página de 'artist' podría no cargar bien sus datos, 
                                        // pero el link funcionará.
                                        href={`/dashboard/profile/${ownerId}`}
                                        className="text-sm font-medium text-gray-400 hover:underline"
                                    >
                                        By {ownerName}
                                    </Link>
                                ) : (
                                    <span className="text-sm font-medium text-gray-400">
                                        By {ownerName}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}

            </div>
        </div>
    );
}

// --- COMPONENTE QUICKCARD (Tu diseño intacto + Next Image) ---
function QuickCard({ title, image, href }: any) {
    return (
        <Link
            href={href}
            className="group relative flex items-center rounded-md overflow-hidden transition-all duration-300 shadow-sm h-48 w-full hover:shadow-xl bg-[#1A1A1A]"
        >
            {/* 1. FONDO */}
            <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
                {image ? (
                    <Image
                        src={image}
                        alt={title}
                        fill // Ocupa todo el contenedor
                        className="object-cover blur-sm scale-110 opacity-80 group-hover:blur-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-[#121212] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Music size={64} className="text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                )}

                {/* Capa oscura */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-300"></div>
            </div>

            {/* 2. TÍTULO */}
            <span className="absolute bottom-4 left-4 z-10 font-bold text-white text-lg line-clamp-2 drop-shadow-lg group-hover:opacity-0 transition-opacity duration-300 pr-2">
                {title}
            </span>

            {/* 3. BOTÓN PLAY */}
            <div className="absolute right-3 bottom-3 z-20 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl rounded-full">
                <div className="bg-green-500 rounded-full p-3 hover:scale-105 hover:bg-green-400 transition text-black shadow-lg">
                    <Play size={20} fill="black" className="ml-1" />
                </div>
            </div>
        </Link>
    );
}