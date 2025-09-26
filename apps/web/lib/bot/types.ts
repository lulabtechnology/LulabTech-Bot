export type Intent =
  | "START"
  | "SALE_ADDRESS"
  | "SALE_CONFIRM"
  | "RESERVATION_DATETIME"
  | "RESERVATION_DEPOSIT";

export type SaleDraft = {
  kind: "sale";
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  shipping_address: string;
  customer_name?: string | null;
};

export type ReservationDraft = {
  kind: "reservation";
  datetime_display: string;
  datetime_iso: string;
  deposit_cents: number; // 1000 si escoge depósito, 0 si no
  customer_name?: string | null;
};
