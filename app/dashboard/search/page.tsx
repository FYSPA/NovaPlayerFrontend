
import SearchComponent from "@/components/dashboard/search/SearchComponent";
import { Suspense } from "react";

export default function Search() {
    return (
        <div className="w-full min-h-screen">
            <Suspense fallback={<div className="text-white p-10">Cargando buscador...</div>}>
                <SearchComponent />
            </Suspense>
        </div>
    )
}