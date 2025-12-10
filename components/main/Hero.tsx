export default function Hero() {
    return (
        // CAMBIO 1: flex-col para móvil (columna), lg:flex-row para escritorio (fila)
        // Agregamos min-h para asegurar altura y gap para separación
        <section className="relative flex flex-col lg:flex-row items-center justify-between p-5 min-h-[80vh] lg:h-full font-saira gap-10 lg:gap-0">

            {/* CONTENEDOR DE TEXTO */}
            {/* CAMBIO 2: Ancho dinámico (w-full) y orden para que en móvil salga el texto después o antes según prefieras (aquí order-2 en móvil) */}
            <div className="flex flex-col items-center lg:items-start justify-center w-full lg:w-1/2 z-10 order-2 lg:order-1">
                {/* CAMBIO 3: Tamaños de texto escalables (text-4xl -> text-7xl) y quitamos el ancho fijo w-[50rem] por max-w */}
                <p className="text-center lg:text-left w-full max-w-3xl text-4xl md:text-5xl lg:text-7xl font-bold font-saira leading-tight">
                    <span className="bg-gradient-to-r from-purple-800 to-pink-500 bg-clip-text text-transparent block mb-2 lg:mb-4">
                        Nova Player
                    </span>
                    the new music player, is free in beta testing created by a student.
                </p>
            </div>

            {/* CONTENEDOR DE IMAGEN */}
            {/* CAMBIO 4: Ajuste de imagen para que no desborde */}
            <div className="flex justify-center lg:justify-end w-full lg:w-1/2 z-10 order-1 lg:order-2">
                <img
                    className="h-auto w-full max-w-md lg:max-w-[40rem] xl:max-w-[50rem] object-contain drop-shadow-2xl"
                    src="/assets/main/HeroImg.png"
                    alt="HeroImg"
                />
            </div>

            {/* DEGRADADO DE FONDO */}
            {/* pointer-events-none para que no bloquee clics si hubiera botones debajo */}
            <div className="absolute bottom-0 left-0 w-full h-24 lg:h-32 bg-gradient-to-b from-transparent to-black pointer-events-none z-20"></div>
        </section>
    );
}