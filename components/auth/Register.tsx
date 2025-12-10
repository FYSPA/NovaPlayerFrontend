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
        setError('');
        console.log("Datos que se enviarán:", form);

        if (form.password !== form.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            await api.post('/users', {
                name: form.name,
                email: form.email,
                password: form.password
            });

            router.push(`/verify?email=${form.email}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al registrarse');
        }
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

            {/* 2. DEGRADADO MÓVIL (Para leer texto blanco sobre imagen) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-0 lg:hidden"></div>

            {/* 3. CONTENEDOR PRINCIPAL */}
            <div className="relative z-10 flex flex-col justify-end items-end h-full">

                {/* 4. CAJA DEL FORMULARIO */}
                {/* 
                   - Móvil: w-full, fondo transparente, texto blanco, padding grande abajo.
                   - Escritorio (lg): w-[40rem], fondo blanco, texto negro.
                */}
                <div className="w-full lg:w-[40rem] h-full flex flex-col justify-center px-8 pb-10 lg:pb-0
                                bg-transparent lg:bg-white 
                                text-white lg:text-black 
                                transition-colors duration-300 overflow-y-auto lg:overflow-visible">

                    {/* Botón Regresar (Corregido: Link directo sin button) */}
                    <Link href="/" className="absolute lg:top-6 lg:left-10 top-5 right-6 hover:opacity-70 transition-opacity">
                        <ArrowLeft size={35} className="text-white lg:text-black" />
                    </Link>

                    {/* Título: Ajustado tamaño para móvil (5xl) y escritorio (7xl/8xl) */}
                    <h1 className="text-5xl lg:text-7xl font-bold mt-16 lg:mt-6 mb-8 lg:mb-10 text-start font-saira">
                        Register
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* INPUT NAME */}
                        <label htmlFor="name" className="font-bold text-white lg:text-black">Username</label>
                        <input
                            name="name"
                            type="text"
                            value={form.name}
                            placeholder="Username"
                            /* Inputs estilo "Cristal" en móvil, estilo sólido en escritorio */
                            className="p-3 rounded-lg border border-gray-400/50 
                                     bg-white/10 lg:bg-white 
                                     text-white lg:text-black 
                                     placeholder-gray-300 lg:placeholder-gray-500 font-poppins
                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            required
                        />

                        {/* INPUT EMAIL */}
                        <label htmlFor="email" className="font-bold text-white lg:text-black">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            placeholder="example@gmail.com"
                            className="p-3 rounded-lg border border-gray-400/50 
                                     bg-white/10 lg:bg-white 
                                     text-white lg:text-black 
                                     placeholder-gray-300 lg:placeholder-gray-500 font-poppins
                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            required
                        />

                        {/* INPUT PASSWORD */}
                        <label htmlFor="password" className="font-bold text-white lg:text-black">Password</label>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            placeholder="Password"
                            className="p-3 rounded-lg border border-gray-400/50 
                                     bg-white/10 lg:bg-white 
                                     text-white lg:text-black 
                                     placeholder-gray-300 lg:placeholder-gray-500 font-poppins
                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            required
                        />

                        {/* INPUT CONFIRM PASSWORD */}
                        <label htmlFor="confirmPassword" className="font-bold text-white lg:text-black">Confirm Password</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            value={form.confirmPassword}
                            placeholder="Repeat Password"
                            className="p-3 rounded-lg border border-gray-400/50 
                                     bg-white/10 lg:bg-white 
                                     text-white lg:text-black 
                                     placeholder-gray-300 lg:placeholder-gray-500 font-poppins
                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            required
                        />

                        {error && <p className="text-red-400 lg:text-red-500 font-bold bg-black/20 lg:bg-transparent p-2 rounded">{error}</p>}

                        {/* Botón Google */}
                        <button
                            type="button"
                            className="bg-white lg:bg-black text-black lg:text-white p-2 rounded-lg hover:bg-gray-200 lg:hover:bg-gray-900 transition flex justify-center items-center gap-2 mt-2 shadow-lg"
                        >
                            <FcGoogle size={25} /> <span className="lg:hidden font-semibold">Sign up with Google</span>
                        </button>

                        {/* Botón Register */}
                        <button
                            type="submit"
                            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-bold mt-2 shadow-lg shadow-blue-900/20"
                        >
                            Register
                        </button>

                        <p className="text-center font-saira text-gray-200 lg:text-black mt-4">
                            Already have an account? <Link href="/login" className="text-blue-400 lg:text-blue-500 font-bold hover:underline">Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}