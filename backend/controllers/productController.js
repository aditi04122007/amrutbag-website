import pool from "../config/db.js";

// GET ALL PRODUCTS with optional search, category, and sorting
export const getProducts = async (req, res) => {
  try {
    const { search, category, sort, featured, limit } = req.query;

    let query = "SELECT * FROM products WHERE 1=1";
    const params = [];

    if (search && search.trim()) {
      query += " AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ?)";
      const term = `%${search.trim().toLowerCase()}%`;
      params.push(term, term);
    }

    if (category && category !== "All" && category.trim()) {
      query += " AND category = ?";
      params.push(category.trim());
    }

    if (featured === "true") {
      query += " AND rating >= 4.7";
    }

    // Sorting
    switch (sort) {
      case "price-asc":
        query += " ORDER BY price ASC";
        break;
      case "price-desc":
        query += " ORDER BY price DESC";
        break;
      case "rating":
        query += " ORDER BY rating DESC";
        break;
      case "name-asc":
        query += " ORDER BY name ASC";
        break;
      case "newest":
      default:
        query += " ORDER BY created_at DESC";
        break;
    }

    if (limit && !isNaN(Number(limit))) {
      query += " LIMIT ?";
      params.push(Number(limit));
    }

    const [products] = await pool.query(query, params);
    res.json(products);
  } catch (error) {
    console.error("getProducts error:", error);
    res.status(500).json({ message: "Failed to retrieve products", error: error.message });
  }
};

// GET DISTINCT CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != '' ORDER BY category ASC"
    );
    const categories = rows.map((r) => r.category);
    res.json(categories);
  } catch (error) {
    console.error("getCategories error:", error);
    res.status(500).json({ message: "Failed to retrieve categories", error: error.message });
  }
};

// GET SINGLE PRODUCT BY ID WITH RELATED PRODUCTS
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [products] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = products[0];

    // Fetch up to 4 related products in the same category
    const [related] = await pool.query(
      "SELECT * FROM products WHERE category = ? AND id != ? LIMIT 4",
      [product.category, id]
    );

    res.json({
      ...product,
      relatedProducts: related
    });
  } catch (error) {
    console.error("getProductById error:", error);
    res.status(500).json({ message: "Failed to retrieve product", error: error.message });
  }
};

// CREATE PRODUCT (ADMIN ONLY)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock, rating } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price, and category are required." });
    }

    const parsedPrice = parseFloat(price);
    const parsedStock = stock !== undefined && !isNaN(Number(stock)) ? parseInt(stock, 10) : 10;
    const parsedRating = rating !== undefined && !isNaN(Number(rating)) ? parseFloat(rating) : 4.5;
    const finalImage = image || "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80";

    const [result] = await pool.query(
      `INSERT INTO products (name, description, price, image, category, stock, rating)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        description ? description.trim() : "",
        parsedPrice,
        finalImage,
        category.trim(),
        parsedStock,
        parsedRating
      ]
    );

    const [newProduct] = await pool.query("SELECT * FROM products WHERE id = ?", [result.insertId]);

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct[0]
    });
  } catch (error) {
    console.error("createProduct error:", error);
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

// UPDATE PRODUCT (ADMIN ONLY)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, category, stock, rating } = req.body;

    const [existing] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const current = existing[0];
    const updatedName = name !== undefined ? name.trim() : current.name;
    const updatedDesc = description !== undefined ? description.trim() : current.description;
    const updatedPrice = price !== undefined ? parseFloat(price) : current.price;
    const updatedImage = image !== undefined ? image : current.image;
    const updatedCategory = category !== undefined ? category.trim() : current.category;
    const updatedStock = stock !== undefined ? parseInt(stock, 10) : current.stock;
    const updatedRating = rating !== undefined ? parseFloat(rating) : current.rating;

    await pool.query(
      `UPDATE products
       SET name = ?, description = ?, price = ?, image = ?, category = ?, stock = ?, rating = ?
       WHERE id = ?`,
      [
        updatedName,
        updatedDesc,
        updatedPrice,
        updatedImage,
        updatedCategory,
        updatedStock,
        updatedRating,
        id
      ]
    );

    const [updated] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);

    res.json({
      message: "Product updated successfully",
      product: updated[0]
    });
  } catch (error) {
    console.error("updateProduct error:", error);
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

// DELETE PRODUCT (ADMIN ONLY)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query("SELECT id FROM products WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    await pool.query("DELETE FROM products WHERE id = ?", [id]);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("deleteProduct error:", error);
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};