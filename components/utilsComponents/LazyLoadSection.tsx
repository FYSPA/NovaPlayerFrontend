"use client";

import { useInView } from "react-intersection-observer";

export default function LazyLoadSection({ children }: { children: React.ReactNode }) {
    const { ref, inView } = useInView({
        /* Opciones de configuración */
        triggerOnce: true, // IMPORTANTE: Una vez cargado, no se vuelve a ocultar (ahorra recursos)
        threshold: 0.1,    // Se activa cuando el 10% del componente es visible
        rootMargin: "200px 0px", // "Pre-carga": Empieza a cargar 200px ANTES de que aparezca en pantalla
    });

    return (
        // Asignamos la referencia al div contenedor
        // min-h-[300px] es CRUCIAL: Reserva el espacio para evitar saltos (layout shift)
        <div ref={ref} className="min-h-[300px] w-full transition-opacity duration-500 ease-in-out">
            {inView ? (
                children
            ) : (
                // MIENTRAS CARGA (SKELETON)
                // Esto es lo que se ve antes de hacer scroll. Un cuadro gris bonito.
                <div className="w-full h-[300px] bg-[#1A1A1A] rounded-xl animate-pulse flex items-center justify-center flex-col">
                    <span className="text-gray-600 font-bold">Cargando Carrusel...</span>
                    <div className="w-12 h-12 rounded-full bg-gray-600 animate-wait"></div>
                </div>
            )}
        </div>
    );
}