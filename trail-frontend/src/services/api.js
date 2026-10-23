/**
 * TRAIL — API Service Layer (src/services/api.js)
 * 
 * Single centralized service layer for all backend communications.
 * When USE_MOCK is true, all calls return realistic mock data simulating
 * network latency and persisting progress in localStorage per user.
 * 
 * When USE_MOCK is false, calls the real Node.js/Express/MongoDB backend
 * at VITE_API_BASE_URL (http://localhost:5000/api/v1) with Bearer token authentication.
 */

export const USE_MOCK = true;

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

function getAuthHeaders() {
  const token = localStorage.getItem("trail_auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getCurrentUserId() {
  try {
    const raw = localStorage.getItem("trail_auth_user");
    if (!raw) return "guest";
    const user = JSON.parse(raw);
    return user.id || "guest";
  } catch {
    return "guest";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPLETE MOCK ROADMAP DATA FOR 6 PREBUILT ROLES
// Exact backend format: { roadmap: { role, slug, source }, nodes: [...], edges: [...] }
// ─────────────────────────────────────────────────────────────────────────────

export const PREBUILT_ROLES = [
  {
    role: "Frontend Developer",
    slug: "frontend-developer",
    description: "Architect responsive, performant user interfaces with modern React, TypeScript, and state management.",
    totalSkills: 11,
    topSkills: ["React 19", "TypeScript", "Tailwind CSS", "Next.js", "State Management"],
    marketDemandAvg: "91%",
    gradient: "from-[#6D3DF5] to-[#9577F4]",
  },
  {
    role: "Backend Developer",
    slug: "backend-developer",
    description: "Build robust, scalable APIs, microservices, secure authentication, and distributed data pipelines.",
    totalSkills: 13,
    topSkills: ["Node.js", "Express", "PostgreSQL", "Docker", "Authentication"],
    marketDemandAvg: "89%",
    gradient: "from-[#7C3AED] to-[#A855F7]",
  },
  {
    role: "Full Stack Developer",
    slug: "full-stack-developer",
    description: "Master end-to-end web engineering from client-side reactive components to production cloud databases.",
    totalSkills: 12,
    topSkills: ["React", "Node.js", "TypeScript", "Prisma / SQL", "Next.js"],
    marketDemandAvg: "95%",
    gradient: "from-[#6D3DF5] to-[#EC4899]",
  },
  {
    role: "Data Analyst",
    slug: "data-analyst",
    description: "Transform complex enterprise datasets into actionable business intelligence, dashboards, and storytelling.",
    totalSkills: 11,
    topSkills: ["Advanced SQL", "Python & Pandas", "Tableau / Power BI", "Data Modeling", "EDA"],
    marketDemandAvg: "87%",
    gradient: "from-[#2563EB] to-[#7C3AED]",
  },
  {
    role: "Data Scientist",
    slug: "data-scientist",
    description: "Design machine learning models, statistical inference pipelines, and neural networks for predictive systems.",
    totalSkills: 12,
    topSkills: ["PyTorch", "Supervised ML", "Feature Engineering", "Vector DBs", "MLflow"],
    marketDemandAvg: "92%",
    gradient: "from-[#9333EA] to-[#3B82F6]",
  },
  {
    role: "DevOps Engineer",
    slug: "devops-engineer",
    description: "Automate CI/CD pipelines, orchestrate Kubernetes clusters, and maintain secure cloud infrastructure.",
    totalSkills: 12,
    topSkills: ["Kubernetes", "Docker", "Terraform", "GitHub Actions", "Observability"],
    marketDemandAvg: "94%",
    gradient: "from-[#059669] to-[#7C3AED]",
  },
];

const MOCK_ROADMAPS = {
  "frontend-developer": {
    roadmap: {
      role: "Frontend Developer",
      slug: "frontend-developer",
      source: "verified",
      description: "Master modern client-side engineering: core foundations, component architecture, type safety, and production delivery.",
    },
    nodes: [
      {
        id: "html-semantic",
        label: "Semantic HTML5 & Accessibility",
        marketDemand: "92%",
        stage: "Foundation",
        description: "Semantic elements, ARIA standards, keyboard navigation, and screen reader compatibility.",
      },
      {
        id: "css-modern",
        label: "Modern CSS & Flex/Grid",
        marketDemand: "95%",
        stage: "Foundation",
        description: "CSS Grid, Flexbox layouts, responsive design, custom properties, and fluid typography.",
      },
      {
        id: "git-version-control",
        label: "Git & Version Control",
        marketDemand: "89%",
        stage: "Foundation",
        description: "Branching strategies, rebasing, pull request workflows, merge conflict resolution, and GitHub Actions.",
      },
      {
        id: "js-es6",
        label: "Modern JavaScript (ES6+)",
        marketDemand: "98%",
        stage: "Core",
        description: "Async/await, closures, prototypes, event loop, Fetch API, DOM manipulation, and ES modules.",
      },
      {
        id: "typescript-core",
        label: "TypeScript Fundamentals",
        marketDemand: "88%",
        stage: "Core",
        description: "Static typing, generics, interfaces, union types, and TypeScript integration with modern tooling.",
      },
      {
        id: "react-ecosystem",
        label: "React 19 & Component Design",
        marketDemand: "96%",
        stage: "Core",
        description: "Hooks, server/client components, reconciliation, custom hooks, and memoization patterns.",
      },
      {
        id: "tailwind-styling",
        label: "Tailwind CSS & Design Systems",
        marketDemand: "84%",
        stage: "Core",
        description: "Utility-first design tokens, responsive breakpoints, dark mode, and design system abstraction.",
      },
      {
        id: "state-management",
        label: "State Management (Zustand)",
        marketDemand: "86%",
        stage: "Advanced",
        description: "Global stores, asynchronous state hydration, selector optimization, and client cache sync.",
      },
      {
        id: "nextjs-ssr",
        label: "Next.js & Server Rendering",
        marketDemand: "91%",
        stage: "Advanced",
        description: "App router, SSR/SSG/ISR, streaming metadata, image optimization, and edge middleware.",
      },
      {
        id: "testing-vitest",
        label: "Testing (Vitest & Playwright)",
        marketDemand: "82%",
        stage: "Tools & Deployment",
        description: "Unit testing components, mock service workers, and automated end-to-end user journeys.",
      },
      {
        id: "web-perf-deployment",
        label: "Web Performance & CI/CD",
        marketDemand: "87%",
        stage: "Tools & Deployment",
        description: "Core Web Vitals, code splitting, asset compression, CDN caching, and automated deployment pipelines.",
      },
    ],
    edges: [
      { id: "e-html-css", source: "html-semantic", target: "css-modern" },
      { id: "e-html-js", source: "html-semantic", target: "js-es6" },
      { id: "e-css-tailwind", source: "css-modern", target: "tailwind-styling" },
      { id: "e-js-ts", source: "js-es6", target: "typescript-core" },
      { id: "e-js-react", source: "js-es6", target: "react-ecosystem" },
      { id: "e-react-state", source: "react-ecosystem", target: "state-management" },
      { id: "e-react-next", source: "react-ecosystem", target: "nextjs-ssr" },
      { id: "e-ts-testing", source: "typescript-core", target: "testing-vitest" },
      { id: "e-git-deploy", source: "git-version-control", target: "web-perf-deployment" },
      { id: "e-next-deploy", source: "nextjs-ssr", target: "web-perf-deployment" },
    ],
  },

  "backend-developer": {
    roadmap: {
      role: "Backend Developer",
      slug: "backend-developer",
      source: "verified",
      description: "Engineer resilient server architectures, high-throughput APIs, fault-tolerant databases, and cloud services.",
    },
    nodes: [
      {
        id: "http-networking",
        label: "HTTP/HTTPS & Network Protocols",
        marketDemand: "90%",
        stage: "Foundation",
        description: "TCP/IP, HTTP/1.1 vs HTTP/2/3, headers, status codes, WebSockets, and TLS encryption.",
      },
      {
        id: "linux-cli",
        label: "Linux OS & Shell Scripting",
        marketDemand: "86%",
        stage: "Foundation",
        description: "Process management, file permissions, systemctl, piping, grep, bash automation, and SSH keys.",
      },
      {
        id: "git-backend",
        label: "Git & Collaborative Workflows",
        marketDemand: "88%",
        stage: "Foundation",
        description: "Semantic versioning, release tagging, changelogs, submodules, and branch protection.",
      },
      {
        id: "nodejs-runtime",
        label: "Node.js & Asynchronous I/O",
        marketDemand: "94%",
        stage: "Core",
        description: "Event loop, libuv, stream buffers, cluster module, worker threads, and memory profiling.",
      },
      {
        id: "express-fastify",
        label: "Express & Fastify Frameworks",
        marketDemand: "91%",
        stage: "Core",
        description: "Middleware pipelines, route handlers, error handling middleware, and schema validation with Zod.",
      },
      {
        id: "rest-api-design",
        label: "RESTful API Architecture",
        marketDemand: "96%",
        stage: "Core",
        description: "Idempotency, rate limiting, pagination, JSON:API conventions, OpenAPI/Swagger specifications.",
      },
      {
        id: "auth-security",
        label: "Authentication & Security",
        marketDemand: "95%",
        stage: "Core",
        description: "JWT access/refresh tokens, OAuth2, Bcrypt hashing, CSRF/CORS policies, and SQL injection prevention.",
      },
      {
        id: "postgresql-db",
        label: "PostgreSQL & Relational Design",
        marketDemand: "93%",
        stage: "Database",
        description: "ACID transactions, foreign keys, indexing (B-tree, GIN), query execution plans, and migrations.",
      },
      {
        id: "mongodb-nosql",
        label: "MongoDB & Document Stores",
        marketDemand: "82%",
        stage: "Database",
        description: "Document aggregation pipelines, schema validation, sharding, and replica sets.",
      },
      {
        id: "redis-caching",
        label: "Redis Caching & Pub/Sub",
        marketDemand: "88%",
        stage: "Database",
        description: "In-memory key-value caching, TTL eviction policies, distributed session locks, and pub/sub channels.",
      },
      {
        id: "docker-containers",
        label: "Docker & Containerization",
        marketDemand: "92%",
        stage: "Advanced",
        description: "Multi-stage builds, Docker Compose, volume mounts, networking, and minimal alpine images.",
      },
      {
        id: "microservices-messaging",
        label: "Message Queues (Kafka / RabbitMQ)",
        marketDemand: "85%",
        stage: "Advanced",
        description: "Asynchronous task workers, event-driven decoupling, consumer groups, and dead-letter queues.",
      },
      {
        id: "cloud-cicd",
        label: "Cloud Deployment & CI/CD",
        marketDemand: "89%",
        stage: "Tools & Deployment",
        description: "AWS EC2/ECS/S3, GitHub Actions CI pipelines, zero-downtime rolling deploys, and monitoring.",
      },
    ],
    edges: [
      { id: "e-net-node", source: "http-networking", target: "nodejs-runtime" },
      { id: "e-node-express", source: "nodejs-runtime", target: "express-fastify" },
      { id: "e-express-rest", source: "express-fastify", target: "rest-api-design" },
      { id: "e-rest-auth", source: "rest-api-design", target: "auth-security" },
      { id: "e-rest-pg", source: "rest-api-design", target: "postgresql-db" },
      { id: "e-rest-mongo", source: "rest-api-design", target: "mongodb-nosql" },
      { id: "e-pg-redis", source: "postgresql-db", target: "redis-caching" },
      { id: "e-linux-docker", source: "linux-cli", target: "docker-containers" },
      { id: "e-auth-micro", source: "auth-security", target: "microservices-messaging" },
      { id: "e-redis-micro", source: "redis-caching", target: "microservices-messaging" },
      { id: "e-docker-cloud", source: "docker-containers", target: "cloud-cicd" },
      { id: "e-git-cloud", source: "git-backend", target: "cloud-cicd" },
    ],
  },

  "full-stack-developer": {
    roadmap: {
      role: "Full Stack Developer",
      slug: "full-stack-developer",
      source: "verified",
      description: "Build complete end-to-end products: responsive clients, typed backends, relational databases, and edge deployments.",
    },
    nodes: [
      {
        id: "web-fundamentals",
        label: "Web Fundamentals (HTML/CSS)",
        marketDemand: "92%",
        stage: "Foundation",
        description: "Responsive layouts, flexbox, semantic structure, browser rendering engine cycles.",
      },
      {
        id: "git-cli-fs",
        label: "Git Version Control & CLI",
        marketDemand: "89%",
        stage: "Foundation",
        description: "Monorepo management, feature branching, interactive rebasing, pull requests.",
      },
      {
        id: "js-ts-core",
        label: "Modern JavaScript & TypeScript",
        marketDemand: "97%",
        stage: "Core",
        description: "Shared type definitions between frontend and backend, generics, async programming.",
      },
      {
        id: "react-frontend",
        label: "React 19 & Component Systems",
        marketDemand: "95%",
        stage: "Core",
        description: "Reusable component libraries, hooks, client state, Tailwind styling, optimistic UI.",
      },
      {
        id: "node-backend",
        label: "Node.js & Express / REST",
        marketDemand: "93%",
        stage: "Core",
        description: "Server architecture, route handling, input validation, middleware chains.",
      },
      {
        id: "sql-prisma",
        label: "PostgreSQL & Prisma ORM",
        marketDemand: "91%",
        stage: "Database",
        description: "Type-safe database queries, schema migrations, relation modeling, transactions.",
      },
      {
        id: "db-cache-redis",
        label: "Redis Caching & Session Stores",
        marketDemand: "84%",
        stage: "Database",
        description: "Distributed caching, rate limiting, pub/sub notifications, session storage.",
      },
      {
        id: "nextjs-fullstack",
        label: "Next.js Full Stack Architecture",
        marketDemand: "94%",
        stage: "Advanced",
        description: "Server Actions, route handlers, SSR caching, parallel routes, and middleware auth.",
      },
      {
        id: "fullstack-security",
        label: "Authentication & API Security",
        marketDemand: "92%",
        stage: "Advanced",
        description: "JWT, session cookies, OAuth social login, CSRF tokens, role-based access control.",
      },
      {
        id: "docker-fs",
        label: "Docker Containerization",
        marketDemand: "88%",
        stage: "Tools & Deployment",
        description: "Containerizing frontend, API, and database services using Docker Compose.",
      },
      {
        id: "testing-cicd",
        label: "Automated Testing & CI/CD",
        marketDemand: "86%",
        stage: "Tools & Deployment",
        description: "End-to-end integration tests, GitHub Actions pipeline automation, pre-commit hooks.",
      },
      {
        id: "cloud-infra",
        label: "Production Cloud Hosting",
        marketDemand: "90%",
        stage: "Tools & Deployment",
        description: "Vercel / AWS deployment, database connection pooling, CDN edge caching, and monitoring.",
      },
    ],
    edges: [
      { id: "e-web-ts", source: "web-fundamentals", target: "js-ts-core" },
      { id: "e-ts-react", source: "js-ts-core", target: "react-frontend" },
      { id: "e-ts-node", source: "js-ts-core", target: "node-backend" },
      { id: "e-react-next", source: "react-frontend", target: "nextjs-fullstack" },
      { id: "e-node-next", source: "node-backend", target: "nextjs-fullstack" },
      { id: "e-node-db", source: "node-backend", target: "sql-prisma" },
      { id: "e-db-redis", source: "sql-prisma", target: "db-cache-redis" },
      { id: "e-node-sec", source: "node-backend", target: "fullstack-security" },
      { id: "e-sec-next", source: "fullstack-security", target: "nextjs-fullstack" },
      { id: "e-git-test", source: "git-cli-fs", target: "testing-cicd" },
      { id: "e-docker-cloud", source: "docker-fs", target: "cloud-infra" },
      { id: "e-next-cloud", source: "nextjs-fullstack", target: "cloud-infra" },
    ],
  },

  "data-analyst": {
    roadmap: {
      role: "Data Analyst",
      slug: "data-analyst",
      source: "verified",
      description: "Extract insights from raw data: query relational databases, perform exploratory analysis, and build executive dashboards.",
    },
    nodes: [
      {
        id: "excel-advanced",
        label: "Advanced Excel & Spreadsheets",
        marketDemand: "85%",
        stage: "Foundation",
        description: "XLOOKUP, INDEX/MATCH, pivot tables, Power Query, dynamic arrays, and macro basics.",
      },
      {
        id: "stats-prob",
        label: "Applied Statistics & Probability",
        marketDemand: "88%",
        stage: "Foundation",
        description: "Hypothesis testing, p-values, A/B testing methodology, variance, normal distributions.",
      },
      {
        id: "sql-analytics",
        label: "SQL for Data Analysis",
        marketDemand: "96%",
        stage: "Core",
        description: "Window functions (RANK, LAG, LEAD), complex JOINs, CTEs, aggregation, and subqueries.",
      },
      {
        id: "python-analytics",
        label: "Python for Data Analysis",
        marketDemand: "91%",
        stage: "Core",
        description: "Python syntax, Jupyter notebooks, virtual environments, data structures, and scripting.",
      },
      {
        id: "pandas-numpy",
        label: "Data Wrangling with Pandas",
        marketDemand: "93%",
        stage: "Core",
        description: "Dataframe manipulation, handling missing values, group-by operations, and string cleaning.",
      },
      {
        id: "data-warehouse",
        label: "Data Warehousing (Snowflake / BigQuery)",
        marketDemand: "86%",
        stage: "Database",
        description: "Columnar databases, star/snowflake schemas, dimensional modeling, and partitioning.",
      },
      {
        id: "data-modeling",
        label: "Relational Data Modeling",
        marketDemand: "84%",
        stage: "Database",
        description: "Entity-relationship diagrams, normalization (1NF-3NF), surrogate keys, and slowly changing dimensions.",
      },
      {
        id: "eda-visualization",
        label: "Exploratory Data Analysis (EDA)",
        marketDemand: "89%",
        stage: "Advanced",
        description: "Matplotlib & Seaborn visualizations, correlation heatmaps, outlier detection, and distribution analysis.",
      },
      {
        id: "bi-dashboards",
        label: "Power BI & Tableau Dashboards",
        marketDemand: "94%",
        stage: "Advanced",
        description: "DAX formulas, LOD expressions, interactive drill-downs, KPI cards, and dashboard UX design.",
      },
      {
        id: "storytelling-insights",
        label: "Executive Storytelling & Presentation",
        marketDemand: "87%",
        stage: "Advanced",
        description: "Translating technical data metrics into business revenue drivers and executive slides.",
      },
      {
        id: "etl-automation",
        label: "ETL Pipelines & Scheduled Reports",
        marketDemand: "83%",
        stage: "Tools & Deployment",
        description: "Automated data ingestion with Python, cron scheduling, data quality checks, and alert webhooks.",
      },
    ],
    edges: [
      { id: "e-excel-sql", source: "excel-advanced", target: "sql-analytics" },
      { id: "e-stats-python", source: "stats-prob", target: "python-analytics" },
      { id: "e-python-pandas", source: "python-analytics", target: "pandas-numpy" },
      { id: "e-sql-dw", source: "sql-analytics", target: "data-warehouse" },
      { id: "e-dw-model", source: "data-warehouse", target: "data-modeling" },
      { id: "e-pandas-eda", source: "pandas-numpy", target: "eda-visualization" },
      { id: "e-eda-bi", source: "eda-visualization", target: "bi-dashboards" },
      { id: "e-dw-bi", source: "data-warehouse", target: "bi-dashboards" },
      { id: "e-bi-story", source: "bi-dashboards", target: "storytelling-insights" },
      { id: "e-pandas-etl", source: "pandas-numpy", target: "etl-automation" },
    ],
  },

  "data-scientist": {
    roadmap: {
      role: "Data Scientist",
      slug: "data-scientist",
      source: "verified",
      description: "Harness mathematical foundations, statistical modeling, machine learning, and deep neural networks to build intelligent software.",
    },
    nodes: [
      {
        id: "math-linear-algebra",
        label: "Linear Algebra & Calculus",
        marketDemand: "89%",
        stage: "Foundation",
        description: "Matrix decompositions, eigenvalues, gradients, partial derivatives, and optimization techniques.",
      },
      {
        id: "python-scientific",
        label: "Scientific Python (NumPy / SciPy)",
        marketDemand: "95%",
        stage: "Foundation",
        description: "Vectorized operations, broadcasting, numerical stability, and statistical distributions.",
      },
      {
        id: "stats-inference",
        label: "Statistical Inference & Modeling",
        marketDemand: "92%",
        stage: "Foundation",
        description: "Bayesian vs Frequentist, regression analysis, confidence intervals, and hypothesis tests.",
      },
      {
        id: "feature-engineering",
        label: "Feature Engineering & Preprocessing",
        marketDemand: "94%",
        stage: "Core",
        description: "Imputation, categorical encoding, feature scaling, interaction terms, and dimensionality reduction (PCA).",
      },
      {
        id: "supervised-learning",
        label: "Supervised ML (Scikit-Learn)",
        marketDemand: "96%",
        stage: "Core",
        description: "Random Forests, XGBoost, LightGBM, SVMs, hyperparameter tuning, and cross-validation.",
      },
      {
        id: "unsupervised-learning",
        label: "Unsupervised ML & Clustering",
        marketDemand: "87%",
        stage: "Core",
        description: "K-Means, hierarchical clustering, DBSCAN, t-SNE, UMAP, and anomaly detection.",
      },
      {
        id: "vector-dbs-sql",
        label: "SQL & Vector Databases",
        marketDemand: "90%",
        stage: "Database",
        description: "Postgres pgvector, Pinecone, similarity search, embeddings storage, and indexing algorithms.",
      },
      {
        id: "big-data-spark",
        label: "Big Data with Apache Spark",
        marketDemand: "85%",
        stage: "Database",
        description: "PySpark DataFrames, distributed memory partitions, and large-scale parallel computations.",
      },
      {
        id: "deep-learning-pytorch",
        label: "Deep Learning with PyTorch",
        marketDemand: "94%",
        stage: "Advanced",
        description: "Neural network architectures, autograd, backpropagation, CNNs, RNNs, and custom loss functions.",
      },
      {
        id: "nlp-llms",
        label: "NLP & Large Language Models",
        marketDemand: "96%",
        stage: "Advanced",
        description: "Transformers, attention mechanisms, HuggingFace, fine-tuning, RAG pipelines, and prompt engineering.",
      },
      {
        id: "model-evaluation",
        label: "Model Evaluation & Bias Auditing",
        marketDemand: "88%",
        stage: "Advanced",
        description: "ROC-AUC, Precision-Recall curves, confusion matrices, calibration, and fairness metrics.",
      },
      {
        id: "mlops-deployment",
        label: "MLOps & Model Deployment (MLflow)",
        marketDemand: "91%",
        stage: "Tools & Deployment",
        description: "FastAPI inference microservices, Dockerization, model artifact versioning, and latency monitoring.",
      },
    ],
    edges: [
      { id: "e-math-stats", source: "math-linear-algebra", target: "stats-inference" },
      { id: "e-py-feat", source: "python-scientific", target: "feature-engineering" },
      { id: "e-stats-sup", source: "stats-inference", target: "supervised-learning" },
      { id: "e-feat-sup", source: "feature-engineering", target: "supervised-learning" },
      { id: "e-feat-unsup", source: "feature-engineering", target: "unsupervised-learning" },
      { id: "e-sup-eval", source: "supervised-learning", target: "model-evaluation" },
      { id: "e-sup-pytorch", source: "supervised-learning", target: "deep-learning-pytorch" },
      { id: "e-pytorch-nlp", source: "deep-learning-pytorch", target: "nlp-llms" },
      { id: "e-vdb-nlp", source: "vector-dbs-sql", target: "nlp-llms" },
      { id: "e-spark-vdb", source: "big-data-spark", target: "vector-dbs-sql" },
      { id: "e-pytorch-mlops", source: "deep-learning-pytorch", target: "mlops-deployment" },
      { id: "e-eval-mlops", source: "model-evaluation", target: "mlops-deployment" },
    ],
  },

  "devops-engineer": {
    roadmap: {
      role: "DevOps Engineer",
      slug: "devops-engineer",
      source: "verified",
      description: "Design automated delivery pipelines, container orchestrations, immutable infrastructure, and bulletproof production uptime.",
    },
    nodes: [
      {
        id: "linux-kernel-bash",
        label: "Linux Internals & Bash Scripting",
        marketDemand: "93%",
        stage: "Foundation",
        description: "Kernel parameters, systemd, crontab, process signals, bash regex, and shell security.",
      },
      {
        id: "networking-security",
        label: "Networking & DNS / TLS Protocols",
        marketDemand: "91%",
        stage: "Foundation",
        description: "CIDR blocks, subnets, NAT gateways, DNS records, SSL/TLS certificates, and load balancing.",
      },
      {
        id: "git-devops",
        label: "Git & GitOps Foundation",
        marketDemand: "89%",
        stage: "Foundation",
        description: "Trunk-based development, automated semantic releases, tag hooks, and signed commits.",
      },
      {
        id: "docker-runtime",
        label: "Docker & Container Architecture",
        marketDemand: "97%",
        stage: "Core",
        description: "OCI standards, multi-stage builds, rootless containers, overlay networks, and image security scanning.",
      },
      {
        id: "cicd-automation",
        label: "CI/CD Pipelines (GitHub Actions)",
        marketDemand: "95%",
        stage: "Core",
        description: "Automated test matrix, cache optimization, secret masking, reusable workflows, and deployment environments.",
      },
      {
        id: "terraform-iac",
        label: "Infrastructure as Code (Terraform)",
        marketDemand: "94%",
        stage: "Core",
        description: "HCL syntax, remote state backends, lock tables, modules, plan/apply gates, and drift detection.",
      },
      {
        id: "cloud-platforms",
        label: "Cloud Architecture (AWS / GCP)",
        marketDemand: "96%",
        stage: "Core",
        description: "VPC architecture, IAM roles, security groups, S3 buckets, EC2 auto-scaling, and managed databases.",
      },
      {
        id: "kubernetes-orchestration",
        label: "Kubernetes (K8s) Orchestration",
        marketDemand: "96%",
        stage: "Advanced",
        description: "Pods, Deployments, StatefulSets, Services, Ingress controllers, ConfigMaps, and ResourceQuotas.",
      },
      {
        id: "gitops-argocd",
        label: "GitOps & Helm (ArgoCD)",
        marketDemand: "88%",
        stage: "Advanced",
        description: "Helm chart templates, declarative state reconciliation, ArgoCD sync waves, and automated rollbacks.",
      },
      {
        id: "observability-monitoring",
        label: "Observability (Prometheus & Grafana)",
        marketDemand: "92%",
        stage: "Tools & Deployment",
        description: "Time-series metrics, PromQL queries, Alertmanager rules, Grafana dashboards, and distributed tracing.",
      },
      {
        id: "secret-management",
        label: "Secrets & Vault Management",
        marketDemand: "87%",
        stage: "Tools & Deployment",
        description: "HashiCorp Vault, AWS Secrets Manager, KMS envelope encryption, and rotating service tokens.",
      },
      {
        id: "devsecops-compliance",
        label: "DevSecOps & Cloud Security",
        marketDemand: "90%",
        stage: "Tools & Deployment",
        description: "Static code analysis (SonarQube), container vulnerability auditing (Trivy), and CIS benchmark hardening.",
      },
    ],
    edges: [
      { id: "e-linux-docker", source: "linux-kernel-bash", target: "docker-runtime" },
      { id: "e-net-k8s", source: "networking-security", target: "kubernetes-orchestration" },
      { id: "e-git-cicd", source: "git-devops", target: "cicd-automation" },
      { id: "e-docker-k8s", source: "docker-runtime", target: "kubernetes-orchestration" },
      { id: "e-iac-cloud", source: "terraform-iac", target: "cloud-platforms" },
      { id: "e-cloud-k8s", source: "cloud-platforms", target: "kubernetes-orchestration" },
      { id: "e-k8s-argo", source: "kubernetes-orchestration", target: "gitops-argocd" },
      { id: "e-k8s-obs", source: "kubernetes-orchestration", target: "observability-monitoring" },
      { id: "e-cicd-argo", source: "cicd-automation", target: "gitops-argocd" },
      { id: "e-secrets-sec", source: "secret-management", target: "devsecops-compliance" },
      { id: "e-cloud-sec", source: "cloud-platforms", target: "devsecops-compliance" },
    ],
  },
};

// Curated resources generator for skills
const MOCK_RESOURCES = {
  default: [
    {
      id: "res-1",
      title: "Comprehensive Documentation & Standard Specifications",
      type: "Documentation",
      platform: "Official Docs",
      url: "https://developer.mozilla.org",
      duration: "Reference",
    },
    {
      id: "res-2",
      title: "Interactive Full-Length Course & Hands-On Labs",
      type: "Course",
      platform: "freeCodeCamp",
      url: "https://www.freecodecamp.org",
      duration: "6 hours",
    },
    {
      id: "res-3",
      title: "Deep Dive Architecture Guide & Production Patterns",
      type: "Article",
      platform: "Dev.to & Medium",
      url: "https://github.com",
      duration: "25 min read",
    },
    {
      id: "res-4",
      title: "Complete Video Breakdown & Real-World Projects",
      type: "Video",
      platform: "YouTube",
      url: "https://www.youtube.com",
      duration: "45 mins",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LOCALSTORAGE PROGRESS HELPERS (Mock Persistence)
// ─────────────────────────────────────────────────────────────────────────────

function getProgressStorageKey() {
  const userId = getCurrentUserId();
  return `trail_user_progress_${userId}`;
}

function getJourneysStorageKey() {
  const userId = getCurrentUserId();
  return `trail_user_journeys_${userId}`;
}

function getSavedRoadmapsStorageKey() {
  const userId = getCurrentUserId();
  return `trail_saved_roadmaps_${userId}`;
}

function getStoredProgressState() {
  try {
    const raw = localStorage.getItem(getProgressStorageKey());
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredProgressState(state) {
  try {
    localStorage.setItem(getProgressStorageKey(), JSON.stringify(state));
  } catch {
    // ignore
  }
}

function getStoredJourneys() {
  try {
    const raw = localStorage.getItem(getJourneysStorageKey());
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredJourneys(list) {
  try {
    localStorage.setItem(getJourneysStorageKey(), JSON.stringify(list));
  } catch {
    // ignore
  }
}

function getStoredSavedRoadmaps() {
  try {
    const raw = localStorage.getItem(getSavedRoadmapsStorageKey());
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredSavedRoadmaps(list) {
  try {
    localStorage.setItem(getSavedRoadmapsStorageKey(), JSON.stringify(list));
  } catch {
    // ignore
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTED SERVICE FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch list of all ready-made prebuilt roadmaps
 */
export async function fetchRoadmaps() {
  if (USE_MOCK) {
    await delay(250);
    return PREBUILT_ROLES;
  }

  const res = await fetch(`${API_BASE}/roadmaps`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch roadmaps");
  return res.json();
}

/**
 * Fetch a roadmap by slug
 */
export async function fetchRoadmapBySlug(slug) {
  if (USE_MOCK) {
    await delay(350);
    const normalizedSlug = slug?.toLowerCase().trim();
    const found = MOCK_ROADMAPS[normalizedSlug];
    if (found) {
      return found;
    }

    // Try finding by role match
    const matchedRole = PREBUILT_ROLES.find(
      (r) => r.slug === normalizedSlug || r.role.toLowerCase() === normalizedSlug
    );
    if (matchedRole && MOCK_ROADMAPS[matchedRole.slug]) {
      return MOCK_ROADMAPS[matchedRole.slug];
    }

    throw new Error(`Roadmap not found for slug: ${slug}`);
  }

  const res = await fetch(`${API_BASE}/roadmaps/${slug}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Roadmap not found for slug: ${slug}`);
  return res.json();
}

/**
 * Generate or retrieve a roadmap for a given role query
 */
export async function generateRoadmap(roleName) {
  if (USE_MOCK) {
    await delay(600); // Simulate market analysis delay
    const cleanRole = (roleName || "").trim().toLowerCase();

    // Direct match against prebuilt
    const matched = PREBUILT_ROLES.find(
      (p) =>
        p.role.toLowerCase() === cleanRole ||
        cleanRole.includes(p.role.toLowerCase()) ||
        p.role.toLowerCase().includes(cleanRole) ||
        p.slug === cleanRole
    );

    if (matched && MOCK_ROADMAPS[matched.slug]) {
      return MOCK_ROADMAPS[matched.slug];
    }

    // Fallback: Generate a clean dynamic roadmap for custom queries
    const customSlug = cleanRole.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "custom-role";
    const formattedTitle = roleName
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

    const dynamicRoadmap = {
      roadmap: {
        role: formattedTitle,
        slug: customSlug,
        source: "ai-generated",
        description: `Custom generated roadmap for ${formattedTitle} based on current tech job requirements.`,
      },
      nodes: [
        {
          id: `${customSlug}-foundations`,
          label: `${formattedTitle} Foundations`,
          marketDemand: "92%",
          stage: "Foundation",
          description: `Fundamental principles, prerequisite syntax, and core toolchains required for ${formattedTitle}.`,
        },
        {
          id: `${customSlug}-git-tooling`,
          label: "Version Control & CLI Workflows",
          marketDemand: "88%",
          stage: "Foundation",
          description: "Git branching models, repository governance, command-line automation, and environment setups.",
        },
        {
          id: `${customSlug}-core-architecture`,
          label: `Core Architecture & Design`,
          marketDemand: "95%",
          stage: "Core",
          description: `Industry standard frameworks, state workflows, and component designs for ${formattedTitle}.`,
        },
        {
          id: `${customSlug}-data-apis`,
          label: "Data Schemas & API Integration",
          marketDemand: "90%",
          stage: "Database",
          description: "Data modeling, asynchronous endpoints, caching strategies, and database query optimizations.",
        },
        {
          id: `${customSlug}-advanced-patterns`,
          label: "Advanced Engineering Patterns",
          marketDemand: "89%",
          stage: "Advanced",
          description: "Performance scaling, secure session layers, architectural isolation, and error tolerance.",
        },
        {
          id: `${customSlug}-testing-deployment`,
          label: "Testing, CI/CD & Cloud Delivery",
          marketDemand: "87%",
          stage: "Tools & Deployment",
          description: "Automated test coverage, pipeline scripts, container packaging, and cloud production release.",
        },
      ],
      edges: [
        { id: `e-1`, source: `${customSlug}-foundations`, target: `${customSlug}-core-architecture` },
        { id: `e-2`, source: `${customSlug}-git-tooling`, target: `${customSlug}-core-architecture` },
        { id: `e-3`, source: `${customSlug}-core-architecture`, target: `${customSlug}-data-apis` },
        { id: `e-4`, source: `${customSlug}-data-apis`, target: `${customSlug}-advanced-patterns` },
        { id: `e-5`, source: `${customSlug}-advanced-patterns`, target: `${customSlug}-testing-deployment` },
      ],
    };

    try {
      const cached = JSON.parse(localStorage.getItem("trail_custom_roadmaps") || "{}");
      cached[customSlug] = dynamicRoadmap;
      localStorage.setItem("trail_custom_roadmaps", JSON.stringify(cached));
    } catch {
      // ignore
    }

    return dynamicRoadmap;
  }

  const res = await fetch(`${API_BASE}/roadmaps/generate`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ role: roleName }),
  });
  if (!res.ok) throw new Error("Failed to generate roadmap");
  return res.json();
}

/**
 * Check if the user has started a journey for this roadmap
 */
export async function isJourneyStarted(slug) {
  const normSlug = slug?.toLowerCase().trim();
  if (USE_MOCK) {
    const list = getStoredJourneys();
    return list.includes(normSlug);
  }

  try {
    const res = await fetch(`${API_BASE}/roadmaps/saved`, { headers: getAuthHeaders() });
    if (!res.ok) return false;
    const data = await res.json();
    return Array.isArray(data) && data.some((r) => r.slug === normSlug);
  } catch {
    return false;
  }
}

/**
 * Start a learning journey on a roadmap (adds to user's Progress)
 */
export async function startJourney(slug) {
  const normSlug = slug?.toLowerCase().trim();
  if (USE_MOCK) {
    await delay(180);
    const journeys = getStoredJourneys();
    if (!journeys.includes(normSlug)) {
      journeys.push(normSlug);
      saveStoredJourneys(journeys);
    }
    const allProgress = getStoredProgressState();
    if (!allProgress[normSlug]) {
      allProgress[normSlug] = {
        startedAt: new Date().toISOString(),
        skills: {},
      };
      saveStoredProgressState(allProgress);
    }
    return { success: true, started: true, slug: normSlug };
  }

  const res = await fetch(`${API_BASE}/roadmaps/${normSlug}/save`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to start journey");
  return res.json();
}

/**
 * Fetch all journeys started by the user with stage checklists
 */
export async function fetchMyJourneys() {
  if (USE_MOCK) {
    await delay(200);
    const journeys = getStoredJourneys();
    const allProgress = getStoredProgressState();
    const savedSlugs = getStoredSavedRoadmaps();
    const result = [];

    for (const slug of journeys) {
      let rData = MOCK_ROADMAPS[slug];
      if (!rData) {
        try {
          const cached = JSON.parse(localStorage.getItem("trail_custom_roadmaps") || "{}");
          rData = cached[slug];
        } catch {
          // ignore
        }
      }
      if (!rData) {
        const p = PREBUILT_ROLES.find((x) => x.slug === slug);
        if (p) rData = MOCK_ROADMAPS[p.slug];
      }

      if (rData) {
        const totalNodes = rData.nodes.length;
        const skillsMap = allProgress[slug]?.skills || {};
        let completedCount = 0;
        let inProgressCount = 0;

        const enrichedNodes = rData.nodes.map((node) => {
          const st = skillsMap[node.id] || "not-started";
          if (st === "completed") completedCount++;
          else if (st === "in-progress") inProgressCount++;
          return {
            ...node,
            status: st,
          };
        });

        const stagesMap = {};
        enrichedNodes.forEach((node) => {
          const stg = node.stage || "Core";
          if (!stagesMap[stg]) stagesMap[stg] = [];
          stagesMap[stg].push(node);
        });

        const stagesList = Object.keys(stagesMap).map((stgName) => ({
          name: stgName,
          skills: stagesMap[stgName],
          total: stagesMap[stgName].length,
          completed: stagesMap[stgName].filter((s) => s.status === "completed").length,
        }));

        const progressPct = totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0;

        result.push({
          slug,
          role: rData.roadmap.role,
          description: rData.roadmap.description,
          totalSkills: totalNodes,
          completedCount,
          inProgressCount,
          notStartedCount: Math.max(0, totalNodes - completedCount - inProgressCount),
          progressPct,
          nodes: enrichedNodes,
          stages: stagesList,
          isSaved: savedSlugs.includes(slug),
          startedAt: allProgress[slug]?.startedAt || null,
        });
      }
    }

    return result;
  }

  const res = await fetch(`${API_BASE}/roadmaps/saved`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch journeys");
  return res.json();
}

/**
 * Fetch user progress for a specific roadmap
 */
export async function fetchProgress(roadmapSlug) {
  if (USE_MOCK) {
    await delay(150);
    const normalizedSlug = roadmapSlug?.toLowerCase().trim();
    const allProgress = getStoredProgressState();
    const userRoadmapProgress = allProgress[normalizedSlug] || { skills: {} };

    // Get nodes of this roadmap to calculate counts
    let roadmapData = MOCK_ROADMAPS[normalizedSlug];
    if (!roadmapData) {
      try {
        const cached = JSON.parse(localStorage.getItem("trail_custom_roadmaps") || "{}");
        roadmapData = cached[normalizedSlug];
      } catch {
        // ignore
      }
    }

    const totalNodes = roadmapData?.nodes?.length || 10;
    const skillsMap = userRoadmapProgress.skills || {};

    const completed = [];
    const inProgress = [];
    const notStarted = [];

    if (roadmapData?.nodes) {
      roadmapData.nodes.forEach((n) => {
        const status = skillsMap[n.id] || "not-started";
        if (status === "completed") completed.push(n.id);
        else if (status === "in-progress") inProgress.push(n.id);
        else notStarted.push(n.id);
      });
    }

    const completedCount = completed.length;
    const progressPct = totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0;

    return {
      roadmapSlug: normalizedSlug,
      progressPct,
      completedSkills: completed,
      inProgressSkills: inProgress,
      notStartedSkills: notStarted,
      totalSkills: totalNodes,
      skillsMap,
    };
  }

  const res = await fetch(`${API_BASE}/progress/${roadmapSlug}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch progress for ${roadmapSlug}`);
  return res.json();
}

/**
 * Update a skill's status in a roadmap
 * status: 'not-started' | 'in-progress' | 'completed'
 */
export async function updateSkillStatus(roadmapSlug, skillId, status) {
  if (USE_MOCK) {
    await delay(180);
    const normalizedSlug = roadmapSlug?.toLowerCase().trim();
    const allProgress = getStoredProgressState();
    if (!allProgress[normalizedSlug]) {
      allProgress[normalizedSlug] = {
        startedAt: new Date().toISOString(),
        skills: {},
      };
    }
    allProgress[normalizedSlug].skills = allProgress[normalizedSlug].skills || {};
    allProgress[normalizedSlug].skills[skillId] = status;
    allProgress[normalizedSlug].lastUpdated = new Date().toISOString();
    saveStoredProgressState(allProgress);

    // Ensure it's in journeys if user marked a skill
    const journeys = getStoredJourneys();
    if (!journeys.includes(normalizedSlug)) {
      journeys.push(normalizedSlug);
      saveStoredJourneys(journeys);
    }

    return fetchProgress(normalizedSlug);
  }

  const res = await fetch(`${API_BASE}/progress/${roadmapSlug}/skills/${skillId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update skill status");
  return res.json();
}

/**
 * Fetch all roadmaps that the user has interacted with or saved
 */
export async function fetchUserExploreActivity() {
  return fetchMyJourneys();
}

/**
 * Save a roadmap to user profile (bookmark)
 */
export async function saveRoadmap(slug) {
  if (USE_MOCK) {
    await delay(180);
    const list = getStoredSavedRoadmaps();
    if (!list.includes(slug)) {
      list.push(slug);
      saveStoredSavedRoadmaps(list);
    }
    return { success: true, saved: true, slug };
  }

  const res = await fetch(`${API_BASE}/roadmaps/${slug}/save`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to save roadmap");
  return res.json();
}

/**
 * Unsave a roadmap
 */
export async function unsaveRoadmap(slug) {
  if (USE_MOCK) {
    await delay(150);
    let list = getStoredSavedRoadmaps();
    list = list.filter((s) => s !== slug);
    saveStoredSavedRoadmaps(list);
    return { success: true, saved: false, slug };
  }

  const res = await fetch(`${API_BASE}/roadmaps/${slug}/save`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to unsave roadmap");
  return res.json();
}

/**
 * Check if a roadmap is currently saved
 */
export async function isRoadmapSaved(slug) {
  if (USE_MOCK) {
    const list = getStoredSavedRoadmaps();
    return list.includes(slug);
  }
  // Handled by saved roadmaps list
  return false;
}

/**
 * Fetch saved roadmaps for current user
 */
export async function fetchSavedRoadmaps() {
  if (USE_MOCK) {
    await delay(200);
    const savedSlugs = getStoredSavedRoadmaps();
    return PREBUILT_ROLES.filter((r) => savedSlugs.includes(r.slug));
  }

  const res = await fetch(`${API_BASE}/roadmaps/saved`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch saved roadmaps");
  return res.json();
}

/**
 * Fetch curated resources for a specific skill node
 */
export async function fetchResources(skillId) {
  if (USE_MOCK) {
    await delay(150);
    return MOCK_RESOURCES[skillId] || MOCK_RESOURCES.default;
  }

  const res = await fetch(`${API_BASE}/resources?skill=${skillId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch resources");
  return res.json();
}

/**
 * Export roadmap data payload for download / sharing
 */
export async function exportRoadmapData(slug) {
  if (USE_MOCK) {
    await delay(100);
    const rData = MOCK_ROADMAPS[slug] || null;
    return {
      exportedAt: new Date().toISOString(),
      platform: "TRAIL Career Roadmaps",
      data: rData,
    };
  }

  const res = await fetch(`${API_BASE}/roadmaps/${slug}/export-data`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to export roadmap data");
  return res.json();
}

/**
 * Resource Bookmarks (per-user storage in localStorage via service layer)
 */
export function getStoredBookmarkedResourceIds() {
  const userId = getCurrentUserId();
  if (userId === "guest") return [];
  try {
    const raw = localStorage.getItem(`trail_saved_resources_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function toggleBookmarkResource(resourceId) {
  const userId = getCurrentUserId();
  if (userId === "guest") {
    throw new Error("Login to save resources");
  }
  const current = getStoredBookmarkedResourceIds();
  let updated;
  let isBookmarked;
  if (current.includes(resourceId)) {
    updated = current.filter((id) => id !== resourceId);
    isBookmarked = false;
  } else {
    updated = [...current, resourceId];
    isBookmarked = true;
  }
  localStorage.setItem(`trail_saved_resources_${userId}`, JSON.stringify(updated));
  return { isBookmarked, bookmarkedIds: updated };
}

export async function fetchBookmarkedResourceIds() {
  if (USE_MOCK) {
    await delay(80);
    return getStoredBookmarkedResourceIds();
  }
  try {
    const res = await fetch(`${API_BASE}/resources/bookmarks`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      return getStoredBookmarkedResourceIds();
    }
    return await res.json();
  } catch {
    return getStoredBookmarkedResourceIds();
  }
}

