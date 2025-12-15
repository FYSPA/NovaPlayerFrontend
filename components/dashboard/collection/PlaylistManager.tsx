"use client";
import Link from "next/link";
import { Plus, Library, Trash2, Pencil } from "lucide-react";
import CreatePlaylistModal from "@/components/dashboard/collection/CreatePlaylistModal";
import EditPlaylistModal from "@/components/dashboard/collection/EditPlaylistModal";
import { usePlaylistManager } from "@/hooks/usePlaylistManager"; // <--- IMPORTAMOS LA LÓGICA

export default function PlaylistManager({ isCollapsed }: { isCollapsed: boolean }) {
    // Usamos el hook y extraemos todo
    const { 
        playlists, user, 
        isCreateOpen, setIsCreateOpen, 
        isEditOpen, setIsEditOpen, playlistToEdit,
        handleCreate, handleDelete, handleEditConfirm, openEditModal 
    } = usePlaylistManager();

    return (
        <>
            {/* Los modales viven aquí (o podrías hacer un componente Wrapper) */}
            <CreatePlaylistModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSubmit={handleCreate} />
            <EditPlaylistModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} onSubmit={handleEditConfirm} initialData={playlistToEdit} />

            <div className="custom-scrollbar flex flex-col gap-2 px-2 h-full overflow-y-auto pb-20">
                {/* HEADER SIDEBAR */}
                <div className={`flex items-center mb-2 mt-2 ${isCollapsed ? "justify-center" : "justify-between px-2"}`}>
                    <Link href={"/dashboard/library"}>{!isCollapsed && <h3 className="hover:text-green-400 text-xs font-semibold uppercase text-gray-400 flex gap-2"><Library size={16} /> Your Library</h3>}</Link>
                    <button onClick={() => setIsCreateOpen(true)} className="text-gray-400 hover:text-white p-1 rounded-full transition"><Plus size={20} /></button>
                </div>

                {/* LIKED SONGS (Sidebar Version) */}
                <div className="mb-2">
                    <Link href="/dashboard/favorites">
                        <li className={`flex items-center gap-3 rounded-md cursor-pointer group transition-colors ${isCollapsed ? "justify-center py-2" : "px-2 py-2 hover:bg-[#1A1A1A]"}`}>
                            <div className="w-12 h-12 bg-gradient-to-br from-[#450af5] to-[#c4efd9] flex items-center justify-center rounded-md text-white shadow-md flex-shrink-0">
                                <span className="text-lg">♥</span>
                            </div>
                            {!isCollapsed && (
                                <div className="flex flex-col">
                                    <span className="text-white font-medium text-sm">Liked Songs</span>
                                    <span className="text-gray-500 text-xs">Playlist • Auto</span>
                                </div>
                            )}
                        </li>
                    </Link>
                </div>

                {/* LISTA SIDEBAR */}
                <ul className="flex flex-col gap-1">
                    {playlists.map((playlist) => {
                        const isOwner = user && playlist.owner.id === user.spotifyId;
                        return (
                            <Link key={playlist.id} href={`/dashboard/collection/${playlist.id}`} className="group relative block">
                                <li className={`flex items-center transition-colors rounded-md ${isCollapsed ? "justify-center py-2" : "px-2 py-2 hover:bg-[#1A1A1A]"}`}>
                                    <div className="flex items-center gap-3 min-w-0 w-full">
                                        <div className="w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-[#282828] flex items-center justify-center shadow-sm">
                                            {playlist.images?.[0]?.url ? <img src={playlist.images[0].url} alt={playlist.name} className="w-full h-full object-cover" /> : <Library size={20} className="text-gray-500" />}
                                        </div>
                                        {!isCollapsed && (
                                            <div className="flex flex-col min-w-0 overflow-hidden pr-2">
                                                <span className="text-sm text-gray-300 truncate font-medium">{playlist.name}</span>
                                                <span className="text-xs text-gray-500 truncate">Playlist • {playlist.owner.display_name}</span>
                                            </div>
                                        )}
                                    </div>
                                </li>
                                {/* Botones de editar/borrar flotantes */}
                                {!isCollapsed && isOwner && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-md p-1 backdrop-blur-sm z-10">
                                        <button onClick={(e) => openEditModal(e, playlist)} className="p-1 text-gray-300 hover:text-white"><Pencil size={14} /></button>
                                        <button onClick={(e) => handleDelete(e, playlist.id)} className="p-1 text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </ul>
            </div>
        </>
    );
}