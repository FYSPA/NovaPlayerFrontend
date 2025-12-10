import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos', // Permiso para Picsum
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',     // Permiso para Spotify (que usas en otras partes)
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // Por si usas placeholders
      },
      {
        protocol: 'https',
        hostname: 'mosaic.scdn.co', // Otro servidor común de Spotify
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com', // A veces Spotify usa fotos de Facebook
      },
      {
        protocol: 'https',
        hostname: 'mosaic.scdn.co', // Collages de playlists
      },
      {
        protocol: 'https',
        hostname: 'image-cdn-ak.spotifycdn.com', // <--- EL QUE TE DIO ERROR
      },
      {
        protocol: 'https',
        hostname: 'image-cdn-fa.spotifycdn.com', // Otro común de Spotify
      },
      {
        protocol: 'https',
        hostname: 'wrapped-images.spotifycdn.com', // Para el Wrapped
      },
    ],
  },
};

export default nextConfig;
