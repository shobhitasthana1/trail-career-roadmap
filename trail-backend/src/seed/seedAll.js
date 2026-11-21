require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');

const Skill = require('../models/Skill');
const SkillRelationship = require('../models/SkillRelationship');
const Roadmap = require('../models/Roadmap');
const Resource = require('../models/Resource');

// Canonical skills dataset
const skills = [
  // Languages
  { name: 'HTML', slug: 'html', category: 'language', aliases: ['html5'] },
  { name: 'CSS', slug: 'css', category: 'language', aliases: ['css3', 'stylesheets'] },
  { name: 'JavaScript', slug: 'javascript', category: 'language', aliases: ['js', 'es6', 'es2015', 'ecmascript', 'vanilla js'] },
  { name: 'TypeScript', slug: 'typescript', category: 'language', aliases: ['ts'] },
  { name: 'Python', slug: 'python', category: 'language', aliases: ['python3'] },
  { name: 'Java', slug: 'java', category: 'language', aliases: ['java 11', 'java 17', 'java 21', 'core java'] },
  { name: 'C#', slug: 'csharp', category: 'language', aliases: ['c sharp', 'csharp', '.net c#', 'c# .net'] },
  { name: 'Go', slug: 'go', category: 'language', aliases: ['golang'] },
  { name: 'PHP', slug: 'php', category: 'language', aliases: [] },
  { name: 'Rust', slug: 'rust', category: 'language', aliases: [] },
  { name: 'Kotlin', slug: 'kotlin', category: 'language', aliases: [] },
  { name: 'SQL', slug: 'sql', category: 'language', aliases: ['structured query language', 'pl/sql', 'plsql', 't-sql'] },

  // Frontend frameworks / libraries
  { name: 'React', slug: 'react', category: 'library', aliases: ['reactjs', 'react.js', 'react js', 'react 19'] },
  { name: 'Vue.js', slug: 'vuejs', category: 'framework', aliases: ['vue', 'vue3', 'vue.js'] },
  { name: 'Angular', slug: 'angular', category: 'framework', aliases: ['angular.js', 'angularjs', 'angular 2'] },
  { name: 'Tailwind CSS', slug: 'tailwindcss', category: 'framework', aliases: ['tailwind'] },
  { name: 'Next.js', slug: 'nextjs', category: 'framework', aliases: ['next.js', 'next js', 'next'] },
  { name: 'State Management', slug: 'state-management', category: 'concept', aliases: ['redux', 'zustand', 'recoil', 'context api'] },

  // Backend frameworks / platforms
  { name: 'Node.js', slug: 'nodejs', category: 'runtime', aliases: ['node', 'nodejs', 'node js', 'node.js'] },
  { name: 'Express.js', slug: 'expressjs', category: 'framework', aliases: ['express', 'express js', 'expressjs'] },
  { name: 'Spring Boot', slug: 'spring-boot', category: 'framework', aliases: ['spring', 'spring framework', 'spring mvc', 'spring data', 'spring cloud'] },
  { name: '.NET', slug: 'dotnet', category: 'framework', aliases: ['.net core', 'asp.net', 'asp.net core', 'dotnet', '.net 6', '.net 7', '.net 8', '.net framework'] },
  { name: 'Django', slug: 'django', category: 'framework', aliases: ['django rest framework', 'drf'] },
  { name: 'FastAPI', slug: 'fastapi', category: 'framework', aliases: [] },
  { name: 'Flask', slug: 'flask', category: 'framework', aliases: [] },
  { name: 'Laravel', slug: 'laravel', category: 'framework', aliases: [] },
  { name: 'NestJS', slug: 'nestjs', category: 'framework', aliases: ['nest.js', 'nest js'] },

  // Databases
  { name: 'MongoDB', slug: 'mongodb', category: 'database', aliases: ['mongo'] },
  { name: 'PostgreSQL', slug: 'postgresql', category: 'database', aliases: ['postgres', 'psql', 'pg'] },
  { name: 'MySQL', slug: 'mysql', category: 'database', aliases: [] },
  { name: 'Redis', slug: 'redis', category: 'database', aliases: [] },
  { name: 'Elasticsearch', slug: 'elasticsearch', category: 'database', aliases: ['elastic search', 'elastic'] },
  { name: 'Oracle', slug: 'oracle', category: 'database', aliases: ['oracle db', 'oracle database'] },
  { name: 'SQL Server', slug: 'sql-server', category: 'database', aliases: ['mssql', 'microsoft sql server', 'ms sql'] },

  // Message queues / concepts
  { name: 'Kafka', slug: 'kafka', category: 'tool', aliases: ['apache kafka', 'event streaming', 'event-driven'] },
  { name: 'RabbitMQ', slug: 'rabbitmq', category: 'tool', aliases: ['rabbit mq', 'message queue', 'amqp'] },
  { name: 'REST APIs', slug: 'rest-apis', category: 'concept', aliases: ['restful api', 'rest api', 'restful apis', 'rest', 'restful', 'rest services', 'restful web services', 'http apis', 'web services'] },
  { name: 'GraphQL', slug: 'graphql', category: 'concept', aliases: [] },
  { name: 'Microservices', slug: 'microservices', category: 'concept', aliases: ['microservice', 'micro services', 'microservices architecture', 'distributed systems'] },
  { name: 'Authentication', slug: 'authentication', category: 'concept', aliases: ['auth', 'jwt', 'oauth', 'oauth2', 'sso', 'saml'] },
  { name: 'Git', slug: 'git', category: 'tool', aliases: ['version control', 'github', 'gitlab', 'bitbucket'] },
  { name: 'Linux', slug: 'linux', category: 'tool', aliases: ['unix', 'bash', 'shell', 'shell scripting'] },

  // DevOps / Cloud
  { name: 'Docker', slug: 'docker', category: 'tool', aliases: ['containerization', 'containers', 'dockerfile'] },
  { name: 'Kubernetes', slug: 'kubernetes', category: 'tool', aliases: ['k8s', 'k8', 'kube'] },
  { name: 'AWS', slug: 'aws', category: 'cloud', aliases: ['amazon web services', 'amazon aws', 'ec2', 's3', 'lambda', 'aws lambda', 'amazon s3'] },
  { name: 'Azure', slug: 'azure', category: 'cloud', aliases: ['microsoft azure', 'azure cloud', 'azure devops', 'azure functions'] },
  { name: 'GCP', slug: 'gcp', category: 'cloud', aliases: ['google cloud', 'google cloud platform', 'gke'] },
  { name: 'CI/CD', slug: 'ci-cd', category: 'tool', aliases: ['continuous integration', 'continuous deployment', 'continuous delivery', 'github actions', 'jenkins', 'circleci', 'gitlab ci'] },
  { name: 'Terraform', slug: 'terraform', category: 'tool', aliases: ['infrastructure as code', 'iac'] },

  // Data / AI
  { name: 'Pandas', slug: 'pandas', category: 'library', aliases: [] },
  { name: 'NumPy', slug: 'numpy', category: 'library', aliases: [] },
  { name: 'Machine Learning', slug: 'machine-learning', category: 'concept', aliases: ['ml', 'deep learning', 'neural networks'] },
  { name: 'Data Visualization', slug: 'data-visualization', category: 'concept', aliases: ['matplotlib', 'seaborn', 'plotly', 'tableau', 'power bi'] },
];

