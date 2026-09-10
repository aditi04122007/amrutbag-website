import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper to create token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || "mysecretkey",
    { expiresIn: "7d" }
  );
};

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = ?",
      [normalizedEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Only standard customers can register; admin access is restricted to the pre-configured admin account
    const role = "user";

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name.trim(), normalizedEmail, hashedPassword, role]
    );

    const newUser = {
      id: result.insertId,
      name: name.trim(),
      email: normalizedEmail,
      role
    };

    const token = generateToken(newUser);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: newUser
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration", error: error.message });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [users] = await pool.query(
      "SELECT * FROM users WHERE LOWER(email) = ?",
      [normalizedEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || "user"
    };

    const token = generateToken(userData);

    res.json({
      message: "Login successful",
      token,
      user: userData
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
};

// GET USER PROFILE
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [users] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = users[0];

    // Get order statistics for this user
    const [orderStats] = await pool.query(
      "SELECT COUNT(*) as totalOrders, COALESCE(SUM(total_amount), 0) as totalSpent FROM orders WHERE user_id = ?",
      [userId]
    );

    res.json({
      user,
      stats: {
        totalOrders: Number(orderStats[0].totalOrders) || 0,
        totalSpent: parseFloat(orderStats[0].totalSpent) || 0
      }
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

// UPDATE USER PROFILE
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, password } = req.body;

    const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = users[0];
    const updatedName = name ? name.trim() : user.name;
    const updatedEmail = email ? email.trim().toLowerCase() : user.email;

    // Check email conflict if changing email
    if (updatedEmail !== user.email) {
      const [existing] = await pool.query("SELECT id FROM users WHERE email = ? AND id != ?", [updatedEmail, userId]);
      if (existing.length > 0) {
        return res.status(400).json({ message: "Email is already taken by another account." });
      }
    }

    let updatedPassword = user.password;
    if (password && password.trim().length > 0) {
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters." });
      }
      updatedPassword = await bcrypt.hash(password, 10);
    }

    await pool.query(
      "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
      [updatedName, updatedEmail, updatedPassword, userId]
    );

    const updatedUser = {
      id: user.id,
      name: updatedName,
      email: updatedEmail,
      role: user.role
    };

    const token = generateToken(updatedUser);

    res.json({
      message: "Profile updated successfully",
      token,
      user: updatedUser
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};