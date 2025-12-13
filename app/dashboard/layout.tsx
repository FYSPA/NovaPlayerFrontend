"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import SidebarLeft from "@/components/dashboard/SidebarLeft";
import Player from "@/components/dashboard/Player";
import DashboardHeader from "@/components/headers/DashboardHeader";
import SidebarRight from "@/components/dashboard/SidebarRight";
import MobileNav from "@/components/dashboard/MobileNav"; // <--- 1. IMPORTAR
import { PlayerProvider } from "@/context/PlayerContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

    // --- ESTADOS Y LÓGICA DE RESIZE (IGUAL QUE ANTES) ---
    const [leftWidth, setLeftWidth] = useState(250);
    const [rightWidth, setRightWidth] = useState(280); 
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

    const toggleRightSidebar = () => setIsRightSidebarOpen(!isRightSidebarOpen);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const isResizingLeft = useRef(false);
    const isResizingRight = useRef(false);

    const startResizingLeft = useCallback(() => {
        isResizingLeft.current = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
    }, []);

    const startResizingRight = useCallback(() => {
        isResizingRight.current = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
    }, []);

    const stopResizing = useCallback(() => {
        isResizingLeft.current = false;
        isResizingRight.current = false;
        document.body.style.cursor = "default";
        document.body.style.userSelect = "auto";
    }, []);

    const resize = useCallback((e: MouseEvent) => {
        if (isResizingLeft.current) {
            const newWidth = e.clientX;
            if (newWidth > 80 && newWidth < 480) setLeftWidth(newWidth);
        }
        if (isResizingRight.current) {
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

    const currentLeft = isCollapsed ? 80 : leftWidth;
    

    const [isLargeScreen, setIsLargeScreen] = useState(true);

    useEffect(() => {
        const checkScreenSize = () => {
            // 1280px es el breakpoint 'xl' de Tailwind
            setIsLargeScreen(window.innerWidth >= 1280); 
            
            // Opcional: Si baja de tamaño, cerramos el sidebar automáticamente
            if (window.innerWidth < 1280) {
                setIsRightSidebarOpen(false);
            } else {
                setIsRightSidebarOpen(true);
            }
        };

        // Chequear al inicio
        checkScreenSize();

        // Chequear cuando cambia el tamaño
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);
    const currentRight = (isRightSidebarOpen && isLargeScreen) ? rightWidth : 0;
    return (
        <PlayerProvider>
            <div
                // --- CAMBIO CLAVE 1: FLEX en Móvil, GRID en Desktop ---
                // "flex flex-col" para móvil (ignora gridTemplateColumns).
                // "md:grid" activa el grid y tus cálculos solo en pantallas medianas+.
                className="flex flex-col h-screen w-full bg-black text-white overflow-hidden transition-all duration-300 ease-in-out md:grid md:grid-rows-[1fr_90px]"
                style={{
                    // Este estilo solo afectará cuando esté en modo 'grid' (Desktop)
                    gridTemplateColumns: `${currentLeft}px 1fr ${currentRight}px`
                }}
            >
                {/* 1. SIDEBAR IZQ (Solo Desktop) */}
                <aside className="col-start-1 row-start-1 border-r border-gray-800 hidden md:block relative group overflow-hidden h-full">
                    <SidebarLeft isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
                    {!isCollapsed && (
                        <div
                            onMouseDown={startResizingLeft}
                            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors z-50 opacity-0 group-hover:opacity-100"
                        />
                    )}
                </aside>

                {/* 2. CONTENIDO */}
                {/* "flex-1" en móvil para ocupar todo el alto disponible */}
                <div className="flex-1 md:col-start-2 md:row-start-1 flex flex-col h-full overflow-hidden bg-[#121212] md:m-2 md:rounded-lg relative border-l border-t border-b border-gray-900/50">
                    <div className="w-full h-16 bg-[#121212]/90 backdrop-blur-md sticky top-0 z-40 border-b border-white/5 flex-none">
                        <DashboardHeader />
                    </div>
                    
                    <main className="flex-1 overflow-y-auto relative custom-scrollbar">
                        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none z-0" />
                        
                        {/* CAMBIO CLAVE 2: Padding inferior en móvil */}
                        {/* pb-40 en móvil: Espacio para Player (h-20) + MobileNav (h-16) + Margen */}
                        {/* md:pb-6 en desktop: Solo padding normal */}
                        <div className="relative z-10 p-4 pb-40 md:p-6 md:pb-6">
                            {children}
                        </div>
                    </main>
                </div>

                {/* 3. SIDEBAR DER (Solo Desktop Grande) */}
                <aside className="col-start-3 row-start-1 bg-[#090909] overflow-hidden hidden md:block relative group">
                    <div className="w-full h-full">
                        <SidebarRight isOpen={isRightSidebarOpen} toggle={toggleRightSidebar} />
                        {isRightSidebarOpen && (
                            <div
                                onMouseDown={startResizingRight}
                                className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors z-50 opacity-0 group-hover:opacity-100"
                            />
                        )}
                    </div>
                </aside>

                {/* 4. PLAYER */}
                {/* CAMBIO CLAVE 3: Posición Fija en Móvil */}
                {/* Móvil: fixed bottom-16 (encima del nav), z-50 */}
                {/* Desktop: Vuelve a ser estático (static) y ocupa su lugar en el grid (md:col-span-3) */}
                <footer className="fixed bottom-16 left-0 w-full z-50 border-t border-gray-800 bg-black md:static md:bottom-0 md:col-span-3 md:row-start-2">
                    <Player
                        toggleRightSidebar={toggleRightSidebar}
                        isRightSidebarOpen={isRightSidebarOpen}
                    />
                </footer>

                {/* 5. MOBILE NAV (Solo Móvil) */}
                <MobileNav />
            </div>
        </PlayerProvider>
    );
}