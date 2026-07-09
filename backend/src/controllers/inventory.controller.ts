import { Request, Response } from "express";
import { pool } from "../config/db";

export const getMovements = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;

    const [rows] = await pool.query(
      `SELECT
        inventory_movements.*,
        products.name AS product_name,
        users.name AS user_name
      FROM inventory_movements
      LEFT JOIN products ON inventory_movements.product_id = products.id
      LEFT JOIN users ON inventory_movements.user_id = users.id
      ${type ? "WHERE inventory_movements.movement_type = ?" : ""}
      ORDER BY inventory_movements.created_at DESC`,
      type ? [type] : []
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener movimientos", error });
  }
};

export const createMovement = async (req: Request, res: Response) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { product_id, user_id, type, quantity, reason } = req.body;

    if (type !== "in" && type !== "out") {
      await connection.rollback();
      return res.status(400).json({ message: "Tipo de movimiento inválido" });
    }

    const [productRows]: any = await connection.query(
      "SELECT stock FROM products WHERE id = ? FOR UPDATE",
      [product_id]
    );

    if (productRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const previousStock = productRows[0].stock;
    const newStock = type === "in" ? previousStock + quantity : previousStock - quantity;

    await connection.query(
      `INSERT INTO inventory_movements
        (product_id, user_id, movement_type, quantity, previous_stock, new_stock, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [product_id, user_id, type, quantity, previousStock, newStock, reason]
    );

    await connection.query("UPDATE products SET stock = ? WHERE id = ?", [newStock, product_id]);

    await connection.commit();

    res.status(201).json({ message: "Movimiento registrado correctamente" });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: "Error al registrar movimiento", error });
  } finally {
    connection.release();
  }
};
