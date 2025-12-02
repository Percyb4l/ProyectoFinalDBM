import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

// ===============================
// LOGIN
// ===============================
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0)
      return res.status(401).json({ error: "Usuario no encontrado" });

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// REGISTER (solo si lo usas)
// ===============================
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, institution_id } = req.body;

    const hashedPass = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (name, email, password, role, institution_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await pool.query(query, [
      name,
      email,
      hashedPass,
      role,
      institution_id || null,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
