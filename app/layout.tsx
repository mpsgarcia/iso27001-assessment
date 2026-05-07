import type { Metadata } from "next";
import { Ubuntu, Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const ubuntu = Ubuntu({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-ubuntu" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: "GRC Shield — ISO 27001 Assessment",
  description: "Plataforma de Gap Analysis ISO/IEC 27001:2022",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${ubuntu.variable} ${montserrat.variable} font-body h-full bg-background`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
