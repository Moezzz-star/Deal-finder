-- data/products.sql

 
-- Table des catégories
/*CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des marques
CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des produits
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    brand_id INTEGER REFERENCES brands(id),
    stock_quantity INTEGER DEFAULT 0,
    condition VARCHAR(20) DEFAULT 'new', -- new, used, refurbished
    rating DECIMAL(3, 2) DEFAULT 0.0,
    reviews_count INTEGER DEFAULT 0,
    image_url VARCHAR(500),
    specifications JSONB,
    features TEXT[],
    tags TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    seller_phone VARCHAR(20) DEFAULT NULL, 
    seller_location VARCHAR(255) DEFAULT NULL,
    seller_name VARCHAR(20) DEFAULT NULL
);

-- Table des embeddings vectoriels
CREATE TABLE product_embeddings (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    embedding_vector FLOAT8[] NOT NULL,
    embedding_model VARCHAR(100) DEFAULT 'sentence-transformers',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des utilisateurs
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    preferences JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des sessions de recherche
CREATE TABLE search_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_token VARCHAR(255) UNIQUE,
    queries JSONB,
    preferences JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Table des historiques de recherche
CREATE TABLE search_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_id INTEGER REFERENCES search_sessions(id),
    query TEXT NOT NULL,
    query_type VARCHAR(20) DEFAULT 'text', -- text, voice
    results_count INTEGER,
    selected_product_id INTEGER REFERENCES products(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);*/

-- Index pour optimiser les performances
/*CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_products_active ON products(is_active);*/
/*CREATE INDEX idx_products_name_trgm ON products USING GIN(name gin_trgm_ops);
CREATE INDEX idx_products_description_trgm ON products USING GIN(description gin_trgm_ops);
CREATE INDEX idx_search_history_user ON search_history(user_id);
CREATE INDEX idx_search_history_session ON search_history(session_id);

-- Extension pour la recherche textuelle avancée
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS vector;*/

-- Données d'exemple
INSERT INTO products (
    name, description, price, category_id, brand_id, stock_quantity, condition,
    rating, reviews_count, specifications, features, tags,
    seller_phone, seller_name, seller_location
) VALUES
('iPhone 15 Pro', 'Le dernier smartphone Apple avec puce A17 Pro et caméra avancée', 1199.99, 2, 1, 50, 'new', 4.8, 1250, 
 '{"storage": "256GB", "color": "Titanium Blue", "screen": "6.1 inch", "camera": "48MP", "battery": "3274mAh"}',
 ARRAY['Face ID', '5G', 'Wireless Charging', 'Water Resistant'],
 ARRAY['smartphone', 'premium', 'camera', 'apple'],
 '94 769 502', 'Mourad Mnif', 'Tunis'),

('Galaxy S24 Ultra', 'Smartphone Samsung avec S Pen et zoom 100x', 1299.99, 2, 2, 30, 'new', 4.7, 980,
 '{"storage": "512GB", "color": "Phantom Black", "screen": "6.8 inch", "camera": "200MP", "battery": "5000mAh"}',
 ARRAY['S Pen', '5G', 'Zoom 100x', 'AI Features'],
 ARRAY['smartphone', 'premium', 'stylus', 'camera'],
 '94 769 502', 'Mourad Mnif', 'Tunis'),

('MacBook Air M3', 'Ordinateur portable ultra-fin avec puce M3', 1299.99, 3, 1, 25, 'new', 4.9, 567,
 '{"processor": "M3", "ram": "16GB", "storage": "512GB SSD", "screen": "13.6 inch", "weight": "1.24kg"}',
 ARRAY['Touch ID', 'Retina Display', 'All-day battery', 'Silent operation'],
 ARRAY['laptop', 'ultrabook', 'premium', 'productivity'],
 '94 769 502', 'Mourad Mnif', 'Tunis'),

('AirPods Pro 2', 'Écouteurs sans fil avec réduction de bruit active', 279.99, 4, 1, 100, 'new', 4.6, 2340,
 '{"battery": "6h + 24h case", "connectivity": "Bluetooth 5.3", "features": "ANC", "weight": "5.3g each"}',
 ARRAY['Active Noise Cancellation', 'Transparency Mode', 'Spatial Audio', 'Sweat Resistant'],
 ARRAY['earbuds', 'wireless', 'noise-cancelling', 'premium'],
 '94 769 502', 'Mourad Mnif', 'Tunis'),

('Sony WH-1000XM5', 'Casque audio premium avec ANC de pointe', 399.99, 4, 3, 45, 'new', 4.7, 1890,
 '{"battery": "30h", "connectivity": "Bluetooth 5.2", "weight": "250g", "driver": "30mm"}',
 ARRAY['Industry-leading ANC', 'LDAC', 'Quick Charge', 'Multipoint Connection'],
 ARRAY['headphones', 'wireless', 'noise-cancelling', 'audiophile'],
 '94 769 502', 'Mourad Mnif', 'Tunis'),

('Dell XPS 13', 'Ultrabook premium avec écran InfinityEdge', 1199.99, 3, 7, 20, 'new', 4.5, 678,
 '{"processor": "Intel i7-1360P", "ram": "16GB", "storage": "512GB SSD", "screen": "13.4 inch OLED"}',
 ARRAY['InfinityEdge Display', 'Thunderbolt 4', 'Gorilla Glass', 'Premium Build'],
 ARRAY['laptop', 'ultrabook', 'oled', 'business'],
 '94 769 502', 'Mourad Mnif', 'Tunis'),

('Nike Air Max 270', 'Chaussures de sport avec amorti Air Max', 149.99, 7, 4, 80, 'new', 4.4, 1560,
 '{"sizes": "36-48", "material": "Mesh/Synthetic", "sole": "Rubber", "weight": "300g"}',
 ARRAY['Air Max cushioning', 'Breathable mesh', 'Durable rubber sole', 'Stylish design'],
 ARRAY['sneakers', 'running', 'casual', 'comfort'],
 '94 769 502', 'Mourad Mnif', 'Tunis');


-- Fonction pour mettre à jour updated_at automatiquement
/*CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();*/