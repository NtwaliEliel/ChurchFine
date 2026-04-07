-- ============================================================
-- Church Finance Management System — Database Schema
-- Multi-tenant, production-grade
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ┌────────────────────────────────────────────┐
-- │  ENUMS                                     │
-- └────────────────────────────────────────────┘
CREATE TYPE user_role AS ENUM ('member', 'admin', 'super_admin');
CREATE TYPE transaction_status AS ENUM ('pending', 'successful', 'failed', 'cancelled');
CREATE TYPE tithe_type AS ENUM ('percentage', 'fixed');
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'enterprise');

-- ┌────────────────────────────────────────────┐
-- │  CHURCHES (tenant root)                    │
-- └────────────────────────────────────────────┘
CREATE TABLE churches (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             VARCHAR(255) NOT NULL,
  country          VARCHAR(100) NOT NULL DEFAULT 'Rwanda',
  currency         VARCHAR(10) NOT NULL DEFAULT 'RWF',
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ┌────────────────────────────────────────────┐
-- │  USERS                                     │
-- └────────────────────────────────────────────┘
CREATE TABLE users (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id        UUID NOT NULL REFERENCES churches(id) ON DELETE RESTRICT,
  email            VARCHAR(255),
  phone            VARCHAR(30) NOT NULL,
  first_name       VARCHAR(100) NOT NULL,
  last_name        VARCHAR(100) NOT NULL,
  password_hash    VARCHAR(255) NOT NULL,
  role             user_role NOT NULL DEFAULT 'member',
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at       TIMESTAMPTZ,
  UNIQUE(church_id, phone),
  UNIQUE(church_id, email)
);

CREATE INDEX idx_users_church_id ON users(church_id);
CREATE INDEX idx_users_phone ON users(phone);

-- ┌────────────────────────────────────────────┐
-- │  GIVING CATEGORIES                         │
-- └────────────────────────────────────────────┘
CREATE TABLE giving_categories (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id        UUID NOT NULL REFERENCES churches(id) ON DELETE RESTRICT,
  name             VARCHAR(100) NOT NULL,
  description      TEXT,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_giving_categories_church ON giving_categories(church_id);

-- ┌────────────────────────────────────────────┐
-- │  TRANSACTIONS (IMMUTABLE — no delete)      │
-- └────────────────────────────────────────────┘
CREATE TABLE transactions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id        UUID NOT NULL REFERENCES churches(id) ON DELETE RESTRICT,
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  category_id      UUID REFERENCES giving_categories(id) ON DELETE RESTRICT,
  amount           NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  currency         VARCHAR(10) NOT NULL DEFAULT 'RWF',
  status           transaction_status NOT NULL DEFAULT 'pending',
  momo_reference   VARCHAR(100),
  idempotency_key  UUID NOT NULL UNIQUE,  -- prevents duplicate charges
  payer_phone      VARCHAR(30) NOT NULL,
  description      TEXT,
  metadata         JSONB,
  failure_reason   TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- NO deleted_at — financial records are immutable
);

CREATE INDEX idx_transactions_church ON transactions(church_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);
CREATE INDEX idx_transactions_idempotency ON transactions(idempotency_key);

-- ┌────────────────────────────────────────────┐
-- │  TITHE SUBSCRIPTIONS                       │
-- └────────────────────────────────────────────┘
CREATE TABLE tithe_subscriptions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id        UUID NOT NULL REFERENCES churches(id) ON DELETE RESTRICT,
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  type             tithe_type NOT NULL DEFAULT 'percentage',
  value            NUMERIC(10, 2) NOT NULL CHECK (value > 0),
  payer_phone      VARCHAR(30) NOT NULL,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  retry_count      INT NOT NULL DEFAULT 0,
  next_charge_date DATE NOT NULL,
  last_charged_at  TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)  -- one subscription per user
);

CREATE INDEX idx_tithe_church ON tithe_subscriptions(church_id);
CREATE INDEX idx_tithe_next_charge ON tithe_subscriptions(next_charge_date) WHERE is_active = TRUE;

-- ┌────────────────────────────────────────────┐
-- │  WEBHOOK LOGS (MTN MoMo callbacks)         │
-- └────────────────────────────────────────────┘
CREATE TABLE webhook_logs (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider         VARCHAR(50) NOT NULL DEFAULT 'mtn_momo',
  reference        VARCHAR(100),
  payload          JSONB NOT NULL,
  status           VARCHAR(50),
  processed        BOOLEAN NOT NULL DEFAULT FALSE,
  received_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhook_reference ON webhook_logs(reference);
CREATE INDEX idx_webhook_received ON webhook_logs(received_at DESC);

-- ┌────────────────────────────────────────────┐
-- │  AUDIT LOG                                 │
-- └────────────────────────────────────────────┘
CREATE TABLE audit_logs (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id        UUID REFERENCES churches(id),
  user_id          UUID REFERENCES users(id),
  action           VARCHAR(100) NOT NULL,
  entity           VARCHAR(100),
  entity_id        UUID,
  old_values       JSONB,
  new_values       JSONB,
  ip_address       INET,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_church ON audit_logs(church_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- ┌────────────────────────────────────────────┐
-- │  SEED: Default church                      │
-- └────────────────────────────────────────────┘
INSERT INTO churches (name, country, currency) 
VALUES ('ChurchFine Demo', 'Rwanda', 'RWF');
