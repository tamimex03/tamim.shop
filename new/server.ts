import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db_store.json");

app.use(express.json({ limit: "50mb" }));

// Define initial base seeding structure
const initialData = {
  users: [
    {
      id: "admin_iqbal",
      name: "Admin Iqbal",
      email: "admin@tamimiqbal.com",
      pass: "7VolkJ00",
      isAdmin: true
    }
  ],
  products: [
    {
      id: "p1",
      name: "Tamim's Tech Setup Guide",
      price: 49.99,
      description: "A comprehensive guide to building a professional tech setup for AI research and development.",
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "p2",
      name: "AI Researcher Notebook",
      price: 19.99,
      description: "Premium notebook for brainstorming AI architectures.",
      imageUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80"
    }
  ],
  courses: [
    {
      id: "c1",
      title: "Intro to AI Research",
      price: 149.99,
      description: "Learn the fundamentals of artificial intelligence research from deep learning to practical implementation.",
      syllabus: "Week 1: Basics, Week 2: Deep Learning, Week 3: Model Training",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      rating: 4.8,
      imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80",
      benefits: [
        "Lifetime access to materials",
        "Direct mentorship support",
        "Real-world project building",
        "Certificate of completion"
      ],
      videos: []
    },
    {
      id: "c2",
      title: "Entrepreneurship Masterclass",
      price: 199.99,
      description: "How to organize events and build startups.",
      syllabus: "Week 1: Idea Generation, Week 2: Planning, Week 3: Execution",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      rating: 4.9,
      imageUrl: "https://images.unsplash.com/photo-1556761175-5973e21e51be?auto=format&fit=crop&w=600&q=80",
      benefits: [
        "Lifetime access to materials",
        "Investor pitch strategies",
        "Case studies breakdown"
      ],
      videos: []
    }
  ],
  orders: [],
  promoCodes: [
    { id: "promo1", code: "TAMIM10", type: "percent", value: 10, applicability: "all", targetIds: [] }
  ],
  contactMessages: []
};

const SUPABASE_URL = process.env.SUPABASE_URL || "https://sfnrqhrmawmipjnzjvuj.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmbnJxaHJtYXdtaXBqbnpqdnVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NjgzNjMsImV4cCI6MjA5NjM0NDM2M30.JpHiSFWVFXUvEJOmzLq6SC5HTDPPG8W9UvZASN0LEfE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// In-memory cache of database
let cacheDB: any = null;

// Helper to sanitize database output
function sanitizeDB(loaded: any) {
  return {
    users: Array.isArray(loaded.users) ? loaded.users : initialData.users,
    products: Array.isArray(loaded.products) ? loaded.products : initialData.products,
    courses: Array.isArray(loaded.courses) ? loaded.courses : initialData.courses,
    orders: Array.isArray(loaded.orders) ? loaded.orders : [],
    promoCodes: Array.isArray(loaded.promoCodes) ? loaded.promoCodes : initialData.promoCodes,
    contactMessages: Array.isArray(loaded.contactMessages) ? loaded.contactMessages : []
  };
}

// Format database fields helper for Supabase compatibility
function cleanRowForSupabase(table: string, row: any) {
  const cleanRow = { ...row };

  if (table === "courses") {
    if (cleanRow.benefits && typeof cleanRow.benefits === "object") {
      cleanRow.benefits = JSON.stringify(cleanRow.benefits);
    }
    if (cleanRow.videos && typeof cleanRow.videos === "object") {
      cleanRow.videos = JSON.stringify(cleanRow.videos);
    }
  }

  if (table === "orders") {
    if (cleanRow.items && typeof cleanRow.items === "object") {
      cleanRow.items = JSON.stringify(cleanRow.items);
    }
  }

  if (table === "promoCodes") {
    if (cleanRow.targetIds && typeof cleanRow.targetIds === "object") {
      cleanRow.targetIds = JSON.stringify(cleanRow.targetIds);
    }
  }

  return cleanRow;
}