const relationships = [
  ['html', 'css'],
  ['html', 'javascript'],
  ['css', 'tailwindcss'],
  ['javascript', 'typescript'],
  ['javascript', 'react'],
  ['javascript', 'vuejs'],
  ['javascript', 'angular'],
  ['javascript', 'nodejs'],
  ['nodejs', 'expressjs'],
  ['nodejs', 'nestjs'],
  ['expressjs', 'rest-apis'],
  ['nestjs', 'rest-apis'],
  ['rest-apis', 'authentication'],
  ['rest-apis', 'graphql'],
  ['rest-apis', 'microservices'],
  ['java', 'spring-boot'],
  ['spring-boot', 'rest-apis'],
  ['java', 'sql'],
  ['sql', 'sql-server'],
  ['sql', 'oracle'],
  ['csharp', 'dotnet'],
  ['dotnet', 'rest-apis'],
  ['python', 'django'],
  ['python', 'fastapi'],
  ['python', 'flask'],
  ['django', 'rest-apis'],
  ['fastapi', 'rest-apis'],
  ['flask', 'rest-apis'],
  ['python', 'pandas'],
  ['python', 'numpy'],
  ['pandas', 'machine-learning'],
  ['numpy', 'machine-learning'],
  ['pandas', 'data-visualization'],
  ['php', 'laravel'],
  ['laravel', 'rest-apis'],
  ['rest-apis', 'mongodb'],
  ['rest-apis', 'postgresql'],
  ['sql', 'postgresql'],
  ['sql', 'mysql'],
  ['rest-apis', 'redis'],
  ['rest-apis', 'elasticsearch'],
  ['microservices', 'kafka'],
  ['microservices', 'rabbitmq'],
  ['linux', 'docker'],
  ['docker', 'kubernetes'],
  ['docker', 'aws'],
  ['docker', 'azure'],
  ['docker', 'gcp'],
  ['kubernetes', 'aws'],
  ['kubernetes', 'azure'],
  ['kubernetes', 'gcp'],
  ['git', 'ci-cd'],
  ['docker', 'ci-cd'],
  ['ci-cd', 'terraform'],
];

