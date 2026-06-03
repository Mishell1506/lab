-- ============================================
-- MIGRACIÓN SQL PARA SUPABASE
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de tickets
CREATE TABLE IF NOT EXISTS tickets (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL,
  description TEXT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- 4. Habilitar Row Level Security (opcional pero recomendado)
-- NOTA: Si habilitas RLS, necesitarás políticas. 
-- Como usamos service_role key desde el servidor, RLS no bloquea nada.
-- Pero si quieres seguridad extra, descomenta las líneas siguientes:

-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Política: permitir todo desde service_role (backend)
-- CREATE POLICY "Service role full access on users" ON users FOR ALL USING (true);
-- CREATE POLICY "Service role full access on tickets" ON tickets FOR ALL USING (true);
