import NextLayout from "@/components/layout/nextLayout";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Library Tracker",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <NextLayout>{children}</NextLayout>
      </body>
    </html>
  );
}
