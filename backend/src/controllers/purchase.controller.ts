import { Request, Response } from "express";
import { pool } from "../config/db";

export const createPurchase = async (req: Request, res: Response) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { supplier_id, user_id, items, total } = req.body;

    const [purchaseResult]: any = await connection.query(
      `INSERT INTO purchases (supplier_id, user_id, total) VALUES (?, ?, ?)`,
      [supplier_id, user_id, total]
    );

    const purchaseId = purchaseResult.insertId;

    for (const item of items) {
      await connection.query(
        `INSERT INTO purchase_details (purchase_id, product_id, quantity, cost, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [purchaseId, item.product_id, item.quantity, item.cost, item.subtotal]
      );

      await connection.query(
        `UPDATE products SET stock = stock + ? WHERE id = ?`,
        [item.quantity, item.product_id]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Compra registrada correctamente",
      purchase_id: purchaseId,
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: "Error al registrar compra", error });
  } finally {
    connection.release();
  }
};

export const getPurchases = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        purchases.*,
        suppliers.name AS supplier_name,
        users.name AS user_name
      FROM purchases
      LEFT JOIN suppliers ON purchases.supplier_id = suppliers.id
      LEFT JOIN users ON purchases.user_id = users.id
      ORDER BY purchases.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener compras", error });
  }
};

export const getPurchaseById = async (req: Request, res: Response) => {
  try {
    const [purchaseRows]: any = await pool.query(
      `SELECT purchases.*, suppliers.name AS supplier_name, users.name AS user_name
       FROM purchases
       LEFT JOIN suppliers ON purchases.supplier_id = suppliers.id
       LEFT JOIN users ON purchases.user_id = users.id
       WHERE purchases.id = ?`,
      [req.params.id]
    );

    if (purchaseRows.length === 0) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }

    const [items] = await pool.query(
      `SELECT purchase_details.*, products.name AS product_name
       FROM purchase_details
       LEFT JOIN products ON purchase_details.product_id = products.id
       WHERE purchase_id = ?`,
      [req.params.id]
    );

    res.json({ ...purchaseRows[0], items });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener compra", error });
  }
};
