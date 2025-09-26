"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Chip from "./Chip";

type Role = "bot" | "user";
type Message = { id: string; role: Role; text: string; chips?: string[] };

function timePanama() {
  const now = new Date();
  return new Intl.DateTimeFormat("es-PA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Panama"
  }).format(now);
}

export type FlowState =
  | { flow: "idle" }
  | { flow: "sale"; step: "ask_address" | "confirm"; address?: string; confirmed?: boolean }
  | { flow: "reservation"; step: "ask_datetime" | "deposit_choice"; datetime?: string; deposit?: boolean | null };

export default function PhoneMock({
  messages,
  onSend,
  onChip,
}: {
  messages: Message[];
  onSend: (text: string) => void;
  onChip: (value: string) => void;
}) {
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

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
        {messages.map((m) => (
          <div key={m.id} className={m.role === "bot" ? "bubble-bot" : "bubble-user"}>
            <div dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, "<br/>") }} />
            {m.chips && m.chips.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {m.chips.map((c) => (
                  <Chip key={c} onClick={() => onChip(c)}>{c}</Chip>
                ))}
              </div>
            )}
            <div className="timestamp">{timePanama()}</div>
          </div>
        ))}

        <div ref={bottomRef} />

        {/* Composer */}
        <div className="mt-auto bg-white rounded-xl2 p-2 shadow flex items-center gap-2 sticky bottom-0">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && text.trim()) {
                onSend(text.trim());
                setText("");
              }
            }}
            placeholder="Escribe tu respuesta…"
            className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 outline-none"
          />
          <button
            onClick={() => {
              if (!text.trim()) return;
              onSend(text.trim());
              setText("");
            }}
            className="rounded-xl bg-brand-primary text-white px-4 py-2 font-semibold"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
