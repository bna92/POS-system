import { Request, Response } from "express";
import { pool } from "../config/db";

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories ORDER BY name ASC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener categorías", error });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    await pool.query("INSERT INTO categories (name) VALUES (?)", [name]);

    res.status(201).json({ message: "Categoría creada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear categoría", error });
  }
};