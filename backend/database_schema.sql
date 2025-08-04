-- Create database
CREATE DATABASE IF NOT EXISTS habilitation_manager;
USE habilitation_manager;

-- Create roles table
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES 
('admin', 'Administrator with full system access'),
('manager', 'Manager with limited administrative access'),
('user', 'Regular user with basic access');

-- Create users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    password_reset_token VARCHAR(255) NULL,
    password_reset_expires TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Create refresh_tokens table for JWT token management
CREATE TABLE refresh_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);

-- Insert sample admin user (password will be 'admin123')
-- Note: In production, always use properly hashed passwords
INSERT INTO users (email, password, first_name, last_name, role_id, is_active, email_verified) VALUES 
('admin@habilitation.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LesfVGgL.a9CdM/KS', 'System', 'Administrator', 1, TRUE, TRUE);

-- Insert sample manager user (password will be 'manager123')
INSERT INTO users (email, password, first_name, last_name, role_id, is_active, email_verified) VALUES 
('manager@habilitation.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Manager', 2, TRUE, TRUE);

-- Insert sample regular user (password will be 'user123')
INSERT INTO users (email, password, first_name, last_name, role_id, is_active, email_verified) VALUES 
('user@habilitation.com', '$2a$12$6bafyEWmwPZpEPyh7/I.O.q9/MXTvf4dvqyNX6eJ3jqYhI7G5wxdW', 'Jane', 'User', 3, TRUE, TRUE);