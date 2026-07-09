import { Request, Response } from "express";
import { pool } from "../config/db";

export const getSalesTrend = async (req: Request, res: Response) => {
  try {
    const days = Number(req.query.days) || 7;

    const [rows] = await pool.query(
      `SELECT DATE(created_at) AS date, COUNT(*) AS total_sales, SUM(total) AS total_income
       FROM sales
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [days]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tendencia de ventas", error });
  }
};

export const getTopProducts = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 5;

    const [rows] = await pool.query(
      `SELECT products.id, products.name, SUM(sale_details.quantity) AS units_sold,
        SUM(sale_details.subtotal) AS total_income
       FROM sale_details
       LEFT JOIN products ON sale_details.product_id = products.id
       GROUP BY products.id, products.name
       ORDER BY units_sold DESC
       LIMIT ?`,
      [limit]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos más vendidos", error });
  }
};

export const getLowStock = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, stock, min_stock
       FROM products
       WHERE active = true AND stock <= min_stock
       ORDER BY stock ASC`
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener stock bajo", error });
  }
};
