require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Skill = require('../models/Skill');
const Resource = require('../models/Resource');

const resourceData = [
  // HTML
  { skillSlug: 'html', title: 'MDN HTML Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', type: 'documentation', isFree: true },
  { skillSlug: 'html', title: 'HTML Full Course – freeCodeCamp', url: 'https://www.youtube.com/watch?v=pQN-pnXPaVg', type: 'video', isFree: true },

  // CSS
  { skillSlug: 'css', title: 'MDN CSS Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS', type: 'documentation', isFree: true },
  { skillSlug: 'css', title: 'CSS Tricks', url: 'https://css-tricks.com', type: 'blog', isFree: true },

  // JavaScript
  { skillSlug: 'javascript', title: 'javascript.info', url: 'https://javascript.info', type: 'tutorial', isFree: true },
  { skillSlug: 'javascript', title: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', type: 'documentation', isFree: true },
  { skillSlug: 'javascript', title: 'Eloquent JavaScript (free book)', url: 'https://eloquentjavascript.net', type: 'tutorial', isFree: true },

  // TypeScript
  { skillSlug: 'typescript', title: 'TypeScript Official Docs', url: 'https://www.typescriptlang.org/docs/', type: 'documentation', isFree: true },
  { skillSlug: 'typescript', title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', type: 'tutorial', isFree: true },

  // React
  { skillSlug: 'react', title: 'React Official Docs', url: 'https://react.dev', type: 'documentation', isFree: true },
  { skillSlug: 'react', title: 'Full Stack Open (React section)', url: 'https://fullstackopen.com/en/part1', type: 'course', isFree: true },

  // Node.js
  { skillSlug: 'nodejs', title: 'Node.js Official Docs', url: 'https://nodejs.org/en/docs', type: 'documentation', isFree: true },
  { skillSlug: 'nodejs', title: 'The Odin Project – NodeJS', url: 'https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs', type: 'course', isFree: true },

  // Express.js
  { skillSlug: 'expressjs', title: 'Express.js Official Docs', url: 'https://expressjs.com', type: 'documentation', isFree: true },
  { skillSlug: 'expressjs', title: 'Express.js Crash Course', url: 'https://www.youtube.com/watch?v=L72fhGm1tfE', type: 'video', isFree: true },

  // Python
  { skillSlug: 'python', title: 'Python Official Tutorial', url: 'https://docs.python.org/3/tutorial/', type: 'documentation', isFree: true },
  { skillSlug: 'python', title: 'Real Python', url: 'https://realpython.com', type: 'tutorial', isFree: true },

  // Java
  { skillSlug: 'java', title: 'Oracle Java Tutorials', url: 'https://docs.oracle.com/javase/tutorial/', type: 'documentation', isFree: true },
  { skillSlug: 'java', title: 'Java Programming MOOC', url: 'https://java-programming.mooc.fi', type: 'course', isFree: true },

  // Spring Boot
  { skillSlug: 'spring-boot', title: 'Spring Boot Official Guides', url: 'https://spring.io/guides', type: 'documentation', isFree: true },
  { skillSlug: 'spring-boot', title: 'Spring Boot Tutorial – Amigoscode', url: 'https://www.youtube.com/watch?v=9SGDpanrc8U', type: 'video', isFree: true },

  // C#
  { skillSlug: 'csharp', title: 'Microsoft C# Documentation', url: 'https://learn.microsoft.com/en-us/dotnet/csharp/', type: 'documentation', isFree: true },

  // .NET
  { skillSlug: 'dotnet', title: 'Microsoft .NET Documentation', url: 'https://learn.microsoft.com/en-us/dotnet/', type: 'documentation', isFree: true },

  // MongoDB
  { skillSlug: 'mongodb', title: 'MongoDB University (free courses)', url: 'https://learn.mongodb.com', type: 'course', isFree: true },
  { skillSlug: 'mongodb', title: 'MongoDB Official Docs', url: 'https://www.mongodb.com/docs/', type: 'documentation', isFree: true },

  // PostgreSQL
  { skillSlug: 'postgresql', title: 'PostgreSQL Official Docs', url: 'https://www.postgresql.org/docs/', type: 'documentation', isFree: true },
  { skillSlug: 'postgresql', title: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com', type: 'tutorial', isFree: true },

  // SQL
  { skillSlug: 'sql', title: 'SQLZoo', url: 'https://sqlzoo.net', type: 'tutorial', isFree: true },
  { skillSlug: 'sql', title: 'Mode SQL Tutorial', url: 'https://mode.com/sql-tutorial/', type: 'tutorial', isFree: true },

  // REST APIs
  { skillSlug: 'rest-apis', title: 'REST API Design Best Practices – freeCodeCamp', url: 'https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/', type: 'blog', isFree: true },

  // Docker
  { skillSlug: 'docker', title: 'Docker Official Docs', url: 'https://docs.docker.com', type: 'documentation', isFree: true },
  { skillSlug: 'docker', title: 'Docker for Beginners – TechWorld with Nana', url: 'https://www.youtube.com/watch?v=3c-iBn73dDE', type: 'video', isFree: true },

  // Kubernetes
  { skillSlug: 'kubernetes', title: 'Kubernetes Official Docs', url: 'https://kubernetes.io/docs/home/', type: 'documentation', isFree: true },
  { skillSlug: 'kubernetes', title: 'Kubernetes Crash Course – TechWorld with Nana', url: 'https://www.youtube.com/watch?v=s_o8dwzRlu4', type: 'video', isFree: true },

  // AWS
  { skillSlug: 'aws', title: 'AWS Free Tier', url: 'https://aws.amazon.com/free/', type: 'documentation', isFree: true },
  { skillSlug: 'aws', title: 'AWS Cloud Practitioner Essentials', url: 'https://aws.amazon.com/training/learn-about/cloud-practitioner/', type: 'course', isFree: true },

  // Git
  { skillSlug: 'git', title: 'Pro Git (free book)', url: 'https://git-scm.com/book/en/v2', type: 'tutorial', isFree: true },
  { skillSlug: 'git', title: 'Learn Git Branching (interactive)', url: 'https://learngitbranching.js.org', type: 'tutorial', isFree: true },

  // Linux
  { skillSlug: 'linux', title: 'The Linux Command Line (free book)', url: 'https://linuxcommand.org/tlcl.php', type: 'tutorial', isFree: true },

  // Pandas
  { skillSlug: 'pandas', title: 'Pandas Official Docs', url: 'https://pandas.pydata.org/docs/', type: 'documentation', isFree: true },

  // Machine Learning
  { skillSlug: 'machine-learning', title: 'fast.ai Practical Deep Learning', url: 'https://course.fast.ai', type: 'course', isFree: true },
  { skillSlug: 'machine-learning', title: 'Google Machine Learning Crash Course', url: 'https://developers.google.com/machine-learning/crash-course', type: 'course', isFree: true },
];

async function seedResources() {
  await connectDB();

  console.log('Clearing existing resources...');
  await Resource.deleteMany({});

  // Build slug → _id map
  const allSkills = await Skill.find({}).lean();
  const slugToId = {};
  for (const s of allSkills) slugToId[s.slug] = s._id;

  const docs = [];
  for (const r of resourceData) {
    if (!slugToId[r.skillSlug]) {
      console.warn(`  Skill not found: ${r.skillSlug} — skipping`);
      continue;
    }
    docs.push({
      skill: slugToId[r.skillSlug],
      title: r.title,
      url: r.url,
      type: r.type,
      isFree: r.isFree,
    });
  }

  const inserted = await Resource.insertMany(docs);
  console.log(`  ✓ ${inserted.length} resources inserted`);
  console.log('\nResource seed complete.');
  await mongoose.disconnect();
}

seedResources().catch((err) => {
  console.error('Resource seed error:', err);
  process.exit(1);
});