// Convert JSONB string properties back to arrays/objects
function parseRowFromSupabase(table: string, row: any) {
  const parsedRow = { ...row };
  if (table === "courses") {
    if (typeof parsedRow.benefits === "string") {
      try { parsedRow.benefits = JSON.parse(parsedRow.benefits); } catch { parsedRow.benefits = []; }
    } else if (!parsedRow.benefits) {
      parsedRow.benefits = [];
    }
    if (typeof parsedRow.videos === "string") {
      try { parsedRow.videos = JSON.parse(parsedRow.videos); } catch { parsedRow.videos = []; }
    } else if (!parsedRow.videos) {
      parsedRow.videos = [];
    }
  }
  if (table === "orders") {
    if (typeof parsedRow.items === "string") {
      try { parsedRow.items = JSON.parse(parsedRow.items); } catch { parsedRow.items = []; }
    } else if (!parsedRow.items) {
      parsedRow.items = [];
    }
  }
  if (table === "promoCodes") {
    if (typeof parsedRow.targetIds === "string") {
      try { parsedRow.targetIds = JSON.parse(parsedRow.targetIds); } catch { parsedRow.targetIds = []; }
    } else if (!parsedRow.targetIds) {
      parsedRow.targetIds = [];
    }
  }
  return parsedRow;
}

// Load or Seed DB Helper
function loadDB() {
  if (cacheDB) {
    return cacheDB;
  }

  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      const loaded = JSON.parse(content);
      cacheDB = sanitizeDB(loaded);
      return cacheDB;
    }
  } catch (error) {
    console.error("Error reading database file, resetting to initialData:", error);
  }

  cacheDB = JSON.parse(JSON.stringify(initialData));
  saveLocalDBFile(cacheDB);
  return cacheDB;
}

function saveLocalDBFile(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to local database file:", err);
  }
}

// Save DB Helper - Synchronously caches, writes file, and triggers background Supabase save
function saveDB(data: any) {
  cacheDB = sanitizeDB(data);
  saveLocalDBFile(cacheDB);
  
  // Background asynchronous save to cloud
  syncStoreToSupabase(cacheDB);
}

// Deep Fetch from Supabase
async function fetchFromSupabase() {
  try {
    const [usersRes, productsRes, coursesRes, ordersRes, promosRes, contactsRes] = await Promise.all([
      supabase.from("users").select("*"),
      supabase.from("products").select("*"),
      supabase.from("courses").select("*"),
      supabase.from("orders").select("*"),
      supabase.from("promoCodes").select("*"),
      supabase.from("contactMessages").select("*")
    ]);

    // Check if table missing
    if (usersRes.error || productsRes.error || coursesRes.error || ordersRes.error || promosRes.error || contactsRes.error) {
      const err = usersRes.error || productsRes.error || coursesRes.error || ordersRes.error || promosRes.error || contactsRes.error;
      console.warn("[Supabase] Reading error (tables might be missing in DB):", err?.message);
      return null;
    }

    return {
      users: (usersRes.data || []).map(r => parseRowFromSupabase("users", r)),
      products: (productsRes.data || []).map(r => parseRowFromSupabase("products", r)),
      courses: (coursesRes.data || []).map(r => parseRowFromSupabase("courses", r)),
      orders: (ordersRes.data || []).map(r => parseRowFromSupabase("orders", r)),
      promoCodes: (promosRes.data || []).map(r => parseRowFromSupabase("promoCodes", r)),
      contactMessages: (contactsRes.data || []).map(r => parseRowFromSupabase("contactMessages", r))
    };
  } catch (err) {
    console.error("[Supabase] Failed to fetch data:", err);
    return null;
  }
}

// Upsert specific tables to Supabase
async function syncTableToSupabase(table: string, rows: any[]) {
  if (!rows || rows.length === 0) return;
  try {
    const cleaned = rows.map(r => cleanRowForSupabase(table, r));
    const { error } = await supabase.from(table).upsert(cleaned);
    if (error) {
      console.error(`[Supabase] Upsert error in ${table}:`, error.message);
    }
  } catch (e) {
    console.error(`[Supabase] Upsert exception in ${table}:`, e);
  }
}

// Deletion sync helper
async function syncDeleteInSupabase(table: string, id: string) {
  try {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      console.error(`[Supabase] Deletion error in ${table} for ID ${id}:`, error.message);
    }
  } catch (e) {
    console.error(`[Supabase] Deletion exception in ${table}:`, e);
  }
}

