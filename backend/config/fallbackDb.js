import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "../data");
const DB_FILE = path.resolve(DATA_DIR, "fallback_db.json");

// Pre-hashed passwords for default users
// 'admin123': $2a$10$95Yj5jHh5fXp6DkR4VdE3.mZ8a9kQ4F2dG1hJ2kL3mN4oP5qR6sT7
// 'user123': $2a$10$76Yj5jHh5fXp6DkR4VdE3.mZ8a9kQ4F2dG1hJ2kL3mN4oP5qR6sT8
const DEFAULT_ADMIN_HASH = bcrypt.hashSync("admin123", 10);
const DEFAULT_USER_HASH = bcrypt.hashSync("user123", 10);

const SEED_PRODUCTS = [
  // School Bags
  {
    id: 1,
    name: "Apex Ergonomic School Bag",
    description: "Designed with orthopaedic back support, multiple book dividers, waterproof bottom base, reflective safety strips, and side water bottle sleeves.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=800&auto=format&fit=crop&q=80",
    category: "School Bags",
    stock: 35,
    rating: 4.9,
    created_at: "2026-01-01T10:00:00.000Z"
  },
  {
    id: 2,
    name: "Kids Explorer Adventure School Bag",
    description: "Vibrant lightweight school bag with cushioned breathable shoulder straps, dual mesh drink pockets, smooth durable zippers, and easy-clean lining.",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=800&auto=format&fit=crop&q=80",
    category: "School Bags",
    stock: 45,
    rating: 4.8,
    created_at: "2026-01-02T10:00:00.000Z"
  },
  {
    id: 3,
    name: "Student Pro Heavy-Duty School Backpack",
    description: "Spacious 32L capacity with reinforced stress points, padded tablet/notebook sleeve, organizer pockets for stationery, and rain cover.",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    category: "School Bags",
    stock: 50,
    rating: 4.9,
    created_at: "2026-01-03T10:00:00.000Z"
  },
  {
    id: 4,
    name: "Junior Pastel Study Bag & Pencil Case Set",
    description: "Aesthetic multi-compartment pastel school bag complete with matching pencil pouch, book dividers, and ergonomic chest buckle.",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80",
    category: "School Bags",
    stock: 30,
    rating: 4.7,
    created_at: "2026-01-04T10:00:00.000Z"
  },
  {
    id: 5,
    name: "Galaxy Cosmic Glow School Bag",
    description: "Illuminated reflective cosmic galaxy print, reinforced padded base, dedicated lunchbox strap, and breathable airflow back system.",
    price: 42.99,
    image: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=800&auto=format&fit=crop&q=80",
    category: "School Bags",
    stock: 35,
    rating: 4.9,
    created_at: "2026-01-05T10:00:00.000Z"
  },
  {
    id: 6,
    name: "High School Urban Tech Backpack",
    description: "Sleek multi-layered campus backpack featuring integrated USB pass-through port, water-resistant zippers, and 15.6-inch laptop compartment.",
    price: 64.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    category: "School Bags",
    stock: 40,
    rating: 4.8,
    created_at: "2026-01-06T10:00:00.000Z"
  },

  // Traveling Bags
  {
    id: 7,
    name: "Voyager 60L Expandable Traveling Bag",
    description: "Heavy-duty waterproof traveling bag with hideaway backpack straps, separate ventilated shoe compartment, and airline carry-on compliant dimensions.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    category: "Traveling Bags",
    stock: 25,
    rating: 4.9,
    created_at: "2026-01-07T10:00:00.000Z"
  },
  {
    id: 8,
    name: "Horizon Rolling Traveling Bag with Wheels",
    description: "Smooth 360-degree silent spinner wheels, telescoping aluminum pull handle, ultra-durable tear-resistant exterior, and TSA combination lock.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&auto=format&fit=crop&q=80",
    category: "Traveling Bags",
    stock: 20,
    rating: 4.8,
    created_at: "2026-01-08T10:00:00.000Z"
  },
  {
    id: 9,
    name: "Nomad Water-Resistant Weekender Traveling Bag",
    description: "Stylish travel holdall with luggage trolley pass-through sleeve, separate wet pocket for toiletries, and padded detachable shoulder strap.",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1510519138111-5778749725f0?w=800&auto=format&fit=crop&q=80",
    category: "Traveling Bags",
    stock: 35,
    rating: 4.8,
    created_at: "2026-01-09T10:00:00.000Z"
  },
  {
    id: 10,
    name: "Summit Overnighter Traveling Duffel",
    description: "Compact travel bag with quick-access passport organizer, padded laptop compartment, and high-density ripstop weather-resistant fabric.",
    price: 74.99,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
    category: "Traveling Bags",
    stock: 28,
    rating: 4.7,
    created_at: "2026-01-10T10:00:00.000Z"
  },
  {
    id: 11,
    name: "Alpine Expedition 70L Hiking Travel Rucksack",
    description: "Heavy-duty outdoor rucksack with internal aluminum frame support, hydration bladder sleeve, waterproof rain cover, and trekking pole attachments.",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1510519138111-5778749725f0?w=800&auto=format&fit=crop&q=80",
    category: "Traveling Bags",
    stock: 20,
    rating: 4.9,
    created_at: "2026-01-11T10:00:00.000Z"
  },
  {
    id: 12,
    name: "Oxford Leather Cabin Overnighter",
    description: "Classic British weekender duffel crafted with premium top-grain leather, brass studs, and padded shoulder sling for executive travel getaways.",
    price: 139.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    category: "Traveling Bags",
    stock: 15,
    rating: 4.8,
    created_at: "2026-01-12T10:00:00.000Z"
  },

  // Tiffin Bags
  {
    id: 13,
    name: "ThermoShield Insulated Tiffin Bag",
    description: "Triple-layer thermal insulation keeps tiffin boxes hot for up to 6 hours or chilled with cold packs. Leakproof food-grade PEVA lining and cutlery storage pocket.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
    category: "Tiffin Bags",
    stock: 60,
    rating: 4.9,
    created_at: "2026-01-13T10:00:00.000Z"
  },
  {
    id: 14,
    name: "FreshMeal Dual-Deck Thermal Tiffin Bag",
    description: "Dual-compartment design separates warm lunch containers from fruit, snacks, and beverages. Water-resistant oxford exterior with sturdy padded handle.",
    price: 28.99,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80",
    category: "Tiffin Bags",
    stock: 50,
    rating: 4.8,
    created_at: "2026-01-14T10:00:00.000Z"
  },
  {
    id: 15,
    name: "Compact Office Tiffin Tote",
    description: "Sleek, minimalist lunch carrier tailored for office tiffins and bento boxes. Features wipe-clean aluminum foil interior and exterior napkin pocket.",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
    category: "Tiffin Bags",
    stock: 75,
    rating: 4.7,
    created_at: "2026-01-15T10:00:00.000Z"
  },
  {
    id: 16,
    name: "Kids FunPrint Insulated Tiffin Carrier",
    description: "BPA-free insulated school tiffin bag with cheerful design, name tag label, and sturdy clip-on buckle for attaching to school bags.",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=800&auto=format&fit=crop&q=80",
    category: "Tiffin Bags",
    stock: 45,
    rating: 4.9,
    created_at: "2026-01-16T10:00:00.000Z"
  },
  {
    id: 17,
    name: "EcoGreen Stainless Steel Tiffin Bag",
    description: "Custom-fitted insulated cylindrical tote designed for 3-tier and 4-tier traditional stainless steel tiffins with heat-retaining foam padding.",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
    category: "Tiffin Bags",
    stock: 55,
    rating: 4.8,
    created_at: "2026-01-17T10:00:00.000Z"
  },
  {
    id: 18,
    name: "BentoBox Premium Meal Prep Cooler Bag",
    description: "Spacious horizontal insulated cooler bag designed to hold 2 full-size bento boxes, cutlery set, drink bottle, and ice packs.",
    price: 32.99,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80",
    category: "Tiffin Bags",
    stock: 40,
    rating: 4.9,
    created_at: "2026-01-18T10:00:00.000Z"
  },

  // Handbags & Everyday
  {
    id: 19,
    name: "Venice Luxury Leather Tote",
    description: "Handcrafted from full-grain Italian leather. Features generous compartments, gold-tone hardware, and reinforced handles for unmatched everyday elegance.",
    price: 189.99,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
    category: "Handbags",
    stock: 24,
    rating: 4.9,
    created_at: "2026-01-19T10:00:00.000Z"
  },
  {
    id: 20,
    name: "Executive Slim Leather Briefcase",
    description: "Sharp professional aesthetic with padded dual compartments for laptops and tablets, organizer sleeves for pens, cards, and documents.",
    price: 169.50,
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
    category: "Laptop Bags",
    stock: 18,
    rating: 4.8,
    created_at: "2026-01-20T10:00:00.000Z"
  },
  {
    id: 21,
    name: "Artisan Leather Bifold Wallet",
    description: "Slim RFID-blocking bifold wallet with 8 card slots, bill divider, and clear ID window. Ages with a rich, unique patina over time.",
    price: 49.00,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
    category: "Wallets & Clutches",
    stock: 65,
    rating: 4.9,
    created_at: "2026-01-21T10:00:00.000Z"
  },
  {
    id: 22,
    name: "Florence Suede Slouchy Shoulder Hobo",
    description: "Supple slouchy shoulder bag in butter-soft suede with brushed gold rings and hidden magnetic closure.",
    price: 109.99,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
    category: "Handbags",
    stock: 22,
    rating: 4.8,
    created_at: "2026-01-22T10:00:00.000Z"
  },
  {
    id: 23,
    name: "Oxford Canvas Roll-Top Commuter",
    description: "Expandable roll-top urban commuter bag with water-repellent coating and quick-access side laptop zip.",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=800&auto=format&fit=crop&q=80",
    category: "Backpacks",
    stock: 30,
    rating: 4.7,
    created_at: "2026-01-23T10:00:00.000Z"
  }
];

