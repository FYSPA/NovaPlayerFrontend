// components/dashboard/search/GenreCard.tsx

interface GenreCardProps {
    title: string;
    image?: string;   // <--- Agregamos esto (es opcional con ?)
    color?: string;   // <--- Agregamos esto como opcional (fallback)
    onClick?: () => void; // <--- Opcional también
}

export default function GenreCard({ title, image, color, onClick }: GenreCardProps) {
    return (
        <div 
            onClick={onClick}
            className={`relative h-40 rounded-lg p-4 overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-200 shadow-lg group ${!image ? (color || 'bg-[#333]') : 'bg-[#222]'}`} 
        >
            {/* Si hay imagen, la mostramos de fondo */}
            {image && (
                <img 
                    src={image} 
                    alt={title} 
                    className="absolute inset-0 w-full h-full object-cover z-0 brightness-[0.7] group-hover:brightness-90 transition-all duration-300"
                />
            )}
            
            {/* Título encima */}
            <span className="font-bold text-xl text-white font-saira absolute top-4 left-4 max-w-[80%] z-10 break-words leading-tight drop-shadow-lg">
                {title}
            </span>
        </div>
    );
}