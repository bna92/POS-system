import { Request, Response } from "express";
import { pool } from "../config/db";

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        products.*,
        categories.name AS category_name
      FROM products
      LEFT JOIN categories ON products.category_id = categories.id
      WHERE products.active = true
      ORDER BY products.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener producto", error });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, barcode, category_id, price, cost, stock, min_stock, image_url } = req.body;

    await pool.query(
      `INSERT INTO products
      (name, barcode, category_id, price, cost, stock, min_stock, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, barcode || null, category_id || null, price, cost, stock, min_stock ?? 5, image_url || null]
    );

    res.status(201).json({ message: "Producto creado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear producto", error });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, barcode, category_id, price, cost, stock, min_stock, image_url } = req.body;

    await pool.query(
      `UPDATE products
       SET name = ?, barcode = ?, category_id = ?, price = ?, cost = ?, stock = ?, min_stock = ?, image_url = ?
       WHERE id = ?`,
      [name, barcode || null, category_id || null, price, cost, stock, min_stock ?? 5, image_url || null, req.params.id]
    );

    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar producto", error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await pool.query("UPDATE products SET active = false WHERE id = ?", [
      req.params.id,
    ]);

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto", error });
  }
};