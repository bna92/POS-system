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

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    await pool.query("UPDATE categories SET name = ? WHERE id = ?", [
      name,
      req.params.id,
    ]);

    res.json({ message: "Categoría actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar categoría", error });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await pool.query("DELETE FROM categories WHERE id = ?", [req.params.id]);

    res.json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar categoría", error });
  }
};