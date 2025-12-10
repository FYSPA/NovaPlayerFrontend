import { Play } from "lucide-react";
import useUser from "@/hooks/useUser";
import Image from "next/image";

// 1. Definimos qué datos va a recibir el componente
interface PlaylistCardProps {
    id: string;
    title: string;
    cover?: string;
    author?: string;
    description?: string;
    authorImg?: string | null;
}

export default function PlaylistCard({
    id,
    title,
    cover = "https://picsum.photos/seed/playlist/500", // Imagen por defecto si no envías una
    author = "User Demo",
    description = "Playlist Description",
    authorImg
}: PlaylistCardProps) {

    return (
        <div className="flex flex-col">
            <div className="flex flex-col md:flex-row gap-6 items-end">
                {/* PORTADA */}
                <div className="w-56 h-56 min-w-[224px] bg-gradient-to-br from-gray-900 to-white/50 flex items-center rounded-lg justify-center shadow-[26px_21px_60px_27px_rgba(0,0,0,0.75)] overflow-hidden">
                    <img
                        src={cover}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* INFO TEXTO */}
                <div className="flex flex-col justify-end">
                    <span className="text-gray-400 text-sm font-bold uppercase">Playlist</span>

                    {/* Título Dinámico */}
                    <h1 className="text-white text-6xl md:text-8xl font-black tracking-tight mb-4">
                        {title}
                    </h1>

                    <div className="flex items-center gap-2 text-gray-300">
                        <div className="h-8 w-8 rounded-full overflow-hidden relative border border-gray-500">
                            {authorImg ? (
                                <Image
                                    src={authorImg}
                                    alt={author || "Author"}
                                    fill
                                    priority
                                    className="object-cover"
                                />
                            ) : (
                                // Si no hay foto del autor, mostramos la inicial
                                <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white font-bold text-xs">
                                    {author?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <span className="text-white font-bold hover:underline cursor-pointer">{author}</span>
                        <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                        <span>{description}</span>
                    </div>
                </div>
            </div>

            {/* BOTONES */}
            <div className="flex items-center gap-2 mt-10">
                <div className="z-20 transition-all duration-300 transform translate-y-2 shadow-xl rounded-full">
                    <div className="bg-green-500 rounded-full p-5 hover:scale-105 hover:bg-green-400 transition text-black cursor-pointer">
                        <Play size={28} fill="black" />
                    </div>
                </div>
            </div>
        </div>
    )
}