// Upload all memory DB collections to Supabase
async function syncStoreToSupabase(db: any) {
  try {
    await Promise.all([
      syncTableToSupabase("users", db.users),
      syncTableToSupabase("products", db.products),
      syncTableToSupabase("courses", db.courses),
      syncTableToSupabase("orders", db.orders),
      syncTableToSupabase("promoCodes", db.promoCodes),
      syncTableToSupabase("contactMessages", db.contactMessages)
    ]);
  } catch (err) {
    console.error("[Supabase] Sync all failed:", err);
  }
}

// Perform initial pull & sync
async function performInitialPull() {
  console.log("[Supabase] Attempting to synchronize data...");
  const sbData = await fetchFromSupabase();
  if (sbData) {
    console.log("[Supabase] Loaded data successfully from cloud!");
    const local = loadDB();
    
    // Seed Supabase if some core data exists locally but empty in Supabase
    let needsSeeding = false;
    
    if (sbData.products.length === 0 && local.products.length > 0) {
      sbData.products = local.products;
      needsSeeding = true;
    }
    if (sbData.courses.length === 0 && local.courses.length > 0) {
      sbData.courses = local.courses;
      needsSeeding = true;
    }
    if (sbData.promoCodes.length === 0 && local.promoCodes.length > 0) {
      sbData.promoCodes = local.promoCodes;
      needsSeeding = true;
    }
    if (sbData.users.length === 0 && local.users.length > 0) {
      sbData.users = local.users;
      needsSeeding = true;
    }

    cacheDB = {
      users: sbData.users.length > 0 ? sbData.users : local.users,
      products: sbData.products.length > 0 ? sbData.products : local.products,
      courses: sbData.courses.length > 0 ? sbData.courses : local.courses,
      orders: sbData.orders.length > 0 ? sbData.orders : local.orders,
      promoCodes: sbData.promoCodes.length > 0 ? sbData.promoCodes : local.promoCodes,
      contactMessages: sbData.contactMessages.length > 0 ? sbData.contactMessages : local.contactMessages
    };

    saveLocalDBFile(cacheDB);

    if (needsSeeding) {
      console.log("[Supabase] Seeding initial data into cloud tables...");
      await syncStoreToSupabase(cacheDB);
    }
  } else {
    console.log("[Supabase] Failed load/No tables found. Using robust local store.");
  }
}

// Periodically sync (every 30 seconds) to ensure multiple browser sessions are instantly shared
setInterval(async () => {
  try {
    const sbData = await fetchFromSupabase();
    if (sbData) {
      const local = loadDB();
      // Only update cache if we actually pulled rows to prevent empty overrides
      cacheDB = {
        users: sbData.users.length > 0 ? sbData.users : local.users,
        products: sbData.products.length > 0 ? sbData.products : local.products,
        courses: sbData.courses.length > 0 ? sbData.courses : local.courses,
        orders: sbData.orders,
        promoCodes: sbData.promoCodes.length > 0 ? sbData.promoCodes : local.promoCodes,
        contactMessages: sbData.contactMessages
      };
      saveLocalDBFile(cacheDB);
    }
  } catch (err) {
    // Keep silent on poll network issues
  }
}, 30000);

// ----------------------------------------
// API ENDPOINTS
// ----------------------------------------

// Unified status endpoint
app.get("/api/data", (req, res) => {
  const db = loadDB();
  res.json(db);
});

// User signup
app.post("/api/users/signup", (req, res) => {
  const db = loadDB();
  const { name, email, pass } = req.body;
  
  if (!name || !email || !pass) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (db.users.find((u: any) => u.email.toLowerCase().trim() === email.toLowerCase().trim())) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    pass,
    isAdmin: email.toLowerCase().trim() === "admin@tamimiqbal.com",
    restricted: false
  };

  db.users.push(newUser);
  saveDB(db);

  res.json(newUser);
});

// Memory store for login block tracking
// Key: email (lowercased), Value: { attempts: number, lockTime: number }
const loginAttempts = new Map<string, { attempts: number; lockTime: number }>();

