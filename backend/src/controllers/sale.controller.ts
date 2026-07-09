import { Request, Response } from "express";
import { pool } from "../config/db";

export const createSale = async (req: Request, res: Response) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const {
      user_id,
      items,
      payment_method,
      cash_received,
      change_amount,
      total,
    } = req.body;

    const [saleResult]: any = await connection.query(
      `INSERT INTO sales 
      (user_id, total, payment_method, cash_received, change_amount)
      VALUES (?, ?, ?, ?, ?)`,
      [user_id, total, payment_method, cash_received, change_amount]
    );

    const saleId = saleResult.insertId;

    for (const item of items) {
      await connection.query(
        `INSERT INTO sale_items 
        (sale_id, product_id, quantity, price, subtotal)
        VALUES (?, ?, ?, ?, ?)`,
        [saleId, item.product_id, item.quantity, item.price, item.subtotal]
      );

      await connection.query(
        `UPDATE products 
         SET stock = stock - ? 
         WHERE id = ?`,
        [item.quantity, item.product_id]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Venta registrada correctamente",
      sale_id: saleId,
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: "Error al registrar venta", error });
  } finally {
    connection.release();
  }
};

export const getSales = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        sales.*,
        users.name AS cashier_name
      FROM sales
      LEFT JOIN users ON sales.user_id = users.id
      ORDER BY sales.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener ventas", error });
  }
};

export const getDailySummary = async (_req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(`
      SELECT 
        COUNT(*) AS total_sales,
        IFNULL(SUM(total), 0) AS total_income
      FROM sales
      WHERE DATE(created_at) = CURDATE()
    `);

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener resumen", error });
  }
};