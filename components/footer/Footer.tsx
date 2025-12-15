import Link from "next/link";
import ThemeSwitch from "@/components/utilsComponents/ThemeSwitch";

export default function Footer() {
    return (
        // CAMBIOS GENERALES:
        // 1. Quitamos m-16 y usamos padding (py-10 px-5) para que no desborde.
        // 2. Quitamos gap-96. Usamos 'justify-between' para separar los bloques extremos.
        // 3. 'flex-col' para móvil (columna) y 'lg:flex-row' para escritorio (fila).
        <footer className="w-full border-t border-gray-200 mt-10">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-10 p-8 lg:p-16">

                {/* SECCIÓN 1: MARCA Y COPYRIGHT */}
                <div className="flex flex-col items-start gap-2 max-w-sm">
                    <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">Managed by</span>
                    <span className="text-4xl font-bold bg-gradient-to-r from-purple-800 to-pink-500 bg-clip-text text-transparent">
                        Nova Player
                    </span>
                    <span className="text-sm text-gray-500 mt-2">
                        © {new Date().getFullYear()} Nova Player. All rights reserved.
                    </span>
                </div>

                {/* SECCIÓN 2: ENLACES Y SWITCH */}
                {/* En móvil se ven en columna o rejilla, en escritorio (md) en fila */}
                <div className="flex flex-col md:flex-row gap-10 md:gap-16 w-full lg:w-auto">

                    {/* Columna de Enlaces 1 */}
                    <div>
                        <span className="text-xl font-bold mb-4 block">Links</span>
                        <ul className="space-y-2 text-gray-600">
                            <li className="hover:text-purple-600 transition-colors"><Link href="/">Home</Link></li>
                            <li className="hover:text-purple-600 transition-colors"><Link href="/">Products</Link></li>
                            <li className="hover:text-purple-600 transition-colors"><Link href="/">Services</Link></li>
                            <li className="hover:text-purple-600 transition-colors"><Link href="/">About</Link></li>
                            <li className="hover:text-purple-600 transition-colors"><Link href="/">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Columna de Enlaces 2 */}
                    <div>
                        <span className="text-xl font-bold mb-4 block">Legal</span>
                        <ul className="space-y-2 text-gray-600">
                            <li className="hover:text-purple-600 transition-colors"><Link href="/privacy">Privacy</Link></li>
                            <li className="hover:text-purple-600 transition-colors"><Link href="/terms">Terms</Link></li>
                            <li className="hover:text-purple-600 transition-colors"><Link href="/faq">FAQ</Link></li>
                            <li className="hover:text-purple-600 transition-colors"><Link href="/support">Support</Link></li>
                        </ul>
                    </div>

                    {/* Theme Switch */}
                    {/* Lo alineamos al inicio en móvil y al centro en escritorio si es necesario */}
                    <div className="mt-4 md:mt-0">
                        <ThemeSwitch />
                    </div>
                </div>
            </div>
        </footer>
    )
}