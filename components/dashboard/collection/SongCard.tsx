import Link from "next/link";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import LikeButton from "@/components/dashboard/collection/LikedButton";

interface SongCardProps {
    index: number;
    image: string;
    name: string;
    album: string;
    duration: number;
    artistName: string;
    artistId: string;
    uri: string;
    trackId: string;
    onPlay?: () => void; // <--- Hacemos que sea opcional por si acaso
    contextUri?: string;
    queue?: string[];
}

export default function SongCard({ 
    index, image, name, album, duration, artistName, artistId, uri, trackId,
    onPlay, // <--- Recibimos la función del padre
    contextUri, 
    queue 
}: SongCardProps) {
    
    const { playSong, currentTrack } = usePlayer();
    const isCurrentTrack = currentTrack?.id === trackId;
    
    // Función auxiliar para manejar el play con todas las variables
    const handlePlay = () => {
        // 1. PRIORIDAD MÁXIMA: Si el padre nos dio una orden (onPlay), la ejecutamos.
        // Esto es lo que usa FavoritesPage para mandar la lista de 50 canciones.
        if (onPlay) {
            console.log("Delegando reproducción al padre...");
            onPlay();
            return;
        }

        // 2. Si no hay onPlay, usamos la lógica interna
        if (contextUri) {
            playSong([uri], contextUri);
        } else if (queue && queue.length > 0) {
            playSong(queue); 
        } else {
            // Caso de emergencia: Solo esta canción
            playSong([uri]);
        }
    };

    const cleanArtistId = artistId?.replace("spotify:artist:", "");

    return (
        <div 
            onDoubleClick={handlePlay} 
            className="group flex w-full items-center justify-between px-4 py-2 hover:bg-white/10 rounded-md transition-colors cursor-pointer"
        >
            {/* IZQUIERDA */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div
                    className="w-6 text-center"
                    onClick={(e) => {
                        e.stopPropagation();
                        handlePlay(); // <--- Ahora esto llamará a onPlay si existe
                    }} 
                >
                    <span className={`text-gray-400 ${isCurrentTrack ? "text-green-500" : ""} group-hover:hidden`}>
                        {isCurrentTrack ? "▶" : index}
                    </span>
                    <span className="hidden group-hover:block text-white">▶</span>
                </div>

                <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                        className="w-full h-full rounded shadow object-cover"
                        src={image}
                        alt={name}
                        fill
                        priority
                        sizes="40px"
                    />
                </div>
                <div className="flex flex-col min-w-0">
                    <h1 className={`text-base font-semibold truncate pr-4 ${isCurrentTrack ? "text-green-500" : "text-white"}`}>
                        {name}
                    </h1>

                    {cleanArtistId && cleanArtistId !== "undefined" && cleanArtistId !== "" ? (
                        <Link
                            href={`/dashboard/artist/${cleanArtistId}`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-fit"
                        >
                            <span className="text-gray-400 text-sm truncate group-hover:text-white hover:underline">
                                {artistName}
                            </span>
                        </Link>
                    ) : (
                        <span className="text-gray-400 text-sm truncate cursor-default">
                            {artistName}
                        </span>
                    )}
                </div>
            </div>

            {/* CENTRO */}
            <span className="text-gray-400 text-sm w-1/3 hidden md:block truncate pr-4 group-hover:text-white">
                {album}
            </span>

            {/* DERECHA */}
            <div className="flex items-center gap-4 w-24 justify-end">
                <div onClick={(e) => e.stopPropagation()}>
                    <LikeButton trackId={trackId} />
                </div>

                <span className="text-gray-400 text-sm group-hover:text-white">
                    {Math.floor(duration / 60000)}:{((duration % 60000) / 1000).toFixed(0).padStart(2, '0')}
                </span>
            </div>
        </div>
    )
}