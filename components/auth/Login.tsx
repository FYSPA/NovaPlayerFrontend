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
        setError('');

        try {
            const { data } = await api.post('/auth/login', form);
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Credenciales incorrectas');
        }
    };

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">

            {/* 1. IMAGEN DE FONDO (Z-0) */}
            {/* En móvil se ve completa. En escritorio (lg) la opacidad baja porque hay un sidebar blanco encima */}
            <Image
                src="/assets/auth/LoginBackground.png"
                alt="Login Background"
                fill
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
                priority
            />

            {/* 2. DEGRADADO MÓVIL (Visible solo en móvil) */}
            {/* Esto oscurece el fondo para que el texto blanco se lea bien sobre la imagen */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-0 lg:hidden"></div>

            {/* 3. CONTENEDOR PRINCIPAL (Z-10) */}
            <div className="relative z-10 flex flex-col h-full lg:flex-row lg:justify-end">

                {/* 4. CAJA DEL FORMULARIO */}
                {/* 
                    Móvil: w-full, fondo transparente (para ver imagen), texto blanco, justificado abajo/centro
                    Escritorio (lg): w-[40rem], fondo blanco, texto negro, altura completa
                */}
                <div className="w-full lg:w-[40rem] h-full flex flex-col justify-center px-8 pb-10 lg:pb-0 
                                bg-transparent lg:bg-white 
                                text-white lg:text-black transition-colors duration-300">

                    {/* Botón Regresar */}
                    <Link href="/" className="absolute lg:top-6 lg:left-6 right-6 top-5 hover:opacity-70 transition-opacity">
                        {/* El icono cambia de color: blanco en móvil, negro en escritorio */}
                        <ArrowLeft size={35} className="text-white lg:text-black" />
                    </Link>

                    <h1 className="text-5xl lg:text-6xl font-bold mb-8 lg:mb-10 text-start font-saira mt-20 lg:mt-0">
                        Login
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* Label: blanco en móvil, negro en escritorio */}
                        <label htmlFor="email" className="font-bold text-white lg:text-black">Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="example@mail.com"
                            /* Inputs: Fondo semitransparente en móvil para estilo moderno, borde gris */
                            className="p-3 rounded-lg border border-gray-400/50 
                                     bg-white/10 lg:bg-white 
                                     text-white lg:text-black 
                                     placeholder-gray-300 lg:placeholder-gray-500
                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="password" className="font-bold text-white lg:text-black">Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="p-3 rounded-lg border border-gray-400/50 
                                     bg-white/10 lg:bg-white 
                                     text-white lg:text-black 
                                     placeholder-gray-300 lg:placeholder-gray-500
                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            required
                        />

                        {error && <p className="text-red-400 lg:text-red-500 font-bold bg-black/20 lg:bg-transparent p-2 rounded">{error}</p>}

                        <Link href="/forgot-password" className="text-right text-gray-300 lg:text-gray-500 hover:text-white lg:hover:text-black transition-colors">
                            Forgot Password?
                        </Link>

                        {/* Botones: Se mantienen similares, ajustando sombras */}
                        <a
                            href="http://localhost:9000/auth/spotify" // <-- Apunta directo a tu backend
                            className="bg-black text-white p-2 rounded-lg hover:bg-gray-900 transition flex justify-center items-center gap-2 mt-2 w-full"
                        >
                            <BsSpotify size={25} className="text-green-500" /> {/* Usa un icono de Spotify */}
                            <span>Sign in with Spotify</span>
                        </a>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-bold mt-2 shadow-lg shadow-blue-900/20"
                        >
                            Login
                        </button>

                        <p className="text-center font-saira mt-6 text-gray-200 lg:text-black">
                            Don't have an account? <Link href="/register" className="text-blue-400 lg:text-blue-600 font-bold hover:underline">Register</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}