const { pool } = require('../config/database');

class MCPService {
  // ==================== COMPANY OPERATIONS ====================
  
  /**
   * Create a new company
   */
  async createCompany(name, companyResources = null) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO company (name, company_resources) VALUES (?, ?)',
        [name, companyResources]
      );
      return {
        success: true,
        companyId: result.insertId,
        message: 'Company created successfully'
      };
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  }

  /**
   * Get company by ID
   */
  async getCompanyById(companyId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM company WHERE company_id = ?',
        [companyId]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error fetching company:', error);
      throw error;
    }
  }

  /**
   * Get company by name
   */
  async getCompanyByName(name) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM company WHERE name = ?',
        [name]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error fetching company by name:', error);
      throw error;
    }
  }

  /**
   * Get all companies
   */
  async getAllCompanies() {
    try {
      const [rows] = await pool.execute('SELECT * FROM company ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }

  /**
   * Update company
   */
  async updateCompany(companyId, name, companyResources) {
    try {
      const [result] = await pool.execute(
        'UPDATE company SET name = ?, company_resources = ? WHERE company_id = ?',
        [name, companyResources, companyId]
      );
      return {
        success: result.affectedRows > 0,
        message: result.affectedRows > 0 ? 'Company updated' : 'Company not found'
      };
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  }

  // ==================== PROJECT OPERATIONS ====================

  /**
   * Create a new project
   */
  async createProject(projectData) {
    try {
      const {
        companyId,
        projectName,
        projectDescription,
        businessObjectives,
        targetAudience,
        estimatedBudget,
        expectedTimeline
      } = projectData;

      const [result] = await pool.execute(
        `INSERT INTO project 
        (company_id, project_name, project_description, business_objectives, 
         target_audience, estimated_budget, expected_timeline) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          companyId,
          projectName,
          projectDescription,
          businessObjectives,
          targetAudience,
          estimatedBudget,
          expectedTimeline
        ]
      );

      return {
        success: true,
        projectId: result.insertId,
        message: 'Project created successfully'
      };
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  /**
   * Get project by ID with company info
   */
  async getProjectById(projectId) {
    try {
      const [rows] = await pool.execute(
        `SELECT p.*, c.name as company_name, c.company_resources 
         FROM project p 
         JOIN company c ON p.company_id = c.company_id 
         WHERE p.project_id = ?`,
        [projectId]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  }

  /**
   * Get all projects for a company
   */
  async getProjectsByCompany(companyId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM project WHERE company_id = ? ORDER BY created_at DESC',
        [companyId]
      );
      return rows;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  /**
   * Get all projects
   */
  async getAllProjects() {
    try {
      const [rows] = await pool.execute(
        `SELECT p.*, c.name as company_name 
         FROM project p 
         JOIN company c ON p.company_id = c.company_id 
         ORDER BY p.created_at DESC`
      );
      return rows;
    } catch (error) {
      console.error('Error fetching all projects:', error);
      throw error;
    }
  }

  // ==================== REPORT OPERATIONS ====================

  /**
   * Save a generated report
   */
  async saveReport(projectId, reportType, reportContent, reasoningContent = null) {
    try {
      const [result] = await pool.execute(
        `INSERT INTO report (project_id, report_type, report_content, reasoning_content) 
         VALUES (?, ?, ?, ?)`,
        [projectId, reportType, reportContent, reasoningContent]
      );

      return {
        success: true,
        reportId: result.insertId,
        message: 'Report saved successfully'
      };
    } catch (error) {
      console.error('Error saving report:', error);
      throw error;
    }
  }

  /**
   * Get reports for a project
   */
  async getReportsByProject(projectId, reportType = null) {
    try {
      let query = 'SELECT * FROM report WHERE project_id = ?';
      const params = [projectId];

      if (reportType) {
        query += ' AND report_type = ?';
        params.push(reportType);
      }

      query += ' ORDER BY created_at DESC';

      const [rows] = await pool.execute(query, params);
      return rows;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  }

  /**
   * Get report by ID
   */
  async getReportById(reportId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM report WHERE report_id = ?',
        [reportId]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  }

  // ==================== PROJECT ANALYSIS OPERATIONS ====================

  /**
   * Create or update project analysis
   */
  async saveProjectAnalysis(projectId, functionalityReport = null, costAnalysisReport = null, marketAnalysisReport = null) {
    try {
      // Check if analysis already exists
      const [existing] = await pool.execute(
        'SELECT project_id FROM project_analysis WHERE project_id = ?',
        [projectId]
      );

      if (existing.length > 0) {
        // Update existing analysis
        const updates = [];
        const params = [];

        if (functionalityReport !== null) {
          updates.push('functionality_report = ?');
          params.push(functionalityReport);
        }
        if (costAnalysisReport !== null) {
          updates.push('cost_analysis_report = ?');
          params.push(costAnalysisReport);
        }
        if (marketAnalysisReport !== null) {
          updates.push('market_analysis_report = ?');
          params.push(marketAnalysisReport);
        }

        if (updates.length > 0) {
          params.push(projectId);
          const query = `UPDATE project_analysis SET ${updates.join(', ')} WHERE project_id = ?`;
          await pool.execute(query, params);
        }

        return {
          success: true,
          message: 'Project analysis updated successfully'
        };
      } else {
        // Insert new analysis
        await pool.execute(
          `INSERT INTO project_analysis 
          (project_id, functionality_report, cost_analysis_report, market_analysis_report) 
          VALUES (?, ?, ?, ?)`,
          [projectId, functionalityReport, costAnalysisReport, marketAnalysisReport]
        );

        return {
          success: true,
          message: 'Project analysis created successfully'
        };
      }
    } catch (error) {
      console.error('Error saving project analysis:', error);
      throw error;
    }
  }

  /**
   * Get project analysis by project ID
   */
  async getProjectAnalysis(projectId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM project_analysis WHERE project_id = ?',
        [projectId]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error fetching project analysis:', error);
      throw error;
    }
  }

  /**
   * Delete project analysis
   */
  async deleteProjectAnalysis(projectId) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM project_analysis WHERE project_id = ?',
        [projectId]
      );
      return {
        success: result.affectedRows > 0,
        message: result.affectedRows > 0 ? 'Analysis deleted' : 'Analysis not found'
      };
    } catch (error) {
      console.error('Error deleting project analysis:', error);
      throw error;
    }
  }

  // ==================== UTILITY OPERATIONS ====================

  /**
   * Get project context for LLM (includes company and project data)
   */
  async getProjectContext(projectId) {
    try {
      const project = await this.getProjectById(projectId);
      if (!project) return null;

      const reports = await this.getReportsByProject(projectId);
      const analysis = await this.getProjectAnalysis(projectId);

      return {
        project,
        reports,
        analysis,
        context: `
Company: ${project.company_name}
Company Resources: ${project.company_resources || 'Not specified'}

Project: ${project.project_name}
Description: ${project.project_description}
Business Objectives: ${project.business_objectives || 'Not specified'}
Target Audience: ${project.target_audience || 'Not specified'}
Budget: ${project.estimated_budget}
Timeline: ${project.expected_timeline}

Previous Reports: ${reports.length} reports generated
Analysis Status: ${analysis ? 'Available' : 'Not yet generated'}
        `.trim()
      };
    } catch (error) {
      console.error('Error getting project context:', error);
      throw error;
    }
  }

  /**
   * Get project analysis reports
   */
  async getProjectAnalysis(projectId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM project_analysis WHERE project_id = ?',
        [projectId]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error fetching project analysis:', error);
      throw error;
    }
  }

  /**
   * Save tech stack decision
   */
  async saveTechStackDecision(projectId, decisionData) {
    try {
      await pool.execute(
        'INSERT INTO tech_stack_decision (project_id, decision_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE decision_json = ?, generated_at = CURRENT_TIMESTAMP',
        [projectId, JSON.stringify(decisionData), JSON.stringify(decisionData)]
      );
      return { success: true };
    } catch (error) {
      console.error('Error saving tech stack decision:', error);
      throw error;
    }
  }

  /**
   * Get tech stack decision
   */
  async getTechStackDecision(projectId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM tech_stack_decision WHERE project_id = ?',
        [projectId]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error fetching tech stack decision:', error);
      throw error;
    }
  }
}

module.exports = new MCPService();