// User login check with 3-minute block after 3 failed attempts and restriction check
app.post("/api/users/login", (req, res) => {
  const db = loadDB();
  const { email, pass } = req.body;
  const emailKey = String(email || "").toLowerCase().trim();
  const now = Date.now();

  // Check lockout block
  const attemptInfo = loginAttempts.get(emailKey);
  if (attemptInfo && attemptInfo.attempts >= 3 && now < attemptInfo.lockTime) {
    const remainingSecs = Math.ceil((attemptInfo.lockTime - now) / 1000);
    const mins = Math.floor(remainingSecs / 60);
    const secs = remainingSecs % 60;
    return res.status(403).json({ 
      error: `Too many failed attempts! Account blocked. Please try again in ${mins}m ${secs}s.` 
    });
  }

  // 1. Check special Admin credentials (not stored in DB, strictly kept on backend to prevent de-compilation hacks)
  if (emailKey === "admin@tamimiqbal.com") {
    if (pass === "7VolkJ00") {
      loginAttempts.delete(emailKey);
      
      // Return admin user session
      const adminUser = {
        id: "admin_iqbal",
        name: "Admin Iqbal",
        email: "admin@tamimiqbal.com",
        isAdmin: true,
        restricted: false
      };
      return res.json(adminUser);
    } else {
      // Record failed attempt
      let info = loginAttempts.get(emailKey) || { attempts: 0, lockTime: 0 };
      info.attempts += 1;
      if (info.attempts >= 3) {
        info.lockTime = now + 3 * 60 * 1000; // 3 minutes lockout
        loginAttempts.set(emailKey, info);
        return res.status(403).json({ 
          error: "Incorrect password. 3 failed attempts reached! Your account is blocked for 3 minutes." 
        });
      } else {
        loginAttempts.set(emailKey, info);
        return res.status(401).json({ 
          error: `Incorrect password. Attempt ${info.attempts} of 3.` 
        });
      }
    }
  }

  // 2. Regular user authentication check
  let user = db.users.find((u: any) => u.email.toLowerCase().trim() === emailKey && u.pass === pass);
  if (user) {
    if (user.restricted) {
      return res.status(403).json({ error: "Access Denied: Your account has been restricted by Admin." });
    }
    
    // Clear any tracking on success
    loginAttempts.delete(emailKey);
    return res.json(user);
  } else {
    // Record failed attempt for standard emails
    let info = loginAttempts.get(emailKey) || { attempts: 0, lockTime: 0 };
    info.attempts += 1;
    if (info.attempts >= 3) {
      info.lockTime = now + 3 * 60 * 1000; // 3 minutes lockout
      loginAttempts.set(emailKey, info);
      return res.status(403).json({ 
        error: "Incorrect credentials. 3 failed attempts reached! Your account is blocked for 3 minutes." 
      });
    } else {
      loginAttempts.set(emailKey, info);
      return res.status(401).json({ 
        error: `Incorrect credentials. Attempt ${info.attempts} of 3.` 
      });
    }
  }
});

// Toggle client restriction (RESTRICT/UNRESTRICT option for Admin dashboard)
app.put("/api/users/:id/restrict", (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  const { restricted } = req.body; // boolean

  db.users = db.users.map((u: any) => u.id === id ? { ...u, restricted: !!restricted } : u);
  saveDB(db);
  res.json({ success: true });
});

// Products: Add
app.post("/api/products", (req, res) => {
  const db = loadDB();
  const newProduct = {
    ...req.body,
    id: Date.now().toString()
  };
  db.products.push(newProduct);
  saveDB(db);
  res.json(newProduct);
});

// Products: Update
app.put("/api/products/:id", (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  const updated = req.body;
  db.products = db.products.map((p: any) => p.id === id ? { ...updated, id } : p);
  saveDB(db);
  res.json(updated);
});

// Products: Delete
app.delete("/api/products/:id", (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  db.products = db.products.filter((p: any) => p.id !== id);
  saveDB(db);
  syncDeleteInSupabase("products", id);
  res.json({ success: true });
});

// Courses: Add
app.post("/api/courses", (req, res) => {
  const db = loadDB();
  const newCourse = {
    ...req.body,
    id: Date.now().toString(),
    videos: req.body.videos || []
  };
  db.courses.push(newCourse);
  saveDB(db);
  res.json(newCourse);
});

