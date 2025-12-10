'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/utils/api';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function ResetForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token'); // Leemos el token de la URL

    const [newPassword, setNewPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return setError('Token inválido');

        try {
            await api.post('/auth/reset-password', { token, newPassword });
            setMsg('¡Contraseña actualizada! Redirigiendo...');
            setTimeout(() => router.push('/login'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'El token es inválido o expiró');
        }
    };

    if (!token) return <p className="text-white">Enlace inválido.</p>;

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
                    <Link href="/forgot-password" className="absolute lg:top-6 lg:left-6 right-6 top-5 hover:opacity-70 transition-opacity">
                        {/* El icono cambia de color: blanco en móvil, negro en escritorio */}
                        <ArrowLeft size={35} className="text-white lg:text-black" />
                    </Link>

                    <h1 className="text-5xl lg:text-6xl font-bold mb-8 lg:mb-10 text-start font-saira mt-20 lg:mt-0">
                        Reset Password
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="password"
                            placeholder="Nueva contraseña"
                            className="border p-2 rounded text-black"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        {error && <p className="text-red-500">{error}</p>}
                        {msg && <p className="text-green-600">{msg}</p>}
                        <button type="submit" className="bg-green-600 text-white p-2 rounded">Cambiar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function ResetPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black">
            <Suspense fallback={<p>Cargando...</p>}>
                <ResetForm />
            </Suspense>
        </div>
    );
}