class FallbackDatabase {
  constructor() {
    this.data = {
      users: [],
      products: [],
      orders: [],
      order_items: [],
      nextUserId: 5,
      nextProductId: 24,
      nextOrderId: 2,
      nextOrderItemId: 2
    };
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        this.data = JSON.parse(raw);
        console.log("📂 Loaded existing persistent fallback database storage.");
      } else {
        this.seedInitialData();
        this.save();
        console.log("🌱 Initialized and seeded fresh fallback database storage.");
      }
    } catch (err) {
      console.error("FallbackDb init warning:", err.message);
      this.seedInitialData();
    }
  }

  seedInitialData() {
    this.data.users = [
      {
        id: 1,
        name: "Amrut Bag Admin",
        email: "admin@amrutbag.com",
        password: DEFAULT_ADMIN_HASH,
        role: "admin",
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: "Amrut Bag Admin",
        email: "admin@shopsphere.com",
        password: DEFAULT_ADMIN_HASH,
        role: "admin",
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        name: "Admin User",
        email: "admin@gmail.com",
        password: DEFAULT_ADMIN_HASH,
        role: "admin",
        created_at: new Date().toISOString()
      },
      {
        id: 4,
        name: "Jane Doe",
        email: "user@shopsphere.com",
        password: DEFAULT_USER_HASH,
        role: "user",
        created_at: new Date().toISOString()
      }
    ];

    this.data.products = [...SEED_PRODUCTS];

    this.data.orders = [
      {
        id: 1,
        user_id: 4,
        total_amount: 49.99,
        status: "Delivered",
        shipping_address: JSON.stringify({
          fullName: "Jane Doe",
          email: "user@shopsphere.com",
          phone: "+91 9876543210",
          address: "123 Main Street, Suite 4B",
          city: "Mumbai",
          state: "Maharashtra",
          postalCode: "400001",
          paymentMethod: "upi",
          upiId: "janedoe@oksbi",
          upiApp: "Google Pay"
        }),
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    this.data.order_items = [
      {
        id: 1,
        order_id: 1,
        product_id: 1,
        quantity: 1,
        price: 49.99
      }
    ];

    this.data.nextUserId = 5;
    this.data.nextProductId = 24;
    this.data.nextOrderId = 2;
    this.data.nextOrderItemId = 2;
  }

  save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (err) {
      console.error("FallbackDb save error:", err.message);
    }
  }

  // Emulate MySQL Pool query: returns [rows, fields]
  async query(sql, params = []) {
    const s = sql.trim();
    const sUpper = s.toUpperCase();

    // 1. Health check: SELECT 1
    if (sUpper.startsWith("SELECT 1")) {
      return [[{ status: 1 }], []];
    }

    // 2. USERS Queries
    // 2a. SELECT id FROM users WHERE LOWER(email) = ?
    // 2b. SELECT * FROM users WHERE LOWER(email) = ?
    if (sUpper.includes("FROM USERS") && sUpper.includes("LOWER(EMAIL)")) {
      const email = String(params[0] || "").trim().toLowerCase();
      const match = this.data.users.find((u) => u.email.toLowerCase() === email);
      if (!match) return [[], []];
      if (sUpper.startsWith("SELECT ID")) {
        return [[{ id: match.id }], []];
      }
      return [[{ ...match }], []];
    }

    // 2c. SELECT id, name, email, role, created_at FROM users WHERE id = ?
    //     or SELECT * FROM users WHERE id = ?
    if (sUpper.includes("FROM USERS") && sUpper.includes("WHERE ID =")) {
      const id = Number(params[0]);
      const match = this.data.users.find((u) => u.id === id);
      if (!match) return [[], []];
      const { password, ...safeUser } = match;
      return [[sUpper.includes("SELECT *") ? { ...match } : safeUser], []];
    }

    // 2d. Email conflict check: SELECT id FROM users WHERE email = ? AND id != ?
    if (sUpper.includes("FROM USERS") && sUpper.includes("EMAIL =") && sUpper.includes("ID !=")) {
      const email = String(params[0] || "").trim().toLowerCase();
      const id = Number(params[1]);
      const match = this.data.users.find((u) => u.email.toLowerCase() === email && u.id !== id);
      return [match ? [{ id: match.id }] : [], []];
    }

    // 2e. INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)
    if (sUpper.startsWith("INSERT INTO USERS")) {
      const [name, email, password, role] = params;
      const newUser = {
        id: this.data.nextUserId++,
        name: String(name || "").trim(),
        email: String(email || "").trim().toLowerCase(),
        password: String(password || ""),
        role: role || "user",
        created_at: new Date().toISOString()
      };
      this.data.users.push(newUser);
      this.save();
      return [{ insertId: newUser.id, affectedRows: 1 }, []];
    }

    // 2f. UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?
    if (sUpper.startsWith("UPDATE USERS")) {
      const [name, email, password, id] = params;
      const user = this.data.users.find((u) => u.id === Number(id));
      if (user) {
        if (name) user.name = name;
        if (email) user.email = email.toLowerCase();
        if (password) user.password = password;
        this.save();
        return [{ affectedRows: 1 }, []];
      }
      return [{ affectedRows: 0 }, []];
    }

    // 2g. COUNT users
    if (sUpper.includes("SELECT COUNT(*) AS TOTAL FROM USERS") || sUpper.includes("SELECT COUNT(*) FROM USERS")) {
      return [[{ total: this.data.users.length }], []];
    }

    // 3. PRODUCTS Queries
    // 3a. SELECT COUNT(*) AS TOTAL FROM PRODUCTS
    if (sUpper.includes("SELECT COUNT(*) AS TOTAL FROM PRODUCTS") || sUpper.includes("SELECT COUNT(*) FROM PRODUCTS") || sUpper.includes("SELECT COUNT(*) AS COUNT FROM PRODUCTS")) {
      return [[{ total: this.data.products.length, count: this.data.products.length }], []];
    }

    // 3b. SELECT DISTINCT category FROM products
    if (sUpper.includes("SELECT DISTINCT CATEGORY FROM PRODUCTS")) {
      const cats = Array.from(new Set(this.data.products.map((p) => p.category).filter(Boolean))).sort();
      return [cats.map((c) => ({ category: c })), []];
    }

    // 3c. SELECT * FROM products WHERE id = ? or SELECT id, name, price, stock FROM products WHERE id = ?
    if (sUpper.includes("FROM PRODUCTS") && sUpper.includes("WHERE ID =")) {
      const id = Number(params[0]);
      const match = this.data.products.find((p) => p.id === id);
      return [match ? [{ ...match }] : [], []];
    }

    // 3d. Recent products: SELECT id, name, price, stock, category, image FROM products ORDER BY created_at DESC LIMIT 5
    if (sUpper.includes("FROM PRODUCTS") && sUpper.includes("ORDER BY CREATED_AT DESC") && sUpper.includes("LIMIT 5")) {
      const sorted = [...this.data.products]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      return [sorted, []];
    }

    // 3e. General SELECT * FROM products WHERE 1=1 ... (search, category, sort, limit)
    if (sUpper.startsWith("SELECT") && sUpper.includes("FROM PRODUCTS")) {
      let list = [...this.data.products];
      let pIndex = 0;

      // Check for search filter
      if (sUpper.includes("LOWER(NAME) LIKE") || sUpper.includes("LOWER(DESCRIPTION) LIKE")) {
        const term = String(params[pIndex] || "").replace(/%/g, "").toLowerCase();
        pIndex += 2; // two params passed for name and description
        list = list.filter(
          (p) =>
            (p.name && p.name.toLowerCase().includes(term)) ||
            (p.description && p.description.toLowerCase().includes(term))
        );
      }

      // Check for category filter
      if (sUpper.includes("CATEGORY = ?")) {
        const cat = String(params[pIndex] || "").trim();
        pIndex++;
        if (cat && cat !== "All") {
          list = list.filter((p) => p.category && p.category.toLowerCase() === cat.toLowerCase());
        }
      }

      // Check for featured filter
      if (sUpper.includes("RATING >= 4.7") || sUpper.includes("FEATURED =")) {
        list = list.filter((p) => parseFloat(p.rating) >= 4.7);
      }

      // Sorting
      if (sUpper.includes("ORDER BY PRICE ASC")) {
        list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (sUpper.includes("ORDER BY PRICE DESC")) {
        list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      } else if (sUpper.includes("ORDER BY RATING DESC")) {
        list.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
      } else if (sUpper.includes("ORDER BY NAME ASC")) {
        list.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }

      // Limit
      if (sUpper.includes("LIMIT ?") && params[pIndex]) {
        list = list.slice(0, Number(params[pIndex]));
      }

      return [list, []];
    }

    // 3f. INSERT INTO products
    if (sUpper.startsWith("INSERT INTO PRODUCTS")) {
      const [name, description, price, stock, category, image, featured, rating] = params;
      const newProduct = {
        id: this.data.nextProductId++,
        name: String(name || "").trim(),
        description: String(description || ""),
        price: parseFloat(price) || 0,
        stock: parseInt(stock, 10) || 10,
        category: String(category || "General"),
        image: String(image || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"),
        rating: parseFloat(rating) || 4.5,
        created_at: new Date().toISOString()
      };
      this.data.products.push(newProduct);
      this.save();
      return [{ insertId: newProduct.id, affectedRows: 1 }, []];
    }

    // 3g. UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?
    if (sUpper.includes("UPDATE PRODUCTS SET STOCK = GREATEST(0, STOCK - ?)")) {
      const [qty, id] = params;
      const prod = this.data.products.find((p) => p.id === Number(id));
      if (prod) {
        prod.stock = Math.max(0, prod.stock - Number(qty));
        this.save();
      }
      return [{ affectedRows: 1 }, []];
    }

    // 3h. UPDATE products SET ... WHERE id = ?
    if (sUpper.startsWith("UPDATE PRODUCTS")) {
      const id = Number(params[params.length - 1]);
      const prod = this.data.products.find((p) => p.id === id);
      if (prod) {
        const [name, description, price, stock, category, image] = params;
        if (name !== undefined) prod.name = name;
        if (description !== undefined) prod.description = description;
        if (price !== undefined) prod.price = parseFloat(price);
        if (stock !== undefined) prod.stock = parseInt(stock, 10);
        if (category !== undefined) prod.category = category;
        if (image !== undefined) prod.image = image;
        this.save();
        return [{ affectedRows: 1 }, []];
      }
      return [{ affectedRows: 0 }, []];
    }

    // 3i. DELETE FROM products WHERE id = ?
    if (sUpper.startsWith("DELETE FROM PRODUCTS")) {
      const id = Number(params[0]);
      const lenBefore = this.data.products.length;
      this.data.products = this.data.products.filter((p) => p.id !== id);
      this.save();
      return [{ affectedRows: lenBefore - this.data.products.length }, []];
    }

    // 4. ORDERS Queries
    // 4a. INSERT INTO orders
    if (sUpper.startsWith("INSERT INTO ORDERS")) {
      const [userId, totalAmount, serializedShipping] = params;
      const newOrder = {
        id: this.data.nextOrderId++,
        user_id: Number(userId),
        total_amount: parseFloat(totalAmount) || 0,
        status: "Pending",
        shipping_address: String(serializedShipping || ""),
        created_at: new Date().toISOString()
      };
      this.data.orders.push(newOrder);
      this.save();
      return [{ insertId: newOrder.id, affectedRows: 1 }, []];
    }

    // 4b. INSERT INTO order_items
    if (sUpper.startsWith("INSERT INTO ORDER_ITEMS")) {
      const [orderId, productId, quantity, price] = params;
      const newItem = {
        id: this.data.nextOrderItemId++,
        order_id: Number(orderId),
        product_id: Number(productId),
        quantity: Number(quantity),
        price: parseFloat(price)
      };
      this.data.order_items.push(newItem);
      this.save();
      return [{ insertId: newItem.id, affectedRows: 1 }, []];
    }

    // 4c. SELECT COUNT(*) as totalOrders, COALESCE(SUM(total_amount), 0) as totalSpent FROM orders WHERE user_id = ?
    if (sUpper.includes("FROM ORDERS") && sUpper.includes("TOTALORDERS") && sUpper.includes("TOTALSPENT")) {
      const userId = Number(params[0]);
      const userOrders = this.data.orders.filter((o) => o.user_id === userId);
      const totalSpent = userOrders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
      return [[{ totalOrders: userOrders.length, totalSpent }], []];
    }

    // 4d. Total Orders Count
    if (sUpper.includes("SELECT COUNT(*) AS TOTAL FROM ORDERS") || sUpper.includes("SELECT COUNT(*) FROM ORDERS")) {
      return [[{ total: this.data.orders.length }], []];
    }

    // 4e. Total Revenue
    if (sUpper.includes("SUM(TOTAL_AMOUNT)") && sUpper.includes("FROM ORDERS")) {
      const activeOrders = this.data.orders.filter((o) => o.status !== "Cancelled");
      const total = activeOrders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
      return [[{ total }], []];
    }

    // 4f. Status distribution
    if (sUpper.includes("SELECT STATUS, COUNT(*) AS COUNT FROM ORDERS GROUP BY STATUS")) {
      const counts = {};
      this.data.orders.forEach((o) => {
        counts[o.status] = (counts[o.status] || 0) + 1;
      });
      const rows = Object.entries(counts).map(([status, count]) => ({ status, count }));
      return [rows, []];
    }

    // 4g. Order items query: SELECT oi.id, oi.quantity, oi.price, p.id as product_id, p.name, p.image ... FROM order_items oi JOIN products p ... WHERE oi.order_id = ?
    if (sUpper.includes("FROM ORDER_ITEMS") && sUpper.includes("JOIN PRODUCTS") && sUpper.includes("ORDER_ID =")) {
      const orderId = Number(params[0]);
      const items = this.data.order_items.filter((oi) => oi.order_id === orderId);
      const rows = items.map((oi) => {
        const prod = this.data.products.find((p) => p.id === oi.product_id) || {};
        return {
          id: oi.id,
          quantity: oi.quantity,
          price: oi.price,
          product_id: oi.product_id,
          name: prod.name || "Product",
          image: prod.image || "",
          category: prod.category || ""
        };
      });
      return [rows, []];
    }

    // 4h. Single order details: SELECT o.*, u.name as customer_name, u.email as customer_email FROM orders o JOIN users u ... WHERE o.id = ?
    if (sUpper.includes("FROM ORDERS O") && sUpper.includes("JOIN USERS U") && sUpper.includes("WHERE O.ID =")) {
      const orderId = Number(params[0]);
      const order = this.data.orders.find((o) => o.id === orderId);
      if (!order) return [[], []];
      const user = this.data.users.find((u) => u.id === order.user_id) || {};
      return [[{ ...order, customer_name: user.name || "Customer", customer_email: user.email || "" }], []];
    }

    // 4i. User's own orders: SELECT o.id, o.user_id, o.total_amount ... WHERE o.user_id = ? ... ORDER BY o.created_at DESC
    if (sUpper.includes("FROM ORDERS O") && sUpper.includes("WHERE O.USER_ID =")) {
      const userId = Number(params[0]);
      const userOrders = this.data.orders
        .filter((o) => o.user_id === userId)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map((o) => {
          const itemCount = this.data.order_items.filter((oi) => oi.order_id === o.id).length;
          return { ...o, total_items: itemCount };
        });
      return [userOrders, []];
    }

    // 4j. Raw SELECT * FROM orders
    if (sUpper === "SELECT * FROM ORDERS" || sUpper.startsWith("SELECT * FROM ORDERS WHERE")) {
      return [[...this.data.orders], []];
    }

    // 4k. Admin recent orders or all orders: SELECT o.id, o.total_amount ... FROM orders o JOIN users u ...
    if (sUpper.includes("FROM ORDERS") && (sUpper.includes("JOIN USERS") || sUpper.includes("RECENTORDERS") || sUpper.includes("O.ID"))) {
      let orders = [...this.data.orders];

      // Check status filter
      if (sUpper.includes("O.STATUS = ?") && params[0]) {
        orders = orders.filter((o) => o.status === params[0]);
      }

      orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      if (sUpper.includes("LIMIT 10") || sUpper.includes("LIMIT 5")) {
        const limit = sUpper.includes("LIMIT 5") ? 5 : 10;
        orders = orders.slice(0, limit);
      }

      const rows = orders.map((o) => {
        const user = this.data.users.find((u) => u.id === o.user_id) || {};
        const itemCount = this.data.order_items.filter((oi) => oi.order_id === o.id).length;
        return {
          id: o.id,
          user_id: o.user_id,
          total_amount: o.total_amount,
          status: o.status,
          shipping_address: o.shipping_address,
          created_at: o.created_at,
          customer_name: user.name || "Customer",
          customer_email: user.email || "",
          item_count: itemCount
        };
      });

      return [rows, []];
    }

    // 4k. Order existence check: SELECT id FROM orders WHERE id = ?
    if (sUpper.includes("FROM ORDERS WHERE ID =")) {
      const orderId = Number(params[0]);
      const order = this.data.orders.find((o) => o.id === orderId);
      return [order ? [{ id: order.id }] : [], []];
    }

    // 4l. UPDATE orders SET status = ? WHERE id = ?
    if (sUpper.startsWith("UPDATE ORDERS SET STATUS =")) {
      const [status, id] = params;
      const order = this.data.orders.find((o) => o.id === Number(id));
      if (order) {
        order.status = status;
        this.save();
        return [{ affectedRows: 1 }, []];
      }
      return [{ affectedRows: 0 }, []];
    }

    // 4m. DELETE FROM orders WHERE id = ?
    if (sUpper.startsWith("DELETE FROM ORDERS")) {
      const id = Number(params[0]);
      const lenBefore = this.data.orders.length;
      this.data.orders = this.data.orders.filter((o) => o.id !== id);
      this.data.order_items = this.data.order_items.filter((oi) => oi.order_id !== id);
      this.save();
      return [{ affectedRows: lenBefore - this.data.orders.length }, []];
    }

    // Fallback default for any other query
    console.warn("FallbackDb unhandled query:", sql);
    return [[], []];
  }

  // Emulate MySQL connection for transactions
  async getConnection() {
    return {
      beginTransaction: async () => {},
      commit: async () => {},
      rollback: async () => {},
      release: () => {},
      query: (sql, params) => this.query(sql, params)
    };
  }
}

const fallbackDb = new FallbackDatabase();
export default fallbackDb;
