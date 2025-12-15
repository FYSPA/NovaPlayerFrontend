// src/hooks/usePlaylistManager.ts
import { useState } from "react";
import { useLibrary } from "@/hooks/useLibrary";
import useUser from "@/hooks/useUser";

export function usePlaylistManager() {
    const { playlists, createPlaylist, deletePlaylist, editPlaylist } = useLibrary();
    const { user } = useUser();

    // Estados de los Modales
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [playlistToEdit, setPlaylistToEdit] = useState<any>(null);

    // --- ACCIONES ---
    const handleCreate = async (data: any) => {
        try {
            await createPlaylist(data);
            // Opcional: setIsCreateOpen(false) aquí si el modal no lo hace
        } catch (e) { alert("Error al crear"); }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation(); // Importante para no navegar al borrar
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
    };

    // Retornamos todo lo necesario para que CUALQUIER vista funcione
    return {
        playlists,
        user,
        // Modales
        isCreateOpen,
        setIsCreateOpen,
        isEditOpen,
        setIsEditOpen,
        playlistToEdit,
        // Funciones
        handleCreate,
        handleDelete,
        handleEditConfirm,
        openEditModal
    };
}