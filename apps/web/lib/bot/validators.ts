// Tipos explícitos (discriminated unions)
export type AddressValidation =
  | { ok: true; normalized: string }
  | { ok: false; error: string };

export type DateTimeValidation =
  | { ok: true; display: string; iso: string }
  | { ok: false; error: string };

// Zona: America/Panama (UTC-5 todo el año)
export function validateAddress(input: string): AddressValidation {
  const raw = (input || "").trim().replace(/\s+/g, " ");
  if (raw.length < 8) {
    return { ok: false, error: "Dirección muy corta. Dame más detalles (mín. 8 caracteres)." };
  }
  if (!/[a-zA-Z]/.test(raw)) {
    return { ok: false, error: "Incluye letras en la dirección (calle, sector, etc.)." };
  }
  return { ok: true, normalized: raw };
}

// Acepta: "YYYY-MM-DD HH:mm"
export function validateDateTimePanama(input: string): DateTimeValidation {
  const s = (input || "").trim();
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})$/);
  if (!m) return { ok: false, error: "Formato inválido. Usa: 2025-10-10 15:00" };

  const [_, ys, ms, ds, hs, mins] = m;
  const y = Number(ys), mo = Number(ms), d = Number(ds), h = Number(hs), mi = Number(mins);
  if (mo < 1 || mo > 12) return { ok: false, error: "Mes inválido (01–12)." };
  if (d < 1 || d > 31) return { ok: false, error: "Día inválido (01–31)." };
  if (h < 0 || h > 23) return { ok: false, error: "Hora inválida (00–23)." };
  if (mi < 0 || mi > 59) return { ok: false, error: "Minutos inválidos (00–59)." };

  // Construir fecha “como si” fuera en UTC-5 (America/Panama)
  const dateUTC = new Date(Date.UTC(y, mo - 1, d, h + 5, mi)); // compensamos -05:00
  const now = new Date();
  if (dateUTC.getTime() < now.getTime() - 2 * 60 * 1000) {
    return { ok: false, error: "La fecha/hora ya pasó. Elige un momento futuro." };
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  const display = `${ys}-${pad(mo)}-${pad(d)} ${pad(h)}:${pad(mi)}`;
  const iso = `${ys}-${pad(mo)}-${pad(d)}T${pad(h)}:${pad(mi)}:00-05:00`;

  return { ok: true, display, iso };
}
