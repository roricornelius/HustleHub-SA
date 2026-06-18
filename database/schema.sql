CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_key VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    permissions TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(10) NOT NULL,
    location VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_key VARCHAR(50) NOT NULL DEFAULT 'seller',
    seller_type VARCHAR(100) DEFAULT 'Student reseller',
    id_number VARCHAR(30),
    preferred_language VARCHAR(50) DEFAULT 'English',
    verified TINYINT(1) NOT NULL DEFAULT 0,
    account_status VARCHAR(30) NOT NULL DEFAULT 'active',
    member_since VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_key) REFERENCES roles(role_key)
);

CREATE TABLE IF NOT EXISTS banned_emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(100),
    product_name VARCHAR(150) NOT NULL,
    seller_email VARCHAR(150),
    reporter_email VARCHAR(150),
    reason TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS listings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seller_id INT,
    name VARCHAR(150) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    item_condition VARCHAR(100) DEFAULT 'Good',
    location VARCHAR(100) NOT NULL,
    delivery_options VARCHAR(255) DEFAULT 'Meet seller',
    image LONGTEXT,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(30) NOT NULL UNIQUE,
    customer_id INT,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(10) NOT NULL,
    delivery_option VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    dispute_status VARCHAR(50) NOT NULL DEFAULT 'None',
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

INSERT IGNORE INTO roles (role_key, name, description, permissions) VALUES
('admin', 'Administrator', 'Full access to users, roles, products, and orders.', 'users,roles,products,orders'),
('seller', 'Customer & Seller', 'Can browse, buy items, create listings, and manage their profile.', 'products,orders'),
('customer', 'Customer', 'Can browse, buy items, and manage their profile.', 'orders'),
('moderator', 'Moderator', 'Can review users and listings.', 'users,products');

INSERT IGNORE INTO users (full_name, email, phone, location, password_hash, role_key, member_since)
VALUES ('Admin User', 'admin@hustlehub.co.za', '0710000000', 'Gauteng', '$2y$10$zENuxSDka6GKU3Mp8ZY7AuT23iUu579JGfiJQbQAI2b4qWw3gxPrq', 'admin', 'May 2026');
