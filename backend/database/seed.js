import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

async function seedDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "mysql",
    });

    console.log("Connected to MySQL Server...");

    // Create database if not exists
    const dbName = process.env.DB_NAME || "bagstore";
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.query(`USE \`${dbName}\`;`);

    console.log(`Using database: ${dbName}`);

    // Create or migrate users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure role column exists
    const [userCols] = await connection.query("SHOW COLUMNS FROM users LIKE 'role'");
    if (userCols.length === 0) {
      await connection.query("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user'");
      console.log("Added 'role' column to users table.");
    }

    // Create or migrate products table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image VARCHAR(500),
        category VARCHAR(100) NOT NULL,
        stock INT DEFAULT 10,
        rating DECIMAL(2,1) DEFAULT 4.5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create or migrate orders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        shipping_address TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Ensure orders table has total_amount and shipping_address
    const [orderColsTotal] = await connection.query("SHOW COLUMNS FROM orders LIKE 'total_amount'");
    if (orderColsTotal.length === 0) {
      const [orderColsOld] = await connection.query("SHOW COLUMNS FROM orders LIKE 'total'");
      if (orderColsOld.length > 0) {
        await connection.query("ALTER TABLE orders CHANGE COLUMN total total_amount DECIMAL(10,2) NOT NULL");
      } else {
        await connection.query("ALTER TABLE orders ADD COLUMN total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00");
      }
      console.log("Configured total_amount in orders table.");
    }

    const [orderColsShipping] = await connection.query("SHOW COLUMNS FROM orders LIKE 'shipping_address'");
    if (orderColsShipping.length === 0) {
      await connection.query("ALTER TABLE orders ADD COLUMN shipping_address TEXT");
      console.log("Added shipping_address column to orders table.");
    }

    // Create order_items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      );
    `);

    console.log("All tables verified and ready.");

    // Seed Admin and Demo User
    const adminPassword = await bcrypt.hash("admin123", 10);
    const userPassword = await bcrypt.hash("user123", 10);

    await connection.query(`
      INSERT INTO users (name, email, password, role)
      VALUES ('Amrut Bag Admin', 'admin@amrutbag.com', ?, 'admin')
      ON DUPLICATE KEY UPDATE name = 'Amrut Bag Admin', password = VALUES(password), role = 'admin';
    `, [adminPassword]);

    await connection.query(`
      INSERT INTO users (name, email, password, role)
      VALUES ('Amrut Bag Admin', 'admin@shopsphere.com', ?, 'admin')
      ON DUPLICATE KEY UPDATE name = 'Amrut Bag Admin', password = VALUES(password), role = 'admin';
    `, [adminPassword]);

    // Also support admin@gmail.com for backwards compatibility with user's earlier tests
    await connection.query(`
      INSERT INTO users (name, email, password, role)
      VALUES ('Admin User', 'admin@gmail.com', ?, 'admin')
      ON DUPLICATE KEY UPDATE role = 'admin', password = VALUES(password);
    `, [adminPassword]);

    await connection.query(`
      INSERT INTO users (name, email, password, role)
      VALUES ('Jane Doe', 'user@shopsphere.com', ?, 'user')
      ON DUPLICATE KEY UPDATE name = 'Jane Doe', password = VALUES(password), role = 'user';
    `, [userPassword]);

    console.log("Admin & User accounts seeded successfully.");

    // Seed Sample Products
    const sampleProducts = [
      // School Bags
      {
        name: "Apex Ergonomic School Bag",
        description: "Designed with orthopaedic back support, multiple book dividers, waterproof bottom base, reflective safety strips, and side water bottle sleeves.",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=800&auto=format&fit=crop&q=80",
        category: "School Bags",
        stock: 35,
        rating: 4.9
      },
      {
        name: "Kids Explorer Adventure School Bag",
        description: "Vibrant lightweight school bag with cushioned breathable shoulder straps, dual mesh drink pockets, smooth durable zippers, and easy-clean lining.",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=800&auto=format&fit=crop&q=80",
        category: "School Bags",
        stock: 45,
        rating: 4.8
      },
      {
        name: "Student Pro Heavy-Duty School Backpack",
        description: "Spacious 32L capacity with reinforced stress points, padded tablet/notebook sleeve, organizer pockets for stationery, and rain cover.",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
        category: "School Bags",
        stock: 50,
        rating: 4.9
      },
      {
        name: "Junior Pastel Study Bag & Pencil Case Set",
        description: "Aesthetic multi-compartment pastel school bag complete with matching pencil pouch, book dividers, and ergonomic chest buckle.",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80",
        category: "School Bags",
        stock: 30,
        rating: 4.7
      },

      // Traveling Bags
      {
        name: "Voyager 60L Expandable Traveling Bag",
        description: "Heavy-duty waterproof traveling bag with hideaway backpack straps, separate ventilated shoe compartment, and airline carry-on compliant dimensions.",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
        category: "Traveling Bags",
        stock: 25,
        rating: 4.9
      },
      {
        name: "Horizon Rolling Traveling Bag with Wheels",
        description: "Smooth 360-degree silent spinner wheels, telescoping aluminum pull handle, ultra-durable tear-resistant exterior, and TSA combination lock.",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&auto=format&fit=crop&q=80",
        category: "Traveling Bags",
        stock: 20,
        rating: 4.8
      },
      {
        name: "Nomad Water-Resistant Weekender Traveling Bag",
        description: "Stylish travel holdall with luggage trolley pass-through sleeve, separate wet pocket for toiletries, and padded detachable shoulder strap.",
        price: 69.99,
        image: "https://images.unsplash.com/photo-1510519138111-5778749725f0?w=800&auto=format&fit=crop&q=80",
        category: "Traveling Bags",
        stock: 35,
        rating: 4.8
      },
      {
        name: "Summit Overnighter Traveling Duffel",
        description: "Compact travel bag with quick-access passport organizer, padded laptop compartment, and high-density ripstop weather-resistant fabric.",
        price: 74.99,
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
        category: "Traveling Bags",
        stock: 28,
        rating: 4.7
      },

      // Tiffin Bags
      {
        name: "ThermoShield Insulated Tiffin Bag",
        description: "Triple-layer thermal insulation keeps tiffin boxes hot for up to 6 hours or chilled with cold packs. Leakproof food-grade PEVA lining and cutlery storage pocket.",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
        category: "Tiffin Bags",
        stock: 60,
        rating: 4.9
      },
      {
        name: "FreshMeal Dual-Deck Thermal Tiffin Bag",
        description: "Dual-compartment design separates warm lunch containers from fruit, snacks, and beverages. Water-resistant oxford exterior with sturdy padded handle.",
        price: 28.99,
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80",
        category: "Tiffin Bags",
        stock: 50,
        rating: 4.8
      },
      {
        name: "Compact Office Tiffin Tote",
        description: "Sleek, minimalist lunch carrier tailored for office tiffins and bento boxes. Features wipe-clean aluminum foil interior and exterior napkin pocket.",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
        category: "Tiffin Bags",
        stock: 75,
        rating: 4.7
      },
      {
        name: "Kids FunPrint Insulated Tiffin Carrier",
        description: "BPA-free insulated school tiffin bag with cheerful design, name tag label, and sturdy clip-on buckle for attaching to school bags.",
        price: 18.99,
        image: "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=800&auto=format&fit=crop&q=80",
        category: "Tiffin Bags",
        stock: 45,
        rating: 4.9
      },

      // Additional Fashion & Everyday Bags
      {
        name: "Venice Luxury Leather Tote",
        description: "Handcrafted from full-grain Italian leather. Features generous compartments, gold-tone hardware, and reinforced handles for unmatched everyday elegance.",
        price: 189.99,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
        category: "Handbags",
        stock: 24,
        rating: 4.9
      },
      {
        name: "Executive Slim Leather Briefcase",
        description: "Sharp professional aesthetic with padded dual compartments for laptops and tablets, organizer sleeves for pens, cards, and documents.",
        price: 169.50,
        image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
        category: "Laptop Bags",
        stock: 18,
        rating: 4.8
      },
      {
        name: "Artisan Leather Bifold Wallet",
        description: "Slim RFID-blocking bifold wallet with 8 card slots, bill divider, and clear ID window. Ages with a rich, unique patina over time.",
        price: 49.00,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
        category: "Wallets & Clutches",
        stock: 65,
        rating: 4.9
      },
      // Additional School Bags
      {
        name: "Galaxy Cosmic Glow School Bag",
        description: "Illuminated reflective cosmic galaxy print, reinforced padded base, dedicated lunchbox strap, and breathable airflow back system.",
        price: 42.99,
        image: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=800&auto=format&fit=crop&q=80",
        category: "School Bags",
        stock: 35,
        rating: 4.9
      },
      {
        name: "High School Urban Tech Backpack",
        description: "Sleek multi-layered campus backpack featuring integrated USB pass-through port, water-resistant zippers, and 15.6-inch laptop compartment.",
        price: 64.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
        category: "School Bags",
        stock: 40,
        rating: 4.8
      },
      // Additional Traveling Bags
      {
        name: "Alpine Expedition 70L Hiking Travel Rucksack",
        description: "Heavy-duty outdoor rucksack with internal aluminum frame support, hydration bladder sleeve, waterproof rain cover, and trekking pole attachments.",
        price: 119.99,
        image: "https://images.unsplash.com/photo-1510519138111-5778749725f0?w=800&auto=format&fit=crop&q=80",
        category: "Traveling Bags",
        stock: 20,
        rating: 4.9
      },
      {
        name: "Oxford Leather Cabin Overnighter",
        description: "Classic British weekender duffel crafted with premium top-grain leather, brass studs, and padded shoulder sling for executive travel getaways.",
        price: 139.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
        category: "Traveling Bags",
        stock: 15,
        rating: 4.8
      },
      // Additional Tiffin Bags
      {
        name: "EcoGreen Stainless Steel Tiffin Bag",
        description: "Custom-fitted insulated cylindrical tote designed for 3-tier and 4-tier traditional stainless steel tiffins with heat-retaining foam padding.",
        price: 22.99,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
        category: "Tiffin Bags",
        stock: 55,
        rating: 4.8
      },
      {
        name: "BentoBox Premium Meal Prep Cooler Bag",
        description: "Spacious horizontal insulated cooler bag designed to hold 2 full-size bento boxes, cutlery set, drink bottle, and ice packs.",
        price: 32.99,
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80",
        category: "Tiffin Bags",
        stock: 40,
        rating: 4.9
      },
      // Additional Lifestyle Bags
      {
        name: "Florence Suede Slouchy Shoulder Hobo",
        description: "Supple slouchy shoulder bag in butter-soft suede with brushed gold rings and hidden magnetic closure.",
        price: 109.99,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
        category: "Handbags",
        stock: 22,
        rating: 4.8
      },
      {
        name: "Oxford Canvas Roll-Top Commuter",
        description: "Expandable roll-top urban commuter bag with water-repellent coating and quick-access side laptop zip.",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=800&auto=format&fit=crop&q=80",
        category: "Backpacks",
        stock: 30,
        rating: 4.7
      }
    ];

    // Ensure rich catalog of sample products
    for (const p of sampleProducts) {
      const [existing] = await connection.query("SELECT id FROM products WHERE name = ?", [p.name]);
      if (existing.length === 0) {
        await connection.query(`
          INSERT INTO products (name, description, price, image, category, stock, rating)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [p.name, p.description, p.price, p.image, p.category, p.stock, p.rating]);
      }
    }
    const [allProds] = await connection.query("SELECT COUNT(*) as count FROM products");
    console.log(`Total products in catalog: ${allProds[0].count}`);

    console.log("Database setup and seeding completed successfully!");
  } catch (error) {
    console.error("Database seeding failed:", error);
  } finally {
    if (connection) await connection.end();
  }
}

seedDatabase();
