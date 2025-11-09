-- Seed 10 more companies for testing
USE mcp_project_db;

INSERT INTO company (name, company_resources) VALUES
('TechVision Solutions', 'Cloud infrastructure (AWS), 15-person engineering team, $2M annual tech budget, CI/CD pipeline, Kubernetes cluster'),
('DataFlow Analytics', 'Big data platform (Hadoop/Spark), 20 data scientists, GPU cluster, $3M R&D budget, ML infrastructure'),
('CloudScale Systems', 'Multi-cloud setup (AWS/Azure/GCP), 25 DevOps engineers, $5M infrastructure budget, Terraform/Ansible automation'),
('FinTech Innovations', 'PCI-DSS compliant infrastructure, 30-person dev team, $4M security budget, Real-time payment processing'),
('HealthTech Partners', 'HIPAA-compliant cloud, 12 full-stack developers, $1.5M annual budget, Telemedicine platform'),
('EduLearn Platform', 'Scalable LMS infrastructure, 18 developers, $2.5M budget, Video streaming CDN, 1M+ active users'),
('RetailNext Commerce', 'E-commerce platform, 22 engineers, $3.5M budget, Microservices architecture, High-traffic handling'),
('GreenEnergy Systems', 'IoT infrastructure, 15 embedded engineers, $2M budget, Real-time monitoring, Edge computing'),
('LogiTrack Solutions', 'GPS tracking platform, 20 developers, $2.8M budget, Real-time data processing, Mobile apps'),
('SocialConnect Media', 'Social platform infrastructure, 35 engineers, $6M budget, Real-time messaging, Content delivery network');

SELECT 'Successfully seeded 10 companies' AS status;
SELECT COUNT(*) AS total_companies FROM company;
