CREATE DATABASE IF NOT EXISTS craft_store
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE craft_store;

-- ============================
-- Users
-- ============================

CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,

    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,

    role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at DATETIME NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- ============================
-- User Passwords
-- ============================

CREATE TABLE user_passwords (
    user_id CHAR(36) PRIMARY KEY,

    password_hash VARCHAR(255) NOT NULL,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_password_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ============================
-- Categories
-- ============================

CREATE TABLE categories (
    id CHAR(36) PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- ============================
-- Products
-- ============================

CREATE TABLE products (
    id CHAR(36) PRIMARY KEY,

    category_id CHAR(36) NOT NULL,

    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,

    price DECIMAL(10,2) NOT NULL,

    stock_quantity INT UNSIGNED NOT NULL DEFAULT 0,

    image_url VARCHAR(500),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at DATETIME NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
);

-- ============================
-- Carts
-- ============================

CREATE TABLE carts (
    id CHAR(36) PRIMARY KEY,

    user_id CHAR(36) NOT NULL UNIQUE,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_cart_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
);

-- ============================
-- Cart Items
-- ============================

CREATE TABLE cart_items (

    cart_id CHAR(36) NOT NULL,

    product_id CHAR(36) NOT NULL,

    quantity INT UNSIGNED NOT NULL,

    PRIMARY KEY (cart_id, product_id),

    CONSTRAINT fk_cart_item_cart
        FOREIGN KEY (cart_id)
        REFERENCES carts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_cart_item_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
);

-- ============================
-- Orders
-- ============================

CREATE TABLE orders (
    id CHAR(36) PRIMARY KEY,

    user_id CHAR(36) NOT NULL,

    total_price DECIMAL(10,2) NOT NULL,

    status ENUM(
        'pending',
        'processing',
        'shipped',
        'completed',
        'cancelled'
    ) NOT NULL DEFAULT 'pending',

    shipping_city VARCHAR(100) NOT NULL,
    shipping_street VARCHAR(150) NOT NULL,
    shipping_house_number VARCHAR(20) NOT NULL,
    shipping_apartment VARCHAR(20),
    shipping_postal_code VARCHAR(20),

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
);

-- ============================
-- Order Items
-- ============================

CREATE TABLE order_items (

    id CHAR(36) PRIMARY KEY,

    order_id CHAR(36) NOT NULL,

    product_id CHAR(36),

    unit_price DECIMAL(10,2) NOT NULL,

    quantity INT UNSIGNED NOT NULL,

    CONSTRAINT fk_order_item_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_item_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
);