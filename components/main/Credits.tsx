import Link from 'next/link';
import { BsSpotify, BsYoutube, BsCodeSlash } from "react-icons/bs";

export default function Credits() {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-12 mt-10 border-t border-white/10 font-saira">
            
            {/* TÍTULO */}
            <h2 className="text-white font-bold text-2xl mb-8 tracking-tight">Legal & Credits</h2>

            {/* GRID DE SECCIONES LEGALES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                
                {/* TARJETA SPOTIFY */}
                <div className="bg-[#181818] p-6 rounded-xl border border-white/5 hover:border-green-500/30 transition-colors duration-300 group">
                    <div className="flex items-center gap-3 text-green-500 font-bold text-lg mb-3">
                        <BsSpotify size={24} className="group-hover:scale-110 transition-transform" />
                        <h3>Powered by Spotify</h3>
                    </div>
                    <div className="space-y-3 text-gray-400 text-xs leading-relaxed">
                        <p>
                            This product uses the Spotify API but is not endorsed, certified, or otherwise approved in any way by Spotify. Spotify is the registered trade mark of the Spotify Group.
                        </p>
                        <p>
                            Content available through this application (including album artwork, artist metadata, and audio tracks) is the property of Spotify AB or its licensors.
                        </p>
                    </div>
                </div>

                {/* TARJETA YOUTUBE */}
                <div className="bg-[#181818] p-6 rounded-xl border border-white/5 hover:border-red-500/30 transition-colors duration-300 group">
                    <div className="flex items-center gap-3 text-red-500 font-bold text-lg mb-3">
                        <BsYoutube size={24} className="group-hover:scale-110 transition-transform" />
                        <h3>Video Integration</h3>
                    </div>
                    <div className="space-y-3 text-gray-400 text-xs leading-relaxed">
                        <p>
                            Music videos are played via YouTube embeds to enhance the user experience.
                        </p>
                        <p>
                            This application complies with YouTube API Services Terms of Service. No video content is stored on our servers.
                        </p>
                    </div>
                </div>
            </div>

            {/* SECCIÓN PROYECTO (Footer Info) */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 pt-6 border-t border-white/5">
                
                <div className="flex bg-[#181818] p-2 rounded-xl flex-col gap-2 max-w-lg">
                    <div className="flex items-center gap-2 text-white font-semibold">
                        <BsCodeSlash className="text-blue-400"/>
                        <h3>Project Info</h3>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Nova Player was developed by a dedicated student as a non-commercial educational project to demonstrate full-stack development skills using Next.js and NestJS.
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                        Special thanks to the open-source community.
                    </p>
                </div>

                {/* ENLACES LEGALES */}
                <div className="flex flex-col items-end gap-2 text-xs bg-[#181818] p-2 rounded-xl">
                    <div className="flex gap-4 text-gray-400">
                        <Link href="https://developer.spotify.com/policy" target="_blank" className="hover:text-green-400 transition hover:underline">
                            Spotify Developer Policy
                        </Link>
                        <span>|</span>
                        <Link href="https://www.spotify.com" target="_blank" className="hover:text-green-400 transition hover:underline">
                            Spotify.com
                        </Link>
                    </div>
                    <p className="text-gray-600">
                        © {new Date().getFullYear()} Nova Player. Educational Use Only.
                    </p>
                </div>
            </div>
        </div>
    );
}