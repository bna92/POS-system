import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../config/db";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      `SELECT users.id, users.name, users.email, roles.name AS role, users.active, users.created_at
       FROM users
       LEFT JOIN roles ON users.role_id = roles.id
       ORDER BY users.name ASC`
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (name, email, password, role_id)
       SELECT ?, ?, ?, id FROM roles WHERE name = ?`,
      [name, email, hashedPassword, role || "cashier"]
    );

    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario", error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, role, password } = req.body;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        `UPDATE users
         SET name = ?, email = ?, role_id = (SELECT id FROM roles WHERE name = ?), password = ?
         WHERE id = ?`,
        [name, email, role, hashedPassword, req.params.id]
      );
    } else {
      await pool.query(
        `UPDATE users
         SET name = ?, email = ?, role_id = (SELECT id FROM roles WHERE name = ?)
         WHERE id = ?`,
        [name, email, role, req.params.id]
      );
    }

    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario", error });
  }
};

export const deactivateUser = async (req: Request, res: Response) => {
  try {
    await pool.query("UPDATE users SET active = false WHERE id = ?", [
      req.params.id,
    ]);

    res.json({ message: "Usuario desactivado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al desactivar usuario", error });
  }
};

export const activateUser = async (req: Request, res: Response) => {
  try {
    await pool.query("UPDATE users SET active = true WHERE id = ?", [
      req.params.id,
    ]);

    res.json({ message: "Usuario activado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al activar usuario", error });
  }
};
