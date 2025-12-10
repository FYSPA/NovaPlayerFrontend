'use client' // Importante para usar usePathname

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, Star, Mic, MoreHorizontal, ChevronLeft, Settings, Crown, Plus, Library, Trash2 } from "lucide-react";
import PlaylistManager from "./collection/PlaylistManager";
import { useRouter } from 'next/navigation';
import useUser from "@/hooks/useUser";

interface SidebarProps {
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

export default function Sidebar({ isCollapsed, toggleCollapse }: SidebarProps) {
    const router = useRouter();
    const { user, loading: userLoading } = useUser();
    if (userLoading) return null;
    return (
        <aside className={
            `h-full bg-[#090909] text-gray-400 flex flex-col border-r border-gray-900 font-sans transition-all duration-300
            ${isCollapsed ? "w-20 p-2 items-center" : "w-full p-6"}`
        }>

            {/* 1. CONTROLES DE VENTANA + BOTÓN TOGGLE */}
            <div className={`flex w-full mb-8 ${isCollapsed ? "flex-col-reverse gap-6 items-center" : "justify-between items-center"}`}>

                {!isCollapsed && (
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer"></div>
                    </div>
                )}

                <button
                    onClick={toggleCollapse}
                    className="bg-[#1A1A1A] p-1.5 rounded-full hover:text-white transition shadow-sm"
                >
                    <ChevronLeft size={16} className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
                </button>
            </div>

            {/* 2. HEADER DEL SIDEBAR */}
            <div className={`flex items-center mb-8 ${isCollapsed ? "justify-center" : "justify-between w-full px-2"}`}>
                {!isCollapsed ? (
                    <>
                        <h1 className="text-xl font-bold text-white tracking-wide truncate">{user?.name}</h1>
                        <button className="hover:text-white"><MoreHorizontal size={20} /></button>
                    </>
                ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    </div>
                )}
            </div>

            {/* 3. MENÚ PRINCIPAL */}
            <div className="w-full">
                {!isCollapsed && <h3 className="text-xs font-semibold uppercase tracking-wider mb-4 px-2 text-gray-500">Menu</h3>}

                <nav className="flex flex-col gap-2 w-full">
                    {/* Items detectan automáticamente si están activos */}
                    <SidebarItem href="/dashboard" icon={<Home size={20} />} label="Home" isCollapsed={isCollapsed} />
                    <SidebarItem href="/dashboard/search" icon={<Search size={20} />} label="Search" isCollapsed={isCollapsed} />
                    <SidebarItem href="/dashboard/favorites" icon={<Heart size={20} />} label="Favorites" isCollapsed={isCollapsed} />
                </nav>
            </div>

            <div className="flex flex-col gap-2 mb-6 border-b border-gray-800 pb-6 w-full">

            </div>

            <div className="flex-1 min-h-0 overflow-y-auto w-full custom-scrollbar">
                <PlaylistManager isCollapsed={isCollapsed} />
            </div>

            <div className="mt-auto pt-6 border-t border-gray-800 w-full flex flex-col gap-2">
                <SidebarItem href="/dashboard/settings" icon={<Settings size={20} />} label="Settings" isCollapsed={isCollapsed} />

                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        router.push('/login');
                    }}
                    className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition "
                >
                    Log Out
                </button>
            </div>
        </aside>
    );
}


function SidebarItem({ href, icon, label, isCollapsed }: any) {
    const pathname = usePathname(); // Obtenemos la ruta actual
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            title={isCollapsed ? label : ""}
            className={`
                relative flex items-center gap-4 transition-all duration-300 group
                ${isCollapsed
                    ? "justify-center p-2 rounded-lg"
                    : "px-4 py-3 rounded-l-lg"
                }
                ${isActive
                    ? "bg-[#121212] text-white"
                    : "hover:bg-[#1A1A1A] hover:text-white text-gray-400"
                }
            `}
        >
            <div className={`transition-transform group-hover:scale-110 ${isActive ? "text-white" : ""}`}>
                {icon}
            </div>

            {!isCollapsed && (
                <span className={`whitespace-nowrap overflow-hidden text-sm ${isActive ? "font-bold" : "font-medium"}`}>
                    {label}
                </span>
            )}

            {isActive && !isCollapsed && (
                <div className="absolute right-0 top-0 h-full w-1 bg-green-500 rounded-l-md shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse"></div>
            )}
            {isActive && isCollapsed && (
                <div className="absolute top-1 right-2 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>
            )}
        </Link>
    )
}

