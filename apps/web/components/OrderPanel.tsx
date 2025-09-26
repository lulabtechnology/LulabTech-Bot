"use client";

export default function OrderPanel() {
  // Fijo para Fase 1 (en Fase 4/6 lo actualizamos con estado real)
  const subtotal = 100;
  const shipping = 5;
  const total = subtotal + shipping;

  return (
    <div className="bg-white rounded-xl2 shadow-soft border border-gray-200 p-5">
      <h2 className="text-lg font-bold mb-4">Registro de pedido</h2>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Producto Lulab Tech</span>
          <span>$100.00</span>
        </div>
        <div className="flex items-center justify-between text-gray-600">
          <span>Envío</span>
          <span>$5.00</span>
        </div>
        <hr className="my-2" />
        <div className="flex items-center justify-between text-base font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Estado: <b>Esperando confirmación</b>
      </div>

      <button
        disabled
        title="Aparece tras Confirmar (Fase 4/6)"
        className="mt-4 w-full rounded-xl bg-brand-primary text-white py-2 font-semibold disabled:opacity-60"
      >
        Pagar con Yappy (mock)
      </button>
    </div>
  );
}
