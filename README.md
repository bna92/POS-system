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
