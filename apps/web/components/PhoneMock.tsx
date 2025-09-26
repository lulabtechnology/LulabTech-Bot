"use client";

import { useMemo } from "react";

function timePanama() {
  const now = new Date();
  // Mostramos HH:mm local del navegador (Fase 8 ajustaremos al server TZ)
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function PhoneMock() {
  const hhmm = useMemo(() => timePanama(), []);

  return (
    <div className="phone relative mx-auto w-full max-w-[420px] h-[740px]">
      <div className="phone-notch" />
      <header className="phone-header">
        <div className="h-9 w-9 rounded-full bg-white/20 grid place-items-center">LT</div>
        <div className="flex-1">
          <div className="font-semibold">Lulab Tech</div>
          <div className="text-xs text-white/90">en línea</div>
        </div>
        <div className="text-white/90 text-xl">⋮</div>
      </header>

      <div className="h-[calc(100%-56px)] bg-[#ECE5DD] p-3 flex flex-col gap-3 overflow-y-auto">
        {/* Mensajes de ejemplo estáticos (Fase 3 los haremos dinámicos) */}
        <div className="bubble-bot">
          ¡Hola! Soy <b>LulabBot</b> 🤖 de <b>Lulab Tech</b>. ¿Qué deseas hoy?
          <div className="timestamp">{hhmm}</div>
        </div>
        <div className="flex gap-2">
          <span className="bubble-bot">Ventas</span>
          <span className="bubble-bot">Reservas</span>
        </div>

        <div className="bubble-user">
          Ventas
          <div className="timestamp">{hhmm}</div>
        </div>

        <div className="bubble-bot">
          Agregué <b>Producto Lulab Tech — $100</b>. Envío fijo <b>$5</b>.<br />
          ¿Cuál es tu <b>dirección</b> para el envío?
          <div className="timestamp">{hhmm}</div>
        </div>

        {/* Input (decorativo por ahora) */}
        <div className="mt-auto bg-white rounded-xl2 p-2 shadow flex items-center gap-2">
          <input
            disabled
            placeholder="Escribe un mensaje… (Fase 3)"
            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 outline-none disabled:bg-gray-100"
          />
          <button
            disabled
            className="rounded-xl bg-brand-primary text-white px-4 py-2 font-semibold disabled:opacity-60"
            title="Disponible en Fase 3"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
