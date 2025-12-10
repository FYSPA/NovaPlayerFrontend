"use client";
import { useState, useRef } from "react";
import { X, Music, Upload } from "lucide-react";
import Image from "next/image";

interface CreatePlaylistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; description: string; image: string | null }) => void;
}

export default function CreatePlaylistModal({ isOpen, onClose, onSubmit }: CreatePlaylistModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [preview, setPreview] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    // Manejar la selección de imagen
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validar tamaño (Spotify: Max 256KB)
            if (file.size > 256 * 1024) {
                alert("La imagen es muy pesada. Spotify solo acepta imágenes menores a 256KB.");
                return;
            }

            // Crear preview y Base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setPreview(result);
                // Spotify necesita el Base64 SIN el prefijo "data:image/jpeg;base64,"
                const base64Clean = result.replace(/^data:image\/(jpeg|jpg);base64,/, "");
                setBase64Image(base64Clean);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        onSubmit({ name, description, image: base64Image });
        // Limpiar estados
        setName("");
        setDescription("");
        setPreview(null);
        setBase64Image(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#282828] rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h2 className="text-2xl font-bold text-white">Crear Playlist</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col md:flex-row gap-6">

                    {/* COLUMNA IZQUIERDA: IMAGEN */}
                    <div className="flex flex-col items-center gap-3">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="group relative w-48 h-48 bg-[#3E3E3E] shadow-inner flex items-center justify-center cursor-pointer overflow-hidden rounded-md hover:bg-[#4a4a4a] transition"
                        >
                            {preview ? (
                                <Image src={preview} alt="Preview" fill className="object-cover" />
                            ) : (
                                <Music size={64} className="text-gray-500 group-hover:hidden" />
                            )}

                            {/* Overlay de Hover */}
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                                <Upload size={32} className="text-white mb-2" />
                                <span className="text-white text-xs font-bold">Elegir foto</span>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </div>
                        <span className="text-[10px] text-gray-400">Max 256KB • JPG</span>
                    </div>

                    {/* COLUMNA DERECHA: INPUTS */}
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <input
                                type="text"
                                autoFocus
                                placeholder="Nombre de la playlist"
                                className="bg-[#3E3E3E] border-none rounded p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-white/20 outline-none text-sm font-bold"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1 flex-1">
                            <textarea
                                placeholder="Añadir una descripción opcional"
                                className="bg-[#3E3E3E] border-none rounded p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-white/20 outline-none text-sm resize-none h-32 custom-scrollbar"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 font-bold text-white hover:text-green-500 transition text-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-3 font-bold text-black bg-white rounded-full hover:scale-105 transition text-sm"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}