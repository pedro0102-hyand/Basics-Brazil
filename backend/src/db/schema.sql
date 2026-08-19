-- =========================================================
-- E-commerce de Roupas Básicas/Minimalistas — Schema SQL
-- =========================================================

-- Extensão para gerar UUIDs (opcional, aqui usamos SERIAL para simplicidade de aprendizado)

-- =========================
-- USERS
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(120) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            VARCHAR(20)  NOT NULL DEFAULT 'customer'
                        CHECK (role IN ('customer', 'admin')),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================
-- PRODUCTS
-- (loja de roupas básicas/minimalistas: camisetas, calças, moletons, etc.)
-- =========================
CREATE TABLE IF NOT EXISTS products (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    description     TEXT NOT NULL,
    price           NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity  INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    category        VARCHAR(60) NOT NULL,       -- ex: camiseta, calça, moletom, acessório
    size            VARCHAR(10),                -- ex: PP, P, M, G, GG
    color           VARCHAR(40),                -- ex: branco, preto, bege, cinza
    weight_kg       NUMERIC(6, 3) NOT NULL DEFAULT 0.3, -- usado no cálculo de frete
    created_by      INTEGER REFERENCES users(id) ON DELETE SET NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- =========================
-- PRODUCT_IMAGES
-- =========================
CREATE TABLE IF NOT EXISTS product_images (
    id              SERIAL PRIMARY KEY,
    product_id      INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url       VARCHAR(500) NOT NULL,
    is_primary      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- =========================
-- REVIEWS (avaliação numérica)
-- =========================
CREATE TABLE IF NOT EXISTS reviews (
    id              SERIAL PRIMARY KEY,
    product_id      INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (product_id, user_id) -- 1 avaliação por usuário por produto
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);

-- =========================
-- COMMENTS (comentários em texto)
-- =========================
CREATE TABLE IF NOT EXISTS comments (
    id              SERIAL PRIMARY KEY,
    product_id      INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content         TEXT NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_product_id ON comments(product_id);

-- =========================
-- CART_ITEMS
-- =========================
CREATE TABLE IF NOT EXISTS cart_items (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id      INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity        INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, product_id) -- mesmo produto não duplica linha, soma quantidade
);

-- =========================
-- ORDERS
-- =========================
CREATE TABLE IF NOT EXISTS orders (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled')),
    subtotal        NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    shipping_cost   NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total           NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
    shipping_cep    VARCHAR(9) NOT NULL,
    payment_method  VARCHAR(30) NOT NULL DEFAULT 'fake_card',
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- =========================
-- ORDER_ITEMS
-- =========================
CREATE TABLE IF NOT EXISTS order_items (
    id              SERIAL PRIMARY KEY,
    order_id        INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id      INTEGER NOT NULL REFERENCES products(id) ON DELETE SET NULL,
    quantity        INTEGER NOT NULL CHECK (quantity > 0),
    unit_price      NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0) -- snapshot do preço na compra
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- =========================
-- Trigger simples para updated_at (users e products)
-- =========================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();