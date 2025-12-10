export default function SocialSidebar() {
    return (
        <section className="w-full h-full overflow-y-auto hidden xl:block">
            {/* Lista de Amigos (Ejemplo) */}
            <div className="flex flex-col gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex gap-3 items-start group cursor-pointer">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 relative">
                            <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-[#090909]">
                                {/* Icono de música pequeñito */}
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                                <h4 className="text-sm font-bold text-gray-200 truncate group-hover:underline">Friend {i}</h4>
                                <span className="text-[10px] text-gray-500">2h</span>
                            </div>
                            <p className="text-xs text-gray-400 truncate">Listening to Bad Bunny</p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                <span className="w-2 h-2 rounded-full border border-gray-500"></span>
                                <span className="truncate">Un Verano Sin Ti</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 px-4 py-6 text-center">
                <p className="text-sm text-gray-400 mb-4">Go to Settings Social and enable 'Share my listening activity on Spotify' to share.</p>
                <button className="px-6 py-2 bg-white text-black font-bold rounded-full text-sm hover:scale-105 transition">Settings</button>
            </div>
        </section>
    )
}