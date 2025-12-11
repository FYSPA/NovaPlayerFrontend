"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Music } from "lucide-react";
import api from "@/utils/api";
import { useRouter } from "next/navigation"; 

export default function CarrouselMusic({ title, type }: { title: string, type: "new-releases" | "featured" }) {

    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            let url = "";
            if (type === "new-releases") url = "/spotify/new-releases";
            else if (type === "featured") url = "/spotify/featured";

            try {
                const { data } = await api.get(url, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // --- SOLUCIÓN DEL ERROR ---
                // Validamos estrictamente qué nos llegó para asegurarnos de guardar SIEMPRE un Array
                let itemsList: any[] = [];

                if (data?.albums?.items && Array.isArray(data.albums.items)) {
                    itemsList = data.albums.items;
                } 
                else if (data?.playlists?.items && Array.isArray(data.playlists.items)) {
                    itemsList = data.playlists.items;
                }
                else if (Array.isArray(data)) {
                    itemsList = data;
                }
                // Caso extra: A veces Spotify devuelve { items: [...] } directamente
                else if (data?.items && Array.isArray(data.items)) {
                    itemsList = data.items;
                }

                setItems(itemsList);

            } catch (error: any) {
                console.error(`Error cargando ${type}:`, error);
                if (error.response && error.response.status === 401) {
                    // Manejo silencioso de error 401 o redirección
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [type, router]);

    if (loading) return <div className="h-40 flex items-center justify-center text-gray-500">Cargando...</div>;
    
    // Si no es un array o está vacío, no renderizamos nada para evitar errores
    if (!Array.isArray(items) || items.length === 0) return null;

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-white mb-4 px-2">{title}</h2>

            <div className="flex overflow-x-auto custom-scrollbar gap-6 pb-4 px-2">

                {items.map((item) => {
                    if (!item || !item.id) return null;

                    // --- LÓGICA DINÁMICA ---
                    const isAlbum = item.type === 'album';
                    
                    const name = item.name;
                    const image = item.images?.[0]?.url;
                    
                    let subtitle = "";
                    let subLink = "#";

                    if (isAlbum) {
                        subtitle = item.artists?.[0]?.name || "Varios Artistas";
                        subLink = `/dashboard/artist/${item.artists?.[0]?.id}`;
                    } else {
                        // Playlist
                        subtitle = `By ${item.owner?.display_name || "Spotify"}`;
                        subLink = item.owner?.id ? `/dashboard/profile/${item.owner.id}` : "#";
                    }

                    const cardHref = `/dashboard/collection/${item.id}`; 

                    return (
                        <div key={item.id} className="flex-shrink-0 w-[200px] group cursor-pointer">
                            <QuickCard
                                title={name || "Sin nombre"}
                                image={image}
                                href={cardHref}
                            />
                            <div className="mt-3">
                                <h3 className="text-base font-bold text-white truncate hover:underline">
                                    {name}
                                </h3>
                                <Link
                                    href={subLink}
                                    className="text-sm font-medium text-gray-400 hover:underline block truncate"
                                >
                                    {subtitle}
                                </Link>
                            </div>
                        </div>
                    );
                })}

            </div>
        </div>
    );
}

// --- COMPONENTE QUICKCARD ---
function QuickCard({ title, image, href }: any) {
    return (
        <Link
            href={href}
            className="group relative flex items-center rounded-md overflow-hidden transition-all duration-300 shadow-sm h-48 w-full hover:shadow-xl bg-[#1A1A1A]"
        >
            <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
                {image ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover blur-sm scale-110 opacity-80 group-hover:blur-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-[#121212] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Music size={64} className="text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                )}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-300"></div>
            </div>
            <span className="absolute bottom-4 left-4 z-10 font-bold text-white text-lg line-clamp-2 drop-shadow-lg group-hover:opacity-0 transition-opacity duration-300 pr-2">
                {title}
            </span>
            <div className="absolute right-3 bottom-3 z-20 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl rounded-full">
                <div className="bg-green-500 rounded-full p-3 hover:scale-105 hover:bg-green-400 transition text-black shadow-lg">
                    <Play size={20} fill="black" className="ml-1" />
                </div>
            </div>
        </Link>
    );
}