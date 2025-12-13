import { Play } from "lucide-react";
import Image from "next/image";

// 1. Definimos qué datos va a recibir el componente
interface PlaylistCardProps {
    id: string;
    title: string;
    cover?: string;
    author?: string;
    description?: string;
    authorImg?: string | null;
    onPlay?: () => void; // Agregué esto por si quieres conectar el botón de play
}

export default function PlaylistCard({
    id,
    title,
    cover = "https://picsum.photos/seed/playlist/500", 
    author = "User Demo",
    description = "Playlist Description",
    authorImg,
    onPlay
}: PlaylistCardProps) {

    return (
        <div className="flex flex-col pb-6"> {/* Agregué un poco de padding bottom */}
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-end">
                
                {/* 1. PORTADA (Responsiva) */}
                {/* w-48 en móvil, w-60 en escritorio. Sombra profunda. */}
                <div className="w-48 h-48 md:w-60 md:h-60 flex-shrink-0 bg-gradient-to-br from-gray-900 to-white/50 flex items-center rounded-lg justify-center shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden">
                    <img
                        src={cover}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* 2. INFO TEXTO (Centrado móvil / Izq escritorio) */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left justify-end flex-1">
                    <span className="text-gray-400 text-sm font-bold uppercase mb-2">Playlist</span>

                    {/* Título Dinámico: Ajustamos tamaños de fuente */}
                    <h1 className="text-white text-4xl md:text-6xl lg:text-8xl font-black tracking-tight mb-4 leading-tight">
                        {title}
                    </h1>

                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 text-gray-300">
                        {/* Avatar Autor */}
                        <div className="h-6 w-6 md:h-8 md:w-8 rounded-full overflow-hidden relative border border-gray-500">
                            {authorImg ? (
                                <Image
                                    src={authorImg}
                                    alt={author || "Author"}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white font-bold text-xs">
                                    {author?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        
                        <span className="text-white font-bold hover:underline cursor-pointer">{author}</span>
                        
                        {description && (
                            <>
                                <span className="hidden md:inline w-1 h-1 bg-gray-500 rounded-full"></span>
                                <span className="text-sm md:text-base line-clamp-1">{description}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* --- BOTONES --- */}
            {/* Centrados en móvil, izquierda en escritorio */}
            <div className="flex items-center justify-center md:justify-start gap-4 mt-6 md:mt-10">
                <div className="z-20 transition-all duration-300 transform shadow-xl rounded-full">
                    <button 
                        onClick={onPlay}
                        className="bg-green-500 rounded-full p-4 md:p-5 hover:scale-105 hover:bg-green-400 transition text-black cursor-pointer flex items-center justify-center"
                    >
                        <Play size={28} fill="black" className="ml-1" />
                    </button>
                </div>
            </div>
        </div>
    )
}