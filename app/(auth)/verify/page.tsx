'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import api from '@/utils/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

// Componente interno para manejar los SearchParams
function VerifyForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Recuperar el email de la URL automáticamente
    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) setEmail(emailParam);
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            // Enviamos al backend
            await api.post('/users/verify', { email, code });

            setMessage('¡Cuenta verificada con éxito!');

            // Esperar 2 segundos y mandar al Login
            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (err: any) {
            setError(err.response?.data?.message || 'Código incorrecto');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="text-black mb-4">
                We sent a verification code to: <strong>{email}</strong>
            </p>

            <label htmlFor="code" className="text-black font-bold">Verification Code</label>
            <input
                name="code"
                type="text"
                maxLength={6} // Tu código es de 6 dígitos
                placeholder="123456"
                className="border border-gray-300 p-2 rounded-lg text-black text-center text-2xl tracking-widest"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
            />

            {error && <p className="text-red-500 font-bold">{error}</p>}
            {message && <p className="text-green-600 font-bold">{message}</p>}

            <button
                type="submit"
                className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition font-bold mt-4"
            >
                Verify Account
            </button>
        </form>
    );
}

// Componente Principal
export default function Verify() {
    return (
        <div className="relative w-full h-screen bg-black">
            <Image
                src="/assets/auth/LoginBackground.png"
                alt="Background"
                fill
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
                priority
            />

            <div className="relative z-10 flex flex-col justify-end items-end h-full">
                <div className="bg-white p-8 shadow-lg w-[40rem] h-full relative flex flex-col justify-center">

                    <h1 className="text-6xl font-bold mb-10 text-start text-black font-saira">Verify</h1>

                    <Link href="/register" className="absolute top-5 left-5">
                        <ArrowLeft size={35} className="text-black" />
                    </Link>

                    {/* Suspense es necesario en Next.js cuando usas useSearchParams */}
                    <Suspense fallback={<div>Loading...</div>}>
                        <VerifyForm />
                    </Suspense>

                </div>
            </div>
        </div>
    )
}