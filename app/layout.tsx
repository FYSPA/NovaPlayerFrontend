import "@styles/global.css";
import { Poppins, Saira } from "next/font/google";
import { Providers } from "./providers";

const poppins = Poppins({
  subsets: ["latin"],      // Importante: Aquí le dices que cargue los caracteres latinos
  weight: ["400", "600", "700"], // Los pesos que vayas a usar (Regular, SemiBold, Bold)
  variable: "--font-poppins", // Opcional: para usarla con variables CSS/Tailwind
});

const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Elige los pesos que necesites
  variable: "--font-saira",      // OJO: Nombre de variable diferente
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${saira.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
