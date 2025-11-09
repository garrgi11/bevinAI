USE mcp_project_db;

CREATE TABLE IF NOT EXISTS tech_stack_decision (
    project_id INT UNSIGNED NOT NULL,
    decision_json LONGTEXT NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id),
    FOREIGN KEY (project_id)
        REFERENCES project(project_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

SELECT 'tech_stack_decision table created successfully' AS status;
