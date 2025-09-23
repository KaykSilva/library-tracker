"use client";

import { usePathname } from "next/navigation";
import NextLayout from "@/components/layout/nextLayout";
import "./globals.css";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noLayoutRoutes = ["/auth/login", "/register"]; // rotas sem layout

  const isNoLayout = noLayoutRoutes.includes(pathname);

  return (
    <html lang="pt-BR">
      <body>
        {isNoLayout ? children : <NextLayout>{children}</NextLayout>}
      </body>
    </html>
  );
}
