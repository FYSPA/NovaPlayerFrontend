'use client';
import Image from 'next/image';
import Link from 'next/link';
import { BsSpotify } from "react-icons/bs";
import { ArrowLeft } from 'lucide-react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Lógica deshabilitada
        return; 
    };

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">

            {/* 1. IMAGEN DE FONDO */}
            <Image
                src="/assets/auth/LoginBackground.png"
                alt="Login Background"
                fill
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
                priority
            />

            {/* 2. DEGRADADO MÓVIL */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-0 lg:hidden"></div>

            {/* 3. CONTENEDOR PRINCIPAL */}
            <div className="relative z-10 flex flex-col h-full lg:flex-row lg:justify-end">

                {/* 4. CAJA DEL FORMULARIO */}
                <div className="w-full lg:w-[40rem] h-full flex flex-col justify-center px-8 pb-10 lg:pb-0 
                                bg-transparent lg:bg-white 
                                text-white lg:text-black transition-colors duration-300">

                    <Link href="/" className="absolute lg:top-6 lg:left-6 right-6 top-5 hover:opacity-70 transition-opacity">
                        <ArrowLeft size={35} className="text-white lg:text-black" />
                    </Link>

                    <h1 className="text-5xl lg:text-6xl font-bold mb-8 lg:mb-10 text-start font-saira mt-20 lg:mt-0">
                        Login
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        <label htmlFor="email" className="font-bold text-white lg:text-black opacity-50">Email</label>
                        <input
                            name="email"
                            type="email"
                            disabled={true} // DESHABILITADO
                            placeholder="Deshabilitado temporalmente"
                            className="p-3 rounded-lg border border-gray-400/50 
                                     bg-white/10 lg:bg-gray-100 
                                     text-white lg:text-gray-500 
                                     placeholder-gray-400 
                                     focus:outline-none 
                                     opacity-50 cursor-not-allowed" // ESTILOS DE DESHABILITADO
                            onChange={handleChange}
                        />

                        <label htmlFor="password" className="font-bold text-white lg:text-black opacity-50">Password</label>
                        <input
                            name="password"
                            type="password"
                            disabled={true} // DESHABILITADO
                            placeholder="••••••"
                            className="p-3 rounded-lg border border-gray-400/50 
                                     bg-white/10 lg:bg-gray-100 
                                     text-white lg:text-gray-500 
                                     placeholder-gray-400 
                                     focus:outline-none 
                                     opacity-50 cursor-not-allowed" // ESTILOS DE DESHABILITADO
                            onChange={handleChange}
                        />

                        {error && <p className="text-red-400 lg:text-red-500 font-bold bg-black/20 lg:bg-transparent p-2 rounded">{error}</p>}

                        {/* Link deshabilitado con pointer-events-none */}
                        <Link href="/forgot-password" className="text-right text-gray-400 pointer-events-none opacity-50">
                            Forgot Password?
                        </Link>

                        <span>It's only available now on Spotify</span>
                        <a
                            href="http://localhost:9000/auth/spotify" 
                            className="bg-black text-white p-2 rounded-lg hover:bg-gray-900 transition flex justify-center items-center gap-2 mt-4 w-full border border-white/20 lg:border-transparent cursor-pointer relative z-50"
                        >
                            <BsSpotify size={25} className="text-green-500" /> 
                            <span>Sign in with Spotify</span>
                        </a>

                        {/* Botón Login deshabilitado */}
                        <button
                            disabled={true} // SIEMPRE DESHABILITADO
                            type="submit"
                            className="bg-blue-600/50 text-white/50 p-3 rounded-lg font-bold mt-2 shadow-none cursor-not-allowed"
                        >
                            Login (Disabled)
                        </button>

                        {/* Link Registro deshabilitado */}
                        <p className="text-center font-saira mt-6 text-gray-500 lg:text-gray-400 opacity-50">
                            Don't have an account? <span className="text-blue-400/50 font-bold cursor-not-allowed">Register</span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}