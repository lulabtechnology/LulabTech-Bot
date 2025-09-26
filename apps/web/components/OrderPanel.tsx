"use client";

type PanelMode = "sale" | "reservation" | "idle";

export default function OrderPanel({
  mode,
  saleTotal = { subtotal: 100, shipping: 5, total: 105 },
  saleAddress,
  reservation = { depositSelected: null, datetimeDisplay: undefined },
  status = "Esperando acción",
  onPayClick
}: {
  mode: PanelMode;
  saleTotal?: { subtotal: number; shipping: number; total: number };
  saleAddress?: string;
  reservation?: { depositSelected: boolean | null; datetimeDisplay?: string };
  status?: string;
  onPayClick?: () => void;
}) {
  const fmt = (n: number) => `$${n.toFixed(2)}`;

  return (
    <div className="bg-white rounded-xl2 shadow-soft border border-zinc-200 p-5">
      <h2 className="text-lg font-bold mb-4">
        {mode === "reservation" ? "Reserva" : "Registro de pedido"}
      </h2>

      {mode === "sale" && (
        <>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Producto Lulab Tech</span>
              <span>{fmt(saleTotal.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-600">
              <span>Envío</span>
              <span>{fmt(saleTotal.shipping)}</span>
            </div>
            <hr className="my-2" />
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Total</span>
              <span>{fmt(saleTotal.total)}</span>
            </div>
          </div>
          {saleAddress && (
            <div className="mt-3 text-xs text-zinc-600">
              <b>Envío a:</b> {saleAddress}
            </div>
          )}
        </>
      )}

      {mode === "reservation" && (
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>Reserva Lulab Tech</span>
            <span>{reservation.depositSelected ? "$10.00" : "$0.00"}</span>
          </div>
          {reservation.datetimeDisplay && (
            <div className="text-xs text-zinc-600">
              <b>Fecha/Hora:</b> {reservation.datetimeDisplay} (America/Panama)
            </div>
          )}
          <div className="text-xs text-zinc-600">
            Depósito opcional para asegurar la reserva.
          </div>
          <hr className="my-2" />
          <div className="flex items-center justify-between text-base font-semibold">
            <span>Total</span>
            <span>{reservation.depositSelected ? "$10.00" : "$0.00"}</span>
          </div>
        </div>
      )}

      {mode === "idle" && (
        <div className="text-sm text-zinc-600">
          Inicia en el chat: elige <b>Ventas</b> o <b>Reservas</b>.
        </div>
      )}

      <div className="mt-4 text-xs text-zinc-500">
        Estado: <b>{status}</b>
      </div>

      <button
        onClick={onPayClick}
        disabled={!["sale", "reservation"].includes(mode)}
        title="Se habilita en Fase 6 (API Yappy mock)"
        className="mt-4 w-full rounded-xl bg-brand-primary text-white py-2 font-semibold disabled:opacity-60"
      >
        Pagar con Yappy (mock)
      </button>
    </div>
  );
}
