import { Play, ListMusic, MoreHorizontal } from "lucide-react";

export default function MusicQueueSidebar() {
    return (
        <div className="flex flex-col h-full">

            {/* 1. SECCIÓN "NOW PLAYING" (Visual principal) */}
            <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Now Playing</h3>

                {/* Aquí iría tu <video> o Imagen de Portada */}
                <div className="relative group w-full aspect-square bg-gray-800 rounded-xl overflow-hidden shadow-lg mb-4">
                    <img
                        src="https://i.scdn.co/image/ab67616d0000b273295c52c673426742543d3b73"
                        alt="Album Cover"
                        className="w-full h-full object-cover"
                    />
                    {/* Overlay al pasar el mouse */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <button className="bg-white p-3 rounded-full text-black hover:scale-105 transition">
                            <Play size={24} fill="black" className="ml-1" />
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-white hover:underline cursor-pointer">Ilusión Supersport</h2>
                        <p className="text-gray-400 text-sm hover:underline cursor-pointer">Ilusión Supersport</p>
                    </div>
                    <button className="text-gray-400 hover:text-white"><MoreHorizontal size={20} /></button>
                </div>
            </div>

            {/* 2. SECCIÓN "NEXT UP" (La Cola) */}
            <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-bold text-gray-400 uppercase">Next Up</h3>
                    <button className="text-xs text-white hover:underline">Open Queue</button>
                </div>

                <div className="flex flex-col gap-1">
                    {/* Lista de canciones simulada */}
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1A1A1A] group cursor-pointer transition">
                            <div className="relative w-10 h-10 flex-shrink-0">
                                <img
                                    src={`https://picsum.photos/seed/${i}/200`}
                                    className="w-full h-full object-cover rounded"
                                    alt="Cover"
                                />
                                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center rounded">
                                    <Play size={12} fill="white" className="text-white" />
                                </div>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-white truncate w-32 group-hover:text-green-500 transition">Song Name {i}</p>
                                <p className="text-xs text-gray-400 truncate">Artist Name</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}