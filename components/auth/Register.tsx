'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";
import { ArrowLeft } from 'lucide-react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Register() {
    const router = useRouter();

    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
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
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-70"
                priority
            />

            {/* 2. DEGRADADO MÓVIL */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-0 lg:hidden"></div>

            {/* 3. CONTENEDOR PRINCIPAL */}
            <div className="relative z-10 flex flex-col justify-end items-end h-full">

                {/* 4. CAJA DEL FORMULARIO */}
                <div className="w-full lg:w-[40rem] h-full flex flex-col justify-center px-8 pb-10 lg:pb-0
                                bg-transparent lg:bg-white 
                                text-white lg:text-black 
                                transition-colors duration-300 overflow-y-auto lg:overflow-visible">

                    {/* Botón Regresar (Este lo dejamos activo para poder salir) */}
                    <Link href="/" className="absolute lg:top-6 lg:left-10 top-5 right-6 hover:opacity-70 transition-opacity">
                        <ArrowLeft size={35} className="text-white lg:text-black" />
                    </Link>

                    <h1 className="text-5xl lg:text-7xl font-bold mt-16 lg:mt-6 mb-8 lg:mb-10 text-start font-saira">
                        Register
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* INPUT NAME */}
                        <label htmlFor="name" className="font-bold text-white lg:text-black opacity-50">Username</label>
                        <input
                            name="name"
                            type="text"
                            disabled={true} // DESHABILITADO
                            value={form.name}
                            placeholder="Deshabilitado"
                            className="p-3 rounded-lg border border-gray-400/50 
                                     bg-white/10 lg:bg-gray-100 
                                     text-white lg:text-gray-500 
                                     placeholder-gray-400 font-poppins
                                     focus:outline-none 
                                     opacity-50 cursor-not-allowed" // ESTILOS DESHABILITADO
                            onChange={handleChange}
                        />

                        {/* INPUT EMAIL */}
                        <label htmlFor="email" className="font-bold text-white lg:text-black opacity-50">Email</label>
                        <input
                            name="email"
                            type="email"
                            disabled={true} // DESHABILITADO
                            value={form.email}
                            placeholder="Deshabilitado"
                            className="p-3 rounded-lg border border-gray-400/50 
                                     bg-white/10 lg:bg-gray-100 
                                     text-white lg:text-gray-500 
                                     placeholder-gray-400 font-poppins
                                     focus:outline-none 
                                     opacity-50 cursor-not-allowed"
                            onChange={handleChange}
                        />

                        {/* INPUT PASSWORD */}
                        <label htmlFor="password" className="font-bold text-white lg:text-black opacity-50">Password</label>
                        <input
                            name="password"
                            type="password"
                            disabled={true} // DESHABILITADO
                            value={form.password}
                            placeholder="••••••"
                            className="p-3 rounded-lg border border-gray-400/50 
                                     bg-white/10 lg:bg-gray-100 
                                     text-white lg:text-gray-500 
                                     placeholder-gray-400 font-poppins
                                     focus:outline-none 
                                     opacity-50 cursor-not-allowed"
                            onChange={handleChange}
                        />

                        {/* INPUT CONFIRM PASSWORD */}
                        <label htmlFor="confirmPassword" className="font-bold text-white lg:text-black opacity-50">Confirm Password</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            disabled={true} // DESHABILITADO
                            value={form.confirmPassword}
                            placeholder="••••••"
                            className="p-3 rounded-lg border border-gray-400/50 
                                     bg-white/10 lg:bg-gray-100 
                                     text-white lg:text-gray-500 
                                     placeholder-gray-400 font-poppins
                                     focus:outline-none 
                                     opacity-50 cursor-not-allowed"
                            onChange={handleChange}
                        />

                        {error && <p className="text-red-400 lg:text-red-500 font-bold bg-black/20 lg:bg-transparent p-2 rounded">{error}</p>}

                        {/* Botón Google DESHABILITADO */}
                        <button
                            type="button"
                            disabled={true}
                            className="bg-white/50 lg:bg-gray-200 text-black/50 lg:text-gray-500 p-2 rounded-lg transition flex justify-center items-center gap-2 mt-2 shadow-none opacity-50 cursor-not-allowed"
                        >
                            <FcGoogle size={25} className="opacity-50" /> <span className="lg:hidden font-semibold">Sign up with Google</span>
                        </button>

                        {/* Botón Register DESHABILITADO */}
                        <button
                            type="submit"
                            disabled={true}
                            className="bg-blue-600/50 text-white/50 p-3 rounded-lg font-bold mt-2 shadow-none opacity-50 cursor-not-allowed"
                        >
                            Register (Disabled)
                        </button>

                        {/* Link Login DESHABILITADO */}
                        <p className="text-center font-saira text-gray-500 lg:text-gray-400 mt-4 opacity-50">
                            Already have an account? <span className="text-blue-400/50 lg:text-blue-500/50 font-bold cursor-not-allowed">Login</span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}