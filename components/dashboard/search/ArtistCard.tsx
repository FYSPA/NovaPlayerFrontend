import Link from "next/link";
import Image from "next/image";

export default function ArtistCard({ artist }: { artist: any }) {
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
                    <div className="relative w-32 h-32 mb-4">
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
    );
}