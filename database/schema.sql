-- POS System - MySQL schema
-- Usage: mysql -u root -p pos_system < schema.sql
-- (create the database first: CREATE DATABASE pos_system;)

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------------
-- roles
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- ---------------------------------------------------------------------------
-- business_settings
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS business_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  business_name VARCHAR(150),
  phone VARCHAR(50),
  address TEXT,
  logo_url TEXT,
  tax_rate DECIMAL(5, 2) NOT NULL DEFAULT 0,
  ticket_message TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  barcode VARCHAR(100),
  description TEXT,
  category_id INT,
  cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  min_stock INT NOT NULL DEFAULT 5,
  image_url TEXT,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------------
-- customers
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(30),
  email VARCHAR(150),
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- suppliers
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(30),
  email VARCHAR(150),
  address TEXT,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- cash_registers (apertura / cierre de caja)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cash_registers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  opening_amount DECIMAL(10, 2) NOT NULL,
  closing_amount DECIMAL(10, 2),
  expected_amount DECIMAL(10, 2),
  difference_amount DECIMAL(10, 2),
  status ENUM('open', 'closed') NOT NULL DEFAULT 'open',
  opened_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  closed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ---------------------------------------------------------------------------
-- sales
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  folio VARCHAR(50),
  user_id INT NOT NULL,
  customer_id INT,
  cash_register_id INT,
  subtotal DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  payment_method ENUM('cash', 'card', 'transfer', 'mixed') NOT NULL,
  cash_received DECIMAL(10, 2) NOT NULL DEFAULT 0,
  change_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status ENUM('completed', 'cancelled') NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (cash_register_id) REFERENCES cash_registers(id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------------
-- sale_details
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sale_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sale_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
  price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ---------------------------------------------------------------------------
-- purchases
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS purchases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  supplier_id INT,
  user_id INT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ---------------------------------------------------------------------------
-- purchase_details
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS purchase_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  purchase_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ---------------------------------------------------------------------------
-- inventory_movements (ajustes manuales de stock, fuera de ventas/compras)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inventory_movements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  movement_type ENUM('in', 'out', 'adjustment', 'sale', 'purchase') NOT NULL,
  quantity INT NOT NULL,
  previous_stock INT NOT NULL,
  new_stock INT NOT NULL,
  reference VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------------
-- Seed data
-- ---------------------------------------------------------------------------
INSERT IGNORE INTO roles (id, name) VALUES (1, 'admin'), (2, 'cashier'), (3, 'supervisor');

INSERT INTO business_settings (business_name, phone, address, tax_rate, ticket_message)
SELECT 'Mi Negocio', '667 000 0000', 'Culiacán, Sinaloa', 0.00, 'Gracias por su compra'
WHERE NOT EXISTS (SELECT 1 FROM business_settings);

INSERT INTO categories (name)
SELECT * FROM (SELECT 'Bebidas' UNION SELECT 'Snacks' UNION SELECT 'Abarrotes' UNION SELECT 'Limpieza' UNION SELECT 'Otros') AS seed(name)
WHERE NOT EXISTS (SELECT 1 FROM categories);

-- Usuario administrador inicial
-- email: admin@pos.local
-- password: admin123  (cámbiala después de tu primer login)
INSERT INTO users (name, email, password, role_id)
SELECT 'Administrador', 'admin@pos.local', '$2b$10$bTBcjmR4U1KopCuEJCTvEuxyygoN4whcED.kro.BBE/sHbXGze3BK', id
FROM roles WHERE name = 'admin'
ON DUPLICATE KEY UPDATE email = email;
