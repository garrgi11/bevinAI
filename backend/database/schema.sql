-- Create Database
CREATE DATABASE IF NOT EXISTS mcp_project_db;
USE mcp_project_db;

-- Company Table
CREATE TABLE IF NOT EXISTS company (
    company_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    company_resources TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (company_id),
    INDEX idx_name (name)
) ENGINE=InnoDB;

-- Project Table
CREATE TABLE IF NOT EXISTS project (
    project_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    company_id INT UNSIGNED NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    project_description MEDIUMTEXT,
    business_objectives TEXT,
    target_audience VARCHAR(255),
    -- Budget ENUM for efficient storage and integrity
    estimated_budget ENUM('<25k', '25-50k', '50-100k', '100k+') NOT NULL,
    -- Timeline ENUM for efficient storage and integrity
    expected_timeline ENUM('flexible', 'under 1 month', '1-3 months', '3-6 months', '6+ months') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id),
    INDEX idx_company (company_id),
    INDEX idx_project_name (project_name),
    -- Define the Foreign Key Relationship
    FOREIGN KEY (company_id)
        REFERENCES company(company_id)
        ON DELETE RESTRICT  -- Prevents deleting a company that still has projects
        ON UPDATE CASCADE   -- If company_id ever changed, update here too
) ENGINE=InnoDB;

-- Reports Table (for storing generated reports)
CREATE TABLE IF NOT EXISTS report (
    report_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    project_id INT UNSIGNED NOT NULL,
    report_type ENUM('functional', 'cost', 'market_research', 'prd') NOT NULL,
    report_content LONGTEXT NOT NULL,
    reasoning_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (report_id),
    INDEX idx_project (project_id),
    INDEX idx_type (report_type),
    FOREIGN KEY (project_id)
        REFERENCES project(project_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Project Analysis Table (for storing comprehensive analysis reports)
CREATE TABLE IF NOT EXISTS project_analysis (
    project_id INT UNSIGNED NOT NULL,
    -- ALL REPORT COLUMNS ARE NOW LONGTEXT
    functionality_report LONGTEXT,
    cost_analysis_report LONGTEXT,
    market_analysis_report LONGTEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id),
    FOREIGN KEY (project_id)
        REFERENCES project(project_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
