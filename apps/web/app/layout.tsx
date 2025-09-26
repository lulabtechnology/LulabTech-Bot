export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-zinc-50 text-zinc-900">
        {children}
      </body>
    </html>
  );
}
