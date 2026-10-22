import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { Providers } from "@/components/providers";
import "./globals.css";

// Aplica el tema guardado ANTES del primer pintado para evitar el parpadeo.
const THEME_INIT = `(function(){try{var t=localStorage.getItem('dr-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export const metadata: Metadata = {
  title: "DataRadar — radar de vacantes de data remotas",
  description:
    "El radar diario del mercado de vacantes de Data Engineer y Analytics Engineer, 100% remotas para LATAM y España.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="flex min-h-screen flex-col bg-bg text-text antialiased">
        <Providers>
          <Nav />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
