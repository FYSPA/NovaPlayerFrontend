'use client';
import { useState } from 'react';
import api from '@/utils/api';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            await api.post('/auth/forgot-password', { email });
            setMessage('Si el correo existe, te hemos enviado un enlace.');
        } catch (err: any) {
            setError('Error al enviar el correo.');
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

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-0 lg:hidden"></div>

            <div className="relative z-10 flex flex-col h-full lg:flex-row lg:justify-end">

                <div className="w-full lg:w-[40rem] h-full flex flex-col justify-center px-8 pb-10 lg:pb-0 
                                        bg-transparent lg:bg-white 
                                        text-white lg:text-black transition-colors duration-300">

                    <Link href="/login" className="absolute lg:top-6 lg:left-6 right-6 top-5 hover:opacity-70 transition-opacity">
                        <ArrowLeft size={35} className="text-white lg:text-black" />
                    </Link>

                    <h1 className="text-5xl lg:text-6xl font-bold mb-8 lg:mb-10 text-start font-saira mt-20 lg:mt-0">
                        Forgot Password
                    </h1>

                    {message ? (
                        <p className="text-green-600 mb-4">{message}</p>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <label>Ingresa tu correo</label>
                            <input
                                type="email"
                                className="border p-2 rounded text-black"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {error && <p className="text-red-500">{error}</p>}
                            <button type="submit" className="bg-blue-600 text-white p-2 rounded">Enviar Link</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}


