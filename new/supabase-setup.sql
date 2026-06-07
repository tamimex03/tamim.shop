-- Run this script in the Supabase SQL Editor to setup your database

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  pass TEXT,
  "isAdmin" BOOLEAN DEFAULT FALSE,
  restricted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT,
  price NUMERIC,
  description TEXT,
  "imageUrl" TEXT
);

CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  title TEXT,
  price NUMERIC,
  description TEXT,
  syllabus TEXT,
  "videoUrl" TEXT,
  rating NUMERIC,
  "imageUrl" TEXT,
  benefits JSONB DEFAULT '[]'::jsonb,
  videos JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  "userId" TEXT,
  "customerName" TEXT,
  "customerEmail" TEXT,
  "customerLocation" TEXT,
  "customerDetails" TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  total NUMERIC,
  status TEXT DEFAULT 'pending',
  date TEXT,
  "paymentMethod" TEXT,
  "paymentNumber" TEXT,
  "transactionId" TEXT
);

CREATE TABLE IF NOT EXISTS "contactMessages" (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  message TEXT,
  date TEXT
);

CREATE TABLE IF NOT EXISTS "promoCodes" (
  id TEXT PRIMARY KEY,
  code TEXT,
  type TEXT,
  value NUMERIC,
  applicability TEXT,
  "targetIds" JSONB DEFAULT '[]'::jsonb
);

-- DISABLE RLS to allow the application to read/write data easily
-- In a production environment, you should use ENABLE RLS and define specific policies.
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE "contactMessages" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "promoCodes" DISABLE ROW LEVEL SECURITY;

-- Insert default admin user if not exists
INSERT INTO users (id, name, email, pass, "isAdmin", restricted)
VALUES ('admin_iqbal', 'Admin Iqbal', 'admin@tamimiqbal.com', '7VolkJ00', TRUE, FALSE)
ON CONFLICT (email) DO NOTHING;

