import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

export default function QuickAccess() {
    return (
        <div className="flex flex-col gap-6">

            {/* 1. FILTROS (Todo, Música, Podcast) */}
            <div className="flex gap-2">
                <button className="px-4 py-1.5 bg-white text-black text-sm font-medium rounded-full transition hover:scale-105">
                    All
                </button>
                <button className="px-4 py-1.5 bg-[#2A2A2A] text-white text-sm font-medium rounded-full hover:bg-[#3E3E3E] transition hover:scale-105">
                    Music
                </button>
                <button className="px-4 py-1.5 bg-[#2A2A2A] text-white text-sm font-medium rounded-full hover:bg-[#3E3E3E] transition hover:scale-105">
                    Podcasts
                </button>
            </div>

            {/* 2. GRILLA DE TARJETAS (Quick Access) */}
            {/* Grid responsivo: 2 col en móvil, 2 en tablet, 4 en escritorio grande */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                {/* TARJETA 1: Liked Songs (Especial con gradiente) */}
                <QuickCard
                    title="Liked Songs"
                    image="/assets/liked-songs.png" // Asegúrate de tener esta imagen o usa un div de color
                    href="/dashboard/favorites"
                    isLikedSongs={true}
                />

            </div>
        </div>
    );
}

function QuickCard({ title, image, href, isLikedSongs = false }: any) {
    return (
        <Link
            href={href}
            // 1. El padre debe ser relative y overflow-hidden
            className="group relative flex items-center rounded-md overflow-hidden transition-all duration-300 pr-4 gap-4 shadow-sm h-16 hover:shadow-md"
        >

            {/* --- CAPA DE FONDO (IMAGEN BORROSA) --- */}
            <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
                {isLikedSongs ? (
                    <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                    </div>
                ) : (
                    <img
                        src={image}
                        alt="Background Blur"
                        className="w-full h-full object-cover blur-md scale-110 opacity-90"
                    />
                )}
                {/* Capa oscura encima para que el texto se lea bien */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
            </div>


            {/* --- CAPA DE CONTENIDO (THUMBNAIL + TEXTO) --- */}
            {/* z-10 es vital para que esté encima del fondo borroso */}

            {/* 1. Thumbnail Pequeño (Nítido) */}
            <div className="relative z-10 h-16 w-16 flex-shrink-0 shadow-xl">
                {isLikedSongs ? (
                    <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                        <span className="text-white text-2xl">♥</span>
                    </div>
                ) : (
                    <img
                        src={image}
                        alt={title}
                        className="object-cover w-full h-full"
                    />
                )}
            </div>

            {/* 2. Título */}
            <span className="relative z-10 font-bold text-white text-sm line-clamp-2 leading-tight flex-1 drop-shadow-md">
                {title}
            </span>

            {/* 3. Botón Play (Flotante) */}
            <div className="absolute right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-xl rounded-full">
                <div className="bg-green-500 rounded-full p-3 hover:scale-105 hover:bg-green-400 transition text-black">
                    <Play size={20} fill="black" className="ml-0.5" />
                </div>
            </div>

        </Link>
    )
}