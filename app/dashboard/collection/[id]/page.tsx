import PlaylistViewClient from "@/components/dashboard/collection/PlaylistViewClient";

interface PlaylistPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function PlaylistDynamicPage({ params }: PlaylistPageProps) {
    // Esperamos a obtener el ID de la URL
    const { id } = await params;

    return (
        <div className="bg-gradient-to-b from-gray-800/40 to-[#121212] min-h-full -m-6 p-8 pb-20">
            {/* Llamamos al componente Cliente que sí puede leer LocalStorage */}
            <PlaylistViewClient playlistId={id} />
        </div>
    );
}