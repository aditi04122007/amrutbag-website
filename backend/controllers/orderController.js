import pool from "../config/db.js";

// CREATE ORDER (Transaction-based)
export const createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.user.id;
    const { items, shipping_address } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart items cannot be empty." });
    }

    if (!shipping_address) {
      return res.status(400).json({ message: "Shipping address is required." });
    }

    // Convert shipping address to string if object
    const serializedShipping = typeof shipping_address === "object"
      ? JSON.stringify(shipping_address)
      : String(shipping_address);

    await connection.beginTransaction();

    // Calculate total amount securely based on database products or verified prices
    let totalAmount = 0;
    const verifiedItems = [];

    for (const item of items) {
      const productId = item.id || item.product_id;
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);

      const [productRows] = await connection.query(
        "SELECT id, name, price, stock FROM products WHERE id = ?",
        [productId]
      );

      if (productRows.length === 0) {
        throw new Error(`Product with ID ${productId} no longer exists.`);
      }

      const product = productRows[0];
      const itemPrice = parseFloat(product.price);
      totalAmount += itemPrice * quantity;

      verifiedItems.push({
        product_id: product.id,
        quantity,
        price: itemPrice
      });
    }

    // Insert order header
    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, total_amount, status, shipping_address)
       VALUES (?, ?, 'Pending', ?)`,
      [userId, totalAmount, serializedShipping]
    );

    const orderId = orderResult.insertId;

    // Insert order items & adjust product stock
    for (const item of verifiedItems) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.price]
      );

      // Decrement stock gracefully
      await connection.query(
        "UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?",
        [item.quantity, item.product_id]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Order placed successfully",
      orderId,
      totalAmount,
      status: "Pending"
    });
  } catch (error) {
    await connection.rollback();
    console.error("createOrder error:", error);
    res.status(500).json({ message: error.message || "Failed to place order" });
  } finally {
    connection.release();
  }
};

// GET USER'S OWN ORDERS
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const [orders] = await pool.query(
      `SELECT o.id, o.user_id, o.total_amount, o.status, o.shipping_address, o.created_at,
              COUNT(oi.id) as total_items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId]
    );

    // Populate items for each order
    for (const order of orders) {
      const [items] = await pool.query(
        `SELECT oi.id, oi.quantity, oi.price, p.id as product_id, p.name, p.image, p.category
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;

      // Parse shipping address if stored as JSON
      try {
        order.shipping_details = JSON.parse(order.shipping_address);
      } catch {
        order.shipping_details = { address: order.shipping_address };
      }
    }

    res.json(orders);
  } catch (error) {
    console.error("getMyOrders error:", error);
    res.status(500).json({ message: "Failed to retrieve your orders", error: error.message });
  }
};

// GET SINGLE ORDER DETAILS
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === "admin";

    const [orders] = await pool.query(
      `SELECT o.*, u.name as customer_name, u.email as customer_email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.id = ?`,
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orders[0];

    // Authorization check: only order owner or admin can view
    if (!isAdmin && order.user_id !== userId) {
      return res.status(403).json({ message: "You are not authorized to view this order." });
    }

    const [items] = await pool.query(
      `SELECT oi.id, oi.quantity, oi.price, p.id as product_id, p.name, p.image, p.category
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [id]
    );

    order.items = items;
    try {
      order.shipping_details = JSON.parse(order.shipping_address);
    } catch {
      order.shipping_details = { address: order.shipping_address };
    }

    res.json(order);
  } catch (error) {
    console.error("getOrderById error:", error);
    res.status(500).json({ message: "Failed to retrieve order details", error: error.message });
  }
};

// GET ALL ORDERS (ADMIN ONLY)
export const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT o.id, o.user_id, o.total_amount, o.status, o.shipping_address, o.created_at,
             u.name as customer_name, u.email as customer_email,
             COUNT(oi.id) as item_count
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== "All") {
      query += " AND o.status = ?";
      params.push(status);
    }

    query += " GROUP BY o.id ORDER BY o.created_at DESC";

    const [orders] = await pool.query(query, params);

    // Attach items for each order
    for (const order of orders) {
      const [items] = await pool.query(
        `SELECT oi.id, oi.quantity, oi.price, p.id as product_id, p.name, p.image
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
      try {
        order.shipping_details = JSON.parse(order.shipping_address);
      } catch {
        order.shipping_details = { address: order.shipping_address };
      }
    }

    res.json(orders);
  } catch (error) {
    console.error("getAllOrders error:", error);
    res.status(500).json({ message: "Failed to retrieve orders", error: error.message });
  }
};

// UPDATE ORDER STATUS (ADMIN ONLY)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      });
    }

    const [existing] = await pool.query("SELECT id FROM orders WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);

    res.json({
      message: `Order #${id} status updated to ${status}`,
      orderId: id,
      status
    });
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
};

// DELETE ORDER (ADMIN ONLY)
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query("SELECT id FROM orders WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    await pool.query("DELETE FROM orders WHERE id = ?", [id]);

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("deleteOrder error:", error);
    res.status(500).json({ message: "Failed to delete order", error: error.message });
  }
};

// GET ADMIN DASHBOARD STATS (ADMIN ONLY)
export const getAdminStats = async (req, res) => {
  try {
    const [userCount] = await pool.query("SELECT COUNT(*) as total FROM users");
    const [productCount] = await pool.query("SELECT COUNT(*) as total FROM products");
    const [orderCount] = await pool.query("SELECT COUNT(*) as total FROM orders");
    const [revenue] = await pool.query(
      "SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status != 'Cancelled'"
    );

    // Recent orders with customer contact and address details
    const [recentOrders] = await pool.query(`
      SELECT o.id, o.total_amount, o.status, o.created_at, o.shipping_address,
             u.name as customer_name, u.email as customer_email,
             COUNT(oi.id) as item_count
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);

    // Parse shipping address details for each order
    for (const order of recentOrders) {
      try {
        order.shipping_details = JSON.parse(order.shipping_address);
      } catch {
        order.shipping_details = { address: order.shipping_address };
      }
    }

    // Status breakdown
    const [statusDistribution] = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM orders
      GROUP BY status
    `);

    // Recent 5 products
    const [recentProducts] = await pool.query(`
      SELECT id, name, price, stock, category, image
      FROM products
      ORDER BY created_at DESC
      LIMIT 5
    `);

    res.json({
      totalUsers: userCount[0].total,
      totalProducts: productCount[0].total,
      totalOrders: orderCount[0].total,
      totalRevenue: parseFloat(revenue[0].total) || 0,
      recentOrders,
      recentProducts,
      statusDistribution
    });
  } catch (error) {
    console.error("getAdminStats error:", error);
    res.status(500).json({ message: "Failed to retrieve admin stats", error: error.message });
  }
};