import { useState, useEffect } from 'react';
import api from '@/utils/api';

interface User {
    id: number;
    name: string;
    email: string;
    image: string | null;
    spotifyId: string | null;
}

export default function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');

            // Si no hay token, no hacemos nada (o redirigimos)
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const { data } = await api.get('/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(data);
            } catch (error) {
                console.error("Error obteniendo usuario", error);
                // Si el token no sirve, lo borramos
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading };
}