import "./globals.css";
// (Opcional) si quieres SEO básico, descomenta y ajusta:
// import type { Metadata } from "next";
// export const metadata: Metadata = {
//   title: "Lulab Tech — WhatsApp Bot",
//   description: "Chat → Pedido → Pago Yappy (mock) → Recibo"
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-zinc-50 text-zinc-900">
        {children}
      </body>
    </html>
  );
}
