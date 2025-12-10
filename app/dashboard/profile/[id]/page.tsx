"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { User, Library } from "lucide-react";
import api from "@/utils/api";

export default function UserProfilePage() {
    const params = useParams();
    const userId = params.id as string;

    const [profile, setProfile] = useState<any>(null);
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const [userRes, playlistRes] = await Promise.all([
                    api.get(`/spotify/user-profile/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
                    api.get(`/spotify/user-profile/${userId}/playlists`, { headers: { Authorization: `Bearer ${token}` } })
                ]);

                setProfile(userRes.data);
                setPlaylists(playlistRes.data);
            } catch (error) {
                console.error("Error cargando perfil", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    if (loading) return <div className="text-white p-10">Cargando perfil...</div>;
    if (!profile) return <div className="text-white p-10">Usuario no encontrado</div>;

    const userImage = profile.images?.[0]?.url;

    return (
        <div className="flex flex-col min-h-full -m-6 pb-20 font-saira bg-[#121212]">

            {/* HEADER PERFIL */}
            <div className="relative w-full h-[30vh] min-h-[300px] flex items-center p-8 bg-gradient-to-b from-gray-800 to-[#121212]">
                <div className="flex items-center gap-6 z-10 mt-10">
                    {/* FOTO CIRCULAR GIGANTE */}
                    <div className="relative w-48 h-48 rounded-full shadow-2xl overflow-hidden bg-[#282828] flex items-center justify-center">
                        {userImage ? (
                            <Image src={userImage} alt={profile.display_name} fill className="object-cover" />
                        ) : (
                            <User size={80} className="text-gray-500" />
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold uppercase text-white">Perfil</span>
                        <h1 className="text-6xl font-black text-white">{profile.display_name}</h1>
                        <p className="text-white font-medium">
                            {profile.followers.total} seguidores
                        </p>
                    </div>
                </div>
            </div>

            {/* LISTA DE PLAYLISTS PÚBLICAS */}
            <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Playlists Públicas</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {playlists.map((playlist) => (
                        <Link key={playlist.id} href={`/dashboard/collection/${playlist.id}`}>
                            <div className="bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition cursor-pointer group">
                                <div className="relative w-full aspect-square mb-4 bg-[#333] rounded-md overflow-hidden shadow-lg">
                                    {playlist.images?.[0]?.url ? (
                                        <Image
                                            src={playlist.images[0].url}
                                            alt={playlist.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Library className="text-gray-500" size={40} />
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-bold text-white truncate">{playlist.name}</h3>
                                <p className="text-sm text-gray-400 truncate">By {playlist.owner.display_name}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}