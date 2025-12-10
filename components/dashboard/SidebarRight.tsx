"use client";
import { useState } from "react";
import { X, User, Music, ListMusic } from "lucide-react";
import SocialSidebar from "./SocialSIdebar";
import MusicQueueSidebar from "./MusicQueueSidebar";
import NowPlayingSidebar from "./NowPlayingSidebar";


export default function SidebarRight({ isOpen, toggle }: any) {
    const [activeTab, setActiveTab] = useState<"music" | "social" | "queue">("music");

    if (!isOpen) return null;

    return (
        <aside className="w-full h-full bg-[#090909] border-l border-gray-900 flex flex-col hidden xl:flex custom-scrollbar">

            {/* 1. HEADER FIJO */}
            <div className="p-4 pb-2 relative">
                <div className="flex justify-between items-center mb-6 text-gray-400 ">
                    {/* El título cambia dinámicamente según la pestaña */}
                    <h2 className="text-sm font-bold text-white">
                        {activeTab === 'social' ? 'Friend Activity' : activeTab === 'queue' ? 'Queue' : 'Music'}
                    </h2>
                    <div className="flex gap-2 z-30">
                        <button onClick={toggle} className="hover:text-white transition"><X size={18} /></button>
                    </div>
                </div>

                {/* 2. BOTONES DE NAVEGACIÓN (Tabs) */}
                <div className="flex flex-row gap-2 overflow-x-auto p-1 pb-2 bg-[#090909] custom-scrollbar relative">

                    <button
                        onClick={() => setActiveTab("music")}
                        className={`
                            flex flex-row items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                            ${activeTab === "music"
                                ? "bg-white text-black font-bold scale-105" // Estilo Activo
                                : "bg-[#1A1A1A] text-gray-400 hover:text-white hover:bg-[#2A2A2A]" // Estilo Inactivo
                            }
                        `}
                    >
                        <Music size={16} /> Music
                    </button>

                    {/* Botón SOCIAL */}
                    <button
                        onClick={() => setActiveTab("social")}
                        className={`
                            flex flex-row items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                            ${activeTab === "social"
                                ? "bg-white text-black font-bold scale-105" // Estilo Activo
                                : "bg-[#1A1A1A] text-gray-400 hover:text-white hover:bg-[#2A2A2A]" // Estilo Inactivo
                            }
                        `}
                    >
                        <User size={16} /> Social
                    </button>

                    {/* Botón QUEUE */}
                    <button
                        onClick={() => setActiveTab("queue")}
                        className={`
                            flex flex-row items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                            ${activeTab === "queue"
                                ? "bg-white text-black font-bold scale-105"
                                : "bg-[#1A1A1A] text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
                            }
                        `}
                    >
                        <ListMusic size={16} /> Queue
                    </button>

                </div>
                <div className="absolute bottom-0 left-24 w-full h-24 bg-gradient-to-r from-transparent to-[#090909] pointer-events-none z-20"></div>
            </div>

            {/* 3. ÁREA DE CONTENIDO (Scrollable) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {activeTab === "music" ? (
                    <div className="p-0 h-full overflow-y-auto custom-scrollbar">
                        <NowPlayingSidebar />
                    </div>
                ) : activeTab === "queue" ? (
                    <div className="p-4 h-full overflow-y-auto custom-scrollbar">
                        <MusicQueueSidebar />
                    </div>
                ) : (
                    <div className="p-4 h-full overflow-y-auto custom-scrollbar">
                        <SocialSidebar />
                    </div>
                )}
            </div>

        </aside>
    );
}