-- Migration: Add tech_stack_decision table
-- Date: 2025-11-09
-- Description: Adds table to store AI-generated technology stack recommendations

USE mcp_project_db;

-- Create tech_stack_decision table
CREATE TABLE IF NOT EXISTS tech_stack_decision (
    project_id INT UNSIGNED NOT NULL,
    decision_json LONGTEXT NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id),
    FOREIGN KEY (project_id)
        REFERENCES project(project_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- Verify table was created
SELECT 'tech_stack_decision table created successfully' AS status;
