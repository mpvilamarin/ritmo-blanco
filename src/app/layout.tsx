import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

/*
  Sets Grotesk está solo en Adobe Fonts. Mientras no haya kit web, se ve con
  Schibsted Grotesk, la misma que usa el diseño de Claude Design. Para usar el kit: agregar <link rel="stylesheet" href="https://use.typekit.net/XXXX.css">
  en <head> y cambiar --font-display en globals.css a "sets-grotesk".
*/
const grotesk = Schibsted_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
});

const plex = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ritmo Blanco · Festival silencioso y sustentable",
  description:
    "14 al 17 de noviembre en los Bosques de Palermo. Entrada gratuita con reserva, auriculares incluidos.",
};

export const viewport: Viewport = {
  // El meta no admite variables: es el blanco de la paleta
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${grotesk.variable} ${plex.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
