-- =============================================
-- AddOn Courses Registration Database Setup
-- =============================================
-- Run this script manually in your MySQL database
-- Database: addons
-- =============================================

-- Use the addons database
USE addons;

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(20) NOT NULL,
    course VARCHAR(255) NOT NULL,
    year VARCHAR(100) NOT NULL,
    workshop_slug VARCHAR(255), -- Add workshop slug column
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at),
    INDEX idx_workshop_slug (workshop_slug) -- Add index for workshop_slug
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verify table creation
SHOW TABLES;

-- Show table structure
DESCRIBE registrations;

-- Optional: Insert sample data for testing
-- INSERT INTO registrations (name, email, mobile, course, year) VALUES
-- ('John Doe', 'john@example.com', '+91 98765 43210', 'BCA', '3rd Year'),
-- ('Jane Smith', 'jane@example.com', '+91 98765 43211', 'MCA', '1st Year');

-- Optional: Query to check sample data
-- SELECT * FROM registrations;

-- =============================================
-- Additional useful queries for management
-- =============================================

-- Count total registrations
-- SELECT COUNT(*) as total_registrations FROM registrations;

-- Get registrations by course
-- SELECT course, COUNT(*) as count FROM registrations GROUP BY course;

-- Get recent registrations (last 7 days)
-- SELECT * FROM registrations WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY);

-- Delete all test data (use with caution)
-- DELETE FROM registrations WHERE email LIKE '%example.com';
