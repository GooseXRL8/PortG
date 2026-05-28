import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "PortG — Seu Hub de Estudos & Portfólio Tech Vivo",
  description:
    "Organize seus estudos, registre sua evolução, estabeleça metas semanais, integre seus repositórios do GitHub e publique um portfólio incrível automaticamente.",
  keywords: ["portfolio", "estudos", "programação", "github", "commits", "dev", "desenvolvedor"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/pg.png" sizes="1254x1254" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gradient-premium min-h-screen antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