// Prebuilt canonical roadmaps dataset
const prebuiltRoadmaps = [
  {
    role: "Frontend Developer",
    slug: "frontend-developer",
    source: "prebuilt",
    description: "Master modern client-side engineering: core foundations, component architecture, type safety, and production delivery.",
    totalSkills: 11,
    topSkills: ["React 19", "TypeScript", "Tailwind CSS", "Next.js", "State Management"],
    marketDemandAvg: "91%",
    gradient: "from-[#6D3DF5] to-[#9577F4]",
    totalJobs: 2450,
    nodes: [
      { id: "html-semantic", label: "Semantic HTML5 & Accessibility", marketDemand: "92%", stage: "Foundation", category: "language", description: "Semantic elements, ARIA standards, keyboard navigation, and screen reader compatibility." },
      { id: "css-modern", label: "Modern CSS & Flex/Grid", marketDemand: "95%", stage: "Foundation", category: "language", description: "CSS Grid, Flexbox layouts, responsive design, custom properties, and fluid typography." },
      { id: "git-version-control", label: "Git & Version Control", marketDemand: "89%", stage: "Foundation", category: "tool", description: "Branching strategies, rebasing, pull request workflows, merge conflict resolution, and GitHub Actions." },
      { id: "js-es6", label: "Modern JavaScript (ES6+)", marketDemand: "98%", stage: "Core", category: "language", description: "Async/await, closures, prototypes, event loop, Fetch API, DOM manipulation, and ES modules." },
      { id: "typescript-core", label: "TypeScript Fundamentals", marketDemand: "88%", stage: "Core", category: "language", description: "Static typing, generics, interfaces, union types, and TypeScript integration with modern tooling." },
      { id: "react-ecosystem", label: "React 19 & Component Design", marketDemand: "96%", stage: "Core", category: "library", description: "Hooks, server/client components, reconciliation, custom hooks, and memoization patterns." },
      { id: "tailwind-styling", label: "Tailwind CSS & Design Systems", marketDemand: "84%", stage: "Core", category: "framework", description: "Utility-first design tokens, responsive breakpoints, dark mode, and design system abstraction." },
      { id: "state-management", label: "State Management (Zustand)", marketDemand: "86%", stage: "Advanced", category: "concept", description: "Global stores, asynchronous state hydration, selector optimization, and client cache sync." },
      { id: "nextjs-ssr", label: "Next.js & Server Rendering", marketDemand: "91%", stage: "Advanced", category: "framework", description: "App router, SSR/SSG/ISR, streaming metadata, image optimization, and edge middleware." },
      { id: "testing-vitest", label: "Testing (Vitest & Playwright)", marketDemand: "82%", stage: "Tools & Deployment", category: "tool", description: "Unit testing components, mock service workers, and automated end-to-end user journeys." },
      { id: "web-perf-deployment", label: "Web Performance & CI/CD", marketDemand: "87%", stage: "Tools & Deployment", category: "tool", description: "Core Web Vitals, code splitting, asset compression, CDN caching, and automated deployment pipelines." },
    ],
    edges: [
      { id: "e-html-css", source: "html-semantic", target: "css-modern", type: "smoothstep" },
      { id: "e-html-js", source: "html-semantic", target: "js-es6", type: "smoothstep" },
      { id: "e-css-tailwind", source: "css-modern", target: "tailwind-styling", type: "smoothstep" },
      { id: "e-js-ts", source: "js-es6", target: "typescript-core", type: "smoothstep" },
      { id: "e-js-react", source: "js-es6", target: "react-ecosystem", type: "smoothstep" },
      { id: "e-react-state", source: "react-ecosystem", target: "state-management", type: "smoothstep" },
      { id: "e-react-next", source: "react-ecosystem", target: "nextjs-ssr", type: "smoothstep" },
      { id: "e-ts-testing", source: "typescript-core", target: "testing-vitest", type: "smoothstep" },
      { id: "e-git-deploy", source: "git-version-control", target: "web-perf-deployment", type: "smoothstep" },
      { id: "e-next-deploy", source: "nextjs-ssr", target: "web-perf-deployment", type: "smoothstep" },
    ],
  },
  {
    role: "Backend Developer",
    slug: "backend-developer",
    source: "prebuilt",
    description: "Engineer resilient server architectures, high-throughput APIs, fault-tolerant databases, and cloud services.",
    totalSkills: 13,
    topSkills: ["Node.js", "Express", "PostgreSQL", "Docker", "Authentication"],
    marketDemandAvg: "89%",
    gradient: "from-[#7C3AED] to-[#A855F7]",
    totalJobs: 3120,
    nodes: [
      { id: "http-networking", label: "HTTP/HTTPS & Network Protocols", marketDemand: "90%", stage: "Foundation", category: "concept", description: "TCP/IP, HTTP/1.1 vs HTTP/2/3, headers, status codes, WebSockets, and TLS encryption." },
      { id: "linux-cli", label: "Linux OS & Shell Scripting", marketDemand: "86%", stage: "Foundation", category: "tool", description: "Process management, file permissions, systemctl, piping, grep, bash automation, and SSH keys." },
      { id: "git-backend", label: "Git & Collaborative Workflows", marketDemand: "88%", stage: "Foundation", category: "tool", description: "Semantic versioning, release tagging, changelogs, submodules, and branch protection." },
      { id: "nodejs-runtime", label: "Node.js & Asynchronous I/O", marketDemand: "94%", stage: "Core", category: "runtime", description: "Event loop, libuv, stream buffers, cluster module, worker threads, and memory profiling." },
      { id: "express-fastify", label: "Express & Fastify Frameworks", marketDemand: "91%", stage: "Core", category: "framework", description: "Middleware pipelines, route handlers, error handling middleware, and schema validation with Zod." },
      { id: "rest-api-design", label: "RESTful API Architecture", marketDemand: "96%", stage: "Core", category: "concept", description: "Idempotency, rate limiting, pagination, JSON:API conventions, OpenAPI/Swagger specifications." },
      { id: "auth-security", label: "Authentication & Security", marketDemand: "95%", stage: "Core", category: "concept", description: "JWT access/refresh tokens, OAuth2, Bcrypt hashing, CSRF/CORS policies, and SQL injection prevention." },
      { id: "postgresql-db", label: "PostgreSQL & Relational Design", marketDemand: "93%", stage: "Database", category: "database", description: "ACID transactions, foreign keys, indexing (B-tree, GIN), query execution plans, and migrations." },
      { id: "mongodb-nosql", label: "MongoDB & Document Stores", marketDemand: "82%", stage: "Database", category: "database", description: "Document aggregation pipelines, schema validation, sharding, and replica sets." },
      { id: "redis-caching", label: "Redis Caching & Pub/Sub", marketDemand: "88%", stage: "Database", category: "database", description: "In-memory key-value caching, TTL eviction policies, distributed session locks, and pub/sub channels." },
      { id: "docker-containers", label: "Docker & Containerization", marketDemand: "92%", stage: "Advanced", category: "tool", description: "Multi-stage builds, Docker Compose, volume mounts, networking, and minimal alpine images." },
      { id: "microservices-messaging", label: "Message Queues (Kafka / RabbitMQ)", marketDemand: "85%", stage: "Advanced", category: "tool", description: "Asynchronous task workers, event-driven decoupling, consumer groups, and dead-letter queues." },
      { id: "cloud-cicd", label: "Cloud Deployment & CI/CD", marketDemand: "89%", stage: "Tools & Deployment", category: "cloud", description: "AWS EC2/ECS/S3, GitHub Actions CI pipelines, zero-downtime rolling deploys, and monitoring." },
    ],
    edges: [
      { id: "e-net-node", source: "http-networking", target: "nodejs-runtime", type: "smoothstep" },
      { id: "e-node-express", source: "nodejs-runtime", target: "express-fastify", type: "smoothstep" },
      { id: "e-express-rest", source: "express-fastify", target: "rest-api-design", type: "smoothstep" },
      { id: "e-rest-auth", source: "rest-api-design", target: "auth-security", type: "smoothstep" },
      { id: "e-rest-pg", source: "rest-api-design", target: "postgresql-db", type: "smoothstep" },
      { id: "e-rest-mongo", source: "rest-api-design", target: "mongodb-nosql", type: "smoothstep" },
      { id: "e-pg-redis", source: "postgresql-db", target: "redis-caching", type: "smoothstep" },
      { id: "e-linux-docker", source: "linux-cli", target: "docker-containers", type: "smoothstep" },
      { id: "e-auth-micro", source: "auth-security", target: "microservices-messaging", type: "smoothstep" },
      { id: "e-redis-micro", source: "redis-caching", target: "microservices-messaging", type: "smoothstep" },
      { id: "e-docker-cloud", source: "docker-containers", target: "cloud-cicd", type: "smoothstep" },
      { id: "e-git-cloud", source: "git-backend", target: "cloud-cicd", type: "smoothstep" },
    ],
  },
  {
    role: "Full Stack Developer",
    slug: "full-stack-developer",
    source: "prebuilt",
    description: "Master end-to-end web engineering from client-side reactive components to production cloud databases.",
    totalSkills: 12,
    topSkills: ["React", "Node.js", "TypeScript", "Prisma / SQL", "Next.js"],
    marketDemandAvg: "95%",
    gradient: "from-[#6D3DF5] to-[#EC4899]",
    totalJobs: 4180,
    nodes: [
      { id: "web-fundamentals", label: "Web Fundamentals (HTML/CSS)", marketDemand: "92%", stage: "Foundation", category: "language", description: "Responsive layouts, flexbox, semantic structure, browser rendering engine cycles." },
      { id: "git-cli-fs", label: "Git Version Control & CLI", marketDemand: "89%", stage: "Foundation", category: "tool", description: "Monorepo management, feature branching, interactive rebasing, pull requests." },
      { id: "js-ts-core", label: "Modern JavaScript & TypeScript", marketDemand: "97%", stage: "Core", category: "language", description: "Shared type definitions between frontend and backend, generics, async programming." },
      { id: "react-frontend", label: "React 19 & Component Systems", marketDemand: "95%", stage: "Core", category: "library", description: "Reusable component libraries, hooks, client state, Tailwind styling, optimistic UI." },
      { id: "node-backend", label: "Node.js & Express / REST", marketDemand: "93%", stage: "Core", category: "runtime", description: "Server architecture, route handling, input validation, middleware chains." },
      { id: "sql-prisma", label: "PostgreSQL & Prisma ORM", marketDemand: "91%", stage: "Database", category: "database", description: "Type-safe database queries, schema migrations, relation modeling, transactions." },
      { id: "db-cache-redis", label: "Redis Caching & Session Stores", marketDemand: "84%", stage: "Database", category: "database", description: "Distributed caching, rate limiting, pub/sub notifications, session storage." },
      { id: "nextjs-fullstack", label: "Next.js Full Stack Architecture", marketDemand: "94%", stage: "Advanced", category: "framework", description: "Server Actions, route handlers, SSR caching, parallel routes, and middleware auth." },
      { id: "fullstack-security", label: "Authentication & API Security", marketDemand: "92%", stage: "Advanced", category: "concept", description: "JWT, session cookies, OAuth social login, CSRF tokens, role-based access control." },
      { id: "docker-fs", label: "Docker Containerization", marketDemand: "88%", stage: "Tools & Deployment", category: "tool", description: "Containerizing frontend, API, and database services using Docker Compose." },
      { id: "testing-cicd", label: "Automated Testing & CI/CD", marketDemand: "86%", stage: "Tools & Deployment", category: "tool", description: "End-to-end integration tests, GitHub Actions pipeline automation, pre-commit hooks." },
      { id: "cloud-infra", label: "Production Cloud Hosting", marketDemand: "90%", stage: "Tools & Deployment", category: "cloud", description: "Vercel / AWS deployment, database connection pooling, CDN edge caching, and monitoring." },
    ],
    edges: [
      { id: "e-web-ts", source: "web-fundamentals", target: "js-ts-core", type: "smoothstep" },
      { id: "e-ts-react", source: "js-ts-core", target: "react-frontend", type: "smoothstep" },
      { id: "e-ts-node", source: "js-ts-core", target: "node-backend", type: "smoothstep" },
      { id: "e-react-next", source: "react-frontend", target: "nextjs-fullstack", type: "smoothstep" },
      { id: "e-node-next", source: "node-backend", target: "nextjs-fullstack", type: "smoothstep" },
      { id: "e-node-db", source: "node-backend", target: "sql-prisma", type: "smoothstep" },
      { id: "e-db-redis", source: "sql-prisma", target: "db-cache-redis", type: "smoothstep" },
      { id: "e-node-sec", source: "node-backend", target: "fullstack-security", type: "smoothstep" },
      { id: "e-sec-next", source: "fullstack-security", target: "nextjs-fullstack", type: "smoothstep" },
      { id: "e-git-test", source: "git-cli-fs", target: "testing-cicd", type: "smoothstep" },
      { id: "e-docker-cloud", source: "docker-fs", target: "cloud-infra", type: "smoothstep" },
      { id: "e-next-cloud", source: "nextjs-fullstack", target: "cloud-infra", type: "smoothstep" },
    ],
  },
  {
    role: "Data Analyst",
    slug: "data-analyst",
    source: "prebuilt",
    description: "Transform complex enterprise datasets into actionable business intelligence, dashboards, and storytelling.",
    totalSkills: 11,
    topSkills: ["Advanced SQL", "Python & Pandas", "Tableau / Power BI", "Data Modeling", "EDA"],
    marketDemandAvg: "87%",
    gradient: "from-[#2563EB] to-[#7C3AED]",
    totalJobs: 1980,
    nodes: [
      { id: "excel-advanced", label: "Advanced Excel & Spreadsheets", marketDemand: "85%", stage: "Foundation", category: "tool", description: "XLOOKUP, INDEX/MATCH, pivot tables, Power Query, dynamic arrays, and macro basics." },
      { id: "stats-prob", label: "Applied Statistics & Probability", marketDemand: "88%", stage: "Foundation", category: "concept", description: "Hypothesis testing, p-values, A/B testing methodology, variance, normal distributions." },
      { id: "sql-analytics", label: "SQL for Data Analysis", marketDemand: "96%", stage: "Core", category: "language", description: "Window functions (RANK, LAG, LEAD), complex JOINs, CTEs, aggregation, and subqueries." },
      { id: "python-analytics", label: "Python for Data Analysis", marketDemand: "91%", stage: "Core", category: "language", description: "Python syntax, Jupyter notebooks, virtual environments, data structures, and scripting." },
      { id: "pandas-numpy", label: "Data Wrangling with Pandas", marketDemand: "93%", stage: "Core", category: "library", description: "Dataframe manipulation, handling missing values, group-by operations, and string cleaning." },
      { id: "data-warehouse", label: "Data Warehousing (Snowflake / BigQuery)", marketDemand: "86%", stage: "Database", category: "database", description: "Columnar databases, star/snowflake schemas, dimensional modeling, and partitioning." },
      { id: "data-modeling", label: "Relational Data Modeling", marketDemand: "84%", stage: "Database", category: "concept", description: "Entity-relationship diagrams, normalization (1NF-3NF), surrogate keys, and slowly changing dimensions." },
      { id: "eda-visualization", label: "Exploratory Data Analysis (EDA)", marketDemand: "89%", stage: "Advanced", category: "concept", description: "Matplotlib & Seaborn visualizations, correlation heatmaps, outlier detection, and distribution analysis." },
      { id: "bi-dashboards", label: "Power BI & Tableau Dashboards", marketDemand: "94%", stage: "Advanced", category: "tool", description: "DAX formulas, LOD expressions, interactive drill-downs, KPI cards, and dashboard UX design." },
      { id: "storytelling-insights", label: "Executive Storytelling & Presentation", marketDemand: "87%", stage: "Advanced", category: "concept", description: "Translating technical data metrics into business revenue drivers and executive slides." },
      { id: "etl-automation", label: "ETL Pipelines & Scheduled Reports", marketDemand: "83%", stage: "Tools & Deployment", category: "tool", description: "Automated data ingestion with Python, cron scheduling, data quality checks, and alert webhooks." },
    ],
    edges: [
      { id: "e-excel-sql", source: "excel-advanced", target: "sql-analytics", type: "smoothstep" },
      { id: "e-stats-python", source: "stats-prob", target: "python-analytics", type: "smoothstep" },
      { id: "e-python-pandas", source: "python-analytics", target: "pandas-numpy", type: "smoothstep" },
      { id: "e-sql-dw", source: "sql-analytics", target: "data-warehouse", type: "smoothstep" },
      { id: "e-dw-model", source: "data-warehouse", target: "data-modeling", type: "smoothstep" },
      { id: "e-pandas-eda", source: "pandas-numpy", target: "eda-visualization", type: "smoothstep" },
      { id: "e-eda-bi", source: "eda-visualization", target: "bi-dashboards", type: "smoothstep" },
      { id: "e-dw-bi", source: "data-warehouse", target: "bi-dashboards", type: "smoothstep" },
      { id: "e-bi-story", source: "bi-dashboards", target: "storytelling-insights", type: "smoothstep" },
      { id: "e-pandas-etl", source: "pandas-numpy", target: "etl-automation", type: "smoothstep" },
    ],
  },
  {
    role: "Data Scientist",
    slug: "data-scientist",
    source: "prebuilt",
    description: "Design machine learning models, statistical inference pipelines, and neural networks for predictive systems.",
    totalSkills: 12,
    topSkills: ["PyTorch", "Supervised ML", "Feature Engineering", "Vector DBs", "MLflow"],
    marketDemandAvg: "92%",
    gradient: "from-[#9333EA] to-[#3B82F6]",
    totalJobs: 1750,
    nodes: [
      { id: "math-linear-algebra", label: "Linear Algebra & Calculus", marketDemand: "89%", stage: "Foundation", category: "concept", description: "Matrix decompositions, eigenvalues, gradients, partial derivatives, and optimization techniques." },
      { id: "python-scientific", label: "Scientific Python (NumPy / SciPy)", marketDemand: "95%", stage: "Foundation", category: "library", description: "Vectorized operations, broadcasting, numerical stability, and statistical distributions." },
      { id: "stats-inference", label: "Statistical Inference & Modeling", marketDemand: "92%", stage: "Foundation", category: "concept", description: "Bayesian vs Frequentist, regression analysis, confidence intervals, and hypothesis tests." },
      { id: "feature-engineering", label: "Feature Engineering & Preprocessing", marketDemand: "94%", stage: "Core", category: "concept", description: "Imputation, categorical encoding, feature scaling, interaction terms, and dimensionality reduction (PCA)." },
      { id: "supervised-learning", label: "Supervised ML (Scikit-Learn)", marketDemand: "96%", stage: "Core", category: "concept", description: "Random Forests, XGBoost, LightGBM, SVMs, hyperparameter tuning, and cross-validation." },
      { id: "unsupervised-learning", label: "Unsupervised ML & Clustering", marketDemand: "87%", stage: "Core", category: "concept", description: "K-Means, hierarchical clustering, DBSCAN, t-SNE, UMAP, and anomaly detection." },
      { id: "vector-dbs-sql", label: "SQL & Vector Databases", marketDemand: "90%", stage: "Database", category: "database", description: "Postgres pgvector, Pinecone, similarity search, embeddings storage, and indexing algorithms." },
      { id: "big-data-spark", label: "Big Data with Apache Spark", marketDemand: "85%", stage: "Database", category: "tool", description: "PySpark DataFrames, distributed memory partitions, and large-scale parallel computations." },
      { id: "deep-learning-pytorch", label: "Deep Learning with PyTorch", marketDemand: "94%", stage: "Advanced", category: "library", description: "Neural network architectures, autograd, backpropagation, CNNs, RNNs, and custom loss functions." },
      { id: "nlp-llms", label: "NLP & Large Language Models", marketDemand: "96%", stage: "Advanced", category: "concept", description: "Transformers, attention mechanisms, HuggingFace, fine-tuning, RAG pipelines, and prompt engineering." },
      { id: "model-evaluation", label: "Model Evaluation & Bias Auditing", marketDemand: "88%", stage: "Advanced", category: "concept", description: "ROC-AUC, Precision-Recall curves, confusion matrices, calibration, and fairness metrics." },
      { id: "mlops-deployment", label: "MLOps & Model Deployment (MLflow)", marketDemand: "91%", stage: "Tools & Deployment", category: "tool", description: "FastAPI inference microservices, Dockerization, model artifact versioning, and latency monitoring." },
    ],
    edges: [
      { id: "e-math-stats", source: "math-linear-algebra", target: "stats-inference", type: "smoothstep" },
      { id: "e-py-feat", source: "python-scientific", target: "feature-engineering", type: "smoothstep" },
      { id: "e-stats-sup", source: "stats-inference", target: "supervised-learning", type: "smoothstep" },
      { id: "e-feat-sup", source: "feature-engineering", target: "supervised-learning", type: "smoothstep" },
      { id: "e-feat-unsup", source: "feature-engineering", target: "unsupervised-learning", type: "smoothstep" },
      { id: "e-sup-eval", source: "supervised-learning", target: "model-evaluation", type: "smoothstep" },
      { id: "e-sup-pytorch", source: "supervised-learning", target: "deep-learning-pytorch", type: "smoothstep" },
      { id: "e-pytorch-nlp", source: "deep-learning-pytorch", target: "nlp-llms", type: "smoothstep" },
      { id: "e-vdb-nlp", source: "vector-dbs-sql", target: "nlp-llms", type: "smoothstep" },
      { id: "e-spark-vdb", source: "big-data-spark", target: "vector-dbs-sql", type: "smoothstep" },
      { id: "e-pytorch-mlops", source: "deep-learning-pytorch", target: "mlops-deployment", type: "smoothstep" },
      { id: "e-eval-mlops", source: "model-evaluation", target: "mlops-deployment", type: "smoothstep" },
    ],
  },
  {
    role: "DevOps Engineer",
    slug: "devops-engineer",
    source: "prebuilt",
    description: "Automate CI/CD pipelines, orchestrate Kubernetes clusters, and maintain secure cloud infrastructure.",
    totalSkills: 12,
    topSkills: ["Kubernetes", "Docker", "Terraform", "GitHub Actions", "Observability"],
    marketDemandAvg: "94%",
    gradient: "from-[#059669] to-[#7C3AED]",
    totalJobs: 2890,
    nodes: [
      { id: "linux-kernel-bash", label: "Linux Internals & Bash Scripting", marketDemand: "93%", stage: "Foundation", category: "tool", description: "Kernel parameters, systemd, crontab, process signals, bash regex, and shell security." },
      { id: "networking-security", label: "Networking & DNS / TLS Protocols", marketDemand: "91%", stage: "Foundation", category: "concept", description: "CIDR blocks, subnets, NAT gateways, DNS records, SSL/TLS certificates, and load balancing." },
      { id: "git-devops", label: "Git & GitOps Foundation", marketDemand: "89%", stage: "Foundation", category: "tool", description: "Trunk-based development, automated semantic releases, tag hooks, and signed commits." },
      { id: "docker-runtime", label: "Docker & Container Architecture", marketDemand: "97%", stage: "Core", category: "tool", description: "OCI standards, multi-stage builds, rootless containers, overlay networks, and image security scanning." },
      { id: "cicd-automation", label: "CI/CD Pipelines (GitHub Actions)", marketDemand: "95%", stage: "Core", category: "tool", description: "Automated test matrix, cache optimization, secret masking, reusable workflows, and deployment environments." },
      { id: "terraform-iac", label: "Infrastructure as Code (Terraform)", marketDemand: "94%", stage: "Core", category: "tool", description: "HCL syntax, remote state backends, lock tables, modules, plan/apply gates, and drift detection." },
      { id: "cloud-platforms", label: "Cloud Architecture (AWS / GCP)", marketDemand: "96%", stage: "Core", category: "cloud", description: "VPC architecture, IAM roles, security groups, S3 buckets, EC2 auto-scaling, and managed databases." },
      { id: "kubernetes-orchestration", label: "Kubernetes (K8s) Orchestration", marketDemand: "96%", stage: "Advanced", category: "tool", description: "Pods, Deployments, StatefulSets, Services, Ingress controllers, ConfigMaps, and ResourceQuotas." },
      { id: "gitops-argocd", label: "GitOps & Helm (ArgoCD)", marketDemand: "88%", stage: "Advanced", category: "tool", description: "Helm chart templates, declarative state reconciliation, ArgoCD sync waves, and automated rollbacks." },
      { id: "observability-monitoring", label: "Observability (Prometheus & Grafana)", marketDemand: "92%", stage: "Tools & Deployment", category: "tool", description: "Time-series metrics, PromQL queries, Alertmanager rules, Grafana dashboards, and distributed tracing." },
      { id: "secret-management", label: "Secrets & Vault Management", marketDemand: "87%", stage: "Tools & Deployment", category: "tool", description: "HashiCorp Vault, AWS Secrets Manager, KMS envelope encryption, and rotating service tokens." },
      { id: "devsecops-compliance", label: "DevSecOps & Cloud Security", marketDemand: "90%", stage: "Tools & Deployment", category: "tool", description: "Static code analysis (SonarQube), container vulnerability auditing (Trivy), and CIS benchmark hardening." },
    ],
    edges: [
      { id: "e-linux-docker", source: "linux-kernel-bash", target: "docker-runtime", type: "smoothstep" },
      { id: "e-net-k8s", source: "networking-security", target: "kubernetes-orchestration", type: "smoothstep" },
      { id: "e-git-cicd", source: "git-devops", target: "cicd-automation", type: "smoothstep" },
      { id: "e-docker-k8s", source: "docker-runtime", target: "kubernetes-orchestration", type: "smoothstep" },
      { id: "e-iac-cloud", source: "terraform-iac", target: "cloud-platforms", type: "smoothstep" },
      { id: "e-cloud-k8s", source: "cloud-platforms", target: "kubernetes-orchestration", type: "smoothstep" },
      { id: "e-k8s-argo", source: "kubernetes-orchestration", target: "gitops-argocd", type: "smoothstep" },
      { id: "e-k8s-obs", source: "kubernetes-orchestration", target: "observability-monitoring", type: "smoothstep" },
      { id: "e-cicd-argo", source: "cicd-automation", target: "gitops-argocd", type: "smoothstep" },
      { id: "e-secrets-sec", source: "secret-management", target: "devsecops-compliance", type: "smoothstep" },
      { id: "e-cloud-sec", source: "cloud-platforms", target: "devsecops-compliance", type: "smoothstep" },
    ],
  },
];

