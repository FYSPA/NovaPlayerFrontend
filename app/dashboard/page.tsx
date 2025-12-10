import type { Metadata } from "next";
import QuickAccess from "../../components/dashboard/QuickAccess";
import CarrouselMusic from "../../components/dashboard/CarrouselMusic";
import LazyLoadSection from "../../components/utilsComponents/LazyLoadSection";
import TopTracks from "../../components/dashboard/TopTracks";

export const metadata: Metadata = {
    title: "Nova - Dashboard",
    description: "The new music player, is free in beta testing created by a student.",
    icons: {
        icon: "/assets/NovaPlayerIcon.png",
    },
};

export default function Dashboard() {
    return (
        <div className="flex flex-col gap-8 min-h-full pb-10">

            <section className="mt-2">
                <QuickAccess />
            </section>

            <section>
                <div className="p-6 pb-24 space-y-10"> {/* Espaciado vertical */}

                    {/* 1. Playlists DEL USUARIO (Las tuyas) */}
                    <CarrouselMusic
                        title="Your Playlists"
                        type="user"
                    />

                    {/* 2. Playlists RECOMENDADAS (De Spotify y otros) */}
                    <LazyLoadSection>
                        <CarrouselMusic
                            title="Recommended for you"
                            type="featured"
                        />
                    </LazyLoadSection>

                </div>
            </section>
        </div>
    )
}