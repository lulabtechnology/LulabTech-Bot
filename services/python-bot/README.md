# Lulab Tech — Python Automation (FastAPI)

Endpoints:
- `POST /py/order/create` → crea `sale` o `reservation` en Supabase.
- `POST /py/payment/init` → crea `payment` y devuelve `redirect_url`.
- `POST /py/yappy/webhook` → marca `succeeded`/`failed`.

## Variables de entorno
- SUPABASE_URL = https://<tu-proyecto>.supabase.co
- SUPABASE_SERVICE_ROLE_KEY = (Service role key de Supabase)
- BASE_URL = https://<tu-app>.vercel.app  (para construir el redirect_url)

## Arranque (Railway)
Start command:
