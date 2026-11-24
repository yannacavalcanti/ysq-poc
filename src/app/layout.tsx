import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Questionário de Esquemas",
  description: "Questionário enviado pela sua psicóloga.",
  // Link privado: não deve aparecer em buscadores.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
