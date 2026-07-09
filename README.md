# POS System

Sistema de punto de venta con backend en Express/TypeScript + MySQL y frontend en React/Vite.

## Módulos

- Punto de venta (POS), carrito y cobro
- Catálogo de productos y categorías
- Clientes y proveedores
- Compras a proveedores
- Entradas y salidas de inventario
- Apertura y cierre de caja
- Historial de ventas y reportes (PDF)
- Impresión de tickets (vista imprimible de navegador y soporte ESC/POS opcional)
- Usuarios y roles (admin / cajero) con autenticación por JWT

## Requisitos

- Node.js 18+
- MySQL 8+

## Instalación

### 1. Base de datos

```bash
mysql -u root -p -e "CREATE DATABASE pos_system;"
mysql -u root -p pos_system < database/schema.sql
```

Esto crea todas las tablas y un usuario administrador inicial:

- **email:** `admin@pos.local`
- **password:** `admin123`

Cambia esa contraseña después de tu primer inicio de sesión.

### 2. Backend

```bash
cd backend
npm install
```

Crea `backend/.env`:

```
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=pos_system
JWT_SECRET=cambia_esto_por_un_secreto_largo
```

```bash
npm run dev
```

El backend queda disponible en `http://localhost:4000`.

### 3. Frontend

```bash
cd frontend
npm install
```

Crea `frontend/.env`:

```
VITE_API_URL=http://localhost:4000/api
```

```bash
npm run dev
```

El frontend queda disponible en `http://localhost:5173`.

## Despliegue (Railway + Render + Vercel)

### 1. Base de datos — Railway

1. Crea un proyecto en Railway → **New** → **Database** → **MySQL**.
2. En la pestaña **Variables** del servicio MySQL, copia `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`.
3. Conéctate con esos datos (por ejemplo con MySQL Workbench o `mysql -h <host> -P <port> -u <user> -p`) y carga el esquema:
   ```bash
   mysql -h MYSQLHOST -P MYSQLPORT -u MYSQLUSER -p MYSQLDATABASE < database/schema.sql
   ```

### 2. Backend — Render

1. En Render: **New** → **Web Service**, conecta el repo de GitHub.
2. **Root Directory:** `backend`
3. **Build Command:** `npm install && npm run build`
4. **Start Command:** `npm start`
5. Variables de entorno (Environment):
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` → los valores de Railway (paso 1)
   - `DB_SSL` → `false` (déjalo en `true` solo si Render no logra conectar sin SSL)
   - `JWT_SECRET` → un secreto largo y aleatorio
   - `FRONTEND_URL` → la URL de Vercel del paso 3 (se agrega/actualiza después de crear el proyecto en Vercel)
6. Despliega. Tu backend queda en algo como `https://pos-backend.onrender.com`.

> Nota: en el plan free, Render "duerme" el servicio tras ~15 min sin tráfico — la primera petición después de eso tarda unos 30-50 seg en responder.

### 3. Frontend — Vercel

1. En Vercel: **Add New** → **Project**, importa el repo de GitHub.
2. **Root Directory:** `frontend`
3. Framework se detecta solo (Vite). Build command y output quedan por defecto.
4. Variable de entorno: `VITE_API_URL` → `https://pos-backend.onrender.com/api` (la URL de Render del paso 2, con `/api` al final)
5. Despliega. Copia la URL final de Vercel (ej. `https://pos-system.vercel.app`) y actualízala en Render como `FRONTEND_URL` (paso 2.5), luego vuelve a desplegar el backend para que el CORS la reconozca.
