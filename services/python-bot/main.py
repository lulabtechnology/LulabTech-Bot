import os
from typing import Optional, Literal
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import httpx

# ========= Config =========
SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
BASE_URL = os.getenv("BASE_URL", "https://example.vercel.app").rstrip("/")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    print("[WARN] SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no configurados aún.")

HEADERS = {
    "apikey": SUPABASE_SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
    "Content-Type": "application/json",
}

app = FastAPI(title="Lulab Tech — Python Automation", version="1.0.0")


# ========= Modelos =========
class CreateOrderReq(BaseModel):
    kind: Literal["sale", "reservation"]
    shipping_address: Optional[str] = None
    customer_name: Optional[str] = None
    datetime_iso: Optional[str] = None  # ej: 2025-10-10T15:00:00-05:00
    deposit_cents: Optional[int] = 0


class CreateOrderRes(BaseModel):
    ok: bool = True
    order_id: str


class PaymentInitReq(BaseModel):
    order_id: str = Field(..., description="UUID del pedido")
    amount_cents: int = Field(..., ge=1, description="Monto en centavos")


class PaymentInitRes(BaseModel):
    ok: bool = True
    payment_id: str
    redirect_url: str


class YappyWebhookReq(BaseModel):
    order_id: str
    payment_id: str
    status: Literal["succeeded", "failed"]
    external_ref: Optional[str] = None


class OkRes(BaseModel):
    ok: bool = True


# ========= Helpers =========
def _rpc_url(name: str) -> str:
    return f"{SUPABASE_URL}/rest/v1/rpc/{name}"


async def call_rpc(name: str, payload: dict) -> dict:
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.post(_rpc_url(name), headers=HEADERS, json=payload)
        if r.status_code >= 400:
            raise HTTPException(status_code=502, detail={
                "where": f"rpc:{name}",
                "status": r.status_code,
                "body": r.text
            })
        # puede devolver string plano (uuid) o JSON
        try:
            return r.json()
        except Exception:
            return {"value": r.text}


async def patch(url: str, body: dict, extra_headers: Optional[dict] = None) -> dict:
    headers = {**HEADERS}
    if extra_headers:
        headers.update(extra_headers)
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.patch(url, headers=headers, json=body)
        if r.status_code >= 400:
            raise HTTPException(status_code=502, detail={
                "where": f"patch:{url}",
                "status": r.status_code,
                "body": r.text
            })
        try:
            return r.json()
        except Exception:
            return {"value": r.text}


# ========= Endpoints =========
@app.get("/health")
async def health():
    return {"ok": True, "service": "python-bot", "supabase": bool(SUPABASE_URL)}


@app.post("/py/order/create", response_model=CreateOrderRes)
async def create_order(body: CreateOrderReq):
    if body.kind == "sale":
        if not body.shipping_address:
            raise HTTPException(400, detail="shipping_address requerido para sale")
        data = await call_rpc("rpc_create_sale_order", {
            "p_shipping_address": body.shipping_address,
            "p_customer_name": body.customer_name
        })
        # normal: {"rpc_create_sale_order":"uuid"}
        order_id = (
            data.get("rpc_create_sale_order")
            or data.get("id")
            or (isinstance(data, dict) and data.get("value"))
        )
        if not order_id:
            raise HTTPException(500, detail={"msg": "No se obtuvo order_id", "data": data})
        return CreateOrderRes(order_id=order_id)

    # reservation
    if not body.datetime_iso:
        raise HTTPException(400, detail="datetime_iso requerido para reservation")
    pay_deposit = bool(body.deposit_cents and body.deposit_cents > 0)
    data = await call_rpc("rpc_create_reservation", {
        "p_datetime": body.datetime_iso,
        "p_customer_name": body.customer_name,
        "p_pay_deposit": pay_deposit
    })
    order_id = (
        data.get("rpc_create_reservation")
        or data.get("id")
        or (isinstance(data, dict) and data.get("value"))
    )
    if not order_id:
        raise HTTPException(500, detail={"msg": "No se obtuvo order_id", "data": data})
    return CreateOrderRes(order_id=order_id)


@app.post("/py/payment/init", response_model=PaymentInitRes)
async def payment_init(body: PaymentInitReq):
    data = await call_rpc("rpc_payment_init", {
        "p_order_id": body.order_id,
        "p_amount_cents": body.amount_cents,
    })
    payment_id = (
        data.get("rpc_payment_init")
        or data.get("id")
        or (isinstance(data, dict) and data.get("value"))
    )
    if not payment_id:
        raise HTTPException(500, detail={"msg": "No se obtuvo payment_id", "data": data})

    # URL del checkout mock en el frontend Next (FASE 6)
    redirect = f"{BASE_URL}/yappy/mock/checkout?order_id={body.order_id}&payment_id={payment_id}"
    return PaymentInitRes(payment_id=payment_id, redirect_url=redirect)


@app.post("/py/yappy/webhook", response_model=OkRes)
async def yappy_webhook(body: YappyWebhookReq):
    if body.status == "succeeded":
        await call_rpc("rpc_payment_succeeded", {
            "p_order_id": body.order_id,
            "p_payment_id": body.payment_id,
            "p_external_ref": body.external_ref
        })
    else:
        # marcar failed en payments
        url = f"{SUPABASE_URL}/rest/v1/payments?id=eq.{body.payment_id}"
        await patch(url, {"status": "failed"}, {"Prefer": "return=representation"})
    return OkRes()
