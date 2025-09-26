"use client";

import { useMemo, useState } from "react";
import PhoneMock from "@/components/PhoneMock";
import OrderPanel from "@/components/OrderPanel";

type Role = "bot" | "user";
type Message = { id: string; role: Role; text: string; chips?: string[] };

type UIState =
  | { mode: "idle"; status: string }
  | { mode: "sale"; status: string; address?: string; confirmed?: boolean }
  | { mode: "reservation"; status: string; datetime?: string; depositSelected: boolean | null };

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: crypto.randomUUID(),
      role: "bot",
      text: "¡Hola! Soy <b>LulabBot</b> 🤖 de <b>Lulab Tech</b>. ¿Qué deseas hoy?",
      chips: ["Ventas", "Reservas"]
    }
  ]);

  const [ui, setUi] = useState<UIState>({ mode: "idle", status: "Esperando acción" });

  function push(role: Role, text: string, chips?: string[]) {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role, text, chips }]);
  }

  function handleChip(choice: string) {
    push("user", choice);
    if (choice === "Ventas") {
      setUi({ mode: "sale", status: "Esperando dirección" });
      push(
        "bot",
        "Agregué <b>Producto Lulab Tech — $100</b>. Envío fijo <b>$5</b>.<br/>¿Cuál es tu <b>dirección</b> para el envío?"
      );
      return;
    }
    if (choice === "Reservas") {
      setUi({ mode: "reservation", status: "Esperando fecha/hora", depositSelected: null });
      push(
        "bot",
        "¿Para qué <b>fecha y hora</b> deseas reservar? <span class='text-zinc-600'>(Ej.: 2025-10-10 15:00)</span>"
      );
      return;
    }
    if (choice === "Confirmar") {
      setUi((prev) =>
        prev.mode === "sale" ? { ...prev, confirmed: true, status: "Listo para pagar" } : prev
      );
      push("bot", "Perfecto ✅. Presiona <b>“Pagar con Yappy (mock)”</b> en el panel para completar tu compra.");
      return;
    }
    if (choice === "Editar") {
      setUi({ mode: "sale", status: "Esperando dirección" });
      push("bot", "Ok, dime de nuevo tu <b>dirección</b> para el envío.");
      return;
    }
    if (choice === "Pagar depósito $10") {
      setUi((prev) =>
        prev.mode === "reservation" ? { ...prev, depositSelected: true, status: "Listo para pagar" } : prev
      );
      push(
        "bot",
        "Genial. Presiona <b>“Pagar con Yappy (mock)”</b> en el panel para completar el <b>depósito</b>."
      );
      return;
    }
    if (choice === "Reservar sin pago") {
      setUi((prev) =>
        prev.mode === "reservation" ? { ...prev, depositSelected: false, status: "Reserva confirmada" } : prev
      );
      push("bot", "✅ <b>Reserva confirmada</b>. Te contactaremos para detalles.");
      return;
    }
  }

  function handleSend(text: string) {
    push("user", text);

    // Ventas: capturar dirección y pedir confirmación
    if (ui.mode === "sale" && !ui.confirmed && ui.status === "Esperando dirección") {
      setUi({ mode: "sale", address: text, status: "Esperando confirmación", confirmed: false });
      push(
        "bot",
        [
          "Resumen del pedido 🧾",
          "• Producto: $100",
          "• Envío: $5",
          "<b>Total: $105</b>",
          "¿Confirmas el pedido?"
        ].join("<br/>"),
        ["Confirmar", "Editar"]
      );
      return;
    }

    // Reservas: capturar fecha/hora y ofrecer depósito
    if (ui.mode === "reservation" && ui.status === "Esperando fecha/hora") {
      setUi({ mode: "reservation", datetime: text, status: "Elegir depósito", depositSelected: null });
      push(
        "bot",
        `Reserva para <b>${text}</b> creada en borrador.<br/>¿Deseas pagar <b>depósito $10</b> o <b>reservar sin pago</b>?`,
        ["Pagar depósito $10", "Reservar sin pago"]
      );
      return;
    }
  }

  // props panel
  const panel = useMemo(() => {
    if (ui.mode === "sale") {
      return {
        mode: "sale" as const,
        status: ui.confirmed ? "Listo para pagar" : ui.status,
        saleTotal: { subtotal: 100, shipping: 5, total: 105 },
      };
    }
    if (ui.mode === "reservation") {
      return {
        mode: "reservation" as const,
        status: ui.status,
        reservation: { depositSelected: ui.depositSelected ?? null }
      };
    }
    return { mode: "idle" as const, status: ui.status };
  }, [ui]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-2">
          <PhoneMock messages={messages} onSend={handleSend} onChip={handleChip} />
        </section>
        <aside className="md:col-span-1">
          <OrderPanel
            mode={panel.mode}
            // @ts-ignore (pasamos props según el modo)
            saleTotal={panel.saleTotal}
            // @ts-ignore
            reservation={panel.reservation}
            status={panel.status}
            onPayClick={() => alert("Disponible en Fase 6 (Yappy mock)")}
          />
        </aside>
      </div>
    </main>
  );
}
