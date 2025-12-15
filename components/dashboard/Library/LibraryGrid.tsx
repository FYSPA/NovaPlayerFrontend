"use client";
import Link from "next/link";
import Image from "next/image";
import { Plus, Library, Heart, Pencil, Trash2 } from "lucide-react";
import CreatePlaylistModal from "@/components/dashboard/collection/CreatePlaylistModal";
import EditPlaylistModal from "@/components/dashboard/collection/EditPlaylistModal";
import { usePlaylistManager } from "@/hooks/usePlaylistManager"; // <--- REUTILIZAMOS CEREBRO

export default function LibraryGrid() {
    const { 
        playlists, user, 
        isCreateOpen, setIsCreateOpen, 
        isEditOpen, setIsEditOpen, playlistToEdit,
        handleCreate, handleDelete, handleEditConfirm, openEditModal 
    } = usePlaylistManager();

    return (
        <div className="p-6 pb-32">
            <CreatePlaylistModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSubmit={handleCreate} />
            <EditPlaylistModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} onSubmit={handleEditConfirm} initialData={playlistToEdit} />

            <div className="flex justify-between items-center mb-6">
                <button 
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-white text-black px-4 py-2 rounded-full font-bold hover:scale-105 transition flex items-center gap-2"
                >
                    <Plus size={20} /> Create Playlist
                </button>
            </div>

            {/* GRILLA RESPONSIVA GRANDE */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                
                {/* 1. TARJETA LIKED SONGS */}
                <Link href="/dashboard/favorites" className="group">
                    <div className="bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition duration-300 h-full flex flex-col relative">
                        <div className="relative aspect-square w-full mb-4 shadow-lg rounded-md overflow-hidden bg-gradient-to-br from-[#450af5] to-[#c4efd9] flex items-center justify-center">
                            <Heart size={64} className="text-white fill-white" />
                        </div>
                        <h3 className="text-white font-bold truncate text-lg">Liked Songs</h3>
                        <p className="text-gray-400 text-sm mt-1">Auto Generated</p>
                    </div>
                </Link>

                {/* 2. PLAYLISTS */}
                {playlists.map((playlist) => {
                    const isOwner = user && playlist.owner.id === user.spotifyId;
                    
                    return (
                        <Link key={playlist.id} href={`/dashboard/collection/${playlist.id}`} className="group">
                            <div className="bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition duration-300 h-full flex flex-col relative group/card">
                                
                                {/* IMAGEN */}
                                <div className="relative aspect-square w-full mb-4 shadow-lg rounded-md overflow-hidden bg-[#333] flex items-center justify-center">
                                    {playlist.images?.[0]?.url ? (
                                        <Image src={playlist.images[0].url} alt={playlist.name} fill className="object-cover" />
                                    ) : (
                                        <Library size={48} className="text-gray-500" />
                                    )}
                                    
                                    {/* Botones de acción flotantes (Solo para el dueño) */}
                                    {isOwner && (
                                        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                            <button 
                                                onClick={(e) => openEditModal(e, playlist)}
                                                className="bg-black/70 p-2 rounded-full text-white hover:scale-110 hover:bg-black transition"
                                                title="Editar"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button 
                                                onClick={(e) => handleDelete(e, playlist.id)}
                                                className="bg-black/70 p-2 rounded-full text-red-500 hover:scale-110 hover:bg-black transition"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* TEXTO */}
                                <h3 className="text-white font-bold truncate text-base">{playlist.name}</h3>
                                <p className="text-gray-400 text-sm mt-1 line-clamp-2">By {playlist.owner.display_name}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}