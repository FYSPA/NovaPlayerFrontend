"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Library, Trash2, Pencil } from "lucide-react";
import CreatePlaylistModal from "@/components/dashboard/collection/CreatePlaylistModal";
import EditPlaylistModal from "@/components/dashboard/collection/EditPlaylistModal";
import api from "@/utils/api";
import useUser from "@/hooks/useUser";

interface PlaylistManagerProps {
    isCollapsed: boolean;
}

export default function PlaylistManager({ isCollapsed }: PlaylistManagerProps) {
    // 1. ESTADOS
    const [playlists, setPlaylists] = useState<any[]>([]);

    // Estado para el Modal de Crear
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Estados para el Modal de Editar (LOS QUE TE FALTABAN)
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [playlistToEdit, setPlaylistToEdit] = useState<any>(null);

    // Usuario actual (para verificar si es dueño de la playlist)
    const { user } = useUser();

    // 2. FUNCIÓN CARGAR PLAYLISTS
    const fetchPlaylists = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const { data } = await api.get('/spotify/playlists', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPlaylists(data);
        } catch (error) {
            console.error("Error cargando playlists", error);
        }
    };

    // 3. EFECTOS (Carga inicial + Sincronización al enfocar)
    useEffect(() => {
        fetchPlaylists();

        const onFocus = () => fetchPlaylists();
        window.addEventListener("focus", onFocus);

        return () => window.removeEventListener("focus", onFocus);
    }, []);

    // 4. MANEJADORES DE ACCIONES (Handlers)

    // Crear
    const handleCreate = async (data: any) => {
        const token = localStorage.getItem('token');
        try {
            await api.post('/spotify/playlist', data, { headers: { Authorization: `Bearer ${token}` } });
            fetchPlaylists();
        } catch (error) {
            console.error(error);
            alert("Error al crear. Verifica tus permisos.");
        }
    };

    // Borrar
    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        if (!confirm("¿Seguro que quieres borrar esta playlist?")) return;

        const token = localStorage.getItem('token');
        try {
            // Actualización visual inmediata (Optimista)
            setPlaylists(prev => prev.filter(p => p.id !== id));

            await api.delete(`/spotify/playlist/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchPlaylists(); // Recarga real
        } catch (err) {
            alert("No se pudo borrar");
            fetchPlaylists(); // Revertir si falló
        }
    };

    // Abrir Modal Editar
    const openEditModal = (e: React.MouseEvent, playlist: any) => {
        e.preventDefault();
        e.stopPropagation(); // Evita que el clic abra la playlist
        setPlaylistToEdit({
            id: playlist.id,
            name: playlist.name,
            description: playlist.description,
            image: playlist.images?.[0]?.url
        });
        setIsEditOpen(true);
    }

    // Confirmar Edición
    const handleEditConfirm = async (data: any) => {
        if (!playlistToEdit) return;
        const token = localStorage.getItem('token');
        try {
            await api.put(`/spotify/playlist/${playlistToEdit.id}`, data, { headers: { Authorization: `Bearer ${token}` } });
            fetchPlaylists();
        } catch (err) { console.error(err); }
    };

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

// --- COMPONENTE VISUAL PLAYLIST ITEM ---
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