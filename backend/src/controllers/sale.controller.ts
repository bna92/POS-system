import { Request, Response } from "express";
import { pool } from "../config/db";
import { printReceipt } from "../utils/ticketPrinter";

export const createSale = async (req: Request, res: Response) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const {
      user_id,
      customer_id,
      cash_register_id,
      items,
      payment_method,
      cash_received,
      change_amount,
      total,
    } = req.body;

    const [saleResult]: any = await connection.query(
      `INSERT INTO sales
      (user_id, customer_id, cash_register_id, subtotal, total, payment_method, cash_received, change_amount)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        customer_id || null,
        cash_register_id || null,
        total,
        total,
        payment_method,
        cash_received,
        change_amount,
      ]
    );

    const saleId = saleResult.insertId;

    await connection.query(
      "UPDATE sales SET folio = ? WHERE id = ?",
      [`V-${String(saleId).padStart(6, "0")}`, saleId]
    );

    for (const item of items) {
      await connection.query(
        `INSERT INTO sale_details
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
        users.name AS cashier_name,
        customers.name AS customer_name
      FROM sales
      LEFT JOIN users ON sales.user_id = users.id
      LEFT JOIN customers ON sales.customer_id = customers.id
      ORDER BY sales.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener ventas", error });
  }
};

async function fetchReceiptData(saleId: string) {
  const [saleRows]: any = await pool.query(
    `SELECT sales.*, users.name AS cashier_name, customers.name AS customer_name
     FROM sales
     LEFT JOIN users ON sales.user_id = users.id
     LEFT JOIN customers ON sales.customer_id = customers.id
     WHERE sales.id = ?`,
    [saleId]
  );

  if (saleRows.length === 0) {
    return null;
  }

  const [items] = await pool.query(
    `SELECT sale_details.*, products.name AS product_name
     FROM sale_details
     LEFT JOIN products ON sale_details.product_id = products.id
     WHERE sale_id = ?`,
    [saleId]
  );

  return { ...saleRows[0], items };
}

export const getSaleReceipt = async (req: Request, res: Response) => {
  try {
    const receipt = await fetchReceiptData(String(req.params.id));

    if (!receipt) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    res.json(receipt);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el recibo", error });
  }
};

export const printSaleReceipt = async (req: Request, res: Response) => {
  try {
    const receipt = await fetchReceiptData(String(req.params.id));

    if (!receipt) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    await printReceipt(receipt);

    res.json({ message: "Ticket enviado a la impresora" });
  } catch (error: any) {
    res.status(503).json({
      message: error?.message || "No se pudo imprimir el ticket. Verifica la impresora térmica.",
    });
  }
};

export const getDailySummary = async (_req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(`
      SELECT
        COUNT(*) AS total_sales,
        IFNULL(SUM(total), 0) AS total_income
      FROM sales
      WHERE DATE(created_at) = CURDATE() AND status = 'completed'
    `);

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener resumen", error });
  }
};
