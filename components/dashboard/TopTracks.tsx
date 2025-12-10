'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/utils/api'; // Tu instancia de axios

interface Track {
    id: string;
    name: string;
    album: {
        images: { url: string }[];
        name: string;
    };
    artists: { name: string }[];
    external_urls: { spotify: string };
}

export default function TopTracks() {
    const router = useRouter();
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                // 1. Configurar el header con el token
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                // 2. Pedir Top Tracks a TU backend (que se los pide a Spotify)
                const { data } = await api.get('/spotify/top-tracks', config);
                setTracks(data);

                // Opcional: Podrías hacer otro endpoint /auth/me para sacar el nombre del usuario
                // Por ahora lo dejamos genérico o lo sacas del localStorage si lo guardaste
            } catch (error) {
                console.error("Error cargando datos", error);
                // Si el token expiró, mandar al login
                // router.push('/login'); 
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading) return <div className="h-screen bg-black text-white flex items-center justify-center">Cargando tu música...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-8 font-saira">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Tu Top 10 en Spotify 🎵</h1>
            </header>

            {/* Grid de Canciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tracks.length === 0 ? (
                    <p>No encontramos canciones. ¿Has escuchado música en Spotify recientemente?</p>
                ) : (
                    tracks.map((track) => (
                        <div key={track.id} className="bg-gray-900 p-4 rounded-lg flex items-center gap-4 hover:bg-gray-800 transition">
                            {/* Imagen del Álbum */}
                            <div className="relative w-20 h-20 flex-shrink-0">
                                <Image
                                    src={track.album.images[0]?.url}
                                    alt={track.name}
                                    fill
                                    className="object-cover rounded"
                                />
                            </div>

                            {/* Info Canción */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg truncate">{track.name}</h3>
                                <p className="text-gray-400 truncate">{track.artists.map(a => a.name).join(', ')}</p>
                                <a
                                    href={track.external_urls.spotify}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-green-500 text-sm hover:underline mt-1 block"
                                >
                                    Escuchar en Spotify
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}