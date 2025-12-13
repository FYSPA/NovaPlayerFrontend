import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePlayer } from "@/context/PlayerContext";
// Importamos TU hook original
import { useSearch } from "@/hooks/useSearch"; 

export function useSearchPage() {
    const searchParams = useSearchParams();
    const queryFromUrl = searchParams.get("q") || "";
    
    // 1. Usamos TU hook useSearch
    // Le pasamos la query de la URL como valor inicial
    const { query, setQuery, results, loading } = useSearch(queryFromUrl);
    
    // 2. Traemos la función de reproducir
    const { playSong } = usePlayer();

    // 3. Sincronizar URL -> Estado
    // Si el usuario da click en "Atrás" en el navegador, actualizamos el input
    useEffect(() => {
        if (queryFromUrl !== query) {
            setQuery(queryFromUrl);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryFromUrl]); 

    // 4. Funciones auxiliares para la vista
    const handlePlayTrack = (uri: string) => {
        playSong([uri]);
    };

    const clearQuery = () => {
        setQuery("");
        // Opcional: Si quieres limpiar la URL también, necesitarías useRouter
    };

    // 5. Retornamos todo lo que la UI necesita
    return {
        query,
        setQuery,
        results,
        loading,
        handlePlayTrack,
        clearQuery
    };
}