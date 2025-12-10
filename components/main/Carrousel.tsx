export default function Carrousel() {
    const technologies = [
        "React", "Next.js", "Tailwind CSS", "TypeScript", "Node.js", "Vercel", "Git", "GitHub", "Spotify Api", "NestJs", "Axios", "Stripe"
    ];

    return (
        <div className="w-full py-20 overflow-hidden bg-black">

            <h2 className="text-4xl font-bold text-center mb-12 text-white">Technology used</h2>

            <div className="relative flex overflow-hidden">
                <div className="flex animate-marquee whitespace-nowrap">
                    {technologies.map((tech, index) => (
                        <span key={index} className="mx-12 text-3xl font-semibold text-gray-400 hover:text-white transition-colors cursor-default">
                            {tech}
                        </span>
                    ))}
                    {/* Duplicate set for seamless loop */}
                    {technologies.map((tech, index) => (
                        <span key={`dup-${index}`} className="mx-12 text-3xl font-semibold text-gray-400 hover:text-white transition-colors cursor-default">
                            {tech}
                        </span>
                    ))}
                    {/* Triplicate set for wide screens */}
                    {technologies.map((tech, index) => (
                        <span key={`dup2-${index}`} className="mx-12 text-3xl font-semibold text-gray-400 hover:text-white transition-colors cursor-default">
                            {tech}
                        </span>
                    ))}
                    {/* Quadruplicate set for very wide screens */}
                    {technologies.map((tech, index) => (
                        <span key={`dup3-${index}`} className="mx-12 text-3xl font-semibold text-gray-400 hover:text-white transition-colors cursor-default">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

        </div>
    );
}