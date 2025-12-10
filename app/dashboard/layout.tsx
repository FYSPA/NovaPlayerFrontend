"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import SidebarLeft from "@/components/dashboard/SidebarLeft";
import Player from "@/components/dashboard/Player";
import DashboardHeader from "@/components/headers/DashboardHeader";
import SidebarRight from "@/components/dashboard/SidebarRight";
import { PlayerProvider } from "@/context/PlayerContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

    // --- ESTADOS ---
    const [leftWidth, setLeftWidth] = useState(250);
    const [rightWidth, setRightWidth] = useState(280); // Estado para el ancho derecho

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

    const toggleRightSidebar = () => setIsRightSidebarOpen(!isRightSidebarOpen);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    // --- LÓGICA DE RESIZE (DOBLE) ---
    // Usamos refs para saber QUÉ lado estamos arrastrando
    const isResizingLeft = useRef(false);
    const isResizingRight = useRef(false);

    // 1. Empezar a arrastrar IZQUIERDA
    const startResizingLeft = useCallback(() => {
        isResizingLeft.current = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
    }, []);

    // 2. Empezar a arrastrar DERECHA (Nuevo)
    const startResizingRight = useCallback(() => {
        isResizingRight.current = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
    }, []);

    // 3. Detener arrastre (Sirve para ambos)
    const stopResizing = useCallback(() => {
        isResizingLeft.current = false;
        isResizingRight.current = false;
        document.body.style.cursor = "default";
        document.body.style.userSelect = "auto";
    }, []);

    // 4. Mover el mouse (Cálculos matemáticos)
    const resize = useCallback((e: MouseEvent) => {
        // Lógica Izquierda
        if (isResizingLeft.current) {
            const newWidth = e.clientX;
            if (newWidth > 80 && newWidth < 480) setLeftWidth(newWidth);
        }

        // Lógica Derecha (Invertida)
        if (isResizingRight.current) {
            // El ancho es: AnchoTotal - PosiciónMouse
            const newWidth = window.innerWidth - e.clientX;
            if (newWidth > 200 && newWidth < 500) setRightWidth(newWidth);
        }
    }, []);

    useEffect(() => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [resize, stopResizing]);


    // --- CÁLCULOS FINALES PARA EL GRID ---
    const currentLeft = isCollapsed ? 80 : leftWidth;
    const currentRight = isRightSidebarOpen ? rightWidth : 0;

    return (
        <PlayerProvider>
            <div
                className="grid h-screen w-full grid-rows-[1fr_90px] bg-black text-white overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                    // Aquí aplicamos los anchos dinámicos
                    gridTemplateColumns: `${currentLeft}px 1fr ${currentRight}px`
                }}
            >
                {/* 1. SIDEBAR IZQ */}
                <aside className="col-start-1 row-start-1 border-r border-gray-800 hidden md:block relative group overflow-hidden h-full">
                    <SidebarLeft isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />

                    {/* Resizer Izquierdo (A la derecha del sidebar) */}
                    {!isCollapsed && (
                        <div
                            onMouseDown={startResizingLeft}
                            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors z-50 opacity-0 group-hover:opacity-100"
                        />
                    )}
                </aside>

                {/* 2. CONTENIDO */}
                <div className="col-start-2 row-start-1 flex flex-col h-full overflow-hidden bg-[#121212] m-2 rounded-lg relative border-l border-t border-b border-gray-900/50">
                    <div className="w-full h-16 bg-[#121212]/90 backdrop-blur-md sticky top-0 z-40 border-b border-white/5 flex-none">
                        <DashboardHeader />
                    </div>
                    <main className="flex-1 overflow-y-auto relative custom-scrollbar">
                        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none z-0" />
                        <div className="relative z-10 p-6">
                            {children}
                        </div>
                    </main>
                </div>

                {/* 3. SIDEBAR DER */}
                <aside className="col-start-3 row-start-1 bg-[#090909] overflow-hidden hidden xl:block relative group">
                    <div className="w-full h-full">
                        <SidebarRight isOpen={isRightSidebarOpen} toggle={toggleRightSidebar} />

                        {/* Resizer Derecho (A la IZQUIERDA del sidebar) */}
                        {isRightSidebarOpen && (
                            <div
                                onMouseDown={startResizingRight}
                                // CAMBIO CLAVE: left-0
                                className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors z-50 opacity-0 group-hover:opacity-100"
                            />
                        )}
                    </div>
                </aside>

                {/* 4. PLAYER */}
                <footer className="col-span-3 row-start-2 bg-black border-t border-gray-900 z-50">
                    <Player
                        toggleRightSidebar={toggleRightSidebar}
                        isRightSidebarOpen={isRightSidebarOpen}
                    />
                </footer>
            </div>
        </PlayerProvider>
    );
}