var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var import_supabase_js = require("@supabase/supabase-js");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
var DB_FILE = import_path.default.join(process.cwd(), "db_store.json");
app.use(import_express.default.json({ limit: "50mb" }));
var initialData = {
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
var SUPABASE_URL = process.env.SUPABASE_URL || "https://sfnrqhrmawmipjnzjvuj.supabase.co";
var SUPABASE_KEY = process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmbnJxaHJtYXdtaXBqbnpqdnVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NjgzNjMsImV4cCI6MjA5NjM0NDM2M30.JpHiSFWVFXUvEJOmzLq6SC5HTDPPG8W9UvZASN0LEfE";
var supabase = (0, import_supabase_js.createClient)(SUPABASE_URL, SUPABASE_KEY);
var cacheDB = null;
function sanitizeDB(loaded) {
  return {
    users: Array.isArray(loaded.users) ? loaded.users : initialData.users,
    products: Array.isArray(loaded.products) ? loaded.products : initialData.products,
    courses: Array.isArray(loaded.courses) ? loaded.courses : initialData.courses,
    orders: Array.isArray(loaded.orders) ? loaded.orders : [],
    promoCodes: Array.isArray(loaded.promoCodes) ? loaded.promoCodes : initialData.promoCodes,
    contactMessages: Array.isArray(loaded.contactMessages) ? loaded.contactMessages : []
  };
}
function cleanRowForSupabase(table, row) {
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
function parseRowFromSupabase(table, row) {
  const parsedRow = { ...row };
  if (table === "courses") {
    if (typeof parsedRow.benefits === "string") {
      try {
        parsedRow.benefits = JSON.parse(parsedRow.benefits);
      } catch {
        parsedRow.benefits = [];
      }
    } else if (!parsedRow.benefits) {
      parsedRow.benefits = [];
    }
    if (typeof parsedRow.videos === "string") {
      try {
        parsedRow.videos = JSON.parse(parsedRow.videos);
      } catch {
        parsedRow.videos = [];
      }
    } else if (!parsedRow.videos) {
      parsedRow.videos = [];
    }
  }
  if (table === "orders") {
    if (typeof parsedRow.items === "string") {
      try {
        parsedRow.items = JSON.parse(parsedRow.items);
      } catch {
        parsedRow.items = [];
      }
    } else if (!parsedRow.items) {
      parsedRow.items = [];
    }
  }
  if (table === "promoCodes") {
    if (typeof parsedRow.targetIds === "string") {
      try {
        parsedRow.targetIds = JSON.parse(parsedRow.targetIds);
      } catch {
        parsedRow.targetIds = [];
      }
    } else if (!parsedRow.targetIds) {
      parsedRow.targetIds = [];
    }
  }
  return parsedRow;
}
function loadDB() {
  if (cacheDB) {
    return cacheDB;
  }
  try {
    if (import_fs.default.existsSync(DB_FILE)) {
      const content = import_fs.default.readFileSync(DB_FILE, "utf-8");
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
function saveLocalDBFile(data) {
  try {
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to local database file:", err);
  }
}
function saveDB(data) {
  cacheDB = sanitizeDB(data);
  saveLocalDBFile(cacheDB);
  syncStoreToSupabase(cacheDB);
}
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
    if (usersRes.error || productsRes.error || coursesRes.error || ordersRes.error || promosRes.error || contactsRes.error) {
      const err = usersRes.error || productsRes.error || coursesRes.error || ordersRes.error || promosRes.error || contactsRes.error;
      console.warn("[Supabase] Reading error (tables might be missing in DB):", err?.message);
      return null;
    }
    return {
      users: (usersRes.data || []).map((r) => parseRowFromSupabase("users", r)),
      products: (productsRes.data || []).map((r) => parseRowFromSupabase("products", r)),
      courses: (coursesRes.data || []).map((r) => parseRowFromSupabase("courses", r)),
      orders: (ordersRes.data || []).map((r) => parseRowFromSupabase("orders", r)),
      promoCodes: (promosRes.data || []).map((r) => parseRowFromSupabase("promoCodes", r)),
      contactMessages: (contactsRes.data || []).map((r) => parseRowFromSupabase("contactMessages", r))
    };
  } catch (err) {
    console.error("[Supabase] Failed to fetch data:", err);
    return null;
  }
}
async function syncTableToSupabase(table, rows) {
  if (!rows || rows.length === 0) return;
  try {
    const cleaned = rows.map((r) => cleanRowForSupabase(table, r));
    const { error } = await supabase.from(table).upsert(cleaned);
    if (error) {
      console.error(`[Supabase] Upsert error in ${table}:`, error.message);
    }
  } catch (e) {
    console.error(`[Supabase] Upsert exception in ${table}:`, e);
  }
}
async function syncDeleteInSupabase(table, id) {
  try {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      console.error(`[Supabase] Deletion error in ${table} for ID ${id}:`, error.message);
    }
  } catch (e) {
    console.error(`[Supabase] Deletion exception in ${table}:`, e);
  }
}
async function syncStoreToSupabase(db) {
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
async function performInitialPull() {
  console.log("[Supabase] Attempting to synchronize data...");
  const sbData = await fetchFromSupabase();
  if (sbData) {
    console.log("[Supabase] Loaded data successfully from cloud!");
    const local = loadDB();
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
setInterval(async () => {
  try {
    const sbData = await fetchFromSupabase();
    if (sbData) {
      const local = loadDB();
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
  }
}, 3e4);
app.get("/api/data", (req, res) => {
  const db = loadDB();
  res.json(db);
});
app.post("/api/users/signup", (req, res) => {
  const db = loadDB();
  const { name, email, pass } = req.body;
  if (!name || !email || !pass) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (db.users.find((u) => u.email.toLowerCase().trim() === email.toLowerCase().trim())) {
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
var loginAttempts = /* @__PURE__ */ new Map();
app.post("/api/users/login", (req, res) => {
  const db = loadDB();
  const { email, pass } = req.body;
  const emailKey = String(email || "").toLowerCase().trim();
  const now = Date.now();
  const attemptInfo = loginAttempts.get(emailKey);
  if (attemptInfo && attemptInfo.attempts >= 3 && now < attemptInfo.lockTime) {
    const remainingSecs = Math.ceil((attemptInfo.lockTime - now) / 1e3);
    const mins = Math.floor(remainingSecs / 60);
    const secs = remainingSecs % 60;
    return res.status(403).json({
      error: `Too many failed attempts! Account blocked. Please try again in ${mins}m ${secs}s.`
    });
  }
  if (emailKey === "admin@tamimiqbal.com") {
    if (pass === "7VolkJ00") {
      loginAttempts.delete(emailKey);
      const adminUser = {
        id: "admin_iqbal",
        name: "Admin Iqbal",
        email: "admin@tamimiqbal.com",
        isAdmin: true,
        restricted: false
      };
      return res.json(adminUser);
    } else {
      let info = loginAttempts.get(emailKey) || { attempts: 0, lockTime: 0 };
      info.attempts += 1;
      if (info.attempts >= 3) {
        info.lockTime = now + 3 * 60 * 1e3;
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
  let user = db.users.find((u) => u.email.toLowerCase().trim() === emailKey && u.pass === pass);
  if (user) {
    if (user.restricted) {
      return res.status(403).json({ error: "Access Denied: Your account has been restricted by Admin." });
    }
    loginAttempts.delete(emailKey);
    return res.json(user);
  } else {
    let info = loginAttempts.get(emailKey) || { attempts: 0, lockTime: 0 };
    info.attempts += 1;
    if (info.attempts >= 3) {
      info.lockTime = now + 3 * 60 * 1e3;
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
app.put("/api/users/:id/restrict", (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  const { restricted } = req.body;
  db.users = db.users.map((u) => u.id === id ? { ...u, restricted: !!restricted } : u);
  saveDB(db);
  res.json({ success: true });
});
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
app.put("/api/products/:id", (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  const updated = req.body;
  db.products = db.products.map((p) => p.id === id ? { ...updated, id } : p);
  saveDB(db);
  res.json(updated);
});
app.delete("/api/products/:id", (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  db.products = db.products.filter((p) => p.id !== id);
  saveDB(db);
  syncDeleteInSupabase("products", id);
  res.json({ success: true });
});
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
app.put("/api/courses/:id", (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  const updated = req.body;
  db.courses = db.courses.map((c) => c.id === id ? { ...updated, id, videos: updated.videos || [] } : c);
  saveDB(db);
  res.json(updated);
});
app.delete("/api/courses/:id", (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  db.courses = db.courses.filter((c) => c.id !== id);
  saveDB(db);
  syncDeleteInSupabase("courses", id);
  res.json({ success: true });
});
app.post("/api/orders", (req, res) => {
  const db = loadDB();
  const orderData = req.body;
  const newOrder = {
    ...orderData,
    id: "ORD-" + Math.floor(Math.random() * 1e6),
    status: "pending",
    date: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.orders.push(newOrder);
  saveDB(db);
  res.json(newOrder);
});
app.put("/api/orders/:id/approve", (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  db.orders = db.orders.map((o) => o.id === id ? { ...o, status: "approved" } : o);
  saveDB(db);
  res.json({ success: true });
});
app.put("/api/orders/:id/dismiss", (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  db.orders = db.orders.map((o) => o.id === id ? { ...o, status: "rejected" } : o);
  saveDB(db);
  res.json({ success: true });
});
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
app.delete("/api/promos/:id", (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  db.promoCodes = db.promoCodes.filter((p) => p.id !== id);
  saveDB(db);
  syncDeleteInSupabase("promoCodes", id);
  res.json({ success: true });
});
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
    date: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.contactMessages.push(newMsg);
  saveDB(db);
  res.json(newMsg);
});
app.delete("/api/contact/messages/:id", (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  if (!db.contactMessages || !Array.isArray(db.contactMessages)) {
    db.contactMessages = [];
  }
  db.contactMessages = db.contactMessages.filter((m) => m.id !== id);
  saveDB(db);
  syncDeleteInSupabase("contactMessages", id);
  res.json({ success: true });
});
async function startServer() {
  try {
    await performInitialPull();
  } catch (err) {
    console.error("[Supabase] Initial sync pull failed:", err);
  }
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  try {
    const currentDB = loadDB();
    const adminExists = currentDB.users.find(
      (u) => String(u.email || "").toLowerCase().trim() === "admin@tamimiqbal.com"
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
      currentDB.users = currentDB.users.map((u) => {
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
//# sourceMappingURL=server.cjs.map
