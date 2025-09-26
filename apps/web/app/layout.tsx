import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lulab Tech — WhatsApp Bot",
  description: "Chat tipo WhatsApp → Pedido → Pago Yappy (mock) → Recibo"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
