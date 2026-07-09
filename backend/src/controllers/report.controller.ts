import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import { pool } from "../config/db";

export const getSalesReportPdf = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query;

    const fromDate = (from as string) || new Date().toISOString().slice(0, 10);
    const toDate = (to as string) || new Date().toISOString().slice(0, 10);

    const [rows]: any = await pool.query(
      `SELECT sales.id, sales.total, sales.payment_method, sales.created_at,
        users.name AS cashier_name
       FROM sales
       LEFT JOIN users ON sales.user_id = users.id
       WHERE DATE(sales.created_at) BETWEEN ? AND ?
       ORDER BY sales.created_at ASC`,
      [fromDate, toDate]
    );

    const totalIncome = rows.reduce((sum: number, row: any) => sum + Number(row.total), 0);

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="reporte-ventas-${fromDate}-a-${toDate}.pdf"`
    );

    doc.pipe(res);

    doc.fontSize(18).text("Reporte de ventas", { align: "center" });
    doc.moveDown();
    doc.fontSize(11).text(`Periodo: ${fromDate} a ${toDate}`);
    doc.text(`Total de ventas: ${rows.length}`);
    doc.text(`Ingresos totales: $${totalIncome.toFixed(2)}`);
    doc.moveDown();

    doc.fontSize(10);
    rows.forEach((row: any) => {
      doc.text(
        `#${row.id}  ${new Date(row.created_at).toLocaleString()}  ${row.cashier_name || "N/A"}  ${row.payment_method}  $${Number(row.total).toFixed(2)}`
      );
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Error al generar reporte", error });
  }
};
