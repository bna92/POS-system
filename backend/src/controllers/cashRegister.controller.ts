import { Request, Response } from "express";
import { pool } from "../config/db";

export const getActiveSession = async (_req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      `SELECT cash_registers.*, users.name AS user_name
       FROM cash_registers
       LEFT JOIN users ON cash_registers.user_id = users.id
       WHERE status = 'open'
       ORDER BY opened_at DESC
       LIMIT 1`
    );

    if (rows.length === 0) {
      return res.json(null);
    }

    const session = rows[0];

    const [salesSummary]: any = await pool.query(
      `SELECT COUNT(*) AS total_sales, IFNULL(SUM(total), 0) AS total_income,
        IFNULL(SUM(CASE WHEN payment_method = 'cash' THEN total ELSE 0 END), 0) AS cash_income
       FROM sales
       WHERE cash_register_id = ?`,
      [session.id]
    );

    res.json({ ...session, summary: salesSummary[0] });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener sesión de caja", error });
  }
};

export const openSession = async (req: Request, res: Response) => {
  try {
    const { user_id, opening_amount } = req.body;

    const [existing]: any = await pool.query(
      "SELECT id FROM cash_registers WHERE status = 'open' LIMIT 1"
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Ya hay una caja abierta" });
    }

    const [result]: any = await pool.query(
      "INSERT INTO cash_registers (user_id, opening_amount) VALUES (?, ?)",
      [user_id, opening_amount]
    );

    res.status(201).json({ message: "Caja abierta correctamente", id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Error al abrir caja", error });
  }
};

export const closeSession = async (req: Request, res: Response) => {
  try {
    const { closing_amount } = req.body;

    const [rows]: any = await pool.query(
      "SELECT * FROM cash_registers WHERE id = ? AND status = 'open'",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Sesión de caja no encontrada o ya cerrada" });
    }

    const session = rows[0];

    const [salesSummary]: any = await pool.query(
      `SELECT IFNULL(SUM(CASE WHEN payment_method = 'cash' THEN total ELSE 0 END), 0) AS cash_income
       FROM sales
       WHERE cash_register_id = ?`,
      [session.id]
    );

    const expectedAmount =
      Number(session.opening_amount) + Number(salesSummary[0].cash_income);
    const difference = Number(closing_amount) - expectedAmount;

    await pool.query(
      `UPDATE cash_registers
       SET closing_amount = ?, expected_amount = ?, difference_amount = ?, status = 'closed', closed_at = NOW()
       WHERE id = ?`,
      [closing_amount, expectedAmount, difference, session.id]
    );

    res.json({ message: "Caja cerrada correctamente", expected_amount: expectedAmount, difference });
  } catch (error) {
    res.status(500).json({ message: "Error al cerrar caja", error });
  }
};

export const getSessionHistory = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      `SELECT cash_registers.*, users.name AS user_name
       FROM cash_registers
       LEFT JOIN users ON cash_registers.user_id = users.id
       ORDER BY opened_at DESC`
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener historial de caja", error });
  }
};
