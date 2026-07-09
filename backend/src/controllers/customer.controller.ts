import { Request, Response } from "express";
import { pool } from "../config/db";

export const getCustomers = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM customers WHERE active = true ORDER BY name ASC"
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener clientes", error });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, tax_id, address } = req.body;

    await pool.query(
      `INSERT INTO customers (name, phone, email, tax_id, address)
       VALUES (?, ?, ?, ?, ?)`,
      [name, phone || null, email || null, tax_id || null, address || null]
    );

    res.status(201).json({ message: "Cliente creado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear cliente", error });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, tax_id, address } = req.body;

    await pool.query(
      `UPDATE customers
       SET name = ?, phone = ?, email = ?, tax_id = ?, address = ?
       WHERE id = ?`,
      [name, phone || null, email || null, tax_id || null, address || null, req.params.id]
    );

    res.json({ message: "Cliente actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar cliente", error });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    await pool.query("UPDATE customers SET active = false WHERE id = ?", [
      req.params.id,
    ]);

    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar cliente", error });
  }
};
