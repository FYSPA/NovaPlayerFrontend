'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function CallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // 1. Guardar token
            localStorage.setItem('token', token);

        
            // 3. Redirigir al Home
            router.push('/dashboard');
        } else {
            router.push('/login?error=auth_failed');
        }
    }, [searchParams, router]);

    return (
        <div className="h-screen bg-black flex items-center justify-center text-white">
            <h1 className="text-2xl">Autenticando con Spotify...</h1>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackHandler />
        </Suspense>
    );
}