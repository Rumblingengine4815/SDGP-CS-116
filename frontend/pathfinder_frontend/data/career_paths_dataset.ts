export type CareerStatus = "completed" | "current" | "future";

export interface CareerStep {
  title: string;
  years: string;
  salary: string;
  skills: string[];
  status: CareerStatus;
}

export const careerPaths: Record<string, CareerStep[]> = {
  "Software Engineer": [
    { title: "Associate Software Engineer (ASE)", years: "0 - 1.5 Years", salary: "100,000 - 180,000 LKR", skills: ["Java / C#", "Python", "OOP", "Git", "Data Structures", "Agile Basics"], status: "completed" },
    { title: "Software Engineer (SE)", years: "1.5 - 3 Years", salary: "180,000 - 300,000 LKR", skills: ["REST APIs", "Spring Boot / .NET Core", "SQL / NoSQL", "Unit Testing", "Docker"], status: "completed" },
    { title: "Senior Software Engineer (SSE)", years: "3 - 5 Years", salary: "300,000 - 550,000 LKR", skills: ["Microservices", "Kubernetes", "AWS / Azure", "CI/CD", "Code Review"], status: "current" },
    { title: "Associate Tech Lead (ATL)", years: "5 - 7 Years", salary: "500,000 - 750,000 LKR", skills: ["System Design", "Task Delegation", "Mentoring", "Client Communication", "Sprint Planning"], status: "future" },
    { title: "Tech Lead", years: "7 - 9 Years", salary: "700,000 - 1,000,000 LKR", skills: ["Cross-team Architecture", "Release Management", "Technical Strategy", "RFP Support"], status: "future" },
    { title: "Software Architect", years: "10+ Years", salary: "1,200,000+ LKR", skills: ["Enterprise Architecture", "Engineering Culture", "Executive Influence", "Hiring"], status: "future" },
  ],

  "Software Quality Assurance (SQA)": [
    { title: "Associate QA Engineer", years: "0 - 1.5 Years", salary: "80,000 - 140,000 LKR", skills: ["Manual Testing", "Test Cases", "JIRA", "Defect Life Cycle", "Agile Testing"], status: "completed" },
    { title: "QA Engineer", years: "1.5 - 3 Years", salary: "140,000 - 250,000 LKR", skills: ["API Testing", "Postman", "Selenium Basics", "SQL Basics", "Regression Testing"], status: "completed" },
    { title: "Senior QA Engineer", years: "3 - 5 Years", salary: "250,000 - 450,000 LKR", skills: ["Test Automation", "Selenium / Cypress", "CI/CD Integration", "Performance Testing", "Mentoring"], status: "current" },
    { title: "Associate QA Lead", years: "5 - 7 Years", salary: "400,000 - 650,000 LKR", skills: ["QA Strategy", "Framework Design", "Test Estimation", "Team Leadership", "Risk Mitigations"], status: "future" },
    { title: "QA Lead", years: "7 - 10 Years", salary: "650,000 - 900,000 LKR", skills: ["Test Architecture", "Quality Metrics", "Client Facing", "Release Sign-off", "Cross-functional Leadership"], status: "future" },
    { title: "QA Architect / Manager", years: "10+ Years", salary: "1,000,000+ LKR", skills: ["Org-wide Quality Standards", "Tool Selection", "Budgeting", "Executive Reporting"], status: "future" },
  ],

  "UI/UX Engineer": [
    { title: "Associate UI/UX Engineer", years: "0 - 1.5 Years", salary: "90,000 - 160,000 LKR", skills: ["Figma", "HTML/CSS", "TailwindCSS", "Wireframing", "React Basics"], status: "completed" },
    { title: "UI/UX Engineer", years: "1.5 - 3 Years", salary: "160,000 - 280,000 LKR", skills: ["React / Next.js", "Framer Motion", "Design Systems", "Prototyping", "User Research Basics"], status: "completed" },
    { title: "Senior UI/UX Engineer", years: "3 - 5 Years", salary: "280,000 - 500,000 LKR", skills: ["State Management", "Micro-interactions", "A/B Testing", "Accessibility", "Mentoring"], status: "current" },
    { title: "UI/UX Tech Lead", years: "5 - 8 Years", salary: "500,000 - 800,000 LKR", skills: ["Frontend Architecture", "Design System Ownership", "Stakeholder Reviews", "Client Workshops"], status: "future" },
    { title: "Principal UX / Head of Design", years: "8+ Years", salary: "900,000+ LKR", skills: ["UX Strategy", "Org-wide Design Standards", "Hiring", "Executive Pitching", "Product Vision"], status: "future" },
  ],

  "Backend Engineer": [
    { title: "Intern Backend Developer", years: "0 - 1 Year", salary: "30,000 - 60,000 LKR", skills: ["Python", "Java", "SQL", "Git", "Basic APIs"], status: "completed" },
    { title: "Junior Backend Developer", years: "1 - 2 Years", salary: "80,000 - 140,000 LKR", skills: ["REST APIs", "Unit Testing", "Databases", "Debugging", "Linux Basics"], status: "completed" },
    { title: "Backend Engineer", years: "2 - 4 Years", salary: "150,000 - 270,000 LKR", skills: ["Microservices", "Redis", "Docker", "API Design", "Security Basics"], status: "current" },
    { title: "Senior Backend Engineer", years: "4 - 7 Years", salary: "270,000 - 480,000 LKR", skills: ["Kafka", "Kubernetes", "Performance Engineering", "System Design", "Mentoring"], status: "future" },
    { title: "Backend Tech Lead", years: "6 - 9 Years", salary: "450,000 - 650,000 LKR", skills: ["Team Leadership", "Architecture Decisions", "Incident Management", "Roadmapping"], status: "future" },
    { title: "Backend Architect", years: "9+ Years", salary: "650,000+ LKR", skills: ["Enterprise Architecture", "Platform Strategy", "Cloud Design", "Stakeholder Management"], status: "future" },
  ],

  "Frontend Engineer": [
    { title: "Trainee Frontend Developer", years: "0 - 1 Year", salary: "40,000 - 70,000 LKR", skills: ["HTML", "CSS", "JavaScript", "Git", "Responsive Design"], status: "completed" },
    { title: "Junior Frontend Developer", years: "1 - 2 Years", salary: "80,000 - 140,000 LKR", skills: ["React", "Component Design", "REST API Integration", "Figma Handoff"], status: "completed" },
    { title: "Frontend Engineer", years: "2 - 4 Years", salary: "140,000 - 260,000 LKR", skills: ["TypeScript", "State Management", "Testing", "Web Performance", "Accessibility"], status: "current" },
    { title: "Senior Frontend Engineer", years: "4 - 7 Years", salary: "260,000 - 450,000 LKR", skills: ["Design Systems", "Architecture", "Next.js", "Code Review", "Mentoring"], status: "future" },
    { title: "Frontend Platform Engineer", years: "6 - 9 Years", salary: "420,000 - 600,000 LKR", skills: ["Build Tooling", "Micro-frontends", "DX Improvement", "Monorepo Management"], status: "future" },
    { title: "Frontend Architect", years: "9+ Years", salary: "600,000+ LKR", skills: ["Engineering Strategy", "Cross-org Standards", "Hiring", "Technical Roadmap"], status: "future" },
  ],

  "Fullstack Developer": [
    { title: "Fullstack Intern", years: "0 - 1 Year", salary: "30,000 - 60,000 LKR", skills: ["HTML", "JavaScript", "Node.js Basics", "Git", "SQL Basics"], status: "completed" },
    { title: "Junior Fullstack Developer", years: "1 - 2 Years", salary: "85,000 - 150,000 LKR", skills: ["React", "Node.js", "PostgreSQL", "REST APIs", "Docker Basics"], status: "completed" },
    { title: "Fullstack Developer", years: "2 - 5 Years", salary: "150,000 - 290,000 LKR", skills: ["TypeScript", "CI/CD", "Testing", "System Design Basics", "Cloud Basics"], status: "current" },
    { title: "Senior Fullstack Engineer", years: "5 - 8 Years", salary: "290,000 - 500,000 LKR", skills: ["Architecture", "Security", "Performance", "Mentoring", "Cross-functional Collaboration"], status: "future" },
    { title: "Fullstack Tech Lead", years: "7 - 10 Years", salary: "480,000 - 680,000 LKR", skills: ["Team Leadership", "Delivery Management", "Technical Vision", "Stakeholder Management"], status: "future" },
    { title: "Head of Engineering", years: "10+ Years", salary: "700,000+ LKR", skills: ["Engineering Strategy", "Hiring", "Culture Building", "Executive Communication", "P&L Awareness"], status: "future" },
  ],

  "Mobile Developer (Android)": [
    { title: "Android Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Kotlin", "Android SDK", "XML Layouts", "Git", "OOP"], status: "completed" },
    { title: "Junior Android Developer", years: "1 - 2 Years", salary: "80,000 - 140,000 LKR", skills: ["MVVM", "Jetpack", "REST APIs", "Room Database", "Firebase"], status: "completed" },
    { title: "Android Developer", years: "2 - 4 Years", salary: "140,000 - 260,000 LKR", skills: ["Jetpack Compose", "Coroutines", "Unit Testing", "Play Store Deployment", "Performance"], status: "current" },
    { title: "Senior Android Developer", years: "4 - 7 Years", salary: "260,000 - 450,000 LKR", skills: ["App Architecture", "Modularisation", "CI/CD", "Accessibility", "Mentoring"], status: "future" },
    { title: "Android Tech Lead", years: "6 - 9 Years", salary: "420,000 - 620,000 LKR", skills: ["Platform Strategy", "Cross-platform Awareness", "Team Leadership", "Release Management"], status: "future" },
    { title: "Mobile Engineering Manager", years: "9+ Years", salary: "600,000+ LKR", skills: ["Team Building", "Roadmap Ownership", "Stakeholder Alignment", "Hiring", "Budgeting"], status: "future" },
  ],

  "Mobile Developer (iOS)": [
    { title: "iOS Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Swift", "UIKit", "Xcode", "Git", "OOP"], status: "completed" },
    { title: "Junior iOS Developer", years: "1 - 2 Years", salary: "80,000 - 145,000 LKR", skills: ["SwiftUI", "CoreData", "REST APIs", "Auto Layout", "Firebase"], status: "completed" },
    { title: "iOS Developer", years: "2 - 4 Years", salary: "145,000 - 270,000 LKR", skills: ["Combine", "Unit Testing", "App Store Submission", "Instruments Profiling", "MVVM"], status: "current" },
    { title: "Senior iOS Developer", years: "4 - 7 Years", salary: "270,000 - 460,000 LKR", skills: ["App Architecture", "Swift Package Manager", "CI/CD", "Accessibility", "Mentoring"], status: "future" },
    { title: "iOS Platform Lead", years: "7 - 10 Years", salary: "440,000 - 640,000 LKR", skills: ["Cross-platform Strategy", "Architecture Governance", "Release Ops", "Team Leadership"], status: "future" },
    { title: "Mobile Architect", years: "10+ Years", salary: "650,000+ LKR", skills: ["iOS & Android Strategy", "Platform Vision", "Engineering Standards", "Executive Alignment"], status: "future" },
  ],

  "Embedded Systems Engineer": [
    { title: "Embedded Systems Trainee", years: "0 - 1 Year", salary: "50,000 - 80,000 LKR", skills: ["C", "Microcontrollers", "GPIO", "UART", "Debugging"], status: "completed" },
    { title: "Junior Embedded Engineer", years: "1 - 3 Years", salary: "90,000 - 160,000 LKR", skills: ["RTOS", "SPI", "I2C", "Firmware Development", "Oscilloscope Use"], status: "completed" },
    { title: "Embedded Software Engineer", years: "3 - 5 Years", salary: "160,000 - 280,000 LKR", skills: ["Embedded Linux", "Device Drivers", "C++", "Hardware Debugging", "Boot Loaders"], status: "current" },
    { title: "Senior Embedded Engineer", years: "5 - 8 Years", salary: "280,000 - 420,000 LKR", skills: ["System Architecture", "Safety Standards", "DMA", "Power Optimisation", "Mentoring"], status: "future" },
    { title: "Embedded Systems Architect", years: "8 - 12 Years", salary: "430,000 - 620,000 LKR", skills: ["Platform Design", "SoC Selection", "Cross-disciplinary Collaboration", "Technical Leadership"], status: "future" },
    { title: "Head of Embedded Engineering", years: "12+ Years", salary: "640,000+ LKR", skills: ["Hardware-Software Strategy", "Hiring", "R&D Leadership", "Executive Advisory", "Budget"], status: "future" },
  ],

  "Game Developer": [
    { title: "Game Dev Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Unity", "C# Basics", "2D Game Mechanics", "Git", "Game Design Basics"], status: "completed" },
    { title: "Junior Game Developer", years: "1 - 2 Years", salary: "75,000 - 135,000 LKR", skills: ["Unity / Unreal", "C#", "Physics Engine", "Asset Integration", "Mobile Game Publishing"], status: "completed" },
    { title: "Game Developer", years: "2 - 5 Years", salary: "140,000 - 260,000 LKR", skills: ["Shader Programming", "Multiplayer Networking", "Performance Optimisation", "Audio Systems", "AI Behaviours"], status: "current" },
    { title: "Senior Game Developer", years: "5 - 8 Years", salary: "270,000 - 430,000 LKR", skills: ["Game Architecture", "Engine Customisation", "Team Leadership", "Live Ops", "Monetisation Systems"], status: "future" },
    { title: "Lead Game Developer", years: "7 - 10 Years", salary: "440,000 - 620,000 LKR", skills: ["Game Direction", "Studio Pipeline", "Cross-discipline Leadership", "Publisher Relations"], status: "future" },
    { title: "Technical Director / Studio Head", years: "10+ Years", salary: "650,000+ LKR", skills: ["Studio Strategy", "IP Development", "Hiring", "P&L", "Executive Pitching"], status: "future" },
  ],

  "Blockchain Developer": [
    { title: "Blockchain Intern", years: "0 - 1 Year", salary: "35,000 - 65,000 LKR", skills: ["Solidity Basics", "Ethereum Concepts", "JavaScript", "Web3.js", "Cryptography Basics"], status: "completed" },
    { title: "Junior Blockchain Developer", years: "1 - 2 Years", salary: "120,000 - 220,000 LKR", skills: ["Smart Contracts", "Hardhat", "DeFi Protocols", "IPFS", "Wallet Integration"], status: "completed" },
    { title: "Blockchain Developer", years: "2 - 5 Years", salary: "230,000 - 420,000 LKR", skills: ["Layer 2 Solutions", "Cross-chain Bridges", "Security Auditing", "Tokenomics", "Gas Optimisation"], status: "current" },
    { title: "Senior Blockchain Engineer", years: "5 - 8 Years", salary: "430,000 - 650,000 LKR", skills: ["Protocol Design", "DeFi Architecture", "Smart Contract Auditing", "ZK Proofs", "Team Leadership"], status: "future" },
    { title: "Blockchain Architect", years: "8+ Years", salary: "680,000+ LKR", skills: ["Blockchain Strategy", "Enterprise Blockchain", "Regulatory Navigation", "Ecosystem Development", "Executive Advisory"], status: "future" },
  ],

  "API Developer": [
    { title: "API Development Intern", years: "0 - 1 Year", salary: "30,000 - 60,000 LKR", skills: ["REST Basics", "Postman", "JSON", "HTTP Methods", "Git"], status: "completed" },
    { title: "Junior API Developer", years: "1 - 2 Years", salary: "85,000 - 155,000 LKR", skills: ["REST API Design", "OpenAPI / Swagger", "Authentication", "Node.js / Python", "SQL"], status: "completed" },
    { title: "API Developer", years: "2 - 5 Years", salary: "160,000 - 290,000 LKR", skills: ["GraphQL", "gRPC", "OAuth 2.0", "Rate Limiting", "API Gateway"], status: "current" },
    { title: "Senior API Engineer", years: "5 - 8 Years", salary: "300,000 - 480,000 LKR", skills: ["API Platform Design", "Developer Experience", "Versioning Strategy", "Security", "Monetisation"], status: "future" },
    { title: "API Platform Architect", years: "8+ Years", salary: "500,000+ LKR", skills: ["Enterprise API Strategy", "API Governance", "Partner Ecosystem", "Executive Advisory", "Hiring"], status: "future" },
  ],

  "Open Source Contributor": [
    { title: "Open Source Beginner", years: "0 - 1 Year", salary: "Volunteer / 40,000 - 60,000 LKR", skills: ["Git", "GitHub", "Issue Tracking", "Documentation", "Any Programming Language"], status: "completed" },
    { title: "Regular OSS Contributor", years: "1 - 3 Years", salary: "60,000 - 150,000 LKR", skills: ["Pull Requests", "Code Review", "Community Communication", "Testing", "CI/CD Basics"], status: "completed" },
    { title: "OSS Maintainer", years: "3 - 6 Years", salary: "150,000 - 350,000 LKR", skills: ["Project Governance", "Release Management", "RFC Authoring", "Community Building", "Roadmapping"], status: "current" },
    { title: "OSS Core Team Member", years: "6 - 9 Years", salary: "350,000 - 600,000 LKR", skills: ["Architecture Leadership", "Foundation Governance", "Conference Speaking", "Sponsorship Management"], status: "future" },
    { title: "OSS Foundation Lead / Developer Advocate", years: "9+ Years", salary: "600,000+ LKR", skills: ["Ecosystem Strategy", "Developer Relations", "Executive Engagement", "Grant Writing", "Hiring"], status: "future" },
  ],

  "Data Scientist": [
    { title: "Data Analyst Intern", years: "0 - 1 Year", salary: "35,000 - 65,000 LKR", skills: ["Excel", "SQL", "Python Basics", "Data Cleaning", "Visualisation"], status: "completed" },
    { title: "Data Analyst", years: "1 - 3 Years", salary: "90,000 - 180,000 LKR", skills: ["SQL", "Pandas", "Power BI", "Statistics", "Dashboard Building"], status: "completed" },
    { title: "Data Scientist", years: "3 - 5 Years", salary: "200,000 - 380,000 LKR", skills: ["Machine Learning", "Scikit-learn", "Feature Engineering", "A/B Testing", "Python"], status: "current" },
    { title: "Senior Data Scientist", years: "5 - 8 Years", salary: "380,000 - 580,000 LKR", skills: ["Deep Learning", "Causal Inference", "MLOps", "Model Governance", "Mentoring"], status: "future" },
    { title: "Principal Data Scientist", years: "8 - 11 Years", salary: "580,000 - 780,000 LKR", skills: ["Research Direction", "Cross-org Influence", "AI Strategy", "Experimentation Platform"], status: "future" },
    { title: "Head of Data Science", years: "11+ Years", salary: "800,000+ LKR", skills: ["Org Leadership", "Hiring", "Executive Communication", "Business Strategy", "Budget Ownership"], status: "future" },
  ],

  "Data Analyst": [
    { title: "Reporting Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Excel", "Google Sheets", "Basic SQL", "Data Entry", "Pivot Tables"], status: "completed" },
    { title: "Junior Data Analyst", years: "1 - 2 Years", salary: "75,000 - 130,000 LKR", skills: ["SQL", "Power BI", "Python Basics", "Descriptive Stats", "Report Writing"], status: "completed" },
    { title: "Data Analyst", years: "2 - 4 Years", salary: "130,000 - 230,000 LKR", skills: ["Advanced SQL", "Tableau", "Statistical Analysis", "ETL Basics", "Stakeholder Reporting"], status: "current" },
    { title: "Senior Data Analyst", years: "4 - 6 Years", salary: "230,000 - 380,000 LKR", skills: ["A/B Testing", "Data Modelling", "Python", "Predictive Analytics", "Business Partnering"], status: "future" },
    { title: "Analytics Manager", years: "6 - 9 Years", salary: "380,000 - 560,000 LKR", skills: ["Team Leadership", "Analytics Strategy", "Self-serve BI", "Roadmapping", "Stakeholder Management"], status: "future" },
    { title: "Director of Analytics", years: "9+ Years", salary: "580,000+ LKR", skills: ["Org Design", "Data Governance", "Executive Reporting", "Business Intelligence Platform Ownership"], status: "future" },
  ],

  "Business Intelligence Developer": [
    { title: "BI Intern", years: "0 - 1 Year", salary: "35,000 - 60,000 LKR", skills: ["Excel", "Basic SQL", "Google Data Studio", "Data Entry"], status: "completed" },
    { title: "BI Analyst", years: "1 - 3 Years", salary: "90,000 - 170,000 LKR", skills: ["Power BI", "SQL", "DAX", "Data Modelling", "ETL Basics"], status: "completed" },
    { title: "BI Developer", years: "3 - 5 Years", salary: "170,000 - 290,000 LKR", skills: ["Snowflake", "dbt", "Advanced DAX", "Data Warehouse Design", "Performance Tuning"], status: "current" },
    { title: "Senior BI Developer", years: "5 - 8 Years", salary: "290,000 - 450,000 LKR", skills: ["Enterprise DW Architecture", "Semantic Layer", "Governance", "Mentoring", "Looker"], status: "future" },
    { title: "BI Solutions Architect", years: "7 - 10 Years", salary: "460,000 - 640,000 LKR", skills: ["Modern Data Stack", "Platform Strategy", "Vendor Evaluation", "Cross-org Data Standards"], status: "future" },
    { title: "Head of Business Intelligence", years: "10+ Years", salary: "660,000+ LKR", skills: ["BI Programme", "Hiring", "Executive Advisory", "Budget", "Data Democratisation Strategy"], status: "future" },
  ],

  "Quantitative Analyst": [
    { title: "Quant Research Intern", years: "0 - 1 Year", salary: "40,000 - 70,000 LKR", skills: ["Python", "Statistics", "Excel", "Probability", "Linear Algebra"], status: "completed" },
    { title: "Junior Quantitative Analyst", years: "1 - 3 Years", salary: "120,000 - 220,000 LKR", skills: ["Python", "Time Series", "SQL", "Risk Modelling", "Financial Mathematics"], status: "completed" },
    { title: "Quantitative Analyst", years: "3 - 6 Years", salary: "250,000 - 420,000 LKR", skills: ["Monte Carlo Simulation", "VaR", "Backtesting", "Machine Learning", "Model Validation"], status: "current" },
    { title: "Senior Quantitative Analyst", years: "6 - 9 Years", salary: "430,000 - 650,000 LKR", skills: ["Stochastic Modelling", "Regulatory Submission", "Model Governance", "Causal Inference"], status: "future" },
    { title: "Quantitative Research Lead", years: "9 - 12 Years", salary: "680,000 - 900,000 LKR", skills: ["Research Agenda", "Model Risk Framework", "Executive Reporting", "Team Leadership"], status: "future" },
    { title: "Chief Risk / Quant Officer", years: "12+ Years", salary: "920,000+ LKR", skills: ["Firm-wide Quant Strategy", "Regulatory Affairs", "Board Reporting", "Hiring", "Capital Allocation"], status: "future" },
  ],

  "Statistician": [
    { title: "Statistics Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["R", "Excel", "Descriptive Statistics", "Data Collection", "Report Writing"], status: "completed" },
    { title: "Junior Statistician", years: "1 - 3 Years", salary: "80,000 - 150,000 LKR", skills: ["Regression Analysis", "Hypothesis Testing", "SPSS", "R", "Survey Design"], status: "completed" },
    { title: "Statistician", years: "3 - 6 Years", salary: "155,000 - 280,000 LKR", skills: ["Bayesian Methods", "Mixed Models", "Python", "Experimental Design", "Clinical / Social Research"], status: "current" },
    { title: "Senior Statistician", years: "6 - 9 Years", salary: "290,000 - 440,000 LKR", skills: ["Causal Inference", "Longitudinal Analysis", "Consulting", "Peer Review", "Mentoring"], status: "future" },
    { title: "Principal Statistician / Lead Researcher", years: "9+ Years", salary: "460,000+ LKR", skills: ["Statistical Programme Leadership", "Publications", "Grant Writing", "Executive Advisory", "Team Management"], status: "future" },
  ],

  "Data Engineer": [
    { title: "Data Engineering Intern", years: "0 - 1 Year", salary: "35,000 - 65,000 LKR", skills: ["Python", "SQL", "Basic ETL", "Git", "Linux Basics"], status: "completed" },
    { title: "Junior Data Engineer", years: "1 - 2 Years", salary: "100,000 - 180,000 LKR", skills: ["ETL Pipelines", "Airflow", "PostgreSQL", "Python", "Data Cleaning"], status: "completed" },
    { title: "Data Engineer", years: "2 - 5 Years", salary: "180,000 - 330,000 LKR", skills: ["Apache Spark", "dbt", "AWS", "Data Modelling", "Kafka Basics"], status: "current" },
    { title: "Senior Data Engineer", years: "5 - 8 Years", salary: "340,000 - 520,000 LKR", skills: ["Streaming Pipelines", "Data Lakehouse", "Architecture", "SLA Management", "Mentoring"], status: "future" },
    { title: "Staff Data Engineer", years: "7 - 10 Years", salary: "530,000 - 720,000 LKR", skills: ["Platform Design", "Data Mesh Concepts", "Cross-team Standards", "Technical Strategy"], status: "future" },
    { title: "Head of Data Engineering", years: "10+ Years", salary: "750,000+ LKR", skills: ["Org Leadership", "Vendor Selection", "Budgeting", "Data Platform Roadmap", "Hiring"], status: "future" },
  ],

  "Analytics Engineer": [
    { title: "Analytics Engineering Intern", years: "0 - 1 Year", salary: "35,000 - 60,000 LKR", skills: ["SQL", "dbt Basics", "Git", "Excel", "Data Documentation"], status: "completed" },
    { title: "Analytics Engineer", years: "1 - 3 Years", salary: "130,000 - 240,000 LKR", skills: ["dbt", "SQL", "Snowflake", "Data Modelling", "Looker"], status: "completed" },
    { title: "Senior Analytics Engineer", years: "3 - 6 Years", salary: "250,000 - 400,000 LKR", skills: ["Semantic Layer Design", "Data Testing", "Stakeholder Partnership", "Governance", "Python"], status: "current" },
    { title: "Analytics Engineering Lead", years: "6 - 9 Years", salary: "410,000 - 580,000 LKR", skills: ["Platform Architecture", "Cross-team Standards", "Mentoring", "Tool Evaluation"], status: "future" },
    { title: "Head of Analytics Engineering", years: "9+ Years", salary: "600,000+ LKR", skills: ["Modern Data Stack Strategy", "Hiring", "Business Alignment", "Data Product Ownership"], status: "future" },
  ],

  "Data Architect": [
    { title: "Data Modelling Intern", years: "0 - 1 Year", salary: "35,000 - 65,000 LKR", skills: ["SQL", "ERD Design", "Excel", "Data Documentation", "Conceptual Modelling"], status: "completed" },
    { title: "Junior Data Architect", years: "1 - 3 Years", salary: "120,000 - 220,000 LKR", skills: ["Logical Data Modelling", "Data Warehouse Design", "SQL", "ETL Concepts", "Metadata Management"], status: "completed" },
    { title: "Data Architect", years: "3 - 6 Years", salary: "230,000 - 400,000 LKR", skills: ["Enterprise Data Model", "Master Data Management", "Cloud Data Platforms", "Governance Frameworks", "Data Lineage"], status: "current" },
    { title: "Senior Data Architect", years: "6 - 9 Years", salary: "410,000 - 620,000 LKR", skills: ["Data Mesh", "Lakehouse Architecture", "Cross-org Standards", "Vendor Evaluation", "Mentoring"], status: "future" },
    { title: "Chief Data Architect", years: "9+ Years", salary: "650,000+ LKR", skills: ["Enterprise Data Strategy", "Executive Advisory", "Data Platform Roadmap", "Hiring", "Governance Programme"], status: "future" },
  ],

  "Machine Learning Engineer": [
    { title: "ML Intern", years: "0 - 1 Year", salary: "40,000 - 70,000 LKR", skills: ["Python", "Scikit-learn", "Jupyter", "Linear Algebra", "Statistics"], status: "completed" },
    { title: "Junior ML Engineer", years: "1 - 2 Years", salary: "120,000 - 210,000 LKR", skills: ["Model Training", "FastAPI", "Docker", "Experiment Tracking", "SQL"], status: "completed" },
    { title: "ML Engineer", years: "2 - 5 Years", salary: "220,000 - 390,000 LKR", skills: ["MLflow", "Feature Stores", "Kubernetes", "CI/CD for ML", "PyTorch"], status: "current" },
    { title: "Senior ML Engineer", years: "5 - 8 Years", salary: "400,000 - 600,000 LKR", skills: ["Distributed Training", "Model Governance", "Platform Design", "Mentoring", "LLM Ops"], status: "future" },
    { title: "ML Platform Lead", years: "7 - 10 Years", salary: "610,000 - 800,000 LKR", skills: ["ML Infrastructure Strategy", "Vendor Evaluation", "Cross-org Enablement", "Hiring"], status: "future" },
    { title: "Director of ML Engineering", years: "10+ Years", salary: "820,000+ LKR", skills: ["AI/ML Organisation Design", "Executive Strategy", "Budget", "Roadmap", "Hiring"], status: "future" },
  ],

  "MLOps Engineer": [
    { title: "DevOps / ML Intern", years: "0 - 1 Year", salary: "35,000 - 65,000 LKR", skills: ["Linux", "Python", "Docker", "Git", "CI/CD Basics"], status: "completed" },
    { title: "Junior MLOps Engineer", years: "1 - 2 Years", salary: "110,000 - 200,000 LKR", skills: ["Airflow", "MLflow", "Docker", "Kubernetes Basics", "Python"], status: "completed" },
    { title: "MLOps Engineer", years: "2 - 5 Years", salary: "210,000 - 370,000 LKR", skills: ["Model Monitoring", "Feature Stores", "Terraform", "CI/CD for ML", "AWS SageMaker"], status: "current" },
    { title: "Senior MLOps Engineer", years: "5 - 8 Years", salary: "380,000 - 560,000 LKR", skills: ["ML Platform Architecture", "Drift Detection", "Multi-model Management", "Mentoring"], status: "future" },
    { title: "ML Infrastructure Architect", years: "8+ Years", salary: "580,000+ LKR", skills: ["Platform Vision", "Compute Strategy", "GPU Cluster Management", "Cross-org Standards"], status: "future" },
  ],

  "NLP Engineer": [
    { title: "NLP Research Intern", years: "0 - 1 Year", salary: "40,000 - 70,000 LKR", skills: ["Python", "Hugging Face", "Text Processing", "Regular Expressions", "Statistics"], status: "completed" },
    { title: "Junior NLP Engineer", years: "1 - 2 Years", salary: "120,000 - 210,000 LKR", skills: ["Transformer Models", "Text Classification", "Named Entity Recognition", "FastAPI", "PyTorch"], status: "completed" },
    { title: "NLP Engineer", years: "2 - 5 Years", salary: "220,000 - 400,000 LKR", skills: ["Fine-tuning LLMs", "Semantic Search", "RAG Systems", "Model Evaluation", "Vector Databases"], status: "current" },
    { title: "Senior NLP Engineer", years: "5 - 8 Years", salary: "410,000 - 620,000 LKR", skills: ["LLM Architecture", "Prompt Engineering", "Multilingual Models", "Research Translation", "Mentoring"], status: "future" },
    { title: "NLP / AI Research Lead", years: "8+ Years", salary: "640,000+ LKR", skills: ["Research Agenda", "AI Product Strategy", "Publications", "Cross-org Influence", "Hiring"], status: "future" },
  ],

  "Computer Vision Engineer": [
    { title: "Computer Vision Intern", years: "0 - 1 Year", salary: "40,000 - 70,000 LKR", skills: ["Python", "OpenCV", "NumPy", "Image Processing", "Mathematics"], status: "completed" },
    { title: "Junior CV Engineer", years: "1 - 2 Years", salary: "120,000 - 210,000 LKR", skills: ["Object Detection", "PyTorch", "YOLO", "Dataset Annotation", "Model Training"], status: "completed" },
    { title: "Computer Vision Engineer", years: "2 - 5 Years", salary: "220,000 - 400,000 LKR", skills: ["Segmentation", "3D Vision", "Model Optimisation", "ONNX", "Edge Deployment"], status: "current" },
    { title: "Senior CV Engineer", years: "5 - 8 Years", salary: "410,000 - 600,000 LKR", skills: ["Video Analytics", "Multimodal Models", "TensorRT", "Research Translation", "Mentoring"], status: "future" },
    { title: "CV / AI Lead", years: "8+ Years", salary: "620,000+ LKR", skills: ["Product AI Strategy", "Team Leadership", "Research Direction", "Hardware-Software Co-design"], status: "future" },
  ],

  "AI Product Researcher": [
    { title: "AI Research Intern", years: "0 - 1 Year", salary: "40,000 - 70,000 LKR", skills: ["Python", "Literature Review", "Experiment Design", "Statistics", "LaTeX"], status: "completed" },
    { title: "AI Research Scientist I", years: "1 - 3 Years", salary: "180,000 - 320,000 LKR", skills: ["Deep Learning", "PyTorch", "Paper Implementation", "Ablation Studies", "Writing"], status: "completed" },
    { title: "AI Research Scientist II", years: "3 - 6 Years", salary: "330,000 - 520,000 LKR", skills: ["Novel Architecture Design", "Publication", "Peer Review", "Benchmark Design", "Mentoring"], status: "current" },
    { title: "Senior Research Scientist", years: "6 - 9 Years", salary: "530,000 - 740,000 LKR", skills: ["Research Programme", "Grant Applications", "Conference Speaking", "Cross-lab Collaboration"], status: "future" },
    { title: "Research Director", years: "9+ Years", salary: "760,000+ LKR", skills: ["Lab Strategy", "Hiring", "Org Leadership", "Industry Partnerships", "Executive Advisory"], status: "future" },
  ],

  "DevOps Engineer": [
    { title: "IT Operations Intern", years: "0 - 1 Year", salary: "35,000 - 65,000 LKR", skills: ["Linux", "Bash", "Networking Basics", "Git", "Monitoring Basics"], status: "completed" },
    { title: "Junior DevOps Engineer", years: "1 - 2 Years", salary: "100,000 - 180,000 LKR", skills: ["Docker", "CI/CD", "AWS Basics", "Git", "Python Scripting"], status: "completed" },
    { title: "DevOps Engineer", years: "2 - 5 Years", salary: "180,000 - 340,000 LKR", skills: ["Kubernetes", "Terraform", "GitHub Actions", "Observability", "Security Basics"], status: "current" },
    { title: "Senior DevOps Engineer", years: "5 - 7 Years", salary: "350,000 - 530,000 LKR", skills: ["SLO/SLA Management", "Multi-cloud", "FinOps", "Incident Command", "Mentoring"], status: "future" },
    { title: "DevOps Platform Lead", years: "7 - 10 Years", salary: "540,000 - 720,000 LKR", skills: ["Internal Developer Platform", "Toolchain Strategy", "Team Leadership", "Architecture"], status: "future" },
    { title: "VP of Infrastructure", years: "10+ Years", salary: "750,000+ LKR", skills: ["Engineering Organisation", "Budget", "Vendor Contracts", "Executive Strategy", "Hiring"], status: "future" },
  ],

  "Site Reliability Engineer": [
    { title: "Operations Intern", years: "0 - 1 Year", salary: "35,000 - 65,000 LKR", skills: ["Linux", "Monitoring", "Git", "Bash", "Basic Networking"], status: "completed" },
    { title: "Junior SRE", years: "1 - 2 Years", salary: "110,000 - 200,000 LKR", skills: ["Prometheus", "Grafana", "Docker", "Incident Response", "On-call Basics"], status: "completed" },
    { title: "SRE", years: "2 - 5 Years", salary: "200,000 - 370,000 LKR", skills: ["Kubernetes", "SLO Design", "Chaos Engineering", "Terraform", "Go/Python"], status: "current" },
    { title: "Senior SRE", years: "5 - 8 Years", salary: "380,000 - 560,000 LKR", skills: ["Reliability Architecture", "Incident Post-mortems", "Capacity Planning", "Mentoring"], status: "future" },
    { title: "SRE Manager", years: "7 - 10 Years", salary: "570,000 - 750,000 LKR", skills: ["Team Leadership", "SRE Culture", "Executive Reporting", "Budget", "Cross-org Reliability"], status: "future" },
    { title: "Director of Reliability Engineering", years: "10+ Years", salary: "780,000+ LKR", skills: ["Engineering Organisation", "Hiring", "Reliability Strategy", "Vendor Management"], status: "future" },
  ],

  "Cloud Engineer": [
    { title: "Cloud Intern", years: "0 - 1 Year", salary: "35,000 - 65,000 LKR", skills: ["AWS Basics", "Linux", "Python", "Networking", "Git"], status: "completed" },
    { title: "Junior Cloud Engineer", years: "1 - 2 Years", salary: "100,000 - 185,000 LKR", skills: ["AWS EC2 / S3 / RDS", "Terraform Basics", "Docker", "IAM", "Cost Awareness"], status: "completed" },
    { title: "Cloud Engineer", years: "2 - 5 Years", salary: "190,000 - 350,000 LKR", skills: ["Multi-service AWS", "Kubernetes", "Terraform", "Security Groups", "CI/CD"], status: "current" },
    { title: "Senior Cloud Engineer", years: "5 - 8 Years", salary: "360,000 - 540,000 LKR", skills: ["Well-Architected Framework", "FinOps", "Multi-cloud", "Disaster Recovery", "Mentoring"], status: "future" },
    { title: "Cloud Architect", years: "7 - 11 Years", salary: "560,000 - 780,000 LKR", skills: ["Enterprise Cloud Strategy", "Migration Planning", "Security Architecture", "Governance"], status: "future" },
    { title: "Chief Cloud Officer", years: "11+ Years", salary: "800,000+ LKR", skills: ["Technology Strategy", "C-suite Advisory", "Vendor Management", "Budget Ownership", "Hiring"], status: "future" },
  ],

  "Network Engineer": [
    { title: "Network Intern", years: "0 - 1 Year", salary: "35,000 - 60,000 LKR", skills: ["Networking Basics", "OSI Model", "Cisco IOS", "Cable Management", "Troubleshooting"], status: "completed" },
    { title: "Junior Network Engineer", years: "1 - 2 Years", salary: "80,000 - 145,000 LKR", skills: ["VLAN", "Routing", "Switching", "Firewall Basics", "CCNA"], status: "completed" },
    { title: "Network Engineer", years: "2 - 5 Years", salary: "150,000 - 270,000 LKR", skills: ["BGP", "OSPF", "SD-WAN", "Network Security", "Wireless"], status: "current" },
    { title: "Senior Network Engineer", years: "5 - 8 Years", salary: "280,000 - 430,000 LKR", skills: ["Data Centre Networking", "MPLS", "Network Automation", "Vendor Management", "CCNP"], status: "future" },
    { title: "Network Architect", years: "8 - 12 Years", salary: "450,000 - 650,000 LKR", skills: ["Enterprise Network Design", "Zero Trust Networking", "Cloud Networking", "Leadership"], status: "future" },
    { title: "Head of Network Infrastructure", years: "12+ Years", salary: "680,000+ LKR", skills: ["Infrastructure Strategy", "Budget", "Vendor Contracts", "Team Management", "Governance"], status: "future" },
  ],

  "Systems Administrator": [
    { title: "IT Support Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Windows", "Linux Basics", "Hardware Support", "Active Directory Basics", "Helpdesk"], status: "completed" },
    { title: "Junior Systems Administrator", years: "1 - 2 Years", salary: "75,000 - 130,000 LKR", skills: ["Linux", "Windows Server", "Active Directory", "Backup Systems", "Monitoring"], status: "completed" },
    { title: "Systems Administrator", years: "2 - 5 Years", salary: "130,000 - 240,000 LKR", skills: ["VMware", "Scripting", "Patch Management", "DNS/DHCP", "Security Hardening"], status: "current" },
    { title: "Senior Systems Administrator", years: "5 - 8 Years", salary: "250,000 - 390,000 LKR", skills: ["Cloud Migration", "Automation", "Disaster Recovery", "Performance Tuning", "Mentoring"], status: "future" },
    { title: "Systems / Infrastructure Manager", years: "8+ Years", salary: "400,000+ LKR", skills: ["Team Leadership", "Budget", "Vendor Management", "IT Strategy", "Compliance"], status: "future" },
  ],

  "Cybersecurity Analyst": [
    { title: "Security Intern", years: "0 - 1 Year", salary: "35,000 - 65,000 LKR", skills: ["Networking", "Linux", "Security Fundamentals", "Wireshark", "Log Analysis"], status: "completed" },
    { title: "SOC Analyst Tier 1", years: "1 - 2 Years", salary: "90,000 - 160,000 LKR", skills: ["SIEM", "Alert Triage", "Incident Logging", "Threat Intel Basics", "JIRA"], status: "completed" },
    { title: "SOC Analyst Tier 2", years: "2 - 4 Years", salary: "160,000 - 280,000 LKR", skills: ["Incident Response", "Malware Analysis", "Network Forensics", "SOAR", "CBSL Compliance"], status: "current" },
    { title: "Senior Security Analyst", years: "4 - 7 Years", salary: "290,000 - 450,000 LKR", skills: ["Threat Hunting", "Red/Blue Team Concepts", "SIEM Engineering", "Mentoring", "Reporting"], status: "future" },
    { title: "Security Operations Manager", years: "7 - 10 Years", salary: "460,000 - 650,000 LKR", skills: ["SOC Leadership", "KPI Reporting", "Executive Communication", "Hiring", "Shift Management"], status: "future" },
    { title: "CISO / Head of Cyber", years: "10+ Years", salary: "700,000+ LKR", skills: ["Security Strategy", "Board Reporting", "Risk Management", "Regulatory Affairs", "Budgeting"], status: "future" },
  ],

  "Penetration Tester": [
    { title: "Security Intern", years: "0 - 1 Year", salary: "35,000 - 65,000 LKR", skills: ["Linux", "Networking", "CTF Basics", "Burp Suite Basics", "Python"], status: "completed" },
    { title: "Junior Penetration Tester", years: "1 - 2 Years", salary: "100,000 - 190,000 LKR", skills: ["Web App Testing", "OWASP Top 10", "Metasploit", "Report Writing", "OSCP Study"], status: "completed" },
    { title: "Penetration Tester", years: "2 - 5 Years", salary: "200,000 - 370,000 LKR", skills: ["Network Pentesting", "Active Directory Attacks", "Social Engineering", "Exploit Dev Basics"], status: "current" },
    { title: "Senior Penetration Tester", years: "5 - 8 Years", salary: "380,000 - 580,000 LKR", skills: ["Red Team Operations", "Custom Exploit Development", "Client Management", "OSCP/CEH"], status: "future" },
    { title: "Red Team Lead", years: "7 - 10 Years", salary: "600,000 - 800,000 LKR", skills: ["APT Simulation", "Purple Teaming", "Engagement Scoping", "Team Management", "Executive Briefing"], status: "future" },
    { title: "Head of Offensive Security", years: "10+ Years", salary: "820,000+ LKR", skills: ["Security Programme Design", "Board Advisory", "Vendor Management", "Hiring", "Strategy"], status: "future" },
  ],

  "Cloud Security Engineer": [
    { title: "Security Intern", years: "0 - 1 Year", salary: "35,000 - 65,000 LKR", skills: ["AWS Basics", "Linux", "IAM Concepts", "Networking", "Python"], status: "completed" },
    { title: "Junior Cloud Security Engineer", years: "1 - 2 Years", salary: "110,000 - 200,000 LKR", skills: ["AWS Security Services", "IAM Policies", "CloudTrail", "SIEM Basics", "Terraform"], status: "completed" },
    { title: "Cloud Security Engineer", years: "2 - 5 Years", salary: "210,000 - 380,000 LKR", skills: ["Zero Trust", "CSPM Tools", "Container Security", "DevSecOps", "Compliance Frameworks"], status: "current" },
    { title: "Senior Cloud Security Engineer", years: "5 - 8 Years", salary: "390,000 - 580,000 LKR", skills: ["Security Architecture", "Data Protection", "Multi-cloud Security", "Governance", "Mentoring"], status: "future" },
    { title: "Cloud Security Architect", years: "8+ Years", salary: "600,000+ LKR", skills: ["Enterprise Security Design", "Regulatory Advisory", "Vendor Management", "Executive Reporting"], status: "future" },
  ],

  "Application Security Engineer": [
    { title: "AppSec Intern", years: "0 - 1 Year", salary: "35,000 - 65,000 LKR", skills: ["OWASP", "Burp Suite", "Code Review Basics", "Python", "Networking"], status: "completed" },
    { title: "Junior AppSec Engineer", years: "1 - 2 Years", salary: "100,000 - 185,000 LKR", skills: ["SAST/DAST Tools", "Security Code Review", "Vulnerability Assessment", "API Security"], status: "completed" },
    { title: "Application Security Engineer", years: "2 - 5 Years", salary: "190,000 - 360,000 LKR", skills: ["Threat Modelling", "Security Champions Programme", "SDLC Integration", "Pen Testing"], status: "current" },
    { title: "Senior AppSec Engineer", years: "5 - 8 Years", salary: "370,000 - 560,000 LKR", skills: ["Security Architecture Review", "Tool Selection", "Developer Training", "Risk Assessment"], status: "future" },
    { title: "Head of Application Security", years: "8+ Years", salary: "580,000+ LKR", skills: ["AppSec Programme Strategy", "Executive Reporting", "Team Leadership", "Regulatory Compliance"], status: "future" },
  ],

  "GRC Analyst": [
    { title: "GRC Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Policy Documentation", "ISO 27001 Basics", "Excel", "Risk Register Basics", "Communication"], status: "completed" },
    { title: "Junior GRC Analyst", years: "1 - 2 Years", salary: "80,000 - 150,000 LKR", skills: ["Risk Assessment", "Compliance Monitoring", "Audit Support", "CBSL Guidelines", "Reporting"], status: "completed" },
    { title: "GRC Analyst", years: "2 - 5 Years", salary: "155,000 - 290,000 LKR", skills: ["ISO 27001", "PCI-DSS", "Third-party Risk", "Policy Writing", "Business Continuity"], status: "current" },
    { title: "Senior GRC Analyst", years: "5 - 8 Years", salary: "300,000 - 460,000 LKR", skills: ["Regulatory Compliance Leadership", "Enterprise Risk Framework", "Audit Leadership", "Executive Reporting"], status: "future" },
    { title: "Head of GRC", years: "8+ Years", salary: "480,000+ LKR", skills: ["GRC Programme", "Board Reporting", "Regulatory Affairs", "Hiring", "Risk Strategy"], status: "future" },
  ],

  "QA Engineer": [
    { title: "QA Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Manual Testing", "Test Cases", "Bug Reporting", "Attention to Detail", "JIRA Basics"], status: "completed" },
    { title: "Junior QA Engineer", years: "1 - 2 Years", salary: "75,000 - 140,000 LKR", skills: ["Regression Testing", "Exploratory Testing", "Agile Ceremonies", "Test Plans", "JIRA"], status: "completed" },
    { title: "QA Engineer", years: "2 - 4 Years", salary: "140,000 - 250,000 LKR", skills: ["Selenium", "API Testing", "Postman", "CI Integration", "Test Documentation"], status: "current" },
    { title: "Senior QA Engineer", years: "4 - 7 Years", salary: "260,000 - 400,000 LKR", skills: ["Framework Design", "Performance Testing", "Risk-based Testing", "Mentoring", "Playwright"], status: "future" },
    { title: "QA Tech Lead", years: "6 - 9 Years", salary: "410,000 - 570,000 LKR", skills: ["Quality Strategy", "Team Management", "Toolchain Selection", "DevOps Integration", "Reporting"], status: "future" },
    { title: "Head of Quality Engineering", years: "9+ Years", salary: "590,000+ LKR", skills: ["Quality Programme", "Shift-left Culture", "Executive Reporting", "Hiring", "Budget Ownership"], status: "future" },
  ],

  "Test Automation Engineer": [
    { title: "Automation Testing Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Python Basics", "Selenium Basics", "Manual Testing", "Git", "JIRA"], status: "completed" },
    { title: "Junior Test Automation Engineer", years: "1 - 2 Years", salary: "90,000 - 160,000 LKR", skills: ["Selenium WebDriver", "Pytest", "API Testing", "Postman", "Page Object Model"], status: "completed" },
    { title: "Test Automation Engineer", years: "2 - 5 Years", salary: "165,000 - 290,000 LKR", skills: ["CI/CD Integration", "Playwright", "BDD / Cucumber", "Performance Testing", "Test Reporting"], status: "current" },
    { title: "Senior Test Automation Engineer", years: "5 - 7 Years", salary: "300,000 - 460,000 LKR", skills: ["Framework Architecture", "Shift-left Testing", "Mobile Automation", "Mentoring", "Appium"], status: "future" },
    { title: "Automation Architect", years: "7+ Years", salary: "480,000+ LKR", skills: ["Test Platform Design", "Vendor Evaluation", "Cross-team Standards", "Executive Quality Reporting"], status: "future" },
  ],

  "Mobile QA Engineer": [
    { title: "Mobile QA Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Android / iOS Basics", "Manual Testing", "Bug Reporting", "JIRA", "Device Testing"], status: "completed" },
    { title: "Junior Mobile QA Engineer", years: "1 - 2 Years", salary: "80,000 - 145,000 LKR", skills: ["Appium", "Exploratory Testing", "API Testing", "Device Farm", "Regression Testing"], status: "completed" },
    { title: "Mobile QA Engineer", years: "2 - 5 Years", salary: "150,000 - 270,000 LKR", skills: ["Automated Mobile Testing", "Performance Profiling", "Accessibility Testing", "CI/CD", "Detox"], status: "current" },
    { title: "Senior Mobile QA Engineer", years: "5 - 8 Years", salary: "280,000 - 430,000 LKR", skills: ["Strategy Design", "OS Fragmentation Management", "Release Gating", "Team Leadership"], status: "future" },
    { title: "QA Manager – Mobile", years: "8+ Years", salary: "450,000+ LKR", skills: ["Mobile Quality Strategy", "Hiring", "Executive Reporting", "Tool Selection", "Compliance"], status: "future" },
  ],

  "UX Designer": [
    { title: "Design Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Figma Basics", "Wireframing", "Visual Design", "Canva", "Feedback Receptiveness"], status: "completed" },
    { title: "Junior UX Designer", years: "1 - 2 Years", salary: "80,000 - 145,000 LKR", skills: ["User Research", "Prototyping", "Usability Testing", "Design Systems Basics", "Figma"], status: "completed" },
    { title: "UX Designer", years: "2 - 4 Years", salary: "150,000 - 260,000 LKR", skills: ["Interaction Design", "Information Architecture", "Journey Mapping", "Accessibility", "Figma Advanced"], status: "current" },
    { title: "Senior UX Designer", years: "4 - 7 Years", salary: "270,000 - 420,000 LKR", skills: ["Design Systems", "Stakeholder Facilitation", "Research Leadership", "Mentoring", "Strategic Thinking"], status: "future" },
    { title: "Lead UX Designer", years: "6 - 9 Years", salary: "430,000 - 600,000 LKR", skills: ["Design Programme Management", "Cross-org Alignment", "Design Ops", "Executive Communication"], status: "future" },
    { title: "Head of Design", years: "9+ Years", salary: "620,000+ LKR", skills: ["Design Strategy", "Hiring", "Design Culture", "C-suite Partnership", "Portfolio Leadership"], status: "future" },
  ],

  "Product Designer": [
    { title: "Design Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Figma", "Visual Design", "Wireframing", "User Empathy", "Iteration"], status: "completed" },
    { title: "Junior Product Designer", years: "1 - 2 Years", salary: "85,000 - 155,000 LKR", skills: ["UX Research", "Prototyping", "Design Systems", "Agile Collaboration", "User Testing"], status: "completed" },
    { title: "Product Designer", years: "2 - 5 Years", salary: "160,000 - 290,000 LKR", skills: ["End-to-end Feature Design", "Interaction Design", "Accessibility", "PM Collaboration", "Metrics"], status: "current" },
    { title: "Senior Product Designer", years: "5 - 8 Years", salary: "300,000 - 470,000 LKR", skills: ["Design Vision", "Design System Ownership", "Cross-functional Leadership", "Mentoring"], status: "future" },
    { title: "Principal Product Designer", years: "8+ Years", salary: "490,000+ LKR", skills: ["Product Strategy Influence", "Org-wide Design Standards", "Research Platform", "Hiring"], status: "future" },
  ],

  "UX Researcher": [
    { title: "Research Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Survey Design", "Notetaking", "User Interviews Basics", "Empathy", "Qualitative Methods"], status: "completed" },
    { title: "Junior UX Researcher", years: "1 - 2 Years", salary: "85,000 - 155,000 LKR", skills: ["Usability Testing", "Interview Facilitation", "Affinity Mapping", "Figma", "Research Documentation"], status: "completed" },
    { title: "UX Researcher", years: "2 - 5 Years", salary: "160,000 - 290,000 LKR", skills: ["Mixed Methods", "Diary Studies", "Stakeholder Communication", "Data Analysis", "Research Synthesis"], status: "current" },
    { title: "Senior UX Researcher", years: "5 - 8 Years", salary: "300,000 - 470,000 LKR", skills: ["Research Operations", "Strategic Research", "Qual + Quant Integration", "Mentoring", "Evangelism"], status: "future" },
    { title: "Research Lead / Head of Research", years: "8+ Years", salary: "490,000+ LKR", skills: ["Research Programme", "Team Leadership", "Executive Influence", "Hiring", "Insight Repositories"], status: "future" },
  ],

  "Graphic / Visual Designer": [
    { title: "Design Intern", years: "0 - 1 Year", salary: "30,000 - 50,000 LKR", skills: ["Adobe Photoshop", "Illustrator", "Canva", "Typography Basics", "Colour Theory"], status: "completed" },
    { title: "Junior Graphic Designer", years: "1 - 2 Years", salary: "60,000 - 110,000 LKR", skills: ["Brand Identity", "Layout Design", "Print Production", "Social Media Design", "InDesign"], status: "completed" },
    { title: "Graphic Designer", years: "2 - 4 Years", salary: "110,000 - 200,000 LKR", skills: ["Motion Graphics", "After Effects", "Brand Guidelines", "Client Presentation", "Art Direction Basics"], status: "current" },
    { title: "Senior Graphic Designer", years: "4 - 7 Years", salary: "210,000 - 340,000 LKR", skills: ["Creative Direction", "Campaign Design", "Cross-medium Consistency", "Team Collaboration"], status: "future" },
    { title: "Creative Director", years: "7+ Years", salary: "360,000+ LKR", skills: ["Brand Strategy", "Creative Team Leadership", "Pitching", "Budget Management", "Executive Presentations"], status: "future" },
  ],

  "Motion Designer": [
    { title: "Motion Design Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["After Effects Basics", "Premiere Pro", "Figma", "Animation Principles", "Storyboarding"], status: "completed" },
    { title: "Junior Motion Designer", years: "1 - 2 Years", salary: "70,000 - 130,000 LKR", skills: ["2D Animation", "Kinetic Typography", "Social Media Content", "Brand Motion", "Lottie"], status: "completed" },
    { title: "Motion Designer", years: "2 - 5 Years", salary: "135,000 - 250,000 LKR", skills: ["3D Motion", "Cinema 4D", "UI Animation", "Product Demo Videos", "Sound Design Basics"], status: "current" },
    { title: "Senior Motion Designer", years: "5 - 8 Years", salary: "260,000 - 400,000 LKR", skills: ["Creative Direction", "Campaign Storytelling", "Brand System Animation", "Mentoring"], status: "future" },
    { title: "Head of Motion / Creative Lead", years: "8+ Years", salary: "420,000+ LKR", skills: ["Motion Strategy", "Studio Leadership", "Vendor Management", "Executive Creative Direction"], status: "future" },
  ],

  "Business Analyst": [
    { title: "BA Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Excel", "Note-taking", "Process Observation", "Communication", "JIRA Basics"], status: "completed" },
    { title: "Junior Business Analyst", years: "1 - 2 Years", salary: "80,000 - 150,000 LKR", skills: ["Requirements Gathering", "User Stories", "BPMN Basics", "SQL", "Stakeholder Interviews"], status: "completed" },
    { title: "Business Analyst", years: "2 - 4 Years", salary: "155,000 - 260,000 LKR", skills: ["Process Modelling", "UML", "Agile BA", "Data Analysis", "Workshop Facilitation"], status: "current" },
    { title: "Senior Business Analyst", years: "4 - 7 Years", salary: "270,000 - 420,000 LKR", skills: ["Enterprise Analysis", "Business Case Development", "Change Management", "Mentoring"], status: "future" },
    { title: "Principal Business Analyst", years: "6 - 9 Years", salary: "430,000 - 600,000 LKR", skills: ["Transformation Programme Leadership", "Stakeholder Management", "BA Practice Standards"], status: "future" },
    { title: "Head of Business Analysis", years: "9+ Years", salary: "620,000+ LKR", skills: ["BA Organisation", "Hiring", "Methodology Governance", "Executive Advisory", "Practice Leadership"], status: "future" },
  ],

  "Systems Analyst": [
    { title: "IT Support / Systems Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Documentation", "Basic SQL", "System Observation", "Excel", "Helpdesk"], status: "completed" },
    { title: "Junior Systems Analyst", years: "1 - 2 Years", salary: "80,000 - 145,000 LKR", skills: ["Requirements Documentation", "SQL", "System Testing", "Data Flow Diagrams", "JIRA"], status: "completed" },
    { title: "Systems Analyst", years: "2 - 5 Years", salary: "150,000 - 270,000 LKR", skills: ["System Integration Analysis", "API Understanding", "Change Management", "Business Process Redesign"], status: "current" },
    { title: "Senior Systems Analyst", years: "5 - 8 Years", salary: "280,000 - 430,000 LKR", skills: ["Enterprise Architecture Input", "Vendor Assessment", "Programme Management", "Mentoring"], status: "future" },
    { title: "IT Solutions Architect", years: "8+ Years", salary: "450,000+ LKR", skills: ["Solution Design", "RFP Management", "Technology Evaluation", "Stakeholder Advisory", "Leadership"], status: "future" },
  ],

  "ERP Consultant": [
    { title: "ERP Intern / Trainee", years: "0 - 1 Year", salary: "35,000 - 65,000 LKR", skills: ["ERP Fundamentals", "Excel", "Process Documentation", "Communication", "SAP / Oracle Basics"], status: "completed" },
    { title: "ERP Functional Consultant", years: "1 - 3 Years", salary: "120,000 - 230,000 LKR", skills: ["Module Configuration", "UAT Support", "Process Mapping", "SQL", "Change Management"], status: "completed" },
    { title: "Senior ERP Consultant", years: "3 - 6 Years", salary: "240,000 - 420,000 LKR", skills: ["End-to-end Implementation", "Fit-Gap Analysis", "Cutover Management", "Client Leadership"], status: "current" },
    { title: "ERP Solution Architect", years: "6 - 9 Years", salary: "430,000 - 650,000 LKR", skills: ["Multi-module Architecture", "Integration Design", "RFP Response", "Team Management"], status: "future" },
    { title: "ERP Practice Lead", years: "9+ Years", salary: "680,000+ LKR", skills: ["Practice P&L", "Proposal Leadership", "Hiring", "Methodology Development", "Executive Advisory"], status: "future" },
  ],

  "Management Consultant": [
    { title: "Consulting Analyst Intern", years: "0 - 1 Year", salary: "40,000 - 75,000 LKR", skills: ["PowerPoint", "Excel", "Research", "Communication", "Problem Structuring"], status: "completed" },
    { title: "Analyst", years: "1 - 2 Years", salary: "120,000 - 220,000 LKR", skills: ["Data Analysis", "Slide Decks", "Benchmarking", "Client Interviews", "Hypothesis-driven Thinking"], status: "completed" },
    { title: "Consultant", years: "2 - 4 Years", salary: "230,000 - 400,000 LKR", skills: ["Workstream Leadership", "Client Management", "Business Case", "Process Improvement", "Frameworks"], status: "current" },
    { title: "Senior Consultant", years: "4 - 7 Years", salary: "420,000 - 650,000 LKR", skills: ["Engagement Management", "Proposal Writing", "C-level Relationships", "Mentoring", "Industry Expertise"], status: "future" },
    { title: "Manager / Principal", years: "7 - 10 Years", salary: "680,000 - 950,000 LKR", skills: ["Portfolio Management", "Business Development", "Team Leadership", "P&L", "Thought Leadership"], status: "future" },
    { title: "Partner / Director", years: "10+ Years", salary: "1,000,000+ LKR", skills: ["Revenue Ownership", "Firm Strategy", "Practice Building", "C-suite Advisory", "Hiring"], status: "future" },
  ],

  "Strategy Analyst": [
    { title: "Strategy Intern", years: "0 - 1 Year", salary: "40,000 - 70,000 LKR", skills: ["Excel", "Market Research", "PowerPoint", "Competitive Analysis", "Communication"], status: "completed" },
    { title: "Junior Strategy Analyst", years: "1 - 2 Years", salary: "110,000 - 200,000 LKR", skills: ["Strategic Frameworks", "Financial Modelling", "Industry Analysis", "Scenario Planning", "Stakeholder Reporting"], status: "completed" },
    { title: "Strategy Analyst", years: "2 - 5 Years", salary: "210,000 - 380,000 LKR", skills: ["Corporate Strategy", "M&A Screening", "Business Case Development", "Executive Presentations", "OKRs"], status: "current" },
    { title: "Senior Strategy Analyst", years: "5 - 8 Years", salary: "390,000 - 600,000 LKR", skills: ["Programme Strategy", "C-suite Advising", "Portfolio Analysis", "Cross-BU Alignment", "Mentoring"], status: "future" },
    { title: "Head of Strategy", years: "8+ Years", salary: "630,000+ LKR", skills: ["Corporate Strategy", "M&A", "Board Reporting", "Executive Team Partnership", "Org Design"], status: "future" },
  ],

  "Business Development Manager": [
    { title: "BD Intern", years: "0 - 1 Year", salary: "30,000 - 60,000 LKR", skills: ["CRM Basics", "Cold Outreach", "Research", "Communication", "LinkedIn"], status: "completed" },
    { title: "Business Development Executive", years: "1 - 2 Years", salary: "80,000 - 160,000 LKR", skills: ["Lead Generation", "Prospecting", "Proposal Writing", "Client Meetings", "Sales Funnel"], status: "completed" },
    { title: "Business Development Manager", years: "2 - 5 Years", salary: "170,000 - 340,000 LKR", skills: ["Partnership Development", "Contract Negotiation", "Account Management", "Pipeline Management", "Forecasting"], status: "current" },
    { title: "Senior BD Manager", years: "5 - 8 Years", salary: "360,000 - 560,000 LKR", skills: ["Enterprise Sales", "Strategic Partnerships", "Revenue Targets", "C-suite Engagement", "Mentoring"], status: "future" },
    { title: "VP of Business Development", years: "8+ Years", salary: "580,000+ LKR", skills: ["BD Strategy", "Market Expansion", "Alliance Management", "Executive Relationships", "Hiring"], status: "future" },
  ],

  "Sales Engineer": [
    { title: "Sales Support Intern", years: "0 - 1 Year", salary: "30,000 - 60,000 LKR", skills: ["Product Knowledge", "Demo Setup", "CRM Basics", "Communication", "Technical Documentation"], status: "completed" },
    { title: "Junior Sales Engineer", years: "1 - 2 Years", salary: "90,000 - 170,000 LKR", skills: ["Technical Demos", "RFP Support", "API Understanding", "POC Delivery", "Client Communication"], status: "completed" },
    { title: "Sales Engineer", years: "2 - 5 Years", salary: "180,000 - 340,000 LKR", skills: ["Solution Design", "Technical Qualification", "Competitive Positioning", "Workshop Facilitation", "Integration Concepts"], status: "current" },
    { title: "Senior Sales Engineer", years: "5 - 8 Years", salary: "360,000 - 560,000 LKR", skills: ["Enterprise Deal Support", "Technical Strategy", "Team Mentoring", "C-suite Presentations", "Deal Architecture"], status: "future" },
    { title: "Head of Sales Engineering", years: "8+ Years", salary: "580,000+ LKR", skills: ["SE Team Leadership", "Sales Strategy Input", "Hiring", "Enablement", "Revenue Partnership"], status: "future" },
  ],

  "Product Manager": [
    { title: "Product Intern / APM", years: "0 - 1 Year", salary: "40,000 - 75,000 LKR", skills: ["User Empathy", "Agile Basics", "Wireframing", "Communication", "Market Research"], status: "completed" },
    { title: "Associate Product Manager", years: "1 - 2 Years", salary: "120,000 - 220,000 LKR", skills: ["User Research", "Feature Specs", "Backlog Management", "Stakeholder Communication", "Data Analysis"], status: "completed" },
    { title: "Product Manager", years: "2 - 5 Years", salary: "230,000 - 420,000 LKR", skills: ["Roadmapping", "A/B Testing", "OKRs", "SQL", "Cross-functional Leadership"], status: "current" },
    { title: "Senior Product Manager", years: "5 - 8 Years", salary: "430,000 - 650,000 LKR", skills: ["Product Strategy", "P&L Awareness", "Go-to-Market", "Executive Stakeholders", "Hiring"], status: "future" },
    { title: "Group Product Manager", years: "7 - 11 Years", salary: "660,000 - 880,000 LKR", skills: ["Portfolio Roadmap", "PM Team Leadership", "Business Case Development", "Board Reporting"], status: "future" },
    { title: "VP of Product", years: "11+ Years", salary: "900,000+ LKR", skills: ["Product Vision", "C-suite Partnership", "Org Design", "Acquisition Strategy", "Budget Ownership"], status: "future" },
  ],

  "Technical Product Manager": [
    { title: "Technical APM", years: "0 - 1 Year", salary: "50,000 - 90,000 LKR", skills: ["API Concepts", "Agile", "SQL", "Engineering Collaboration", "Documentation"], status: "completed" },
    { title: "Technical Product Manager", years: "1 - 4 Years", salary: "200,000 - 380,000 LKR", skills: ["API Product Management", "Technical Specs", "Developer Experience", "System Design Awareness"], status: "completed" },
    { title: "Senior Technical PM", years: "4 - 7 Years", salary: "390,000 - 580,000 LKR", skills: ["Platform Roadmap", "Engineering Partnership", "Scalability Trade-offs", "Developer Community"], status: "current" },
    { title: "Principal Technical PM", years: "7 - 10 Years", salary: "600,000 - 800,000 LKR", skills: ["Platform Strategy", "Architecture Governance", "Executive Alignment", "Hiring"], status: "future" },
    { title: "VP of Platform Product", years: "10+ Years", salary: "850,000+ LKR", skills: ["Multi-product Portfolio", "C-suite Advisory", "Org Design", "Revenue Ownership"], status: "future" },
  ],

  "Growth Product Manager": [
    { title: "Growth Intern", years: "0 - 1 Year", salary: "35,000 - 65,000 LKR", skills: ["Excel", "A/B Testing Basics", "Analytics", "Marketing Basics", "Communication"], status: "completed" },
    { title: "Growth Analyst / Junior PM", years: "1 - 2 Years", salary: "110,000 - 210,000 LKR", skills: ["SQL", "Google Analytics", "User Funnel Analysis", "Experimentation", "Copywriting"], status: "completed" },
    { title: "Growth PM", years: "2 - 5 Years", salary: "220,000 - 400,000 LKR", skills: ["AARRR Framework", "Retention Analysis", "Feature Experimentation", "Conversion Optimisation"], status: "current" },
    { title: "Senior Growth PM", years: "5 - 8 Years", salary: "410,000 - 620,000 LKR", skills: ["Growth Strategy", "Revenue Modelling", "Cross-channel Optimisation", "Team Leadership"], status: "future" },
    { title: "Head of Growth", years: "8+ Years", salary: "640,000+ LKR", skills: ["Growth Organisation", "Budget", "Executive Reporting", "Acquisition & Retention Strategy", "Hiring"], status: "future" },
  ],

  "Financial Analyst": [
    { title: "Finance Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Excel", "Data Entry", "Basic Accounting", "Report Formatting", "Communication"], status: "completed" },
    { title: "Junior Financial Analyst", years: "1 - 2 Years", salary: "80,000 - 150,000 LKR", skills: ["Financial Modelling", "Variance Analysis", "Budgeting", "Excel Advanced", "Report Writing"], status: "completed" },
    { title: "Financial Analyst", years: "2 - 5 Years", salary: "155,000 - 280,000 LKR", skills: ["Forecasting", "Power BI", "SQL", "Stakeholder Reporting", "ACCA Part-Qualified"], status: "current" },
    { title: "Senior Financial Analyst", years: "5 - 7 Years", salary: "290,000 - 450,000 LKR", skills: ["Valuation", "Board Reporting", "Business Partnering", "Team Leadership", "ACCA Qualified"], status: "future" },
    { title: "Finance Manager", years: "7 - 10 Years", salary: "460,000 - 650,000 LKR", skills: ["P&L Ownership", "Team Management", "Strategic Planning", "Investor Relations", "Budgeting"], status: "future" },
    { title: "CFO / Head of Finance", years: "10+ Years", salary: "700,000+ LKR", skills: ["Corporate Strategy", "Fund Raising", "Regulatory Compliance", "Board Advisory", "M&A"], status: "future" },
  ],

  "Investment Analyst": [
    { title: "Research Intern", years: "0 - 1 Year", salary: "35,000 - 65,000 LKR", skills: ["Excel", "Financial Research", "Company Analysis", "Report Writing", "Bloomberg Basics"], status: "completed" },
    { title: "Junior Investment Analyst", years: "1 - 2 Years", salary: "120,000 - 220,000 LKR", skills: ["Financial Modelling", "DCF Valuation", "Sector Research", "Pitchbooks", "Bloomberg"], status: "completed" },
    { title: "Investment Analyst", years: "2 - 5 Years", salary: "230,000 - 420,000 LKR", skills: ["Deal Sourcing", "Due Diligence", "Portfolio Monitoring", "Client Reporting", "CFA Level 1"], status: "current" },
    { title: "Senior Investment Analyst", years: "5 - 8 Years", salary: "430,000 - 680,000 LKR", skills: ["Investment Committee Presentations", "Portfolio Strategy", "CFA Qualified", "Relationship Management"], status: "future" },
    { title: "Portfolio Manager", years: "8+ Years", salary: "700,000+ LKR", skills: ["Fund Management", "Asset Allocation", "Risk Management", "Investor Relations", "Executive Leadership"], status: "future" },
  ],

  "Risk Analyst": [
    { title: "Risk Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Excel", "Basic Risk Concepts", "Documentation", "Regulatory Awareness", "Communication"], status: "completed" },
    { title: "Junior Risk Analyst", years: "1 - 2 Years", salary: "85,000 - 155,000 LKR", skills: ["Credit Risk", "Market Risk Basics", "SQL", "Regulatory Reporting", "Excel Advanced"], status: "completed" },
    { title: "Risk Analyst", years: "2 - 5 Years", salary: "160,000 - 290,000 LKR", skills: ["Risk Modelling", "VaR", "Stress Testing", "CBSL Compliance", "Python Basics"], status: "current" },
    { title: "Senior Risk Analyst", years: "5 - 8 Years", salary: "300,000 - 480,000 LKR", skills: ["Model Validation", "Basel III", "Scenario Analysis", "Stakeholder Advisory", "FRM/CFA"], status: "future" },
    { title: "Head of Risk", years: "8+ Years", salary: "500,000+ LKR", skills: ["Risk Framework", "Board Reporting", "Regulatory Affairs", "Team Leadership", "Enterprise Risk Management"], status: "future" },
  ],

  "Accountant": [
    { title: "Accounts Intern", years: "0 - 1 Year", salary: "25,000 - 50,000 LKR", skills: ["Excel", "Bookkeeping", "Data Entry", "AAT Basics", "Communication"], status: "completed" },
    { title: "Junior Accountant", years: "1 - 2 Years", salary: "65,000 - 120,000 LKR", skills: ["Accounts Payable / Receivable", "Bank Reconciliation", "Trial Balance", "Tally / QuickBooks", "ACCA Part 1"], status: "completed" },
    { title: "Accountant", years: "2 - 5 Years", salary: "125,000 - 220,000 LKR", skills: ["Management Accounts", "VAT / Tax Filing", "Financial Statements", "Audit Support", "ACCA Part 2"], status: "current" },
    { title: "Senior Accountant", years: "5 - 7 Years", salary: "230,000 - 370,000 LKR", skills: ["Financial Reporting", "IFRS", "Team Supervision", "Internal Controls", "ACCA Qualified"], status: "future" },
    { title: "Finance Controller", years: "7 - 10 Years", salary: "380,000 - 580,000 LKR", skills: ["Financial Close", "Consolidation", "Audit Leadership", "ERP Management", "Team Management"], status: "future" },
    { title: "CFO", years: "10+ Years", salary: "620,000+ LKR", skills: ["Corporate Finance", "Board Advisory", "M&A", "Capital Structure", "Strategic Planning"], status: "future" },
  ],

  "Tax Consultant": [
    { title: "Tax Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Income Tax Basics", "Excel", "Filing Support", "IRD Guidelines", "Documentation"], status: "completed" },
    { title: "Junior Tax Consultant", years: "1 - 2 Years", salary: "80,000 - 150,000 LKR", skills: ["Income Tax Filing", "VAT Returns", "Corporate Tax Basics", "Tax Computation", "Client Communication"], status: "completed" },
    { title: "Tax Consultant", years: "2 - 5 Years", salary: "155,000 - 290,000 LKR", skills: ["Tax Planning", "Transfer Pricing", "International Tax", "Compliance Management", "Client Advisory"], status: "current" },
    { title: "Senior Tax Consultant", years: "5 - 8 Years", salary: "300,000 - 480,000 LKR", skills: ["Tax Strategy", "Dispute Resolution", "M&A Tax", "Regulatory Lobbying", "Team Leadership"], status: "future" },
    { title: "Tax Manager / Partner", years: "8+ Years", salary: "500,000+ LKR", skills: ["Tax Practice Leadership", "Client Portfolio", "Hiring", "IRD Relationship Management", "Executive Advisory"], status: "future" },
  ],

  "Audit Associate": [
    { title: "Audit Intern", years: "0 - 1 Year", salary: "25,000 - 50,000 LKR", skills: ["Working Papers", "Excel", "Communication", "Attention to Detail", "ACCA Basics"], status: "completed" },
    { title: "Audit Associate", years: "1 - 2 Years", salary: "70,000 - 130,000 LKR", skills: ["Financial Statement Audit", "Substantive Testing", "ISA Standards", "Audit Evidence", "Client Liaison"], status: "completed" },
    { title: "Semi-Senior Auditor", years: "2 - 4 Years", salary: "135,000 - 240,000 LKR", skills: ["Risk Assessment", "Internal Controls Testing", "Group Audits", "IFRS", "Team Supervision"], status: "current" },
    { title: "Audit Senior", years: "4 - 6 Years", salary: "250,000 - 400,000 LKR", skills: ["Engagement Management", "Client Relationship", "Technical Accounting", "Staff Training", "Quality Review"], status: "future" },
    { title: "Audit Manager", years: "6 - 9 Years", salary: "410,000 - 620,000 LKR", skills: ["Portfolio Management", "Business Development", "Partner Collaboration", "Firm Standards", "Hiring"], status: "future" },
    { title: "Audit Partner", years: "9+ Years", salary: "650,000+ LKR", skills: ["Practice Leadership", "Revenue Generation", "Regulatory Relationships", "Firm Strategy", "Governance"], status: "future" },
  ],

  "Treasury Analyst": [
    { title: "Treasury Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Excel", "Cash Flow Basics", "Banking Portals", "Documentation", "Communication"], status: "completed" },
    { title: "Junior Treasury Analyst", years: "1 - 2 Years", salary: "85,000 - 160,000 LKR", skills: ["Cash Management", "Bank Reconciliation", "FX Basics", "Payment Processing", "Liquidity Reporting"], status: "completed" },
    { title: "Treasury Analyst", years: "2 - 5 Years", salary: "165,000 - 300,000 LKR", skills: ["FX Hedging", "Interest Rate Risk", "Cash Forecasting", "Treasury Systems", "Covenant Monitoring"], status: "current" },
    { title: "Senior Treasury Analyst", years: "5 - 8 Years", salary: "310,000 - 480,000 LKR", skills: ["Capital Markets", "Debt Management", "Investment Policy", "Counterparty Risk", "Board Reporting"], status: "future" },
    { title: "Head of Treasury", years: "8+ Years", salary: "500,000+ LKR", skills: ["Treasury Strategy", "Funding Structure", "Banking Relationships", "Regulatory Compliance", "Executive Advisory"], status: "future" },
  ],

  "Corporate Finance Analyst": [
    { title: "Corporate Finance Intern", years: "0 - 1 Year", salary: "35,000 - 65,000 LKR", skills: ["Excel", "Financial Research", "PowerPoint", "Basic Valuation", "Communication"], status: "completed" },
    { title: "Junior Corporate Finance Analyst", years: "1 - 2 Years", salary: "120,000 - 220,000 LKR", skills: ["DCF Modelling", "Comparable Company Analysis", "M&A Basics", "Due Diligence Support", "Pitchbooks"], status: "completed" },
    { title: "Corporate Finance Analyst", years: "2 - 5 Years", salary: "230,000 - 420,000 LKR", skills: ["Deal Execution", "LBO Modelling", "Capital Raising", "Transaction Management", "Client Advisory"], status: "current" },
    { title: "Associate / Senior Analyst", years: "5 - 8 Years", salary: "430,000 - 680,000 LKR", skills: ["Deal Leadership", "Origination Support", "Sector Expertise", "Regulatory Navigation", "Mentoring"], status: "future" },
    { title: "Director / MD – Corporate Finance", years: "8+ Years", salary: "700,000+ LKR", skills: ["Revenue Origination", "Client Portfolio", "Firm Strategy", "Regulatory Affairs", "Executive Leadership"], status: "future" },
  ],

  "Project Manager": [
    { title: "Project Coordinator Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["JIRA", "Meeting Coordination", "Documentation", "Excel", "Communication"], status: "completed" },
    { title: "Project Coordinator", years: "1 - 2 Years", salary: "80,000 - 145,000 LKR", skills: ["Schedule Management", "Risk Logging", "Status Reporting", "Agile Basics", "Stakeholder Communication"], status: "completed" },
    { title: "Project Manager", years: "2 - 5 Years", salary: "150,000 - 290,000 LKR", skills: ["PMP / PRINCE2", "Budget Management", "Risk Management", "Agile & Waterfall", "Vendor Management"], status: "current" },
    { title: "Senior Project Manager", years: "5 - 8 Years", salary: "300,000 - 480,000 LKR", skills: ["Programme Delivery", "Executive Reporting", "Conflict Resolution", "Mentoring", "Governance"], status: "future" },
    { title: "Programme Manager", years: "7 - 11 Years", salary: "490,000 - 700,000 LKR", skills: ["Multi-project Governance", "Benefits Realisation", "Strategic Alignment", "Change Leadership"], status: "future" },
    { title: "Head of PMO", years: "11+ Years", salary: "720,000+ LKR", skills: ["PMO Setup", "Portfolio Management", "Executive Advisory", "Methodology Standards", "Hiring"], status: "future" },
  ],

  "Scrum Master": [
    { title: "Agile Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Scrum Basics", "JIRA", "Meeting Facilitation", "Note-taking", "Communication"], status: "completed" },
    { title: "Junior Scrum Master", years: "1 - 2 Years", salary: "90,000 - 160,000 LKR", skills: ["Sprint Facilitation", "Backlog Refinement", "Impediment Removal", "CSM Certification", "Agile Metrics"], status: "completed" },
    { title: "Scrum Master", years: "2 - 4 Years", salary: "165,000 - 280,000 LKR", skills: ["Team Coaching", "Velocity Tracking", "PI Planning", "SAFe Basics", "Retrospective Techniques"], status: "current" },
    { title: "Senior Scrum Master", years: "4 - 7 Years", salary: "290,000 - 430,000 LKR", skills: ["Agile Coaching", "Multi-team Coordination", "Org Transformation", "PSM / SAFe SPC"], status: "future" },
    { title: "Agile Coach", years: "6 - 10 Years", salary: "440,000 - 640,000 LKR", skills: ["Enterprise Agile Transformation", "Leadership Coaching", "Culture Change", "Executive Advisory"], status: "future" },
    { title: "Head of Agile Practice", years: "10+ Years", salary: "660,000+ LKR", skills: ["Practice Leadership", "Methodology Design", "Hiring", "Org-wide Agility", "Executive Partnership"], status: "future" },
  ],

  "Change Manager": [
    { title: "Change Management Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Communication", "Stakeholder Mapping", "Documentation", "PowerPoint", "Empathy"], status: "completed" },
    { title: "Change Analyst", years: "1 - 2 Years", salary: "85,000 - 160,000 LKR", skills: ["Impact Assessment", "Communication Planning", "Training Support", "Resistance Management", "ADKAR Basics"], status: "completed" },
    { title: "Change Manager", years: "2 - 5 Years", salary: "165,000 - 300,000 LKR", skills: ["Change Strategy", "Stakeholder Engagement", "Business Readiness", "Prosci / ADKAR", "Transformation Projects"], status: "current" },
    { title: "Senior Change Manager", years: "5 - 8 Years", salary: "310,000 - 490,000 LKR", skills: ["Org Design", "Leadership Alignment", "Culture Change", "Executive Coaching", "Multi-site Delivery"], status: "future" },
    { title: "Head of Change & Transformation", years: "8+ Years", salary: "510,000+ LKR", skills: ["Transformation Programme", "Change Capability Building", "Executive Advisory", "Hiring", "Strategy"], status: "future" },
  ],

  "Database Administrator": [
    { title: "Database Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["SQL Basics", "MySQL", "Data Entry", "Excel", "Linux Basics"], status: "completed" },
    { title: "Junior DBA", years: "1 - 2 Years", salary: "80,000 - 145,000 LKR", skills: ["PostgreSQL", "Backup & Recovery", "User Management", "Basic Tuning", "Monitoring"], status: "completed" },
    { title: "Database Administrator", years: "2 - 5 Years", salary: "150,000 - 270,000 LKR", skills: ["Oracle", "Performance Tuning", "High Availability", "Security", "PL/SQL"], status: "current" },
    { title: "Senior DBA", years: "5 - 8 Years", salary: "280,000 - 430,000 LKR", skills: ["Replication", "Disaster Recovery", "Capacity Planning", "Database Upgrades", "Mentoring"], status: "future" },
    { title: "Database Architect", years: "8 - 12 Years", salary: "450,000 - 640,000 LKR", skills: ["Enterprise Data Architecture", "Migration Leadership", "Cloud Databases", "Governance"], status: "future" },
    { title: "Head of Data Infrastructure", years: "12+ Years", salary: "660,000+ LKR", skills: ["Data Platform Strategy", "Vendor Management", "Hiring", "Budget", "Executive Advisory"], status: "future" },
  ],

  "Technical Support Engineer": [
    { title: "IT Helpdesk Intern", years: "0 - 1 Year", salary: "25,000 - 50,000 LKR", skills: ["Windows", "Hardware Support", "Active Directory Basics", "Ticketing Systems", "Customer Service"], status: "completed" },
    { title: "Technical Support Analyst", years: "1 - 2 Years", salary: "65,000 - 120,000 LKR", skills: ["Linux", "SQL Basics", "Log Analysis", "Troubleshooting", "JIRA"], status: "completed" },
    { title: "Technical Support Engineer", years: "2 - 4 Years", salary: "125,000 - 230,000 LKR", skills: ["API Debugging", "Database Queries", "Scripting", "Root Cause Analysis", "Client Communication"], status: "current" },
    { title: "Senior Technical Support Engineer", years: "4 - 7 Years", salary: "240,000 - 390,000 LKR", skills: ["Escalation Management", "Product Expertise", "Knowledge Base Authoring", "Mentoring", "Process Improvement"], status: "future" },
    { title: "Support Engineering Manager", years: "6 - 9 Years", salary: "400,000 - 580,000 LKR", skills: ["Team Leadership", "SLA Management", "Customer Success Strategy", "Hiring", "Executive Reporting"], status: "future" },
    { title: "Head of Customer Engineering", years: "9+ Years", salary: "600,000+ LKR", skills: ["Support Organisation Design", "CX Strategy", "Product Feedback Loops", "Budget", "Executive Advisory"], status: "future" },
  ],

  "Digital Marketing Specialist": [
    { title: "Digital Marketing Intern", years: "0 - 1 Year", salary: "25,000 - 50,000 LKR", skills: ["Social Media", "Canva", "Google Analytics Basics", "Content Writing", "Email Marketing Basics"], status: "completed" },
    { title: "Digital Marketing Executive", years: "1 - 2 Years", salary: "65,000 - 120,000 LKR", skills: ["Google Ads", "Facebook Ads", "SEO Basics", "Analytics", "Copywriting"], status: "completed" },
    { title: "Digital Marketing Specialist", years: "2 - 4 Years", salary: "125,000 - 230,000 LKR", skills: ["Performance Marketing", "SEO / SEM", "Marketing Automation", "Attribution Modelling", "A/B Testing"], status: "current" },
    { title: "Senior Digital Marketing Specialist", years: "4 - 7 Years", salary: "240,000 - 390,000 LKR", skills: ["Multi-channel Strategy", "Budget Ownership", "Team Mentoring", "CRO", "Campaign Leadership"], status: "future" },
    { title: "Head of Digital Marketing", years: "7+ Years", salary: "400,000+ LKR", skills: ["Marketing Strategy", "Brand Building", "Agency Management", "Executive Reporting", "Hiring"], status: "future" },
  ],

  "SEO Specialist": [
    { title: "SEO Intern", years: "0 - 1 Year", salary: "25,000 - 45,000 LKR", skills: ["Keyword Research Basics", "Google Search Console", "Content Writing", "On-page SEO Basics", "Excel"], status: "completed" },
    { title: "Junior SEO Specialist", years: "1 - 2 Years", salary: "60,000 - 110,000 LKR", skills: ["Technical SEO Basics", "Link Building", "Ahrefs / SEMrush", "Content Optimisation", "Analytics"], status: "completed" },
    { title: "SEO Specialist", years: "2 - 4 Years", salary: "115,000 - 210,000 LKR", skills: ["Technical SEO Audits", "Core Web Vitals", "Schema Markup", "Content Strategy", "Competitor Analysis"], status: "current" },
    { title: "Senior SEO Specialist", years: "4 - 7 Years", salary: "220,000 - 360,000 LKR", skills: ["SEO Programme Management", "Enterprise SEO", "International SEO", "Mentoring", "Executive Reporting"], status: "future" },
    { title: "Head of SEO / Organic Growth", years: "7+ Years", salary: "380,000+ LKR", skills: ["SEO Strategy", "Agency Management", "Content Platform Ownership", "Budget", "Hiring"], status: "future" },
  ],

  "Marketing Analyst": [
    { title: "Marketing Intern", years: "0 - 1 Year", salary: "25,000 - 50,000 LKR", skills: ["Excel", "Google Analytics", "Social Listening", "Report Formatting", "Communication"], status: "completed" },
    { title: "Junior Marketing Analyst", years: "1 - 2 Years", salary: "70,000 - 130,000 LKR", skills: ["SQL Basics", "Google Analytics", "Campaign Reporting", "Attribution", "Dashboards"], status: "completed" },
    { title: "Marketing Analyst", years: "2 - 5 Years", salary: "135,000 - 250,000 LKR", skills: ["Marketing Mix Modelling", "Customer Segmentation", "A/B Testing", "Python", "Power BI"], status: "current" },
    { title: "Senior Marketing Analyst", years: "5 - 7 Years", salary: "260,000 - 420,000 LKR", skills: ["Predictive Analytics", "Customer LTV", "Incrementality Testing", "Strategic Insight", "Mentoring"], status: "future" },
    { title: "Marketing Analytics Manager", years: "7+ Years", salary: "440,000+ LKR", skills: ["Analytics Platform", "Team Leadership", "Executive Reporting", "Budget Allocation Strategy", "Hiring"], status: "future" },
  ],

  "Brand Manager": [
    { title: "Brand Intern", years: "0 - 1 Year", salary: "25,000 - 50,000 LKR", skills: ["Brand Guidelines", "Social Media", "Canva", "Consumer Research", "Communication"], status: "completed" },
    { title: "Brand Executive", years: "1 - 2 Years", salary: "70,000 - 130,000 LKR", skills: ["Campaign Execution", "Agency Liaison", "Market Research", "Competitive Analysis", "Reporting"], status: "completed" },
    { title: "Brand Manager", years: "2 - 5 Years", salary: "135,000 - 260,000 LKR", skills: ["Brand Strategy", "P&L Management", "Media Planning", "Consumer Insights", "NPD Process"], status: "current" },
    { title: "Senior Brand Manager", years: "5 - 8 Years", salary: "270,000 - 440,000 LKR", skills: ["Portfolio Management", "Agency Management", "Brand Architecture", "Stakeholder Alignment", "Mentoring"], status: "future" },
    { title: "Head of Brand / Marketing Director", years: "8+ Years", salary: "460,000+ LKR", skills: ["Marketing Strategy", "Budget Ownership", "Brand Portfolio", "Executive Reporting", "Hiring"], status: "future" },
  ],

  "Content Strategist": [
    { title: "Content Intern", years: "0 - 1 Year", salary: "25,000 - 45,000 LKR", skills: ["Writing", "Editing", "Social Media Posting", "SEO Basics", "Research"], status: "completed" },
    { title: "Content Writer", years: "1 - 2 Years", salary: "60,000 - 110,000 LKR", skills: ["Long-form Writing", "Blog Strategy", "SEO Copywriting", "CMS (WordPress)", "Analytics Basics"], status: "completed" },
    { title: "Content Strategist", years: "2 - 5 Years", salary: "115,000 - 220,000 LKR", skills: ["Content Audit", "Editorial Calendar", "Distribution Strategy", "Persona Development", "Analytics"], status: "current" },
    { title: "Senior Content Strategist", years: "5 - 8 Years", salary: "230,000 - 380,000 LKR", skills: ["Content Programme", "Brand Voice", "SEO Leadership", "Multi-channel Planning", "Team Leadership"], status: "future" },
    { title: "Head of Content", years: "8+ Years", salary: "400,000+ LKR", skills: ["Content Strategy", "Editorial Vision", "Agency Management", "Budget", "Executive Reporting", "Hiring"], status: "future" },
  ],

  "Social Media Manager": [
    { title: "Social Media Intern", years: "0 - 1 Year", salary: "25,000 - 45,000 LKR", skills: ["Instagram", "Facebook", "Canva", "Caption Writing", "Scheduling Tools"], status: "completed" },
    { title: "Social Media Executive", years: "1 - 2 Years", salary: "60,000 - 110,000 LKR", skills: ["Content Planning", "Community Management", "Paid Social Basics", "Analytics", "Video Editing Basics"], status: "completed" },
    { title: "Social Media Manager", years: "2 - 5 Years", salary: "115,000 - 220,000 LKR", skills: ["Social Strategy", "Paid Social Campaigns", "Influencer Management", "Reporting", "Crisis Management"], status: "current" },
    { title: "Senior Social Media Manager", years: "5 - 7 Years", salary: "230,000 - 370,000 LKR", skills: ["Multi-platform Strategy", "Budget Management", "Team Leadership", "Brand Alignment", "Advocacy Programmes"], status: "future" },
    { title: "Head of Social / Director of Comms", years: "7+ Years", salary: "390,000+ LKR", skills: ["Social Strategy", "PR Integration", "Executive Reporting", "Hiring", "Agency Management"], status: "future" },
  ],

  "PR & Communications Specialist": [
    { title: "PR Intern", years: "0 - 1 Year", salary: "25,000 - 45,000 LKR", skills: ["Press Release Writing", "Media List Building", "Research", "Communication", "Social Monitoring"], status: "completed" },
    { title: "PR Executive", years: "1 - 2 Years", salary: "65,000 - 115,000 LKR", skills: ["Media Relations", "Press Release Distribution", "Event Coordination", "Crisis Basics", "Coverage Tracking"], status: "completed" },
    { title: "PR & Communications Specialist", years: "2 - 5 Years", salary: "120,000 - 240,000 LKR", skills: ["Spokesperson Coaching", "Campaign Strategy", "Stakeholder Communication", "Crisis Management", "Measurement"], status: "current" },
    { title: "Senior PR Specialist / Manager", years: "5 - 8 Years", salary: "250,000 - 420,000 LKR", skills: ["Strategic Communications", "Executive Profiling", "Agency Management", "Reputation Management", "Mentoring"], status: "future" },
    { title: "Head of Communications / VP PR", years: "8+ Years", salary: "440,000+ LKR", skills: ["Corporate Affairs", "Board Advisory", "Comms Strategy", "Regulatory Engagement", "Hiring"], status: "future" },
  ],

  "HR Business Partner": [
    { title: "HR Intern", years: "0 - 1 Year", salary: "25,000 - 50,000 LKR", skills: ["Admin", "HRIS Basics", "Onboarding Support", "Communication", "Documentation"], status: "completed" },
    { title: "HR Executive", years: "1 - 2 Years", salary: "65,000 - 120,000 LKR", skills: ["Recruitment", "Employee Relations", "Payroll Basics", "Performance Management", "Labour Law Basics"], status: "completed" },
    { title: "HR Business Partner", years: "2 - 5 Years", salary: "125,000 - 240,000 LKR", skills: ["Strategic Partnering", "OD Basics", "Compensation & Benefits", "Workforce Planning", "Conflict Resolution"], status: "current" },
    { title: "Senior HRBP", years: "5 - 8 Years", salary: "250,000 - 400,000 LKR", skills: ["Org Design", "Executive Advisory", "Change Management", "Talent Management", "Analytics"], status: "future" },
    { title: "Head of HR", years: "8 - 12 Years", salary: "420,000 - 620,000 LKR", skills: ["People Strategy", "Culture Building", "Hiring Strategy", "Executive Team Partner", "Budget Ownership"], status: "future" },
    { title: "CHRO", years: "12+ Years", salary: "650,000+ LKR", skills: ["People Organisation", "Board Reporting", "DEI Strategy", "Executive Leadership", "M&A HR Integration"], status: "future" },
  ],

  "Talent Acquisition Specialist": [
    { title: "Recruitment Intern", years: "0 - 1 Year", salary: "25,000 - 45,000 LKR", skills: ["Job Posting", "CV Screening", "Interview Scheduling", "LinkedIn Basics", "Communication"], status: "completed" },
    { title: "Junior Talent Acquisition Specialist", years: "1 - 2 Years", salary: "65,000 - 120,000 LKR", skills: ["Full-cycle Recruitment", "LinkedIn Recruiter", "Interview Techniques", "ATS Management", "Employer Branding Basics"], status: "completed" },
    { title: "Talent Acquisition Specialist", years: "2 - 5 Years", salary: "125,000 - 240,000 LKR", skills: ["Technical Recruiting", "Sourcing Strategies", "Candidate Experience", "Diversity Hiring", "Metrics"], status: "current" },
    { title: "Senior TA Specialist", years: "5 - 8 Years", salary: "250,000 - 400,000 LKR", skills: ["Executive Hiring", "TA Programme Design", "Employer Branding", "Vendor Management", "Mentoring"], status: "future" },
    { title: "Head of Talent Acquisition", years: "8+ Years", salary: "420,000+ LKR", skills: ["TA Strategy", "Budget", "Hiring Organisation Design", "RPO Management", "Executive Advisory"], status: "future" },
  ],

  "Learning & Development Specialist": [
    { title: "L&D Intern", years: "0 - 1 Year", salary: "25,000 - 50,000 LKR", skills: ["Training Coordination", "LMS Basics", "Content Uploading", "Communication", "PowerPoint"], status: "completed" },
    { title: "L&D Coordinator", years: "1 - 2 Years", salary: "65,000 - 120,000 LKR", skills: ["Training Needs Analysis", "Workshop Facilitation", "E-learning Basics", "Feedback Collection", "Reporting"], status: "completed" },
    { title: "L&D Specialist", years: "2 - 5 Years", salary: "125,000 - 240,000 LKR", skills: ["Instructional Design", "LMS Administration", "Blended Learning", "Skills Gap Analysis", "Competency Frameworks"], status: "current" },
    { title: "Senior L&D Specialist", years: "5 - 8 Years", salary: "250,000 - 400,000 LKR", skills: ["Learning Strategy", "Leadership Development", "Culture & Capability", "ROI Measurement", "Vendor Management"], status: "future" },
    { title: "Head of L&D", years: "8+ Years", salary: "420,000+ LKR", skills: ["Capability Strategy", "Budget", "Hiring", "Executive Advisory", "Organisation-wide Skills Programme"], status: "future" },
  ],

  "Compensation & Benefits Analyst": [
    { title: "C&B Intern", years: "0 - 1 Year", salary: "25,000 - 50,000 LKR", skills: ["Excel", "Payroll Basics", "Data Entry", "HR Policies", "Communication"], status: "completed" },
    { title: "Junior C&B Analyst", years: "1 - 2 Years", salary: "75,000 - 135,000 LKR", skills: ["Salary Benchmarking", "Benefits Administration", "Job Evaluation", "Market Data Analysis", "HRIS"], status: "completed" },
    { title: "C&B Analyst", years: "2 - 5 Years", salary: "140,000 - 260,000 LKR", skills: ["Total Rewards Design", "Pay Equity Analysis", "Incentive Scheme Design", "Statutory Compliance", "Executive Reporting"], status: "current" },
    { title: "Senior C&B Analyst / Manager", years: "5 - 8 Years", salary: "270,000 - 430,000 LKR", skills: ["Reward Strategy", "Global Mobility", "Equity & Bonus Plans", "Executive Compensation", "Governance"], status: "future" },
    { title: "Head of Reward", years: "8+ Years", salary: "450,000+ LKR", skills: ["Total Rewards Strategy", "Board Reporting", "Regulatory Compliance", "Hiring", "Executive Advisory"], status: "future" },
  ],

  "Operations Analyst": [
    { title: "Operations Intern", years: "0 - 1 Year", salary: "25,000 - 50,000 LKR", skills: ["Excel", "Process Documentation", "Data Entry", "Communication", "Reporting"], status: "completed" },
    { title: "Junior Operations Analyst", years: "1 - 2 Years", salary: "70,000 - 130,000 LKR", skills: ["SQL Basics", "Process Mapping", "KPI Tracking", "Root Cause Analysis", "Power BI Basics"], status: "completed" },
    { title: "Operations Analyst", years: "2 - 5 Years", salary: "135,000 - 260,000 LKR", skills: ["Process Optimisation", "SQL", "Data Analysis", "Lean Basics", "Stakeholder Reporting"], status: "current" },
    { title: "Senior Operations Analyst", years: "5 - 7 Years", salary: "270,000 - 420,000 LKR", skills: ["Operational Strategy", "Team Leadership", "Six Sigma", "Change Management", "Executive Reporting"], status: "future" },
    { title: "Operations Manager", years: "7 - 10 Years", salary: "430,000 - 620,000 LKR", skills: ["P&L Management", "Cross-functional Leadership", "Vendor Contracts", "Capacity Planning", "Budgeting"], status: "future" },
    { title: "Director of Operations", years: "10+ Years", salary: "650,000+ LKR", skills: ["Operations Organisation", "Executive Advisory", "Corporate Strategy", "Hiring", "Business Continuity"], status: "future" },
  ],

  "Supply Chain Analyst": [
    { title: "Supply Chain Intern", years: "0 - 1 Year", salary: "25,000 - 50,000 LKR", skills: ["Excel", "Inventory Basics", "ERP Basics", "Documentation", "Communication"], status: "completed" },
    { title: "Supply Chain Analyst", years: "1 - 3 Years", salary: "80,000 - 160,000 LKR", skills: ["Demand Forecasting", "Inventory Management", "SQL", "SAP Basics", "Supplier Coordination"], status: "completed" },
    { title: "Senior Supply Chain Analyst", years: "3 - 6 Years", salary: "165,000 - 290,000 LKR", skills: ["S&OP", "Network Optimisation", "Python / Power BI", "Logistics", "Lean / Six Sigma"], status: "current" },
    { title: "Supply Chain Manager", years: "6 - 9 Years", salary: "300,000 - 480,000 LKR", skills: ["End-to-end SCM", "Vendor Management", "Procurement Strategy", "Team Leadership", "Risk Management"], status: "future" },
    { title: "Head of Supply Chain", years: "9+ Years", salary: "500,000+ LKR", skills: ["Supply Chain Strategy", "Multi-region Operations", "Executive Reporting", "Digital SCM", "Budget Ownership"], status: "future" },
  ],

  "Procurement Specialist": [
    { title: "Procurement Intern", years: "0 - 1 Year", salary: "25,000 - 50,000 LKR", skills: ["Purchase Order Processing", "Excel", "Supplier Communication", "Documentation", "ERP Basics"], status: "completed" },
    { title: "Procurement Officer", years: "1 - 2 Years", salary: "75,000 - 140,000 LKR", skills: ["RFQ / RFP", "Supplier Evaluation", "Contract Basics", "Cost Analysis", "Inventory Coordination"], status: "completed" },
    { title: "Procurement Specialist", years: "2 - 5 Years", salary: "145,000 - 270,000 LKR", skills: ["Strategic Sourcing", "Supplier Relationship Management", "Negotiation", "Category Management", "ERP Advanced"], status: "current" },
    { title: "Senior Procurement Specialist", years: "5 - 8 Years", salary: "280,000 - 440,000 LKR", skills: ["Category Strategy", "Cost Reduction Programme", "Supplier Risk", "Contract Management", "Mentoring"], status: "future" },
    { title: "Head of Procurement", years: "8+ Years", salary: "460,000+ LKR", skills: ["Procurement Strategy", "Supplier Portfolio", "Budget Ownership", "Executive Reporting", "Hiring"], status: "future" },
  ],

  "Logistics Coordinator": [
    { title: "Logistics Intern", years: "0 - 1 Year", salary: "25,000 - 45,000 LKR", skills: ["Shipment Tracking", "Documentation", "Email Communication", "Excel", "Basic Customs Knowledge"], status: "completed" },
    { title: "Logistics Officer", years: "1 - 2 Years", salary: "65,000 - 120,000 LKR", skills: ["Freight Management", "Customs Clearance", "3PL Coordination", "Cost Tracking", "Import / Export Docs"], status: "completed" },
    { title: "Logistics Coordinator", years: "2 - 5 Years", salary: "125,000 - 230,000 LKR", skills: ["Route Optimisation", "Carrier Negotiation", "Warehouse Coordination", "KPI Reporting", "ERP / TMS"], status: "current" },
    { title: "Senior Logistics Specialist", years: "5 - 8 Years", salary: "240,000 - 390,000 LKR", skills: ["Network Design", "Multi-modal Logistics", "Vendor Management", "Compliance", "Process Improvement"], status: "future" },
    { title: "Head of Logistics", years: "8+ Years", salary: "410,000+ LKR", skills: ["Logistics Strategy", "Budget", "3PL Partnerships", "Executive Reporting", "Team Leadership", "Hiring"], status: "future" },
  ],

  "Legal Counsel": [
    { title: "Legal Intern / Trainee", years: "0 - 1 Year", salary: "30,000 - 60,000 LKR", skills: ["Legal Research", "Contract Review Basics", "Drafting Support", "Court Filing", "Communication"], status: "completed" },
    { title: "Legal Officer / Associate", years: "1 - 3 Years", salary: "100,000 - 200,000 LKR", skills: ["Contract Drafting", "Corporate Law", "Litigation Support", "Regulatory Compliance Basics", "Negotiation"], status: "completed" },
    { title: "Legal Counsel", years: "3 - 6 Years", salary: "210,000 - 400,000 LKR", skills: ["Commercial Contracts", "M&A Support", "Regulatory Affairs", "Dispute Resolution", "Client Advisory"], status: "current" },
    { title: "Senior Legal Counsel", years: "6 - 9 Years", salary: "420,000 - 650,000 LKR", skills: ["Complex Transactions", "Regulatory Strategy", "Board Reporting", "Team Leadership", "Risk Advisory"], status: "future" },
    { title: "General Counsel / Head of Legal", years: "9+ Years", salary: "680,000+ LKR", skills: ["Legal Strategy", "C-suite Advisory", "Corporate Governance", "Hiring", "Regulatory Relationships"], status: "future" },
  ],

  "Compliance Officer": [
    { title: "Compliance Intern", years: "0 - 1 Year", salary: "25,000 - 50,000 LKR", skills: ["Regulatory Research", "Documentation", "KYC Basics", "Communication", "Excel"], status: "completed" },
    { title: "Junior Compliance Officer", years: "1 - 2 Years", salary: "80,000 - 150,000 LKR", skills: ["AML / KYC", "CBSL Regulations", "Policy Review", "Training Delivery", "Reporting"], status: "completed" },
    { title: "Compliance Officer", years: "2 - 5 Years", salary: "155,000 - 290,000 LKR", skills: ["Compliance Monitoring", "Regulatory Reporting", "Policy Writing", "Risk Assessment", "Audit Support"], status: "current" },
    { title: "Senior Compliance Officer", years: "5 - 8 Years", salary: "300,000 - 480,000 LKR", skills: ["Compliance Programme", "Regulatory Engagement", "Board Reporting", "Investigation Management", "Mentoring"], status: "future" },
    { title: "Chief Compliance Officer", years: "8+ Years", salary: "500,000+ LKR", skills: ["Compliance Strategy", "Regulatory Affairs", "Executive Advisory", "Hiring", "Governance Framework"], status: "future" },
  ],

  "Intellectual Property Analyst": [
    { title: "IP Research Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Patent Search", "Trademark Basics", "Legal Research", "Documentation", "Communication"], status: "completed" },
    { title: "IP Analyst", years: "1 - 3 Years", salary: "100,000 - 190,000 LKR", skills: ["Patent Analysis", "FTO Studies", "IP Filing Support", "Competitor Monitoring", "Technical Summaries"], status: "completed" },
    { title: "Senior IP Analyst", years: "3 - 6 Years", salary: "200,000 - 370,000 LKR", skills: ["Portfolio Management", "IP Litigation Support", "Licensing", "Due Diligence", "Strategic IP Mapping"], status: "current" },
    { title: "IP Manager", years: "6 - 9 Years", salary: "380,000 - 580,000 LKR", skills: ["IP Strategy", "Prosecution Management", "Commercialisation", "Executive Advisory", "Team Leadership"], status: "future" },
    { title: "Head of IP / Chief IP Officer", years: "9+ Years", salary: "600,000+ LKR", skills: ["IP Portfolio Strategy", "Licensing Revenue", "Regulatory Engagement", "Hiring", "Executive Advisory"], status: "future" },
  ],

  "Clinical Data Analyst": [
    { title: "Clinical Data Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Excel", "SAS Basics", "Data Entry", "ICH GCP Awareness", "Documentation"], status: "completed" },
    { title: "Clinical Data Associate", years: "1 - 3 Years", salary: "90,000 - 170,000 LKR", skills: ["EDC Systems", "Data Cleaning", "Query Management", "CDASH / CDISC", "Regulatory Submissions"], status: "completed" },
    { title: "Clinical Data Analyst", years: "3 - 6 Years", salary: "175,000 - 310,000 LKR", skills: ["Statistical Programming (SAS/R)", "SDTM / ADaM", "Protocol Review", "Data Validation", "Biostatistics Basics"], status: "current" },
    { title: "Senior Clinical Data Analyst", years: "6 - 9 Years", salary: "320,000 - 500,000 LKR", skills: ["Study Leadership", "Regulatory Dossier Support", "Vendor Oversight", "Mentoring", "Data Governance"], status: "future" },
    { title: "Head of Clinical Data Management", years: "9+ Years", salary: "530,000+ LKR", skills: ["CDM Strategy", "Regulatory Affairs", "Hiring", "Executive Reporting", "Process Innovation"], status: "future" },
  ],

  "Biomedical Engineer": [
    { title: "Biomedical Engineering Intern", years: "0 - 1 Year", salary: "35,000 - 65,000 LKR", skills: ["Medical Device Basics", "Electronics", "CAD", "Safety Standards", "Documentation"], status: "completed" },
    { title: "Junior Biomedical Engineer", years: "1 - 3 Years", salary: "100,000 - 185,000 LKR", skills: ["Device Testing", "IEC 60601", "Equipment Maintenance", "Clinical Interface", "Technical Writing"], status: "completed" },
    { title: "Biomedical Engineer", years: "3 - 6 Years", salary: "190,000 - 340,000 LKR", skills: ["Design Validation", "Risk Management (ISO 14971)", "Regulatory Submissions", "Signal Processing", "Software Integration"], status: "current" },
    { title: "Senior Biomedical Engineer", years: "6 - 9 Years", salary: "350,000 - 520,000 LKR", skills: ["System Architecture", "CE / FDA Process", "Clinical Studies", "Team Leadership", "IP Development"], status: "future" },
    { title: "Biomedical Engineering Manager", years: "9+ Years", salary: "540,000+ LKR", skills: ["R&D Leadership", "Regulatory Strategy", "Hiring", "Executive Reporting", "Product Roadmap"], status: "future" },
  ],

  "Academic Researcher": [
    { title: "Research Assistant", years: "0 - 2 Years", salary: "30,000 - 70,000 LKR", skills: ["Literature Review", "Data Collection", "Academic Writing", "SPSS / R", "Research Ethics"], status: "completed" },
    { title: "Research Associate", years: "2 - 4 Years", salary: "75,000 - 140,000 LKR", skills: ["Grant Writing Support", "Experiment Design", "Data Analysis", "Publication Writing", "Conference Presentation"], status: "completed" },
    { title: "Lecturer / Research Fellow", years: "4 - 7 Years", salary: "145,000 - 270,000 LKR", skills: ["Teaching", "Research Programme Management", "Journal Publications", "Supervision", "Peer Review"], status: "current" },
    { title: "Senior Lecturer / Associate Professor", years: "7 - 12 Years", salary: "280,000 - 450,000 LKR", skills: ["Research Leadership", "Grant Management", "PhD Supervision", "Curriculum Development", "Industry Collaboration"], status: "future" },
    { title: "Professor / Head of Department", years: "12+ Years", salary: "470,000+ LKR", skills: ["Academic Strategy", "Faculty Hiring", "External Partnerships", "Policy Advisory", "Research Excellence"], status: "future" },
  ],

  "Instructional Designer": [
    { title: "ID Intern", years: "0 - 1 Year", salary: "25,000 - 50,000 LKR", skills: ["PowerPoint", "Articulate Rise Basics", "Content Structuring", "Communication", "Video Editing Basics"], status: "completed" },
    { title: "Junior Instructional Designer", years: "1 - 2 Years", salary: "65,000 - 120,000 LKR", skills: ["ADDIE Model", "Storyboarding", "Articulate 360", "LMS Basics", "Assessment Design"], status: "completed" },
    { title: "Instructional Designer", years: "2 - 5 Years", salary: "125,000 - 240,000 LKR", skills: ["Needs Analysis", "Blended Learning", "Gamification", "Accessibility", "Learner Analytics"], status: "current" },
    { title: "Senior Instructional Designer", years: "5 - 8 Years", salary: "250,000 - 400,000 LKR", skills: ["Learning Architecture", "Programme Strategy", "SME Management", "Mentoring", "ID Tool Evaluation"], status: "future" },
    { title: "Head of Instructional Design", years: "8+ Years", salary: "420,000+ LKR", skills: ["L&D Strategy", "Content Platform", "Team Leadership", "Executive Advisory", "Innovation"], status: "future" },
  ],

  "Quantity Surveyor": [
    { title: "QS Intern", years: "0 - 1 Year", salary: "35,000 - 65,000 LKR", skills: ["Measurement Basics", "AutoCAD Basics", "BOQ Preparation", "Communication", "Site Visits"], status: "completed" },
    { title: "Junior Quantity Surveyor", years: "1 - 2 Years", salary: "90,000 - 165,000 LKR", skills: ["Cost Estimation", "Contract Administration", "Tendering", "FIDIC Basics", "Interim Valuations"], status: "completed" },
    { title: "Quantity Surveyor", years: "2 - 5 Years", salary: "170,000 - 300,000 LKR", skills: ["Final Accounts", "Claims Management", "Risk Pricing", "Value Engineering", "Subcontractor Management"], status: "current" },
    { title: "Senior Quantity Surveyor", years: "5 - 8 Years", salary: "310,000 - 480,000 LKR", skills: ["Procurement Strategy", "Commercial Management", "Dispute Resolution", "Client Advisory", "Mentoring"], status: "future" },
    { title: "Commercial Manager / Head of QS", years: "8+ Years", salary: "500,000+ LKR", skills: ["Commercial Strategy", "Contract Portfolio", "Executive Reporting", "Hiring", "Governance"], status: "future" },
  ],

  "Civil Engineer": [
    { title: "Civil Engineering Intern", years: "0 - 1 Year", salary: "40,000 - 70,000 LKR", skills: ["AutoCAD", "Site Supervision", "Material Testing", "Engineering Drawing", "Safety Basics"], status: "completed" },
    { title: "Graduate Civil Engineer", years: "1 - 2 Years", salary: "85,000 - 155,000 LKR", skills: ["Structural Design Basics", "Road Design", "Drainage", "Construction Methods", "Reporting"], status: "completed" },
    { title: "Civil Engineer", years: "2 - 5 Years", salary: "160,000 - 290,000 LKR", skills: ["Project Supervision", "Structural Calculations", "STAAD Pro", "BOQ", "Client Liaison"], status: "current" },
    { title: "Senior Civil Engineer", years: "5 - 8 Years", salary: "300,000 - 480,000 LKR", skills: ["Project Management", "Contract Administration", "Design Leadership", "Mentoring", "Stakeholder Management"], status: "future" },
    { title: "Principal Engineer / Engineering Manager", years: "8+ Years", salary: "500,000+ LKR", skills: ["Technical Leadership", "Large Project Delivery", "Executive Reporting", "Hiring", "Strategic Planning"], status: "future" },
  ],

  "Startup Founder": [
    { title: "Aspiring Entrepreneur", years: "0 - 1 Year", salary: "Self-funded", skills: ["Idea Validation", "Customer Interviews", "Business Model Canvas", "Networking", "Grit"], status: "completed" },
    { title: "Founder – Pre-product", years: "1 - 2 Years", salary: "Equity + Minimal Salary", skills: ["MVP Development", "Fundraising Basics", "Team Building", "Pitch Deck", "Market Sizing"], status: "completed" },
    { title: "Founder – Early Stage", years: "2 - 4 Years", salary: "60,000 - 200,000 LKR + Equity", skills: ["Product-Market Fit", "Growth Hacking", "Financial Modelling", "Angel / Seed Fundraising", "Hiring"], status: "current" },
    { title: "Founder – Growth Stage", years: "4 - 7 Years", salary: "200,000 - 500,000 LKR + Equity", skills: ["Series A/B Fundraising", "Scaling Operations", "Executive Team Building", "Board Management", "Unit Economics"], status: "future" },
    { title: "CEO / Exited Founder", years: "7+ Years", salary: "Variable + Carried Interest", skills: ["Company Sale / IPO", "Investor Relations", "Legacy Building", "Portfolio Investing", "Mentorship"], status: "future" },
  ],

  "Venture Capital Analyst": [
    { title: "VC Intern", years: "0 - 1 Year", salary: "30,000 - 65,000 LKR", skills: ["Market Research", "Startup Evaluation", "Excel", "Memo Writing", "Deal Sourcing Basics"], status: "completed" },
    { title: "VC Analyst", years: "1 - 3 Years", salary: "120,000 - 250,000 LKR", skills: ["Deal Screening", "Financial Modelling", "Due Diligence", "Pitch Deck Review", "Portfolio Support"], status: "completed" },
    { title: "VC Associate", years: "3 - 6 Years", salary: "260,000 - 480,000 LKR", skills: ["Lead Generation", "Founder Relationships", "Term Sheet Negotiation", "Board Observation", "Fund Reporting"], status: "current" },
    { title: "Senior Associate / Principal", years: "6 - 9 Years", salary: "500,000 - 800,000 LKR", skills: ["Deal Leadership", "LP Relations", "Sector Thesis", "Co-investor Syndication", "Portfolio Value Add"], status: "future" },
    { title: "General Partner", years: "9+ Years", salary: "800,000+ LKR + Carry", skills: ["Fund Strategy", "Capital Raising", "LP Management", "Firm Building", "Exit Execution"], status: "future" },
  ],

  "Customer Success Manager": [
    { title: "CS Intern", years: "0 - 1 Year", salary: "25,000 - 50,000 LKR", skills: ["Customer Communication", "CRM Basics", "Onboarding Support", "Documentation", "Empathy"], status: "completed" },
    { title: "Customer Success Associate", years: "1 - 2 Years", salary: "70,000 - 135,000 LKR", skills: ["Onboarding", "Health Score Monitoring", "Churn Prevention", "QBR Support", "Product Knowledge"], status: "completed" },
    { title: "Customer Success Manager", years: "2 - 5 Years", salary: "140,000 - 270,000 LKR", skills: ["Renewal Management", "Expansion Revenue", "Executive Business Reviews", "Product Adoption", "Advocacy Building"], status: "current" },
    { title: "Senior CSM", years: "5 - 8 Years", salary: "280,000 - 440,000 LKR", skills: ["Strategic Account Management", "Churn Analysis", "Team Mentoring", "Executive Relationships", "Revenue Forecasting"], status: "future" },
    { title: "Head of Customer Success", years: "8+ Years", salary: "460,000+ LKR", skills: ["CS Strategy", "Retention Programme", "Hiring", "Executive Reporting", "Revenue Ownership"], status: "future" },
  ],

  "Account Manager": [
    { title: "Account Management Intern", years: "0 - 1 Year", salary: "25,000 - 50,000 LKR", skills: ["CRM Basics", "Client Communication", "Meeting Coordination", "Reporting", "Research"], status: "completed" },
    { title: "Junior Account Manager", years: "1 - 2 Years", salary: "75,000 - 145,000 LKR", skills: ["Client Relationship Management", "Upsell / Cross-sell Basics", "Contract Renewal", "Reporting", "Stakeholder Coordination"], status: "completed" },
    { title: "Account Manager", years: "2 - 5 Years", salary: "150,000 - 290,000 LKR", skills: ["Revenue Growth", "Negotiation", "Executive Relationships", "Account Planning", "Forecasting"], status: "current" },
    { title: "Senior Account Manager", years: "5 - 8 Years", salary: "300,000 - 480,000 LKR", skills: ["Enterprise Account Management", "Revenue Ownership", "Strategic Planning", "Mentoring", "Executive Presence"], status: "future" },
    { title: "Head of Account Management", years: "8+ Years", salary: "500,000+ LKR", skills: ["AM Strategy", "Team Leadership", "Revenue Targets", "Hiring", "Executive Advisory"], status: "future" },
  ],

  "Bank Teller / Customer Service Officer": [
    { title: "Banking Trainee", years: "0 - 1 Year", salary: "30,000 - 50,000 LKR", skills: ["Customer Service", "Cash Handling", "Communication", "Attention to Detail", "Banking Basics"], status: "completed" },
    { title: "Bank Teller", years: "1 - 2 Years", salary: "50,000 - 85,000 LKR", skills: ["Transaction Processing", "Forex Basics", "Vault Management", "KYC", "Compliance Basics"], status: "completed" },
    { title: "Senior Teller / Customer Service Officer", years: "2 - 4 Years", salary: "85,000 - 140,000 LKR", skills: ["Account Opening", "Loan Referrals", "Complaint Handling", "Cross-selling", "Team Coordination"], status: "current" },
    { title: "Branch Operations Supervisor", years: "4 - 7 Years", salary: "145,000 - 230,000 LKR", skills: ["Branch Operations", "Staff Supervision", "Audit Readiness", "Cash Balancing", "Reporting"], status: "future" },
    { title: "Branch Manager", years: "7 - 12 Years", salary: "240,000 - 420,000 LKR", skills: ["Branch P&L", "Business Development", "Staff Management", "Credit Decisions", "CBSL Compliance"], status: "future" },
    { title: "Regional Manager", years: "12+ Years", salary: "450,000+ LKR", skills: ["Multi-branch Oversight", "Strategic Planning", "Executive Reporting", "Hiring", "Portfolio Growth"], status: "future" },
  ],

  "Credit Analyst": [
    { title: "Credit Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Financial Statement Reading", "Excel", "Communication", "Credit Basics", "Documentation"], status: "completed" },
    { title: "Junior Credit Analyst", years: "1 - 2 Years", salary: "80,000 - 150,000 LKR", skills: ["Credit Appraisal", "Ratio Analysis", "Loan Documentation", "CRIB Checks", "Risk Scoring"], status: "completed" },
    { title: "Credit Analyst", years: "2 - 5 Years", salary: "155,000 - 280,000 LKR", skills: ["Corporate Credit Analysis", "Cash Flow Modelling", "Security Valuation", "Credit Committee Presentations", "Covenant Monitoring"], status: "current" },
    { title: "Senior Credit Analyst", years: "5 - 8 Years", salary: "290,000 - 450,000 LKR", skills: ["Portfolio Management", "Large Exposure Analysis", "Sector Research", "Mentoring", "CBSL Reporting"], status: "future" },
    { title: "Head of Credit / Chief Credit Officer", years: "8+ Years", salary: "470,000+ LKR", skills: ["Credit Policy", "Non-performing Loan Strategy", "Board Reporting", "Regulatory Affairs", "Hiring"], status: "future" },
  ],

  "Relationship Manager – Banking": [
    { title: "Relationship Banking Trainee", years: "0 - 1 Year", salary: "35,000 - 65,000 LKR", skills: ["Customer Communication", "Product Knowledge", "CRM Basics", "KYC", "Banking Regulations"], status: "completed" },
    { title: "Junior Relationship Officer", years: "1 - 2 Years", salary: "75,000 - 140,000 LKR", skills: ["CASA Acquisition", "Loan Referrals", "Client Meetings", "Cross-selling", "Portfolio Basics"], status: "completed" },
    { title: "Relationship Manager", years: "2 - 5 Years", salary: "145,000 - 280,000 LKR", skills: ["Portfolio Management", "Credit Assessment", "Trade Finance", "Treasury Products", "Business Development"], status: "current" },
    { title: "Senior Relationship Manager", years: "5 - 8 Years", salary: "290,000 - 480,000 LKR", skills: ["Corporate Banking", "Syndicated Lending", "C-suite Relationships", "Revenue Ownership", "Mentoring"], status: "future" },
    { title: "Head of Corporate / SME Banking", years: "8+ Years", salary: "500,000+ LKR", skills: ["Business Unit Strategy", "Revenue Targets", "Regulatory Compliance", "Hiring", "Executive Reporting"], status: "future" },
  ],

  "Insurance Advisor / Underwriter": [
    { title: "Insurance Trainee", years: "0 - 1 Year", salary: "25,000 - 50,000 LKR", skills: ["Product Knowledge", "Customer Communication", "Documentation", "Basic Underwriting", "Compliance Basics"], status: "completed" },
    { title: "Insurance Advisor", years: "1 - 3 Years", salary: "50,000 - 110,000 LKR", skills: ["Policy Sales", "Needs Analysis", "Claims Basics", "Client Relationship", "Premium Calculations"], status: "completed" },
    { title: "Underwriter", years: "2 - 5 Years", salary: "120,000 - 240,000 LKR", skills: ["Risk Assessment", "Policy Wordings", "Reinsurance Basics", "Loss Ratio Analysis", "Regulatory Compliance"], status: "current" },
    { title: "Senior Underwriter", years: "5 - 8 Years", salary: "250,000 - 400,000 LKR", skills: ["Complex Risk Pricing", "Treaty Reinsurance", "Portfolio Review", "Mentoring", "IRCSL Regulations"], status: "future" },
    { title: "Chief Underwriting Officer / Head of Insurance", years: "8+ Years", salary: "420,000+ LKR", skills: ["Underwriting Strategy", "Product Development", "Actuarial Collaboration", "Board Reporting", "Hiring"], status: "future" },
  ],

  "Actuarial Analyst": [
    { title: "Actuarial Intern", years: "0 - 1 Year", salary: "40,000 - 75,000 LKR", skills: ["Excel", "Probability", "Statistics", "CT1 / IFoA Exam Study", "Documentation"], status: "completed" },
    { title: "Actuarial Analyst", years: "1 - 3 Years", salary: "120,000 - 230,000 LKR", skills: ["Reserving", "Pricing Basics", "Mortality Analysis", "R / Python", "IFoA Exams Progress"], status: "completed" },
    { title: "Senior Actuarial Analyst", years: "3 - 6 Years", salary: "240,000 - 420,000 LKR", skills: ["Life / General Insurance Pricing", "Solvency II / RBC", "Stochastic Modelling", "Regulatory Submissions"], status: "current" },
    { title: "Actuarial Manager", years: "6 - 9 Years", salary: "430,000 - 650,000 LKR", skills: ["Team Leadership", "Model Governance", "Board Reporting", "Nearly / Fully Qualified Actuary", "Product Pricing"], status: "future" },
    { title: "Chief Actuary / Head of Actuarial", years: "9+ Years", salary: "680,000+ LKR", skills: ["Actuarial Strategy", "Regulatory Affairs", "Executive Advisory", "Hired Qualified Actuary", "Capital Management"], status: "future" },
  ],

  "Telecom Engineer": [
    { title: "Telecom Engineering Intern", years: "0 - 1 Year", salary: "35,000 - 65,000 LKR", skills: ["Networking Basics", "RF Basics", "Site Visits", "Documentation", "Communication"], status: "completed" },
    { title: "Junior Telecom Engineer", years: "1 - 2 Years", salary: "85,000 - 155,000 LKR", skills: ["BTS / NodeB Configuration", "Drive Testing", "Network Planning Basics", "Transmission Basics", "Alarm Management"], status: "completed" },
    { title: "Telecom Engineer", years: "2 - 5 Years", salary: "160,000 - 290,000 LKR", skills: ["4G / 5G Radio Planning", "Core Network", "OSS / BSS", "KPI Optimisation", "Vendor Management"], status: "current" },
    { title: "Senior Telecom Engineer", years: "5 - 8 Years", salary: "300,000 - 480,000 LKR", skills: ["Network Architecture", "Capacity Planning", "Technology Rollout", "SLA Management", "Mentoring"], status: "future" },
    { title: "Network Planning Manager", years: "7 - 10 Years", salary: "490,000 - 680,000 LKR", skills: ["National Network Strategy", "CapEx Planning", "Vendor Negotiations", "Executive Reporting", "Team Leadership"], status: "future" },
    { title: "VP / Head of Network", years: "10+ Years", salary: "700,000+ LKR", skills: ["Network Organisation", "5G Strategy", "Regulatory Engagement", "Board Reporting", "Hiring"], status: "future" },
  ],

  "Telecom Sales Executive": [
    { title: "Telecom Sales Intern", years: "0 - 1 Year", salary: "25,000 - 50,000 LKR", skills: ["Product Knowledge", "Customer Handling", "Communication", "CRM Basics", "Target Awareness"], status: "completed" },
    { title: "Sales Executive – Telecom", years: "1 - 2 Years", salary: "60,000 - 120,000 LKR", skills: ["B2B / B2C Sales", "Data Plans", "Fiber Broadband", "Device Sales", "Objection Handling"], status: "completed" },
    { title: "Key Account Executive", years: "2 - 5 Years", salary: "125,000 - 240,000 LKR", skills: ["Corporate Account Management", "SLA Negotiation", "Cross-selling ICT Solutions", "Revenue Growth", "Forecasting"], status: "current" },
    { title: "Senior Sales Manager", years: "5 - 8 Years", salary: "250,000 - 420,000 LKR", skills: ["Regional Sales Leadership", "Strategic Accounts", "Revenue P&L", "Mentoring", "Partner Management"], status: "future" },
    { title: "Head of Enterprise Sales", years: "8+ Years", salary: "440,000+ LKR", skills: ["National Sales Strategy", "C-suite Relationships", "Hiring", "Budget Ownership", "Executive Reporting"], status: "future" },
  ],

  "Hotel Manager": [
    { title: "Hospitality Intern / Trainee", years: "0 - 1 Year", salary: "25,000 - 45,000 LKR", skills: ["Front Office Basics", "Guest Handling", "Housekeeping Awareness", "F&B Service", "Communication"], status: "completed" },
    { title: "Front Office Officer / Guest Relations", years: "1 - 2 Years", salary: "45,000 - 85,000 LKR", skills: ["Reservation Systems", "Check-in / Check-out", "Complaint Resolution", "Upselling Rooms", "Night Audit Basics"], status: "completed" },
    { title: "Duty Manager / Shift Leader", years: "2 - 5 Years", salary: "90,000 - 170,000 LKR", skills: ["Full Hotel Operations", "VIP Handling", "Revenue Management Basics", "Staff Coordination", "Crisis Management"], status: "current" },
    { title: "Department Manager (F&B / Rooms / Revenue)", years: "5 - 8 Years", salary: "175,000 - 320,000 LKR", skills: ["Department P&L", "Revenue Management", "OTA / Channel Management", "Team Leadership", "Quality Standards"], status: "future" },
    { title: "Hotel General Manager", years: "8 - 12 Years", salary: "330,000 - 650,000 LKR", skills: ["Property P&L", "Ownership Relations", "Brand Standards", "Strategic Marketing", "Hiring"], status: "future" },
    { title: "Regional Director of Hotels", years: "12+ Years", salary: "680,000+ LKR", skills: ["Multi-property Strategy", "Investment Decisions", "Executive Reporting", "Operator Relations", "Board Advisory"], status: "future" },
  ],

  "Travel & Tourism Consultant": [
    { title: "Tourism Intern", years: "0 - 1 Year", salary: "25,000 - 45,000 LKR", skills: ["Geography Knowledge", "Customer Service", "GDS Basics (Amadeus)", "Communication", "Documentation"], status: "completed" },
    { title: "Travel Consultant", years: "1 - 3 Years", salary: "50,000 - 100,000 LKR", skills: ["Itinerary Planning", "Flight Booking", "Hotel Contracting", "Visa Assistance", "Client Management"], status: "completed" },
    { title: "Senior Travel Consultant", years: "3 - 6 Years", salary: "105,000 - 190,000 LKR", skills: ["MICE Tourism", "Corporate Travel Management", "Package Design", "Revenue Yield", "Supplier Negotiations"], status: "current" },
    { title: "Product Manager – Tourism", years: "6 - 9 Years", salary: "200,000 - 350,000 LKR", skills: ["Destination Development", "Partner Management", "Revenue Strategy", "Marketing Collaboration", "Team Leadership"], status: "future" },
    { title: "Head of Tourism / Tour Operator Director", years: "9+ Years", salary: "370,000+ LKR", skills: ["Business Strategy", "Market Expansion", "SLTDA Relations", "Hiring", "Executive Reporting"], status: "future" },
  ],

  "Chef / Culinary Professional": [
    { title: "Commis Chef / Kitchen Trainee", years: "0 - 1 Year", salary: "25,000 - 45,000 LKR", skills: ["Basic Knife Skills", "Mise en Place", "Kitchen Safety", "Hygiene Standards", "Recipe Following"], status: "completed" },
    { title: "Chef de Partie", years: "2 - 4 Years", salary: "50,000 - 95,000 LKR", skills: ["Station Management", "Menu Execution", "Food Costing Basics", "Inventory", "Team Coordination"], status: "completed" },
    { title: "Sous Chef", years: "4 - 7 Years", salary: "100,000 - 190,000 LKR", skills: ["Kitchen Operations", "Staff Training", "Menu Development", "Supplier Liaison", "Quality Control"], status: "current" },
    { title: "Head Chef / Executive Chef", years: "7 - 12 Years", salary: "200,000 - 420,000 LKR", skills: ["Menu Engineering", "Food Cost Management", "Culinary Leadership", "Brand Representation", "Hiring"], status: "future" },
    { title: "Executive Culinary Director", years: "12+ Years", salary: "440,000+ LKR", skills: ["Multi-outlet Strategy", "F&B Concept Development", "Revenue", "Celebrity / Media Engagement", "Group Culinary Standards"], status: "future" },
  ],

  "Medical Officer / General Practitioner": [
    { title: "Intern Medical Officer", years: "0 - 1 Year", salary: "50,000 - 80,000 LKR", skills: ["Clinical Examination", "Patient History", "Prescription Writing", "Emergency Response", "SLMC Registration"], status: "completed" },
    { title: "Medical Officer", years: "1 - 5 Years", salary: "85,000 - 180,000 LKR", skills: ["OPD Management", "Ward Rounds", "Referral Management", "Procedure Skills", "Clinical Documentation"], status: "completed" },
    { title: "Senior Medical Officer / Registrar", years: "5 - 8 Years", salary: "190,000 - 350,000 LKR", skills: ["Specialty Rotation", "Research", "Teaching Undergraduates", "Complex Case Management", "Leadership"], status: "current" },
    { title: "Consultant (Specialist)", years: "8 - 14 Years", salary: "360,000 - 800,000 LKR", skills: ["Specialty Expertise", "Private Practice", "Research Publication", "Training Registrars", "Clinical Governance"], status: "future" },
    { title: "Senior Consultant / HoD", years: "14+ Years", salary: "800,000+ LKR", skills: ["Department Leadership", "Policy Advisory", "Academic Research", "International Collaborations", "Institutional Governance"], status: "future" },
  ],

  "Nurse": [
    { title: "Student Nurse / Trainee", years: "0 - 1 Year", salary: "20,000 - 40,000 LKR", skills: ["Basic Nursing Care", "Vital Signs", "Medication Basics", "Patient Communication", "Infection Control"], status: "completed" },
    { title: "Staff Nurse", years: "1 - 4 Years", salary: "45,000 - 90,000 LKR", skills: ["Ward Nursing", "IV Therapy", "Patient Assessment", "Documentation", "Emergency Response"], status: "completed" },
    { title: "Senior Staff Nurse", years: "4 - 7 Years", salary: "95,000 - 160,000 LKR", skills: ["Charge Nursing", "Student Supervision", "Complex Patient Care", "Quality Audits", "Policy Compliance"], status: "current" },
    { title: "Nursing Sister / Unit Manager", years: "7 - 12 Years", salary: "165,000 - 280,000 LKR", skills: ["Unit Management", "Staffing", "Clinical Governance", "Infection Control Leadership", "Training"], status: "future" },
    { title: "Director of Nursing / Matron", years: "12+ Years", salary: "290,000+ LKR", skills: ["Nursing Organisation", "Policy Development", "Regulatory Compliance", "Executive Reporting", "Hiring"], status: "future" },
  ],

  "Pharmacist": [
    { title: "Pharmacy Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Drug Knowledge", "Dispensing Basics", "Patient Counselling Basics", "NMRA Regulations", "Documentation"], status: "completed" },
    { title: "Pharmacist", years: "1 - 4 Years", salary: "60,000 - 130,000 LKR", skills: ["Dispensing", "Drug Interaction Checking", "Patient Counselling", "Inventory Management", "Clinical Pharmacy Basics"], status: "completed" },
    { title: "Senior Pharmacist", years: "4 - 7 Years", salary: "135,000 - 240,000 LKR", skills: ["Clinical Pharmacy", "Formulary Management", "Pharmacovigilance", "Staff Training", "Quality Assurance"], status: "current" },
    { title: "Chief Pharmacist / Pharmacy Manager", years: "7 - 12 Years", salary: "250,000 - 420,000 LKR", skills: ["Department Management", "Regulatory Affairs", "Budget", "Procurement Strategy", "Policy Development"], status: "future" },
    { title: "Director of Pharmacy / Regulatory Affairs Lead", years: "12+ Years", salary: "440,000+ LKR", skills: ["National Pharmacy Standards", "NMRA Relations", "Hiring", "Executive Advisory", "Industry Leadership"], status: "future" },
  ],

  "Physiotherapist": [
    { title: "Physiotherapy Intern", years: "0 - 1 Year", salary: "25,000 - 50,000 LKR", skills: ["Basic Assessment", "Exercise Prescription Basics", "Modality Application", "Patient Communication", "Documentation"], status: "completed" },
    { title: "Physiotherapist", years: "1 - 4 Years", salary: "55,000 - 120,000 LKR", skills: ["Musculoskeletal Rehab", "Neurological Rehab", "Manual Therapy", "Sports Injuries", "Patient Education"], status: "completed" },
    { title: "Senior Physiotherapist", years: "4 - 7 Years", salary: "125,000 - 220,000 LKR", skills: ["Specialist Area (Sports / Paeds / Cardio)", "Supervision", "Research", "Outcome Measurement", "Community Outreach"], status: "current" },
    { title: "Head of Physiotherapy", years: "7+ Years", salary: "230,000+ LKR", skills: ["Department Management", "Clinical Governance", "Curriculum Development", "Executive Reporting", "Hiring"], status: "future" },
  ],

  "Medical Laboratory Scientist": [
    { title: "Lab Trainee", years: "0 - 1 Year", salary: "25,000 - 50,000 LKR", skills: ["Lab Safety", "Sample Processing", "Basic Haematology", "Documentation", "Equipment Calibration"], status: "completed" },
    { title: "Medical Laboratory Scientist", years: "1 - 4 Years", salary: "55,000 - 110,000 LKR", skills: ["Clinical Chemistry", "Microbiology", "Blood Bank", "Quality Control", "SLMTA Standards"], status: "completed" },
    { title: "Senior Lab Scientist", years: "4 - 7 Years", salary: "115,000 - 210,000 LKR", skills: ["Specialist Testing", "Method Validation", "Troubleshooting", "Staff Training", "ISO 15189"], status: "current" },
    { title: "Laboratory Manager", years: "7 - 12 Years", salary: "220,000 - 380,000 LKR", skills: ["Lab Operations", "Accreditation Management", "Budget", "Vendor Management", "Regulatory Compliance"], status: "future" },
    { title: "Director of Laboratory Services", years: "12+ Years", salary: "400,000+ LKR", skills: ["Lab Network Strategy", "Executive Reporting", "Hiring", "National Standards Advisory", "Digital Pathology"], status: "future" },
  ],

  "Radiographer": [
    { title: "Radiography Intern", years: "0 - 1 Year", salary: "25,000 - 50,000 LKR", skills: ["X-ray Basics", "Radiation Safety", "Patient Positioning", "Equipment Operation", "Documentation"], status: "completed" },
    { title: "Radiographer", years: "1 - 4 Years", salary: "55,000 - 115,000 LKR", skills: ["CT Scanning", "MRI Basics", "Ultrasound Assistance", "PACS", "Contrast Procedures"], status: "completed" },
    { title: "Senior Radiographer", years: "4 - 7 Years", salary: "120,000 - 210,000 LKR", skills: ["Specialist Modality", "Quality Assurance", "Trainee Supervision", "Radiation Protection", "Research"], status: "current" },
    { title: "Chief Radiographer / Imaging Manager", years: "7+ Years", salary: "220,000+ LKR", skills: ["Department Management", "Equipment Procurement", "Accreditation", "Budget", "Hiring"], status: "future" },
  ],

  "School Teacher": [
    { title: "Teaching Assistant / Intern", years: "0 - 1 Year", salary: "20,000 - 40,000 LKR", skills: ["Lesson Support", "Classroom Management Basics", "Subject Knowledge", "Child Communication", "NIE Basics"], status: "completed" },
    { title: "Probationary Teacher", years: "1 - 2 Years", salary: "40,000 - 70,000 LKR", skills: ["Lesson Planning", "Curriculum Delivery", "Assessment", "Classroom Management", "Parent Communication"], status: "completed" },
    { title: "Teacher (Permanent / Confirmed)", years: "2 - 7 Years", salary: "70,000 - 130,000 LKR", skills: ["Subject Mastery", "Differentiated Teaching", "Exam Preparation", "Extracurricular Leadership", "Mentoring"], status: "current" },
    { title: "Senior Teacher / Head of Department", years: "7 - 14 Years", salary: "135,000 - 220,000 LKR", skills: ["Department Leadership", "Curriculum Development", "Staff Appraisal", "Community Relations", "CPD Facilitation"], status: "future" },
    { title: "Deputy Principal / Principal", years: "14+ Years", salary: "230,000+ LKR", skills: ["School Administration", "Stakeholder Management", "Policy Development", "Budget Management", "Strategic Planning"], status: "future" },
  ],

  "University Lecturer": [
    { title: "Research / Teaching Assistant", years: "0 - 2 Years", salary: "30,000 - 65,000 LKR", skills: ["Tutorial Facilitation", "Lab Supervision", "Literature Review", "Marking", "Academic Writing"], status: "completed" },
    { title: "Instructor / Probationary Lecturer", years: "2 - 4 Years", salary: "70,000 - 130,000 LKR", skills: ["Lecture Delivery", "Module Design", "Student Assessment", "Research Initiation", "Supervision"], status: "completed" },
    { title: "Lecturer", years: "4 - 8 Years", salary: "135,000 - 240,000 LKR", skills: ["Research Publication", "Grant Applications", "Undergraduate Supervision", "Industry Engagement", "Peer Review"], status: "current" },
    { title: "Senior Lecturer", years: "8 - 13 Years", salary: "250,000 - 400,000 LKR", skills: ["Postgraduate Supervision", "Research Leadership", "Committee Service", "External Examining", "Consultancy"], status: "future" },
    { title: "Associate Professor / Professor", years: "13+ Years", salary: "420,000+ LKR", skills: ["Research Excellence", "Department Leadership", "Curriculum Governance", "National Advisory", "International Collaboration"], status: "future" },
  ],

  "Educational Counsellor": [
    { title: "Counselling Intern", years: "0 - 1 Year", salary: "25,000 - 45,000 LKR", skills: ["Active Listening", "Student Rapport", "Documentation", "Referral Basics", "Ethics & Confidentiality"], status: "completed" },
    { title: "School Counsellor", years: "1 - 4 Years", salary: "50,000 - 100,000 LKR", skills: ["Individual Counselling", "Career Guidance", "University Applications", "Mental Health Basics", "Group Facilitation"], status: "completed" },
    { title: "Senior Counsellor / Head of Guidance", years: "4 - 8 Years", salary: "105,000 - 190,000 LKR", skills: ["Counselling Programme", "Crisis Intervention", "Staff Training", "Parent Workshops", "Outcome Tracking"], status: "current" },
    { title: "Director of Student Affairs", years: "8+ Years", salary: "200,000+ LKR", skills: ["Wellbeing Strategy", "Policy Development", "Executive Reporting", "Community Partnerships", "Hiring"], status: "future" },
  ],

  "Mechanical Engineer": [
    { title: "Mechanical Engineering Intern", years: "0 - 1 Year", salary: "40,000 - 70,000 LKR", skills: ["AutoCAD", "SolidWorks Basics", "Engineering Drawing", "Material Science", "Workshop Practice"], status: "completed" },
    { title: "Junior Mechanical Engineer", years: "1 - 2 Years", salary: "85,000 - 155,000 LKR", skills: ["Machine Design", "Thermodynamics", "Manufacturing Processes", "Failure Analysis", "Technical Writing"], status: "completed" },
    { title: "Mechanical Engineer", years: "2 - 5 Years", salary: "160,000 - 290,000 LKR", skills: ["Project Engineering", "Maintenance Management", "HVAC Systems", "Vendor Coordination", "Compliance"], status: "current" },
    { title: "Senior Mechanical Engineer", years: "5 - 8 Years", salary: "300,000 - 480,000 LKR", skills: ["System Design", "CapEx Projects", "Team Leadership", "Reliability Engineering", "Mentoring"], status: "future" },
    { title: "Chief Engineer / Engineering Manager", years: "8+ Years", salary: "500,000+ LKR", skills: ["Engineering Strategy", "Budget", "Hiring", "Executive Reporting", "Plant / Factory Oversight"], status: "future" },
  ],

  "Electrical Engineer": [
    { title: "Electrical Engineering Intern", years: "0 - 1 Year", salary: "40,000 - 70,000 LKR", skills: ["Circuit Theory", "AutoCAD Electrical", "Safety Regulations", "Switchgear Basics", "Documentation"], status: "completed" },
    { title: "Junior Electrical Engineer", years: "1 - 2 Years", salary: "90,000 - 160,000 LKR", skills: ["LV / MV Systems", "Panel Design", "Power Distribution", "Motor Control", "Site Supervision"], status: "completed" },
    { title: "Electrical Engineer", years: "2 - 5 Years", salary: "165,000 - 300,000 LKR", skills: ["HV Systems", "Load Flow Analysis", "SCADA", "Protection Relay Settings", "Project Management"], status: "current" },
    { title: "Senior Electrical Engineer", years: "5 - 8 Years", salary: "310,000 - 500,000 LKR", skills: ["Substation Design", "Renewable Integration", "CapEx Budgeting", "Contractor Management", "Mentoring"], status: "future" },
    { title: "Head of Electrical Engineering", years: "8+ Years", salary: "520,000+ LKR", skills: ["Electrical Infrastructure Strategy", "CEB Relations", "Hiring", "Executive Reporting", "Energy Management"], status: "future" },
  ],

  "Production / Manufacturing Engineer": [
    { title: "Manufacturing Trainee", years: "0 - 1 Year", salary: "35,000 - 65,000 LKR", skills: ["Shop Floor Basics", "5S", "Safety", "SOP Compliance", "Quality Inspection Basics"], status: "completed" },
    { title: "Junior Production Engineer", years: "1 - 3 Years", salary: "80,000 - 150,000 LKR", skills: ["Production Planning", "Machine Operation", "Downtime Tracking", "Shift Reporting", "KPI Monitoring"], status: "completed" },
    { title: "Production Engineer", years: "3 - 6 Years", salary: "155,000 - 280,000 LKR", skills: ["Lean Manufacturing", "OEE Improvement", "Process Optimisation", "Shift Management", "ERP (SAP)"], status: "current" },
    { title: "Senior Production Engineer / Supervisor", years: "6 - 9 Years", salary: "290,000 - 460,000 LKR", skills: ["Plant Operations", "Six Sigma", "CapEx Projects", "Staff Development", "Cost Reduction"], status: "future" },
    { title: "Plant / Operations Manager", years: "9+ Years", salary: "480,000+ LKR", skills: ["Factory P&L", "Strategic Planning", "Hiring", "Executive Reporting", "Export Compliance (BOI)"], status: "future" },
  ],

  "Quality Assurance Engineer (Manufacturing)": [
    { title: "QA Technician Trainee", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Inspection Basics", "Gauges & Instruments", "SOP Documentation", "ISO 9001 Awareness", "Defect Logging"], status: "completed" },
    { title: "QA Technician / Officer", years: "1 - 3 Years", salary: "65,000 - 130,000 LKR", skills: ["In-process Inspection", "Statistical Sampling", "NCR Management", "Supplier Quality Basics", "Root Cause Analysis"], status: "completed" },
    { title: "QA Engineer", years: "3 - 6 Years", salary: "135,000 - 250,000 LKR", skills: ["ISO 9001 Internal Audit", "SPC", "FMEA", "Customer Complaint Management", "Calibration"], status: "current" },
    { title: "Senior QA Engineer / QA Manager", years: "6 - 9 Years", salary: "260,000 - 420,000 LKR", skills: ["Quality Management System", "Supplier Audits", "Corrective Action", "Team Leadership", "Customer Visits"], status: "future" },
    { title: "Head of Quality", years: "9+ Years", salary: "440,000+ LKR", skills: ["Quality Strategy", "Certification Management", "Executive Reporting", "Hiring", "Continuous Improvement Culture"], status: "future" },
  ],

  "Apparel Production Manager": [
    { title: "Trainee / IE Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Sewing Machine Basics", "Time Study", "Line Layout", "GSD Basics", "Garment Construction"], status: "completed" },
    { title: "Industrial Engineer / Production Officer", years: "1 - 3 Years", salary: "70,000 - 140,000 LKR", skills: ["SAM Calculation", "Efficiency Tracking", "Line Balancing", "WIP Management", "Quality Basics"], status: "completed" },
    { title: "Production Executive / Asst. Manager", years: "3 - 6 Years", salary: "145,000 - 270,000 LKR", skills: ["Module Management", "Lean Manufacturing", "Buyer Communication", "Style Management", "Output Targets"], status: "current" },
    { title: "Production Manager", years: "6 - 9 Years", salary: "280,000 - 480,000 LKR", skills: ["Factory Floor Leadership", "CapEx Planning", "Cost of Manufacturing", "Compliance (WRAP/SEDEX)", "Team Management"], status: "future" },
    { title: "General Manager – Manufacturing", years: "9+ Years", salary: "500,000+ LKR", skills: ["Factory P&L", "BOI Relations", "Buyer Negotiations", "Hiring", "Strategic Expansion"], status: "future" },
  ],

  "Textile Merchandiser": [
    { title: "Merchandising Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Fabric Knowledge", "T&A Basics", "Costing Basics", "Communication", "Order Tracking"], status: "completed" },
    { title: "Junior Merchandiser", years: "1 - 3 Years", salary: "70,000 - 135,000 LKR", skills: ["Buyer Communication", "Sample Coordination", "BOM Preparation", "Critical Path Management", "Sourcing Basics"], status: "completed" },
    { title: "Merchandiser", years: "3 - 6 Years", salary: "140,000 - 260,000 LKR", skills: ["Order Management", "Price Negotiation", "Quality Follow-up", "Tech Pack Reading", "Vendor Coordination"], status: "current" },
    { title: "Senior Merchandiser", years: "6 - 9 Years", salary: "270,000 - 430,000 LKR", skills: ["Buyer Account Management", "Team Leadership", "Margin Optimisation", "Product Development", "Compliance"], status: "future" },
    { title: "Head of Merchandising / Director", years: "9+ Years", salary: "450,000+ LKR", skills: ["Department Strategy", "Buyer Relationships", "Business Development", "Hiring", "Revenue Ownership"], status: "future" },
  ],

  "Freight Forwarding Executive": [
    { title: "Freight Intern", years: "0 - 1 Year", salary: "25,000 - 50,000 LKR", skills: ["Incoterms Basics", "Bill of Lading", "Shipping Documentation", "Customer Communication", "Excel"], status: "completed" },
    { title: "Freight Forwarding Executive", years: "1 - 3 Years", salary: "60,000 - 120,000 LKR", skills: ["Ocean / Air Freight", "Customs Entry", "Rate Quotation", "Carrier Booking", "Client Communication"], status: "completed" },
    { title: "Senior Freight Executive", years: "3 - 6 Years", salary: "125,000 - 230,000 LKR", skills: ["Complex Shipment Handling", "SLCAA Regulations", "Dangerous Goods", "Client Account Management", "Vendor Negotiations"], status: "current" },
    { title: "Freight Operations Manager", years: "6 - 9 Years", salary: "240,000 - 400,000 LKR", skills: ["Team Leadership", "P&L Management", "Customer Retention", "Carrier Contracts", "Compliance"], status: "future" },
    { title: "Country / Regional Director – Freight", years: "9+ Years", salary: "420,000+ LKR", skills: ["Business Strategy", "Market Expansion", "Executive Reporting", "Hiring", "International Partnerships"], status: "future" },
  ],

  "Customs Officer / Clearing Agent": [
    { title: "Customs Intern", years: "0 - 1 Year", salary: "25,000 - 45,000 LKR", skills: ["HS Code Basics", "ASYCUDA basics", "Import / Export Docs", "Communication", "Attention to Detail"], status: "completed" },
    { title: "Junior Clearing Agent", years: "1 - 2 Years", salary: "55,000 - 100,000 LKR", skills: ["Customs Declaration", "Duty Calculation", "Tariff Classification", "BOI / SL Customs Procedures", "Document Verification"], status: "completed" },
    { title: "Senior Clearing Agent", years: "2 - 5 Years", salary: "105,000 - 200,000 LKR", skills: ["Complex Tariff Classification", "Exemption Handling", "Audit Defence", "Client Advisory", "Regulatory Updates"], status: "current" },
    { title: "Customs Manager", years: "5 - 8 Years", salary: "210,000 - 360,000 LKR", skills: ["Compliance Programme", "Team Leadership", "Customs Authority Relations", "Cost Optimisation", "Risk Management"], status: "future" },
    { title: "Head of Trade Compliance", years: "8+ Years", salary: "380,000+ LKR", skills: ["Trade Strategy", "FTA Utilisation", "Executive Advisory", "Hiring", "Regulatory Engagement"], status: "future" },
  ],

  "Real Estate Agent": [
    { title: "Real Estate Intern", years: "0 - 1 Year", salary: "25,000 - 45,000 LKR", skills: ["Property Market Basics", "Client Communication", "Listing Preparation", "Site Visits", "Documentation"], status: "completed" },
    { title: "Real Estate Agent", years: "1 - 3 Years", salary: "50,000 - 150,000 LKR", skills: ["Residential Sales", "Rental Management", "Negotiation", "Property Valuation Basics", "Legal Documentation Basics"], status: "completed" },
    { title: "Senior Real Estate Agent", years: "3 - 6 Years", salary: "160,000 - 350,000 LKR", skills: ["Commercial Property", "Portfolio Management", "Client Relationship", "Market Analysis", "Developer Relations"], status: "current" },
    { title: "Real Estate Manager / Broker", years: "6 - 10 Years", salary: "360,000 - 600,000 LKR", skills: ["Agency Management", "Revenue Strategy", "Legal Compliance", "Network Development", "Team Leadership"], status: "future" },
    { title: "Director / Head of Real Estate", years: "10+ Years", salary: "630,000+ LKR", skills: ["Market Strategy", "Investment Advisory", "Hiring", "Regulatory Engagement", "Executive Reporting"], status: "future" },
  ],

  "Property Developer": [
    { title: "Property Development Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Site Analysis Basics", "AutoCAD", "Market Research", "Documentation", "Communication"], status: "completed" },
    { title: "Junior Development Executive", years: "1 - 3 Years", salary: "85,000 - 160,000 LKR", skills: ["Feasibility Studies", "Planning Applications", "Contractor Coordination", "Cost Tracking", "Legal Due Diligence"], status: "completed" },
    { title: "Development Manager", years: "3 - 7 Years", salary: "165,000 - 340,000 LKR", skills: ["End-to-end Project Delivery", "Sales Strategy", "Finance Structuring", "Stakeholder Management", "UDA / Local Authority"], status: "current" },
    { title: "Senior Development Manager", years: "7 - 11 Years", salary: "350,000 - 600,000 LKR", skills: ["Portfolio Management", "Joint Ventures", "Investor Relations", "Executive Reporting", "Strategic Land Acquisition"], status: "future" },
    { title: "Director of Property Development", years: "11+ Years", salary: "630,000+ LKR", skills: ["Development Strategy", "Capital Raising", "Board Advisory", "Hiring", "Market Expansion"], status: "future" },
  ],

  "Journalist / News Reporter": [
    { title: "Journalism Intern", years: "0 - 1 Year", salary: "20,000 - 40,000 LKR", skills: ["News Writing", "Interviewing Basics", "Research", "AP Style", "Social Media Basics"], status: "completed" },
    { title: "Junior Reporter", years: "1 - 2 Years", salary: "45,000 - 85,000 LKR", skills: ["Beat Reporting", "Breaking News", "Photography Basics", "Source Development", "Fact Checking"], status: "completed" },
    { title: "Reporter / Correspondent", years: "2 - 5 Years", salary: "90,000 - 170,000 LKR", skills: ["Investigative Journalism", "Multimedia Storytelling", "Data Journalism Basics", "Press Freedom Law", "Political Reporting"], status: "current" },
    { title: "Senior Journalist / Sub-editor", years: "5 - 8 Years", salary: "175,000 - 300,000 LKR", skills: ["Editing", "Headline Writing", "Editorial Judgement", "Mentoring", "Content Planning"], status: "future" },
    { title: "Editor / News Director", years: "8+ Years", salary: "310,000+ LKR", skills: ["Editorial Strategy", "Newsroom Leadership", "Legal Compliance", "Revenue Partnerships", "Hiring"], status: "future" },
  ],

  "Broadcast / TV Producer": [
    { title: "Production Assistant", years: "0 - 1 Year", salary: "25,000 - 45,000 LKR", skills: ["Script Research", "Studio Support", "Camera Basics", "Editing Basics", "Communication"], status: "completed" },
    { title: "Junior Producer / News Presenter", years: "1 - 3 Years", salary: "55,000 - 110,000 LKR", skills: ["Scriptwriting", "On-air Presenting", "Field Production", "Editing (Premiere)", "Social Media Distribution"], status: "completed" },
    { title: "Producer", years: "3 - 6 Years", salary: "115,000 - 220,000 LKR", skills: ["Show Production", "Guest Management", "Budget Management", "Regulatory Compliance (TRC)", "Team Coordination"], status: "current" },
    { title: "Senior Producer / Executive Producer", years: "6 - 9 Years", salary: "230,000 - 400,000 LKR", skills: ["Programme Strategy", "Ratings Management", "Advertiser Relations", "Editorial Leadership", "Mentoring"], status: "future" },
    { title: "Head of Programming / Station Manager", years: "9+ Years", salary: "420,000+ LKR", skills: ["Channel Strategy", "Licensing", "Revenue", "Hiring", "Regulatory Relations (TRC)"], status: "future" },
  ],

  "Agricultural Officer": [
    { title: "Agriculture Intern", years: "0 - 1 Year", salary: "25,000 - 45,000 LKR", skills: ["Crop Science Basics", "Field Work", "Soil Testing", "Documentation", "Farmer Communication"], status: "completed" },
    { title: "Agriculture Graduate Officer", years: "1 - 3 Years", salary: "50,000 - 95,000 LKR", skills: ["Extension Services", "Pest & Disease Management", "Irrigation Basics", "GAP Practices", "Data Collection"], status: "completed" },
    { title: "Agricultural Officer", years: "3 - 7 Years", salary: "100,000 - 190,000 LKR", skills: ["Farm Management Advisory", "Agri Input Supply Chain", "Export Crop Standards", "SPS Compliance", "Training Farmers"], status: "current" },
    { title: "Senior Agricultural Officer / Planting Manager", years: "7 - 12 Years", salary: "200,000 - 380,000 LKR", skills: ["Plantation Management", "Yield Optimisation", "Estate Operations", "Labour Management", "Export Compliance"], status: "future" },
    { title: "Director of Agriculture / Regional Director", years: "12+ Years", salary: "400,000+ LKR", skills: ["Agricultural Policy", "National Programme Leadership", "International Donors", "Executive Reporting", "Hiring"], status: "future" },
  ],

  "Tea / Plantation Manager": [
    { title: "Estate Trainee", years: "0 - 2 Years", salary: "35,000 - 65,000 LKR", skills: ["Field Supervision", "Plucking Standards", "Green Leaf Weighing", "Labour Relations Basics", "Weather Records"], status: "completed" },
    { title: "Assistant Superintendent", years: "2 - 5 Years", salary: "80,000 - 160,000 LKR", skills: ["Division Management", "Factory Basics", "Cost Control", "Worker Welfare", "Crop Improvement"], status: "completed" },
    { title: "Superintendent", years: "5 - 10 Years", salary: "165,000 - 320,000 LKR", skills: ["Estate P&L", "Tea Factory Management", "Replanting", "Export Quality", "Management Accounts"], status: "current" },
    { title: "Estate Manager / Planting Director", years: "10 - 15 Years", salary: "330,000 - 580,000 LKR", skills: ["Multi-estate Oversight", "Strategic Planning", "PAMA Relations", "Board Reporting", "Community Relations"], status: "future" },
    { title: "Group Planting Director", years: "15+ Years", salary: "600,000+ LKR", skills: ["Corporate Strategy", "Investor Relations", "Sustainability", "Hiring", "M&A"], status: "future" },
  ],

  "Sri Lanka Administrative Service (SLAS) Officer": [
    { title: "Management Trainee / Probationary Officer", years: "0 - 2 Years", salary: "45,000 - 80,000 LKR", skills: ["Public Administration", "Report Writing", "Government Procedures", "Community Relations", "Documentation"], status: "completed" },
    { title: "Executive Officer / Development Officer", years: "2 - 5 Years", salary: "80,000 - 140,000 LKR", skills: ["Policy Implementation", "Budget Monitoring", "Interagency Coordination", "Legal Frameworks", "Project Oversight"], status: "completed" },
    { title: "Assistant Director / Deputy Director", years: "5 - 10 Years", salary: "145,000 - 250,000 LKR", skills: ["Programme Management", "Policy Development", "Stakeholder Management", "Cabinet Paper Drafting", "International Coordination"], status: "current" },
    { title: "Director / Senior Director", years: "10 - 15 Years", salary: "260,000 - 420,000 LKR", skills: ["Ministry Leadership", "Budget Ownership", "Regulatory Oversight", "National Programme Design", "Parliamentary Accountability"], status: "future" },
    { title: "Secretary to a Ministry / Senior SLAS Grade", years: "15+ Years", salary: "440,000+ LKR", skills: ["Policy Direction", "Presidential Advisory", "International Negotiations", "Institutional Leadership", "Hiring"], status: "future" },
  ],

  "Customs Officer (Sri Lanka Customs)": [
    { title: "Customs Trainee", years: "0 - 2 Years", salary: "35,000 - 65,000 LKR", skills: ["Customs Law", "ASYCUDA", "Cargo Examination", "Documentation", "Tariff Basics"], status: "completed" },
    { title: "Customs Officer", years: "2 - 6 Years", salary: "70,000 - 130,000 LKR", skills: ["Valuation", "Post-clearance Audit", "Anti-smuggling", "Trade Facilitation", "Risk Assessment"], status: "completed" },
    { title: "Superintendent of Customs", years: "6 - 12 Years", salary: "135,000 - 240,000 LKR", skills: ["Unit Management", "Compliance Monitoring", "Intelligence", "WCO Standards", "Bilateral Trade"], status: "current" },
    { title: "Deputy Director General of Customs", years: "12 - 18 Years", salary: "250,000 - 420,000 LKR", skills: ["Customs Policy", "Revenue Collection Strategy", "International Agreements", "Executive Reporting"], status: "future" },
    { title: "Director General of Customs", years: "18+ Years", salary: "450,000+ LKR", skills: ["National Customs Strategy", "WCO Relations", "Parliament Reporting", "Regulatory Reform", "Trade Facilitation"], status: "future" },
  ],

  "Management Accountant": [
    { title: "Management Accounting Intern", years: "0 - 1 Year", salary: "30,000 - 55,000 LKR", skills: ["Cost Accounting Basics", "Excel", "Variance Analysis Basics", "CIMA Awareness", "Documentation"], status: "completed" },
    { title: "Junior Management Accountant", years: "1 - 2 Years", salary: "80,000 - 150,000 LKR", skills: ["Cost Centre Reporting", "Budget Monitoring", "Overheads Analysis", "CIMA Part 1", "Management Reports"], status: "completed" },
    { title: "Management Accountant", years: "2 - 5 Years", salary: "155,000 - 280,000 LKR", skills: ["Activity-based Costing", "Profitability Analysis", "Product Costing", "Business Partnering", "CIMA Qualified"], status: "current" },
    { title: "Senior Management Accountant", years: "5 - 8 Years", salary: "290,000 - 460,000 LKR", skills: ["Strategic Management Accounting", "Board Pack Preparation", "Investment Appraisal", "Team Leadership", "ERP Management"], status: "future" },
    { title: "Finance Director / CFO", years: "8+ Years", salary: "480,000+ LKR", skills: ["Corporate Finance", "Strategy", "Investor Relations", "Board Reporting", "Hiring"], status: "future" },
  ],

  "Internal Auditor": [
    { title: "Internal Audit Intern", years: "0 - 1 Year", salary: "25,000 - 50,000 LKR", skills: ["Audit Working Papers", "Risk Awareness", "Excel", "Documentation", "Communication"], status: "completed" },
    { title: "Junior Internal Auditor", years: "1 - 2 Years", salary: "70,000 - 130,000 LKR", skills: ["Risk-based Audit", "Control Testing", "Audit Reports", "COSO Framework", "Process Documentation"], status: "completed" },
    { title: "Internal Auditor", years: "2 - 5 Years", salary: "135,000 - 250,000 LKR", skills: ["Audit Planning", "IT Audit Basics", "Fraud Detection", "Governance Frameworks", "CIA Progress"], status: "current" },
    { title: "Senior Internal Auditor", years: "5 - 8 Years", salary: "260,000 - 420,000 LKR", skills: ["Audit Programme Design", "Engagement Management", "Board / AC Reporting", "Data Analytics", "CIA Qualified"], status: "future" },
    { title: "Head of Internal Audit / Chief Audit Executive", years: "8+ Years", salary: "440,000+ LKR", skills: ["Internal Audit Strategy", "Audit Committee Partnership", "Hiring", "Regulatory Compliance", "Enterprise Risk Integration"], status: "future" },
  ],

  "Development Programme Officer": [
    { title: "Programme Intern / Volunteer", years: "0 - 1 Year", salary: "15,000 - 40,000 LKR", skills: ["Community Engagement", "Report Writing", "Data Collection", "Communication", "Project Basics"], status: "completed" },
    { title: "Programme Officer", years: "1 - 3 Years", salary: "65,000 - 130,000 LKR", skills: ["Project Cycle Management", "M&E", "Beneficiary Management", "Donor Reporting", "Stakeholder Coordination"], status: "completed" },
    { title: "Senior Programme Officer", years: "3 - 6 Years", salary: "135,000 - 250,000 LKR", skills: ["Multi-project Management", "Budget Oversight", "Policy Advocacy", "Partner Management", "Log Frame"], status: "current" },
    { title: "Programme Manager", years: "6 - 9 Years", salary: "260,000 - 420,000 LKR", skills: ["Programme Strategy", "Donor Relations", "Team Leadership", "Proposal Writing", "MEAL"], status: "future" },
    { title: "Country Director / Head of Programmes", years: "9+ Years", salary: "440,000+ LKR", skills: ["Country Strategy", "Board Reporting", "Fundraising", "Hiring", "Government Relations"], status: "future" },
  ],

  "Monitoring & Evaluation (M&E) Specialist": [
    { title: "M&E Intern", years: "0 - 1 Year", salary: "20,000 - 45,000 LKR", skills: ["Data Collection", "KoBoToolbox / ODK", "Excel", "Documentation", "Community Interaction"], status: "completed" },
    { title: "M&E Officer", years: "1 - 3 Years", salary: "70,000 - 140,000 LKR", skills: ["Results Framework", "Indicator Tracking", "Quantitative Data Analysis", "Report Writing", "Field Coordination"], status: "completed" },
    { title: "M&E Specialist", years: "3 - 6 Years", salary: "145,000 - 270,000 LKR", skills: ["MEAL Framework Design", "Qualitative Research", "Impact Assessment", "Donor M&E Standards", "Capacity Building"], status: "current" },
    { title: "Senior M&E Specialist / Advisor", years: "6 - 9 Years", salary: "280,000 - 450,000 LKR", skills: ["Programme Evaluation", "Learning Systems", "Statistical Analysis (R/STATA)", "Donor Engagement", "Mentoring"], status: "future" },
    { title: "Head of MEAL / Director of Learning", years: "9+ Years", salary: "470,000+ LKR", skills: ["Organisational Learning", "Knowledge Management", "Evaluation Commissioning", "Executive Reporting", "Strategy"], status: "future" },
  ],

  "Environmental Officer": [
    { title: "Environmental Intern", years: "0 - 1 Year", salary: "25,000 - 50,000 LKR", skills: ["Environmental Impact Basics", "Field Sampling", "Documentation", "CEA Regulations Awareness", "Communication"], status: "completed" },
    { title: "Environmental Officer", years: "1 - 3 Years", salary: "65,000 - 130,000 LKR", skills: ["EIA Support", "Environmental Monitoring", "Waste Management", "CEA / Local Authority Liaison", "Regulatory Reporting"], status: "completed" },
    { title: "Senior Environmental Officer", years: "3 - 7 Years", salary: "135,000 - 250,000 LKR", skills: ["EIA Lead Author", "ISO 14001", "Audit Management", "Stakeholder Engagement", "Climate Risk Basics"], status: "current" },
    { title: "Environmental Manager", years: "7 - 11 Years", salary: "260,000 - 440,000 LKR", skills: ["Environmental Strategy", "Carbon Footprint", "Green Certification", "Executive Reporting", "Team Leadership"], status: "future" },
    { title: "Head of Sustainability / Chief Sustainability Officer", years: "11+ Years", salary: "460,000+ LKR", skills: ["ESG Strategy", "Board Reporting", "International Standards (GRI / TCFD)", "Hiring", "Regulatory Affairs"], status: "future" },
  ],
};