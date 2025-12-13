import { useState, useEffect } from "react";
import api from "@/utils/api";

export function useCategories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem("token");
            try {
                // Este endpoint trae la LISTA de géneros (Pop, Rock, Indie...)
                const { data } = await api.get('/spotify/browse/categories?limit=20', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Spotify devuelve esto dentro de data.categories.items
                setCategories(data.categories?.items || []);
            } catch (error) {
                console.error("Error fetching categories", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, loading };
}