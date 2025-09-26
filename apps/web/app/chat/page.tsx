import PhoneMock from "@/components/PhoneMock";
import OrderPanel from "@/components/OrderPanel";

export default function ChatPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Izquierda: Mock teléfono (2/3) */}
        <section className="md:col-span-2">
          <PhoneMock />
        </section>

        {/* Derecha: Panel Registro de pedido (1/3) */}
        <aside className="md:col-span-1">
          <OrderPanel />
        </aside>
      </div>
    </main>
  );
}
