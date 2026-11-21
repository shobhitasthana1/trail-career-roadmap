require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');

const Skill = require('../models/Skill');
const SkillRelationship = require('../models/SkillRelationship');

// ── Canonical skills ──────────────────────────────────────────────────────────
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
  { name: 'React', slug: 'react', category: 'library', aliases: ['reactjs', 'react.js', 'react js'] },
  { name: 'Vue.js', slug: 'vuejs', category: 'framework', aliases: ['vue', 'vue3', 'vue.js'] },
  { name: 'Angular', slug: 'angular', category: 'framework', aliases: ['angular.js', 'angularjs', 'angular 2'] },
  { name: 'Tailwind CSS', slug: 'tailwindcss', category: 'framework', aliases: ['tailwind'] },

  // Backend frameworks / platforms
  { name: 'Node.js', slug: 'nodejs', category: 'framework', aliases: ['node', 'nodejs', 'node js', 'node.js'] },
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

  // Message queues / event streaming
  { name: 'Kafka', slug: 'kafka', category: 'tool', aliases: ['apache kafka', 'event streaming', 'event-driven'] },
  { name: 'RabbitMQ', slug: 'rabbitmq', category: 'tool', aliases: ['rabbit mq', 'message queue', 'amqp'] },

  // Concepts / APIs
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

  // Data
  { name: 'Pandas', slug: 'pandas', category: 'library', aliases: [] },
  { name: 'NumPy', slug: 'numpy', category: 'library', aliases: [] },
  { name: 'Machine Learning', slug: 'machine-learning', category: 'concept', aliases: ['ml', 'deep learning', 'neural networks'] },
  { name: 'Data Visualization', slug: 'data-visualization', category: 'concept', aliases: ['matplotlib', 'seaborn', 'plotly', 'tableau', 'power bi'] },
];

// ── Prerequisite relationships ─────────────────────────────────────────────────
// Format: [fromSkillSlug, toSkillSlug]
// Meaning: fromSkill must be learned before toSkill
const relationships = [
  // Web fundamentals
  ['html', 'css'],
  ['html', 'javascript'],
  ['css', 'tailwindcss'],
  ['javascript', 'typescript'],

  // Frontend path
  ['javascript', 'react'],
  ['javascript', 'vuejs'],
  ['javascript', 'angular'],

  // JavaScript backend path
  ['javascript', 'nodejs'],
  ['nodejs', 'expressjs'],
  ['nodejs', 'nestjs'],
  ['expressjs', 'rest-apis'],
  ['nestjs', 'rest-apis'],
  ['rest-apis', 'authentication'],
  ['rest-apis', 'graphql'],
  ['rest-apis', 'microservices'],

  // Java path
  ['java', 'spring-boot'],
  ['spring-boot', 'rest-apis'],
  ['java', 'sql'],
  ['sql', 'sql-server'],
  ['sql', 'oracle'],

  // C# / .NET path
  ['csharp', 'dotnet'],
  ['dotnet', 'rest-apis'],

  // Python path
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

  // PHP path
  ['php', 'laravel'],
  ['laravel', 'rest-apis'],

  // Database path
  ['rest-apis', 'mongodb'],
  ['rest-apis', 'postgresql'],
  ['sql', 'postgresql'],
  ['sql', 'mysql'],
  ['rest-apis', 'redis'],
  ['rest-apis', 'elasticsearch'],

  // Message queues (need REST / microservices first)
  ['microservices', 'kafka'],
  ['microservices', 'rabbitmq'],

  // DevOps path
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

async function seed() {
  await connectDB();

  console.log('Clearing existing skills and relationships...');
  await Skill.deleteMany({});
  await SkillRelationship.deleteMany({});

  console.log('Inserting skills...');
  const insertedSkills = await Skill.insertMany(skills);
  console.log(`  ✓ ${insertedSkills.length} skills inserted`);

  // Build a slug → _id map for the relationship pass
  const slugToId = {};
  for (const skill of insertedSkills) {
    slugToId[skill.slug] = skill._id;
  }

  console.log('Inserting skill relationships...');
  const relDocs = relationships.map(([from, to]) => ({
    fromSkill: slugToId[from],
    toSkill: slugToId[to],
    type: 'prerequisite',
    confidence: 1.0,
    source: 'seed',
  }));

  const insertedRels = await SkillRelationship.insertMany(relDocs);
  console.log(`  ✓ ${insertedRels.length} relationships inserted`);

  console.log('\nSeed complete.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
