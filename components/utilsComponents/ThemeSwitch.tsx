"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { Sun } from "@components/icons/Sun";
import { Moon } from "@components/icons/Moon";

export default function ThemeSwitch() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const toggleTheme = (newTheme: string) => {
        if (theme === newTheme) return;

        // Verificar soporte del navegador (Chrome/Edge)
        if (!(document as any).startViewTransition) {
            setTheme(newTheme);
            return;
        }

        // Ejecutar la animación
        (document as any).startViewTransition(() => {
            flushSync(() => {
                setTheme(newTheme);
            });
        });
    };

    if (!mounted) return <div className="w-[88px] h-10" />;

    return (
        <div className="flex items-center gap-3 bg-black px-3 py-1 rounded-xl h-10 border border-gray-800">
            <button onClick={() => toggleTheme("light")} className={theme === 'light' ? 'text-yellow-400' : 'text-gray-500'}>
                <Sun />
            </button>
            <span className="text-gray-700">/</span>
            <button onClick={() => toggleTheme("dark")} className={theme === 'dark' ? 'text-blue-400' : 'text-gray-500'}>
                <Moon />
            </button>
        </div>
    );
}