import LandingHeader from "@/components/headers/LandingHeader";
import Hero from "@/components/main/Hero";
import Carrousel from "@/components/main/Carrousel";
import Footer from "@/components/footer/Footer";
import Credits from "@/components/main/Credits";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nova Player",
  description: "The new music player, is free in beta testing created by a student.",
  icons: {
    icon: "/assets/NovaPlayerIcon.png",
  },
};

export default function Home() {
  return (
    <div>
      <LandingHeader />
      <Hero />
      <Carrousel />
      <Credits />
      <Footer />
    </div>
  );
}
