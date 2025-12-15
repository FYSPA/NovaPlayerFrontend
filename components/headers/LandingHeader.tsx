"use client"; // Necesario para usar useState

import { useState } from "react";
import Link from "next/link";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="border-b-2 border-gray-300 relative bg-white">
            <div className="flex items-center justify-between m-5">
                {/* LOGO */}
                <div>
                    <Link href="/">
                        <img className="h-auto w-16" src="/assets/NovaPlayerIcon.png" alt="NovaPlayerLogo" />
                    </Link>
                </div>

                {/* MENÚ DE NAVEGACIÓN (Escritorio) - Oculto en móviles */}
                <div className="hidden md:block">
                    <ul className="flex gap-5">
                        <li className="hover:text-blue-500 transition-colors"><Link href="/">Home</Link></li>
                        <li className="hover:text-blue-500 transition-colors"><Link href="/">Music</Link></li>
                        <li className="hover:text-blue-500 transition-colors"><Link href="/">About</Link></li>
                        <li className="hover:text-blue-500 transition-colors"><Link href="/">Contact</Link></li>
                    </ul>
                </div>

                {/* BOTONES AUTH (Escritorio) - Oculto en móviles */}
                <div className="hidden md:flex gap-5 items-center">
                    {/* Corregí el <button><Link> anidado, es mejor aplicar estilos directos al Link */}
                    <Link href="/register" className="hover:text-blue-500 transition-colors">
                        Sign In
                    </Link>
                    <Link
                        href="/login"
                        className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        Join Now
                    </Link>
                </div>

                {/* BOTÓN HAMBURGUESA (Móvil) - Visible solo en móviles */}
                <button
                    className="md:hidden p-2 text-gray-700"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {/* Icono cambia si está abierto o cerrado */}
                    {isMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    )}
                </button>
            </div>

            {/* MENÚ DESPLEGABLE (Móvil) */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200">
                    <div className="flex flex-col space-y-4 p-5 text-center">
                        <Link href="/" className="hover:text-blue-500" onClick={() => setIsMenuOpen(false)}>Home</Link>
                        <Link href="/music" className="hover:text-blue-500" onClick={() => setIsMenuOpen(false)}>Music</Link>
                        <Link href="/about" className="hover:text-blue-500" onClick={() => setIsMenuOpen(false)}>About</Link>
                        <Link href="/contact" className="hover:text-blue-500" onClick={() => setIsMenuOpen(false)}>Contact</Link>

                        <div className="border-t border-gray-200 my-2 pt-4 flex flex-col gap-4 items-center">
                            <Link href="/register" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                            <Link
                                href="/login"
                                className="bg-black text-white py-2 px-6 rounded-xl inline-block w-full max-w-xs"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Join Now
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}