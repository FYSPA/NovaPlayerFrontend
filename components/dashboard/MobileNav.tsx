"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, Library } from "lucide-react";

export default function MobileNav() {
    const pathname = usePathname();

    const links = [
        { href: "/dashboard", icon: Home, label: "Home" },
        { href: "/dashboard/search", icon: Search, label: "Search" },
        { href: "/dashboard/collection", icon: Library, label: "Library" },
        { href: "/dashboard/favorites", icon: Heart, label: "Likes" },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#090909] border-t border-gray-900 h-16 z-50 flex items-center justify-around pb-safe">
            {links.map(({ href, icon: Icon, label }) => {
                const isActive = pathname === href;
                return (
                    <Link 
                        key={href} 
                        href={href} 
                        className="flex flex-col items-center justify-center w-full h-full active:scale-95 transition-transform"
                    >
                        <div className={`p-1 rounded-full ${isActive ? "bg-white/10" : "bg-transparent"}`}>
                            <Icon 
                                size={24} 
                                className={`transition-colors ${isActive ? "text-white" : "text-gray-500"}`} 
                                fill={isActive ? "currentColor" : "none"}
                            />
                        </div>
                        <span className={`text-[10px] mt-0.5 font-medium ${isActive ? "text-white" : "text-gray-500"}`}>
                            {label}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}