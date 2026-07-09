import { Request, Response } from "express";
import { pool } from "../config/db";

export const getSuppliers = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM suppliers WHERE active = true ORDER BY name ASC"
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener proveedores", error });
  }
};

export const createSupplier = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, address } = req.body;

    await pool.query(
      `INSERT INTO suppliers (name, phone, email, address) VALUES (?, ?, ?, ?)`,
      [name, phone || null, email || null, address || null]
    );

    res.status(201).json({ message: "Proveedor creado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear proveedor", error });
  }
};

export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, address } = req.body;

    await pool.query(
      `UPDATE suppliers SET name = ?, phone = ?, email = ?, address = ? WHERE id = ?`,
      [name, phone || null, email || null, address || null, req.params.id]
    );

    res.json({ message: "Proveedor actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar proveedor", error });
  }
};

export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    await pool.query("UPDATE suppliers SET active = false WHERE id = ?", [
      req.params.id,
    ]);

    res.json({ message: "Proveedor eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar proveedor", error });
  }
};
