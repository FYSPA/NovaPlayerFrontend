"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Library, Trash2, Pencil } from "lucide-react";
import CreatePlaylistModal from "@/components/dashboard/collection/CreatePlaylistModal";
import EditPlaylistModal from "@/components/dashboard/collection/EditPlaylistModal";
import useUser from "@/hooks/useUser";
// Importamos tu nuevo hook
import { useLibrary } from "@/hooks/useLibrary";

interface PlaylistManagerProps {
    isCollapsed: boolean;
}

export default function PlaylistManager({ isCollapsed }: PlaylistManagerProps) {
    // 1. Usamos la lógica del Hook (Limpio y elegante)
    const { playlists, createPlaylist, deletePlaylist, editPlaylist } = useLibrary();
    
    // 2. Datos del usuario (Para verificar dueño)
    const { user } = useUser();

    // 3. ESTADOS LOCALES (¡ESTO ES LO QUE FALTABA!)
    // Son necesarios para abrir/cerrar los modales y saber qué editar
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [playlistToEdit, setPlaylistToEdit] = useState<any>(null);

    // --- HANDLERS CONECTADOS AL HOOK ---

    const handleCreate = async (data: any) => {
        try {
            await createPlaylist(data); 
        } catch (e) { alert("Error al crear"); }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        if(!confirm("¿Borrar esta playlist?")) return;
        try {
            await deletePlaylist(id); 
        } catch(e) { alert("Error al borrar"); }
    };

    const handleEditConfirm = async (data: any) => {
        if(!playlistToEdit) return;
        try {
            await editPlaylist(playlistToEdit.id, data);
        } catch(e) { console.error(e); }
    };

    // Abrir Modal Editar
    const openEditModal = (e: React.MouseEvent, playlist: any) => {
        e.preventDefault();
        e.stopPropagation(); 
        setPlaylistToEdit({
            id: playlist.id,
            name: playlist.name,
            description: playlist.description,
            image: playlist.images?.[0]?.url
        });
        setIsEditOpen(true);
    }

    return (
        <>
            {/* --- MODALS --- */}
            <CreatePlaylistModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreate}
            />

            <EditPlaylistModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onSubmit={handleEditConfirm}
                initialData={playlistToEdit}
            />

            <div className="custom-scrollbar flex flex-col gap-2 px-2 h-full overflow-y-auto pb-20">

                {/* --- HEADER --- */}
                <div className={`flex items-center mb-2 mt-2 ${isCollapsed ? "justify-center" : "justify-between px-2"}`}>
                    {!isCollapsed && <h3 className="text-xs font-semibold uppercase text-gray-400 flex gap-2"><Library size={16} /> Your Library</h3>}
                    <button onClick={() => setIsCreateOpen(true)} className="text-gray-400 hover:text-white p-1 rounded-full transition"><Plus size={20} /></button>
                </div>

                {/* --- LIKED SONGS (Fijo) --- */}
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

                {!isCollapsed && <hr className="border-gray-800 mb-2 mx-2" />}

                {/* --- LISTA PLAYLISTS --- */}
                <ul className="flex flex-col gap-1">
                    {playlists.map((playlist) => {
                        // Verificamos si soy el dueño para mostrar botones
                        const isOwner = user && playlist.owner.id === user.spotifyId;

                        return (
                            <Link key={playlist.id} href={`/dashboard/collection/${playlist.id}`} className="group relative block">
                                <PlaylistItem
                                    label={playlist.name}
                                    image={playlist.images?.[0]?.url}
                                    author={playlist.owner.display_name}
                                    isCollapsed={isCollapsed}
                                />

                                {/* BOTONES FLOTANTES (Solo en Hover + Dueño + No Colapsado) */}
                                {!isCollapsed && isOwner && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-md p-1 backdrop-blur-sm z-10">
                                        <button
                                            onClick={(e) => openEditModal(e, playlist)}
                                            className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
                                            title="Editar"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(e, playlist.id)}
                                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-gray-700 rounded"
                                            title="Borrar"
                                        >
                                            <Trash2 size={14} />
                                        </button>
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

// --- COMPONENTE VISUAL ---
function PlaylistItem({ label, image, author, isCollapsed }: any) {
    return (
        <li className={`flex items-center transition-colors rounded-md ${isCollapsed ? "justify-center py-2" : "px-2 py-2 hover:bg-[#1A1A1A]"}`}>
            <div className="flex items-center gap-3 min-w-0 w-full">
                <div className="w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-[#282828] flex items-center justify-center shadow-sm">
                    {image ? <img src={image} alt={label} className="w-full h-full object-cover" /> : <Library size={20} className="text-gray-500" />}
                </div>
                {!isCollapsed && (
                    <div className="flex flex-col min-w-0 overflow-hidden pr-2">
                        <span className="text-sm text-gray-300 truncate font-medium">{label}</span>
                        <span className="text-xs text-gray-500 truncate">Playlist • {author}</span>
                    </div>
                )}
            </div>
        </li>
    )
}