// Helper to load frontend resources
function getCuratedResources() {
  try {
    const fs = require('fs');
    const path = require('path');
    const resPath = path.join(__dirname, '../../../trail-frontend/src/data/resourcesData.js');
    if (fs.existsSync(resPath)) {
      const content = fs.readFileSync(resPath, 'utf8');
      // Simple regex extraction for resource objects
      const match = content.match(/export const RESOURCES_DATA = (\[[\s\S]*?\]);/);
      if (match) {
        // Evaluate in a sandbox
        const sandbox = {};
        const fn = new Function('sandbox', `sandbox.data = ${match[1]};`);
        fn(sandbox);
        return sandbox.data || [];
      }
    }
  } catch (err) {
    console.warn('Could not read resourcesData.js, using standard resources:', err.message);
  }
  return [];
}

async function seedAll() {
  await connectDB();
  console.log(`Connected to database: ${mongoose.connection.name}`);

  // 1. Seed Skills
  console.log('Seeding canonical skills...');
  await Skill.deleteMany({});
  const insertedSkills = await Skill.insertMany(skills);
  console.log(`  ✓ ${insertedSkills.length} skills seeded`);

  const slugToId = {};
  for (const s of insertedSkills) {
    slugToId[s.slug] = s._id;
  }

  // 2. Seed Relationships
  console.log('Seeding prerequisite relationships...');
  await SkillRelationship.deleteMany({});
  const relDocs = [];
  for (const [from, to] of relationships) {
    if (slugToId[from] && slugToId[to]) {
      relDocs.push({
        fromSkill: slugToId[from],
        toSkill: slugToId[to],
        type: 'prerequisite',
        confidence: 1.0,
        source: 'seed',
      });
    }
  }
  const insertedRels = await SkillRelationship.insertMany(relDocs);
  console.log(`  ✓ ${insertedRels.length} skill relationships seeded`);

  // 3. Seed Roadmaps
  console.log('Seeding 6 canonical roadmaps...');
  await Roadmap.deleteMany({});
  const insertedRoadmaps = await Roadmap.insertMany(prebuiltRoadmaps);
  console.log(`  ✓ ${insertedRoadmaps.length} roadmaps seeded`);

  // 4. Seed Resources
  console.log('Seeding curated learning resources...');
  await Resource.deleteMany({});
  const frontendResources = getCuratedResources();
  let resourceDocs = [];

  if (frontendResources.length > 0) {
    resourceDocs = frontendResources.map((r) => ({
      resourceId: r.id,
      title: r.title,
      provider: r.provider || '',
      url: r.url,
      description: r.description || '',
      category: r.category || 'General',
      skills: r.skills || [],
      type: r.type || 'Docs',
      difficulty: r.difficulty || 'Beginner',
      isFree: true,
    }));
  }

  // Also include base seed resources
  const baseSeedPath = path => {
    try {
      const sr = require('./seedResources');
    } catch {}
  };

  if (resourceDocs.length === 0) {
    // Fallback resources
    resourceDocs = [
      { resourceId: 'res-mdn-html', title: 'MDN Web Docs - HTML', provider: 'Mozilla', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', description: 'Comprehensive guide to HTML5', category: 'Frontend', skills: ['HTML'], type: 'Docs', difficulty: 'Beginner' },
      { resourceId: 'res-js-info', title: 'JavaScript.info', provider: 'Ilya Kantor', url: 'https://javascript.info', description: 'Modern JavaScript from basics to advanced', category: 'Frontend', skills: ['JavaScript'], type: 'Tutorial', difficulty: 'Beginner' },
      { resourceId: 'res-react-docs', title: 'React Official Documentation', provider: 'Meta', url: 'https://react.dev', description: 'The official documentation for React 19', category: 'Frontend', skills: ['React'], type: 'Docs', difficulty: 'Beginner' },
      { resourceId: 'res-node-docs', title: 'Node.js Documentation', provider: 'OpenJS Foundation', url: 'https://nodejs.org/docs', description: 'Node.js runtime documentation and APIs', category: 'Backend', skills: ['Node.js'], type: 'Docs', difficulty: 'Intermediate' },
      { resourceId: 'res-pg-tutorial', title: 'PostgreSQL Tutorial', provider: 'PostgreSQL', url: 'https://www.postgresqltutorial.com', description: 'Master relational databases with PostgreSQL', category: 'Backend', skills: ['PostgreSQL'], type: 'Tutorial', difficulty: 'Beginner' },
      { resourceId: 'res-docker-docs', title: 'Docker Documentation', provider: 'Docker', url: 'https://docs.docker.com', description: 'Containerization guide and CLI reference', category: 'DevOps', skills: ['Docker'], type: 'Docs', difficulty: 'Intermediate' },
    ];
  }

  const insertedResources = await Resource.insertMany(resourceDocs);
  console.log(`  ✓ ${insertedResources.length} curated resources seeded`);

  console.log('\n=======================================');
  console.log('Database successfully seeded with complete live data!');
  console.log('=======================================');

  await mongoose.disconnect();
}

seedAll().catch((err) => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
