"use client";
import { useState, useEffect, useRef } from "react";
import { X, Music, Upload } from "lucide-react";
import Image from "next/image";

interface EditPlaylistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; description: string; image: string | null }) => void;
    initialData: { name: string; description: string; image?: string } | null;
}

export default function EditPlaylistModal({ isOpen, onClose, onSubmit, initialData }: EditPlaylistModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [preview, setPreview] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cargar datos al abrir
    useEffect(() => {
        if (initialData && isOpen) {
            setName(initialData.name);
            setDescription(initialData.description || "");
            setPreview(initialData.image || null);
            setBase64Image(null); // Reseteamos base64 para no enviar imagen si no se cambió
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 256 * 1024) {
                alert("La imagen debe pesar menos de 256KB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setPreview(result);
                setBase64Image(result.replace(/^data:image\/(jpeg|jpg);base64,/, ""));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, description, image: base64Image });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#282828] rounded-xl shadow-2xl w-full max-w-2xl p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X /></button>
                <h2 className="text-2xl font-bold text-white mb-6">Editar Información</h2>

                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <div onClick={() => fileInputRef.current?.click()} className="relative w-48 h-48 bg-[#3E3E3E] cursor-pointer group shadow-lg">
                            {preview ? <Image src={preview} alt="Cover" fill className="object-cover shadow-lg" /> : <Music size={64} className="text-gray-500 m-auto mt-16" />}
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition"><Upload className="text-white" /><span className="text-white text-xs mt-2">Cambiar foto</span></div>
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/jpeg" className="hidden" onChange={handleImageChange} />
                    </div>

                    <div className="flex-1 flex flex-col gap-4">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-[#3E3E3E] p-3 text-white rounded font-bold" placeholder="Nombre" />
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="bg-[#3E3E3E] p-3 text-white rounded h-32 resize-none" placeholder="Descripción" />
                        <button type="submit" className="bg-white text-black font-bold py-3 rounded-full hover:scale-105 transition mt-auto">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}