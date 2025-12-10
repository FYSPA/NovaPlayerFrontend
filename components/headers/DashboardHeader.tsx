"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Para redirigir
import Link from "next/link";
import { House, Search, User, Bell } from "lucide-react";
import { RxDividerVertical } from "react-icons/rx";

export default function DashboardHeader() {
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    // 2. Función que se ejecuta al dar Enter
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchTerm.trim() !== "") {
            router.push(`/dashboard/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <header className="flex justify-between items-center p-4 bg-[#090909] sticky top-0 z-50">

            {/* LADO IZQUIERDO: HOME + BUSCADOR */}
            <div className="flex items-center gap-2 relative w-full max-w-xl">
                <div className="bg-[#1f1f1f] p-2 rounded-full cursor-pointer hover:bg-[#333] transition">
                    <Link href="/dashboard">
                        <House size={25} color="white" />
                    </Link>
                </div>

                {/* INPUT CONTROLADO */}
                <div className="relative w-full">
                    <input
                        type="text"
                        className="bg-[#1f1f1f] p-2 pl-4 rounded-full w-full text-white pr-20 outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder-gray-400"
                        placeholder="¿What are you looking for?"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="absolute right-3 top-2 flex items-center pointer-events-none">
                        <RxDividerVertical size={25} color="gray" />
                        <Search size={20} color="white" />
                    </div>
                </div>
            </div>

            {/* LADO DERECHO: USUARIO */}
            <div className="flex items-center gap-2">
                <div className="bg-[#1f1f1f] p-2 rounded-full cursor-pointer hover:bg-[#333] transition">
                    <Bell size={25} color="white" />
                </div>
                <div className="bg-[#1f1f1f] p-2 rounded-full cursor-pointer hover:bg-[#333] transition">
                    <Link href="/dashboard/profile"> {/* Opcional: Link al perfil */}
                        <User size={25} color="white" />
                    </Link>
                </div>
            </div>
        </header>
    )
}