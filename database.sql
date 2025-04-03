-- Create database
CREATE DATABASE IF NOT EXISTS ecommerce;
USE ecommerce;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  image VARCHAR(255) DEFAULT 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(255) DEFAULT 'https://images.pexels.com/photos/676540/pexels-photo-676540.jpeg',
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sample admin user (password: admin123)
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMy.MH/rH8Lb6F5J7L2Uw4iB5AgBQd4U1W', 'admin');

-- Sample products
INSERT INTO products (name, description, price, user_id) VALUES
('T-Shirt', 'Comfortable cotton t-shirt', 19.99, 1),
('Jeans', 'Classic blue jeans', 49.99, 1),
('Sneakers', 'Running shoes', 79.99, 1);