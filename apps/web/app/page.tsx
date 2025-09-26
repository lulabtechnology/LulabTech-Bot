import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="text-3xl font-bold mb-3">Lulab Tech — WhatsApp Bot + Yappy (mock)</h1>
      <p className="text-gray-600 mb-8">
        Flujo: Chat tipo WhatsApp → Pedido → Pago Yappy (mock) → Recibo.
      </p>
      <Link
        href="/chat"
        className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-3 font-semibold text-white shadow-soft hover:opacity-90"
      >
        Entrar al chat
        <span aria-hidden>💬</span>
      </Link>
    </main>
  );
}