// Courses: Update
app.put("/api/courses/:id", (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  const updated = req.body;
  db.courses = db.courses.map((c: any) => c.id === id ? { ...updated, id, videos: updated.videos || [] } : c);
  saveDB(db);
  res.json(updated);
});

// Courses: Delete
app.delete("/api/courses/:id", (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  db.courses = db.courses.filter((c: any) => c.id !== id);
  saveDB(db);
  syncDeleteInSupabase("courses", id);
  res.json({ success: true });
});

// Orders: Place
app.post("/api/orders", (req, res) => {
  const db = loadDB();
  const orderData = req.body;
  const newOrder = {
    ...orderData,
    id: "ORD-" + Math.floor(Math.random() * 1000000),
    status: "pending",
    date: new Date().toISOString()
  };
  db.orders.push(newOrder);
  saveDB(db);
  res.json(newOrder);
});

// Orders: Approve
app.put("/api/orders/:id/approve", (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  db.orders = db.orders.map((o: any) => o.id === id ? { ...o, status: "approved" } : o);
  saveDB(db);
  res.json({ success: true });
});

// Orders: Dismiss
app.put("/api/orders/:id/dismiss", (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  db.orders = db.orders.map((o: any) => o.id === id ? { ...o, status: "rejected" } : o);
  saveDB(db);
  res.json({ success: true });
});

// Promo codes: Add
app.post("/api/promos", (req, res) => {
  const db = loadDB();
  const newPromo = {
    ...req.body,
    id: Date.now().toString()
  };
  db.promoCodes.push(newPromo);
  saveDB(db);
  res.json(newPromo);
});

// Promo codes: Delete
app.delete("/api/promos/:id", (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  db.promoCodes = db.promoCodes.filter((p: any) => p.id !== id);
  saveDB(db);
  syncDeleteInSupabase("promoCodes", id);
  res.json({ success: true });
});

// Contact messages: Add
app.post("/api/contact/message", (req, res) => {
  const db = loadDB();
  if (!db.contactMessages || !Array.isArray(db.contactMessages)) {
    db.contactMessages = [];
  }
  
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields (name, email, message) are required." });
  }

  const newMsg = {
    id: Date.now().toString(),
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    date: new Date().toISOString()
  };
  
  db.contactMessages.push(newMsg);
  saveDB(db);
  res.json(newMsg);
});

// Contact messages: Delete
app.delete("/api/contact/messages/:id", (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  if (!db.contactMessages || !Array.isArray(db.contactMessages)) {
    db.contactMessages = [];
  }
  db.contactMessages = db.contactMessages.filter((m: any) => m.id !== id);
  saveDB(db);
  syncDeleteInSupabase("contactMessages", id);
  res.json({ success: true });
});

// Initialize Vite and Start Server async wrapper
async function startServer() {
  // Initial database sync pull from Supabase
  try {
    await performInitialPull();
  } catch (err) {
    console.error("[Supabase] Initial sync pull failed:", err);
  }

  // Vite dev server mapping
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Admin account safeguard
  try {
    const currentDB = loadDB();
    const adminExists = currentDB.users.find(
      (u: any) => String(u.email || "").toLowerCase().trim() === "admin@tamimiqbal.com"
    );
    if (!adminExists) {
      currentDB.users.push({
        id: "admin_iqbal",
        name: "Admin Iqbal",
        email: "admin@tamimiqbal.com",
        pass: "7VolkJ00",
        isAdmin: true
      });
      saveDB(currentDB);
      console.log("Admin account created.");
    } else {
      let changed = false;
      currentDB.users = currentDB.users.map((u: any) => {
        if (String(u.email || "").toLowerCase().trim() === "admin@tamimiqbal.com") {
          if (u.pass !== "7VolkJ00" || !u.isAdmin) {
            changed = true;
            return { ...u, pass: "7VolkJ00", isAdmin: true };
          }
        }
        return u;
      });
      if (changed) {
        saveDB(currentDB);
        console.log("Admin account credential safeguard applied.");
      }
    }
  } catch (err) {
    console.error("Failed to safeguard admin account:", err);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express Syncing Database server running on http://localhost:${PORT}`);
  });
}

startServer();
