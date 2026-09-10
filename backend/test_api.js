const BASE_URL = "http://localhost:5000/api";

async function request(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || `HTTP ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

async function runTests() {
  console.log("--- Starting Backend API Test Suite ---");

  try {
    // 1. Health check
    const health = await request("http://localhost:5000/");
    console.log("✅ API Health check passed:", health.message);

    // 2. Admin login
    const adminLogin = await request(`${BASE_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({
        email: "admin@shopsphere.com",
        password: "admin123"
      })
    });
    console.log("✅ Admin login passed! Role:", adminLogin.user.role);
    const adminToken = adminLogin.token;

    // 3. User login
    const userLogin = await request(`${BASE_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({
        email: "user@shopsphere.com",
        password: "user123"
      })
    });
    console.log("✅ User login passed! Role:", userLogin.user.role);
    const userToken = userLogin.token;

    // 4. Get User profile
    const profileRes = await request(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log("✅ User profile endpoint passed! Name:", profileRes.user.name, "Total orders:", profileRes.stats.totalOrders);

    // 5. Get Products
    const products = await request(`${BASE_URL}/products`);
    console.log(`✅ Get products passed! Found ${products.length} products.`);

    // 6. Get Categories
    const categories = await request(`${BASE_URL}/products/categories`);
    console.log("✅ Get categories passed! Categories:", categories);

    // 7. Get Single Product
    const testProductId = products[0].id;
    const singleProduct = await request(`${BASE_URL}/products/${testProductId}`);
    console.log("✅ Get product by ID passed:", singleProduct.name, "| Related items count:", singleProduct.relatedProducts?.length);

    // 8. Admin Create Product
    const newProductRes = await request(`${BASE_URL}/products`, {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        name: "Test Leather Bag " + Date.now(),
        description: "Test description for automated verification.",
        price: 99.99,
        category: "Handbags",
        stock: 12,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800"
      })
    });
    const createdId = newProductRes.product.id;
    console.log("✅ Admin create product passed! ID:", createdId);

    // 9. Admin Update Product
    const updateRes = await request(`${BASE_URL}/products/${createdId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ name: "Updated Test Leather Bag", price: 109.99 })
    });
    console.log("✅ Admin update product passed! Price updated to:", updateRes.product.price);

    // 10. Admin Delete Product
    await request(`${BASE_URL}/products/${createdId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log("✅ Admin delete product passed!");

    // 11. User Create Order
    const orderRes = await request(`${BASE_URL}/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({
        items: [
          { id: testProductId, quantity: 2, price: products[0].price }
        ],
        shipping_address: {
          fullName: "Jane Doe",
          phone: "+1 555-0199",
          address: "123 Market Street",
          city: "San Francisco",
          state: "CA",
          postalCode: "94105"
        }
      })
    });
    const orderId = orderRes.orderId;
    console.log("✅ User place order passed! Order ID:", orderId, "Total:", orderRes.totalAmount);

    // 12. User Get My Orders
    const myOrders = await request(`${BASE_URL}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log(`✅ User get my-orders passed! Found ${myOrders.length} orders.`);

    // 13. Admin Get All Orders
    const allOrders = await request(`${BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`✅ Admin get all orders passed! Found ${allOrders.length} orders.`);

    // 14. Admin Update Order Status
    const statusRes = await request(`${BASE_URL}/orders/${orderId}/status`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: "Shipped" })
    });
    console.log("✅ Admin update order status passed! New status:", statusRes.status);

    // 15. Admin Dashboard Stats
    const stats = await request(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log("✅ Admin dashboard stats passed! Revenue:", stats.totalRevenue, "Users:", stats.totalUsers, "Orders:", stats.totalOrders);

    console.log("\n=========================================");
    console.log("🎉 ALL 15 BACKEND API TESTS PASSED! 🎉");
    console.log("=========================================\n");
  } catch (error) {
    console.error("❌ Test failed:", error.message, error.data || "");
    process.exit(1);
  }
}

runTests();
