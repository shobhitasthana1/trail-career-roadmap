import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  FiSearch,
  FiX,
  FiExternalLink,
  FiBookmark,
  FiCompass,
  FiLayers,
  FiCpu,
  FiDatabase,
  FiServer,
  FiTerminal,
  FiCode,
  FiBookOpen,
  FiCheck,
  FiFileText,
  FiPlayCircle,
  FiFilter,
} from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import Footer from "../components/footer/Footer";
import {
  RESOURCES_DATA,
  RESOURCE_CATEGORIES,
  RESOURCE_TYPES,
} from "../data/resourcesData";
import {
  fetchBookmarkedResourceIds,
  toggleBookmarkResource,
} from "../services/api";

/* ── 67 Newly Curated Resources (Auto-merged & Deduplicated) ───────── */
export const ADDITIONAL_RESOURCES_DATA = [
  // FRONTEND (1 - 12)
  {
    id: "res-new-1",
    title: "CSS-Tricks",
    provider: "CSS-Tricks",
    category: "Frontend",
    type: "Article",
    difficulty: "Beginner",
    skills: ["CSS", "Flexbox", "Grid"],
    url: "https://css-tricks.com",
    description:
      "CSS ki sabse best articles, visual guides, aur complete almanac library for mastering modern layouts.",
  },
  {
    id: "res-new-2",
    title: "Kevin Powell (YouTube)",
    provider: "Kevin Powell",
    category: "Frontend",
    type: "Video",
    difficulty: "Beginner",
    skills: ["CSS", "Responsive Design"],
    url: "https://www.youtube.com/@KevinPowell",
    description:
      "CSS aur modern responsive web design seekhne ka sabse best YouTube channel.",
  },
  {
    id: "res-new-3",
    title: "Web Dev Simplified (YouTube)",
    provider: "Kyle Cook",
    category: "Frontend",
    type: "Video",
    difficulty: "Beginner",
    skills: ["JavaScript", "React", "CSS"],
    url: "https://www.youtube.com/@WebDevSimplified",
    description:
      "JavaScript, React, aur CSS ka har complex concept 10 minute mein practical examples ke saath clear.",
  },
  {
    id: "res-new-4",
    title: "Traversy Media (YouTube)",
    provider: "Brad Traversy",
    category: "Frontend",
    type: "Video",
    difficulty: "Beginner",
    skills: ["HTML", "CSS", "JS", "React"],
    url: "https://www.youtube.com/@TraversyMedia",
    description:
      "Hands-on project-based crash courses covering HTML, CSS, JavaScript, React, and modern web tools.",
  },
  {
    id: "res-new-5",
    title: "The Net Ninja — Playlists (YouTube)",
    provider: "Shaun Pelling",
    category: "Frontend",
    type: "Video",
    difficulty: "Beginner",
    skills: ["React", "Vue", "Firebase", "Tailwind"],
    url: "https://www.youtube.com/@NetNinja/playlists",
    description:
      "Full structured step-by-step playlist series on React, Vue, Firebase, Tailwind CSS, and more.",
  },
  {
    id: "res-new-6",
    title: "JavaScript Mastery (YouTube)",
    provider: "JS Mastery",
    category: "Frontend",
    type: "Video",
    difficulty: "Intermediate",
    skills: ["React", "Next.js", "Projects"],
    url: "https://www.youtube.com/@javascriptmastery",
    description:
      "Modern industry-grade project builds using React, Next.js, Tailwind CSS, and 3D web technologies.",
  },
  {
    id: "res-new-7",
    title: "Chai aur Code — JavaScript Series (Hindi)",
    provider: "Hitesh Choudhary",
    category: "Frontend",
    type: "Video",
    difficulty: "Beginner",
    skills: ["JavaScript", "Hindi", "Web Dev"],
    url: "https://www.youtube.com/@chaiaurcode/playlists",
    description:
      "Hindi mein sabse best aur deep JavaScript & React structured playlist series.",
  },
  {
    id: "res-new-8",
    title: "CodeWithHarry — Sigma Web Development (Hindi)",
    provider: "CodeWithHarry",
    category: "Frontend",
    type: "Video",
    difficulty: "Beginner",
    skills: ["HTML", "CSS", "JS", "MERN", "Hindi"],
    url: "https://www.youtube.com/@CodeWithHarry",
    description:
      "Zero se full-stack MERN tak ka complete Sigma Web Development course Hindi mein.",
  },
  {
    id: "res-new-9",
    title: "Sheryians Coding School (YouTube, Hindi)",
    provider: "Sheryians Coding School",
    category: "Frontend",
    type: "Video",
    difficulty: "Intermediate",
    skills: ["Frontend", "GSAP", "React", "Hindi"],
    url: "https://www.youtube.com/@sheryians",
    description:
      "Creative frontend development, GSAP scroll animations, Three.js, aur modern React projects Hindi mein.",
  },
  {
    id: "res-new-10",
    title: "freeCodeCamp News",
    provider: "freeCodeCamp",
    category: "Frontend",
    type: "Article",
    difficulty: "Beginner",
    skills: ["Web Dev", "Career", "Tutorials"],
    url: "https://www.freecodecamp.org/news",
    description:
      "Roz naye free in-depth developer tutorials, handbooks, aur tech career articles.",
  },
  {
    id: "res-new-11",
    title: "Smashing Magazine",
    provider: "Smashing Magazine",
    category: "Frontend",
    type: "Article",
    difficulty: "Intermediate",
    skills: ["CSS", "UX", "Performance"],
    url: "https://www.smashingmagazine.com",
    description:
      "Deep frontend engineering articles covering CSS architecture, accessibility, UX design, and web performance.",
  },
  {
    id: "res-new-12",
    title: "Dev.to Community",
    provider: "DEV Community",
    category: "Frontend",
    type: "Article",
    difficulty: "Beginner",
    skills: ["Web Dev", "JavaScript", "Career"],
    url: "https://dev.to",
    description:
      "Global developer community ke practical blogs, coding tutorials, aur real career discussions.",
  },

  // BACKEND (13 - 22)
  {
    id: "res-new-13",
    title: "Hussein Nasser (YouTube)",
    provider: "Hussein Nasser",
    category: "Backend",
    type: "Video",
    difficulty: "Advanced",
    skills: ["Backend", "Databases", "System Design"],
    url: "https://www.youtube.com/@hnasr",
    description:
      "Backend engineering deep dives, database internals, networking protocols, aur real-world architecture.",
  },
  {
    id: "res-new-14",
    title: "DigitalOcean Community Tutorials",
    provider: "DigitalOcean",
    category: "Backend",
    type: "Docs",
    difficulty: "Beginner",
    skills: ["Node.js", "APIs", "Linux", "Databases"],
    url: "https://www.digitalocean.com/community/tutorials",
    description:
      "Step-by-step practical guides for Node.js, Linux servers, SQL/NoSQL databases, and deployment.",
  },
  {
    id: "res-new-15",
    title: "Baeldung",
    provider: "Baeldung",
    category: "Backend",
    type: "Docs",
    difficulty: "Intermediate",
    skills: ["Java", "Spring Boot", "REST"],
    url: "https://www.baeldung.com",
    description:
      "Java backend, Spring Boot, microservices, aur REST APIs seekhne ki sabse best documentation library.",
  },
  {
    id: "res-new-16",
    title: "Node.js Best Practices (GitHub)",
    provider: "Yoni Goldberg",
    category: "Backend",
    type: "Docs",
    difficulty: "Intermediate",
    skills: ["Node.js", "Express", "Security"],
    url: "https://github.com/goldbergyoni/nodebestpractices",
    description:
      "Production Node.js aur Express applications ke liye 100+ curated architecture & security best practices.",
  },
  {
    id: "res-new-17",
    title: "Piyush Garg (YouTube, Hindi)",
    provider: "Piyush Garg",
    category: "Backend",
    type: "Video",
    difficulty: "Intermediate",
    skills: ["Node.js", "DevOps", "System Design", "Hindi"],
    url: "https://www.youtube.com/@piyushgargdev",
    description:
      "Hindi mein Node.js backend engineering, Docker, AWS, System Design, aur full-stack projects.",
  },
  {
    id: "res-new-18",
    title: "Harkirat Singh — 100xDevs (YouTube)",
    provider: "Harkirat Singh",
    category: "Backend",
    type: "Video",
    difficulty: "Intermediate",
    skills: ["MERN", "TypeScript", "Web3"],
    url: "https://www.youtube.com/@harkirat1",
    description:
      "Full-stack cohort style content on MERN stack, TypeScript, monorepos, scalable backends, and open source.",
  },
  {
    id: "res-new-19",
    title: "Postman Learning Center",
    provider: "Postman",
    category: "Backend",
    type: "Docs",
    difficulty: "Beginner",
    skills: ["APIs", "REST", "Testing"],
    url: "https://learning.postman.com",
    description:
      "API development, REST workflows, aur automated API testing seekhne ki official Postman training.",
  },
  {
    id: "res-new-20",
    title: "Supabase Docs",
    provider: "Supabase",
    category: "Backend",
    type: "Docs",
    difficulty: "Beginner",
    skills: ["PostgreSQL", "Auth", "Backend"],
    url: "https://supabase.com/docs",
    description:
      "Modern backend-as-a-service documentation covering PostgreSQL, Row Level Security, Auth, and Edge Functions.",
  },
  {
    id: "res-new-21",
    title: "Redis University",
    provider: "Redis",
    category: "Backend",
    type: "Course",
    difficulty: "Intermediate",
    skills: ["Redis", "Caching"],
    url: "https://university.redis.com",
    description:
      "Free official Redis courses covering in-memory data structures, caching patterns, and fast backends.",
  },
  {
    id: "res-new-22",
    title: "Netflix TechBlog",
    provider: "Netflix Engineering",
    category: "Backend",
    type: "Article",
    difficulty: "Advanced",
    skills: ["System Design", "Backend", "Scale"],
    url: "https://netflixtechblog.com",
    description:
      "Real production engineering stories on how Netflix designs, scales, and operates distributed systems.",
  },

  // DATA & AI (23 - 35)
  {
    id: "res-new-23",
    title: "Codebasics (YouTube)",
    provider: "Dhaval Patel",
    category: "Data & AI",
    type: "Video",
    difficulty: "Beginner",
    skills: ["Python", "SQL", "Power BI", "ML"],
    url: "https://www.youtube.com/@codebasics",
    description:
      "End-to-end data analytics, Python, SQL, Power BI, aur Machine Learning projects in Hindi & English.",
  },
  {
    id: "res-new-24",
    title: "Krish Naik (YouTube)",
    provider: "Krish Naik",
    category: "Data & AI",
    type: "Video",
    difficulty: "Intermediate",
    skills: ["ML", "Deep Learning", "GenAI"],
    url: "https://www.youtube.com/@krishnaik06",
    description:
      "Complete structured playlists on Machine Learning, Deep Learning, NLP, LangChain, and Generative AI.",
  },
  {
    id: "res-new-25",
    title: "Alex The Analyst (YouTube)",
    provider: "Alex Freberg",
    category: "Data & AI",
    type: "Video",
    difficulty: "Beginner",
    skills: ["SQL", "Excel", "Tableau", "Portfolio"],
    url: "https://www.youtube.com/@AlexTheAnalyst",
    description:
      "Data Analyst career roadmap, SQL, Excel, Power BI, Tableau, aur portfolio projects.",
  },
  {
    id: "res-new-26",
    title: "Luke Barousse (YouTube)",
    provider: "Luke Barousse",
    category: "Data & AI",
    type: "Video",
    difficulty: "Beginner",
    skills: ["Data Analytics", "SQL", "Python"],
    url: "https://www.youtube.com/@LukeBarousse",
    description:
      "Data analytics job market analysis, real-world SQL/Python bootcamps, aur practical projects.",
  },
  {
    id: "res-new-27",
    title: "3Blue1Brown (YouTube)",
    provider: "Grant Sanderson",
    category: "Data & AI",
    type: "Video",
    difficulty: "Intermediate",
    skills: ["Math", "Neural Networks", "Linear Algebra"],
    url: "https://www.youtube.com/@3blue1brown",
    description:
      "Machine Learning, Linear Algebra, Calculus, aur Neural Networks ke maths ki sabse best visual samajh.",
  },
  {
    id: "res-new-28",
    title: "Corey Schafer (YouTube)",
    provider: "Corey Schafer",
    category: "Data & AI",
    type: "Video",
    difficulty: "Beginner",
    skills: ["Python", "Django", "Pandas"],
    url: "https://www.youtube.com/@schafer5",
    description:
      "Python programming, Pandas data analysis, OOP, aur Django ki sabse cleanest video tutorials.",
  },
  {
    id: "res-new-29",
    title: "Real Python",
    provider: "Real Python",
    category: "Data & AI",
    type: "Docs",
    difficulty: "Intermediate",
    skills: ["Python", "Django", "Data"],
    url: "https://realpython.com",
    description:
      "Deep, well-tested Python tutorials covering data science, automation, web frameworks, and best practices.",
  },
  {
    id: "res-new-30",
    title: "KDnuggets",
    provider: "KDnuggets",
    category: "Data & AI",
    type: "Article",
    difficulty: "Intermediate",
    skills: ["Data Science", "ML", "AI News"],
    url: "https://www.kdnuggets.com",
    description:
      "Data Science, Machine Learning, LLM engineering articles, career guides, and handy cheatsheets.",
  },
  {
    id: "res-new-31",
    title: "Analytics Vidhya",
    provider: "Analytics Vidhya",
    category: "Data & AI",
    type: "Article",
    difficulty: "Beginner",
    skills: ["Data Science", "ML", "GenAI"],
    url: "https://www.analyticsvidhya.com",
    description:
      "Leading Indian & global data science community with hands-on blogs, GenAI guides, and free courses.",
  },
  {
    id: "res-new-32",
    title: "Machine Learning Mastery",
    provider: "Jason Brownlee",
    category: "Data & AI",
    type: "Article",
    difficulty: "Intermediate",
    skills: ["ML", "Deep Learning", "Python"],
    url: "https://machinelearningmastery.com",
    description:
      "Practical, code-first tutorials for mastering applied Machine Learning and Deep Learning in Python.",
  },
  {
    id: "res-new-33",
    title: "DataLemur",
    provider: "Nick Singh",
    category: "Data & AI",
    type: "Practice",
    difficulty: "Intermediate",
    skills: ["SQL", "Data Interview"],
    url: "https://datalemur.com",
    description:
      "FAANG-style SQL, statistics, aur Data Analyst / Data Science interview questions practice platform.",
  },
  {
    id: "res-new-34",
    title: "Kaggle Datasets",
    provider: "Kaggle",
    category: "Data & AI",
    type: "Practice",
    difficulty: "Beginner",
    skills: ["Datasets", "Python", "ML"],
    url: "https://www.kaggle.com/datasets",
    description:
      "Thousands of real-world datasets for practicing Python data cleaning, EDA, and ML modeling.",
  },
  {
    id: "res-new-35",
    title: "GCFGlobal — Excel",
    provider: "GCFGlobal",
    category: "Data & AI",
    type: "Course",
    difficulty: "Beginner",
    skills: ["Excel", "Spreadsheets"],
    url: "https://edu.gcfglobal.org/en/excel/",
    description:
      "Free step-by-step Excel course covering basics, formulas, pivot tables, and data visualization.",
  },

  // DEVOPS (36 - 44)
  {
    id: "res-new-36",
    title: "TechWorld with Nana (YouTube)",
    provider: "Nana Janashia",
    category: "DevOps",
    type: "Video",
    difficulty: "Beginner",
    skills: ["Docker", "Kubernetes", "DevOps"],
    url: "https://www.youtube.com/@TechWorldwithNana",
    description:
      "Docker, Kubernetes, Jenkins, Terraform, aur CI/CD pipelines seekhne ki sabse best beginner playlists.",
  },
  {
    id: "res-new-37",
    title: "NetworkChuck (YouTube)",
    provider: "NetworkChuck",
    category: "DevOps",
    type: "Video",
    difficulty: "Beginner",
    skills: ["Linux", "Networking", "Cloud"],
    url: "https://www.youtube.com/@NetworkChuck",
    description:
      "Fun aur practical style mein Linux, Computer Networking, Docker, aur Cloud computing.",
  },
  {
    id: "res-new-38",
    title: "Abhishek Veeramalla (YouTube)",
    provider: "Abhishek Veeramalla",
    category: "DevOps",
    type: "Video",
    difficulty: "Intermediate",
    skills: ["DevOps", "Kubernetes", "AWS"],
    url: "https://www.youtube.com/@AbhishekVeeramalla",
    description:
      "Zero-to-Hero DevOps, AWS, Kubernetes, aur real production CI/CD projects in Hindi & English.",
  },
  {
    id: "res-new-39",
    title: "KodeKloud (YouTube)",
    provider: "KodeKloud",
    category: "DevOps",
    type: "Video",
    difficulty: "Beginner",
    skills: ["Kubernetes", "Docker", "Terraform"],
    url: "https://www.youtube.com/@KodeKloud",
    description:
      "Animated aur hands-on DevOps tutorials for Kubernetes, Docker, Terraform, and Linux.",
  },
  {
    id: "res-new-40",
    title: "KodeKloud Free Labs",
    provider: "KodeKloud",
    category: "DevOps",
    type: "Interactive",
    difficulty: "Beginner",
    skills: ["Kubernetes", "Linux", "Docker"],
    url: "https://kodekloud.com/free-labs",
    description:
      "Browser ke andar free interactive hands-on labs for practicing Linux, Docker, and Kubernetes.",
  },
  {
    id: "res-new-41",
    title: "Play with Docker",
    provider: "Docker",
    category: "DevOps",
    type: "Interactive",
    difficulty: "Beginner",
    skills: ["Docker"],
    url: "https://labs.play-with-docker.com",
    description:
      "Browser mein real multi-node Docker playground bina kuch install kiye containers test karne ke liye.",
  },
  {
    id: "res-new-42",
    title: "KillerCoda Interactive Labs",
    provider: "KillerCoda",
    category: "DevOps",
    type: "Interactive",
    difficulty: "Intermediate",
    skills: ["Kubernetes", "Linux"],
    url: "https://killercoda.com",
    description:
      "Free interactive browser terminals for practicing Kubernetes (CKA/CKAD), Linux, and cloud-native scenarios.",
  },
  {
    id: "res-new-43",
    title: "Terraform Tutorials (HashiCorp)",
    provider: "HashiCorp",
    category: "DevOps",
    type: "Docs",
    difficulty: "Beginner",
    skills: ["Terraform", "IaC"],
    url: "https://developer.hashicorp.com/terraform/tutorials",
    description:
      "Official HashiCorp tutorials for learning Infrastructure as Code (IaC) across AWS, Azure, and GCP.",
  },
  {
    id: "res-new-44",
    title: "Prometheus Documentation",
    provider: "Prometheus",
    category: "DevOps",
    type: "Docs",
    difficulty: "Intermediate",
    skills: ["Monitoring", "Prometheus"],
    url: "https://prometheus.io/docs/",
    description:
      "Official documentation for setting up cloud-native monitoring, PromQL queries, and alerting.",
  },

  // DSA & INTERVIEW (45 - 56)
  {
    id: "res-new-45",
    title: "take U forward (YouTube)",
    provider: "Striver (Raj Vikramaditya)",
    category: "DSA & Interview",
    type: "Video",
    difficulty: "Intermediate",
    skills: ["DSA", "Striver's Sheets"],
    url: "https://www.youtube.com/@takeUforward",
    description:
      "Striver ke legendary A2Z DSA Sheet, Dynamic Programming, Graphs, aur Trees ke video explanations.",
  },
  {
    id: "res-new-46",
    title: "Apna College — Java + DSA Playlist (Hindi)",
    provider: "Apna College",
    category: "DSA & Interview",
    type: "Video",
    difficulty: "Beginner",
    skills: ["Java", "DSA", "Hindi"],
    url: "https://www.youtube.com/playlist?list=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMS",
    description:
      "Complete beginner-to-placement Java + Data Structures & Algorithms playlist Hindi mein.",
  },
  {
    id: "res-new-47",
    title: "Love Babbar — DSA C++ Playlist (Hindi)",
    provider: "CodeHelp (Love Babbar)",
    category: "DSA & Interview",
    type: "Video",
    difficulty: "Beginner",
    skills: ["C++", "DSA", "Hindi"],
    url: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA",
    description:
      "Complete C++ Data Structures & Algorithms placement preparation course Hindi mein.",
  },
  {
    id: "res-new-48",
    title: "NeetCode (YouTube)",
    provider: "NeetCode",
    category: "DSA & Interview",
    type: "Video",
    difficulty: "Intermediate",
    skills: ["DSA", "LeetCode Patterns"],
    url: "https://www.youtube.com/@NeetCode",
    description:
      "Har LeetCode pattern (Blind 75 / NeetCode 150) ke visual dry-runs aur optimal code solutions.",
  },
  {
    id: "res-new-49",
    title: "Codeforces",
    provider: "Codeforces",
    category: "DSA & Interview",
    type: "Practice",
    difficulty: "Advanced",
    skills: ["Competitive Programming", "DSA"],
    url: "https://codeforces.com",
    description:
      "World ki top Competitive Programming platform for live algorithmic contests and rating progression.",
  },
  {
    id: "res-new-50",
    title: "CodeChef",
    provider: "CodeChef",
    category: "DSA & Interview",
    type: "Practice",
    difficulty: "Beginner",
    skills: ["DSA", "CP"],
    url: "https://www.codechef.com",
    description:
      "Beginner-friendly DSA practice tracks aur weekly Starters competitive programming contests.",
  },
  {
    id: "res-new-51",
    title: "AtCoder",
    provider: "AtCoder",
    category: "DSA & Interview",
    type: "Practice",
    difficulty: "Intermediate",
    skills: ["Competitive Programming"],
    url: "https://atcoder.jp",
    description:
      "High-quality algorithmic aur mathematical competitive programming problems aur weekly contests.",
  },
  {
    id: "res-new-52",
    title: "InterviewBit",
    provider: "InterviewBit",
    category: "DSA & Interview",
    type: "Practice",
    difficulty: "Intermediate",
    skills: ["DSA", "Interview Prep"],
    url: "https://www.interviewbit.com",
    description:
      "Structured, company-tagged DSA problem sets designed specifically for product-based tech interviews.",
  },
  {
    id: "res-new-53",
    title: "VisuAlgo",
    provider: "NUS (Steven Halim)",
    category: "DSA & Interview",
    type: "Interactive",
    difficulty: "Beginner",
    skills: ["DSA", "Algorithms"],
    url: "https://visualgo.net",
    description:
      "Data structures aur algorithms (Sorting, Graphs, Trees, DP) ko step-by-step animation se samjho.",
  },
  {
    id: "res-new-54",
    title: "Tech Interview Handbook",
    provider: "Yangshun Tay",
    category: "DSA & Interview",
    type: "Docs",
    difficulty: "Intermediate",
    skills: ["Interview Prep", "DSA", "Resume"],
    url: "https://www.techinterviewhandbook.org",
    description:
      "FAANG interviews ka complete free guide — Blind 75 creator ke resume tips, DSA patterns, aur behavioral prep.",
  },
  {
    id: "res-new-55",
    title: "ByteByteGo (YouTube)",
    provider: "Alex Xu",
    category: "DSA & Interview",
    type: "Video",
    difficulty: "Advanced",
    skills: ["System Design"],
    url: "https://www.youtube.com/@ByteByteGo",
    description:
      "System Design interview concepts aur real-world distributed architectures ke visual explanations.",
  },
  {
    id: "res-new-56",
    title: "Gaurav Sen (YouTube)",
    provider: "Gaurav Sen",
    category: "DSA & Interview",
    type: "Video",
    difficulty: "Advanced",
    skills: ["System Design", "Distributed Systems"],
    url: "https://www.youtube.com/@gkcs",
    description:
      "System design classics covering load balancing, microservices, sharding, message queues, and HLD.",
  },

  // CS CORE (57 - 67)
  {
    id: "res-new-57",
    title: "Gate Smashers (YouTube, Hindi)",
    provider: "Varun Singla",
    category: "CS Core",
    type: "Video",
    difficulty: "Beginner",
    skills: ["OS", "DBMS", "CN", "TOC", "Hindi"],
    url: "https://www.youtube.com/@GateSmashers",
    description:
      "Core CS subjects (OS, DBMS, Computer Networks, TOC) Hindi mein — university exams aur placements dono ke liye.",
  },
  {
    id: "res-new-58",
    title: "Neso Academy (YouTube)",
    provider: "Neso Academy",
    category: "CS Core",
    type: "Video",
    difficulty: "Beginner",
    skills: ["DSA", "OS", "Digital Logic", "C"],
    url: "https://www.youtube.com/@nesoacademy",
    description:
      "Structured chapter-wise CS playlists covering Operating Systems, Computer Networks, Digital Logic, and C.",
  },
  {
    id: "res-new-59",
    title: "CMU Database Group (YouTube)",
    provider: "Andy Pavlo (CMU)",
    category: "CS Core",
    type: "Video",
    difficulty: "Advanced",
    skills: ["DBMS", "Database Internals"],
    url: "https://www.youtube.com/@CMUDatabaseGroup",
    description:
      "Carnegie Mellon University ke world-famous lectures on database storage engines, indexing, and internals.",
  },
  {
    id: "res-new-60",
    title: "OSTEP — Operating Systems: Three Easy Pieces",
    provider: "Remzi & Andrea Arpaci-Dusseau",
    category: "CS Core",
    type: "Book",
    difficulty: "Intermediate",
    skills: ["OS"],
    url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
    description:
      "Operating Systems (virtualization, concurrency, persistence) seekhne ki sabse famous free online book.",
  },
  {
    id: "res-new-61",
    title: "Beej's Guide to Network Programming",
    provider: "Brian 'Beej' Hall",
    category: "CS Core",
    type: "Book",
    difficulty: "Intermediate",
    skills: ["Computer Networks", "Sockets"],
    url: "https://beej.us/guide/bgnet/",
    description:
      "Computer networking aur TCP/IP socket programming seekhne ka classic free guide.",
  },
  {
    id: "res-new-62",
    title: "Teach Yourself CS",
    provider: "Bradfield CS",
    category: "CS Core",
    type: "Docs",
    difficulty: "Intermediate",
    skills: ["CS Core", "Self Study"],
    url: "https://teachyourselfcs.com",
    description:
      "Self-taught engineers ke liye 9 core Computer Science subjects master karne ka definitive roadmap.",
  },
  {
    id: "res-new-63",
    title: "OSSU Computer Science (GitHub)",
    provider: "Open Source Society University",
    category: "CS Core",
    type: "Course",
    difficulty: "Beginner",
    skills: ["CS Degree", "Programming"],
    url: "https://github.com/ossu/computer-science",
    description:
      "Free self-taught undergraduate Computer Science degree curriculum curated from MIT, Harvard, and Stanford.",
  },
  {
    id: "res-new-64",
    title: "MIT OpenCourseWare",
    provider: "MIT",
    category: "CS Core",
    type: "Course",
    difficulty: "Intermediate",
    skills: ["CS", "Math", "Engineering"],
    url: "https://ocw.mit.edu",
    description:
      "MIT ke official free university courses, video lectures, aur assignments for CS and Mathematics.",
  },
  {
    id: "res-new-65",
    title: "BaseCS (Vaidehi Joshi)",
    provider: "Vaidehi Joshi",
    category: "CS Core",
    type: "Article",
    difficulty: "Beginner",
    skills: ["CS Fundamentals", "DSA"],
    url: "https://medium.com/basecs",
    description:
      "Computer Science fundamentals, trees, graphs, aur hashing ko illustrations ke saath simple bhasha mein samjho.",
  },
  {
    id: "res-new-66",
    title: "The Pragmatic Engineer",
    provider: "Gergely Orosz",
    category: "CS Core",
    type: "Article",
    difficulty: "Intermediate",
    skills: ["Career", "Engineering Culture"],
    url: "https://blog.pragmaticengineer.com",
    description:
      "Real software industry insights, Big Tech engineering culture, architecture practices, and career growth.",
  },
  {
    id: "res-new-67",
    title: "JavaScript Weekly",
    provider: "Cooperpress",
    category: "CS Core",
    type: "Article",
    difficulty: "Beginner",
    skills: ["JavaScript", "News"],
    url: "https://javascriptweekly.com",
    description:
      "Har hafte ke sabse best JavaScript articles, tool releases, aur deep-dive tutorials ek jagah.",
  },
];

const CATEGORY_ICONS = {
  All: FiLayers,
  Frontend: FiCode,
  Backend: FiServer,
  "Data & AI": FiDatabase,
  DevOps: FiTerminal,
  "DSA & Interview": FiCpu,
  "CS Core": FiBookOpen,
};

const DIFFICULTY_STYLES = {
  Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  Intermediate: "bg-amber-50 text-amber-700 border-amber-200/80",
  Advanced: "bg-purple-50 text-purple-700 border-purple-200/80",
};

const TYPE_STYLES = {
  Docs: "bg-blue-50 text-blue-700 border-blue-200/80",
  Course: "bg-violet-50 text-violet-700 border-violet-200/80",
  Interactive: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  Practice: "bg-orange-50 text-orange-700 border-orange-200/80",
  Video: "bg-rose-50 text-rose-700 border-rose-200/80",
  Article: "bg-cyan-50 text-cyan-700 border-cyan-200/80",
  Book: "bg-stone-100 text-stone-700 border-stone-200/80",
};

const QUICK_SEARCH_TAGS = [
  "React",
  "JavaScript",
  "Python",
  "DSA",
  "System Design",
  "Hindi",
  "Docker",
  "SQL",
  "Node.js",
  "ML",
];

const DIFFICULTY_LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

const Resources = () => {
  const { isAuthenticated, user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [guestPrompt, setGuestPrompt] = useState(false);

  const searchInputRef = useRef(null);
  const catalogRef = useRef(null);

  // Merge existing RESOURCES_DATA with the 67 new resources without duplicates
  const allResources = useMemo(() => {
    const base = Array.isArray(RESOURCES_DATA) ? RESOURCES_DATA : [];
    const seenUrls = new Set(
      base.map((r) => (r.url || "").trim().toLowerCase().replace(/\/+$/, ""))
    );
    const seenTitles = new Set(
      base.map((r) => (r.title || "").trim().toLowerCase())
    );

    const merged = [...base];
    ADDITIONAL_RESOURCES_DATA.forEach((item) => {
      const normUrl = (item.url || "").trim().toLowerCase().replace(/\/+$/, "");
      const normTitle = (item.title || "").trim().toLowerCase();
      if (!seenUrls.has(normUrl) && !seenTitles.has(normTitle)) {
        seenUrls.add(normUrl);
        seenTitles.add(normTitle);
        merged.push(item);
      }
    });
    return merged;
  }, []);

  // Ensure "Article" is always present in Resource Types
  const allResourceTypes = useMemo(() => {
    const baseTypes = Array.isArray(RESOURCE_TYPES)
      ? [...RESOURCE_TYPES]
      : ["All", "Docs", "Course", "Interactive", "Practice", "Video", "Book"];
    if (!baseTypes.includes("Article")) {
      baseTypes.push("Article");
    }
    return baseTypes;
  }, []);

  // Keyboard shortcut: Press "/" or "Ctrl+K" / "Cmd+K" to focus search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isTyping = tag === "input" || tag === "textarea";

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "/" && !isTyping) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Load bookmarks for authenticated user
  useEffect(() => {
    if (isAuthenticated) {
      fetchBookmarkedResourceIds()
        .then((ids) => setBookmarkedIds(ids || []))
        .catch(() => {});
    } else {
      setBookmarkedIds([]);
      setShowSavedOnly(false);
    }
  }, [isAuthenticated, user]);

  // Handle bookmark click (preventDefault stops <motion.a> from opening link)
  const handleToggleBookmark = async (e, resourceId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      setGuestPrompt(true);
      setTimeout(() => setGuestPrompt(false), 4000);
      return;
    }

    try {
      const { bookmarkedIds: updated } = await toggleBookmarkResource(resourceId);
      setBookmarkedIds(updated || []);
    } catch {
      // handled
    }
  };

  // Scroll smoothly to catalog
  const scrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Category counts computed from merged catalog
  const categoryCounts = useMemo(() => {
    const counts = { All: allResources.length };
    RESOURCE_CATEGORIES.forEach((cat) => {
      if (cat !== "All") {
        counts[cat] = allResources.filter((r) => r.category === cat).length;
      }
    });
    return counts;
  }, [allResources]);

  // Smart Multi-Token Search & Filter Engine
  const filteredResources = useMemo(() => {
    const rawQuery = searchQuery.trim().toLowerCase();
    const tokens = rawQuery ? rawQuery.split(/\s+/).filter(Boolean) : [];

    return allResources.filter((item) => {
      // 1. Category filter
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }

      // 2. Type filter
      if (selectedType !== "All" && item.type !== selectedType) {
        return false;
      }

      // 3. Difficulty filter
      if (
        selectedDifficulty !== "All" &&
        item.difficulty !== selectedDifficulty
      ) {
        return false;
      }

      // 4. Saved only filter
      if (showSavedOnly && !bookmarkedIds.includes(item.id)) {
        return false;
      }

      // 5. Multi-keyword smart search across all fields
      if (tokens.length > 0) {
        const searchableBlob = [
          item.title || "",
          item.provider || "",
          item.description || "",
          item.category || "",
          item.type || "",
          item.difficulty || "",
          ...(item.skills || []),
        ]
          .join(" ")
          .toLowerCase();

        const allTokensMatch = tokens.every((token) =>
          searchableBlob.includes(token)
        );
        if (!allTokensMatch) return false;
      }

      return true;
    });
  }, [
    allResources,
    searchQuery,
    selectedCategory,
    selectedType,
    selectedDifficulty,
    showSavedOnly,
    bookmarkedIds,
  ]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedType("All");
    setSelectedDifficulty("All");
    setShowSavedOnly(false);
  };

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedCategory !== "All" ||
    selectedType !== "All" ||
    selectedDifficulty !== "All" ||
    showSavedOnly;

  return (
    <div className="relative min-h-screen w-full bg-[#FAFAFA] text-[#111827] overflow-x-hidden font-inter selection:bg-[#7C3AED]/15 selection:text-[#6D3DF5]">
      {/* Soft Ambient Background Glows */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_15%_12%,rgba(109,61,245,0.08)_0%,transparent_45%),radial-gradient(circle_at_85%_85%,rgba(168,85,247,0.08)_0%,transparent_45%)]" />
      <div className="pointer-events-none absolute top-16 left-1/2 -translate-x-1/2 w-[90vw] max-w-[760px] h-[280px] bg-gradient-to-tr from-[#6D3DF5]/10 via-[#9577F4]/10 to-transparent blur-[100px] rounded-full" />

      {/* Subtle Radial Dot Grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(#6D3DF5 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          opacity: 0.14,
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 75%)",
        }}
      />

      {/* Guest Bookmark Prompt Toast */}
      <AnimatePresence>
        {guestPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-4 sm:right-8 z-50 flex items-center gap-3 bg-[#111827] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md"
          >
            <FiBookmark className="w-5 h-5 text-[#9577F4] shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold block">Save to Library</span>
              <span className="text-stone-300">
                Log in to bookmark free resources
              </span>
            </div>
            <Link
              to="/login"
              state={{ from: "/resources" }}
              className="ml-2 px-3.5 py-1.5 bg-gradient-to-r from-[#6D3DF5] to-[#9577F4] text-white text-xs font-semibold rounded-xl hover:brightness-110 transition-all shrink-0"
            >
              Log In
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 pt-28 sm:pt-36 pb-20">
        {/* ── 1. HERO HEADER ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#6D3DF5]/20 shadow-[0_4px_20px_-4px_rgba(109,61,245,0.12)] mb-5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6D3DF5] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6D3DF5]" />
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#6D3DF5] font-exo">
              {allResources.length}+ Handpicked Free Resources
            </span>
          </div>

          <h1 className="font-geist text-[clamp(2.2rem,5vw,4rem)] font-bold tracking-[-0.045em] text-[#111827] mb-4 leading-[1.03]">
            Curated High-Impact{" "}
            <span className="bg-gradient-to-r from-[#6D3DF5] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent font-iowan italic font-normal pr-1">
              Resources.
            </span>
          </h1>

          <p className="text-[#64748B] font-inter text-sm sm:text-base md:text-[17px] leading-relaxed max-w-2xl mx-auto">
            Zero noise. Every YouTube playlist, documentation hub, interactive lab, book, and coding platform is 100% free and mapped to real industry skills.
          </p>
        </motion.div>

        {/* ── 2. SEARCH & FILTER COMMAND HUB ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative overflow-hidden rounded-[28px] border border-stone-200/90 bg-white/95 backdrop-blur-2xl p-5 sm:p-7 md:p-9 mb-12 shadow-[0_24px_60px_-15px_rgba(17,24,39,0.06)]"
        >
          {/* Top Gradient Bar */}
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#6D3DF5] via-[#9577F4] to-[#A855F7]" />
          <div className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 bg-gradient-to-br from-[#6D3DF5]/10 to-transparent blur-3xl rounded-full" />

          {/* Top Row: Title + Bookmark Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100 relative z-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6D3DF5] font-exo">
                Instant Resource Finder
              </span>
              <h2 className="font-geist text-lg sm:text-2xl font-bold text-[#111827] mt-0.5">
                Search & Filter Verified Library
              </h2>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowSavedOnly((prev) => !prev);
                    scrollToCatalog();
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all font-geist cursor-pointer ${
                    showSavedOnly
                      ? "bg-[#6D3DF5] text-white shadow-[0_8px_20px_-4px_rgba(109,61,245,0.4)]"
                      : "bg-[#6D3DF5]/[0.08] text-[#6D3DF5] hover:bg-[#6D3DF5]/15 border border-[#6D3DF5]/20"
                  }`}
                >
                  <FaBookmark className="w-3.5 h-3.5" />
                  <span>
                    {showSavedOnly
                      ? `Showing Saved (${bookmarkedIds.length})`
                      : `My Saved (${bookmarkedIds.length})`}
                  </span>
                </button>
              ) : (
                <Link
                  to="/signup"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#6D3DF5] to-[#9577F4] px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-white tracking-wide shadow-[0_8px_20px_-4px_rgba(109,61,245,0.4)] transition-all duration-300 hover:shadow-[0_12px_25px_-4px_rgba(109,61,245,0.55)] hover:-translate-y-0.5 active:scale-[0.98] font-geist"
                >
                  <span>Sign Up to Bookmark</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative mt-5 z-10">
            <div className="relative flex items-center w-full rounded-2xl border-2 border-stone-200/90 bg-[#F8FAFC] transition-all duration-300 focus-within:border-[#6D3DF5] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6D3DF5]/10">
              <div className="pl-4 sm:pl-5 text-[#6D3DF5]">
                <FiSearch className="w-5 h-5" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, creator, skill, or language (e.g. React, Striver, Hindi, Docker, SQL)..."
                className="w-full bg-transparent px-3.5 sm:px-4 py-3.5 sm:py-4 text-xs sm:text-sm md:text-base text-[#111827] placeholder:text-[#94A3B8] focus:outline-none font-inter"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 mr-2.5 text-xs font-semibold text-stone-500 hover:text-[#111827] rounded-xl bg-stone-200/70 hover:bg-stone-200 transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <FiX className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              ) : (
                <span className="hidden md:inline-flex items-center gap-1 mr-4 px-2.5 py-1 rounded-lg border border-stone-200 bg-white text-[11px] font-semibold text-stone-400 select-none">
                  Press <kbd className="font-sans font-bold text-stone-600">/</kbd>
                </span>
              )}
            </div>

            {/* Quick Search Tag Pills */}
            <div className="mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] font-exo mr-1 shrink-0">
                Popular:
              </span>
              {QUICK_SEARCH_TAGS.map((tag) => {
                const isTagActive =
                  searchQuery.trim().toLowerCase() === tag.toLowerCase();
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setSearchQuery(isTagActive ? "" : tag)
                    }
                    className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      isTagActive
                        ? "bg-[#6D3DF5] text-white shadow-sm"
                        : "bg-stone-100/90 text-[#475569] hover:bg-[#6D3DF5]/10 hover:text-[#6D3DF5]"
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Domain Category Tabs */}
          <div className="mt-5 pt-5 border-t border-stone-100 z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#475569] font-exo">
                Filter By Domain
              </span>
              <span className="text-xs font-semibold text-[#6D3DF5] font-inter">
                Showing {filteredResources.length} of {allResources.length}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {RESOURCE_CATEGORIES.map((category) => {
                const isSelected = selectedCategory === category;
                const Icon = CATEGORY_ICONS[category] || FiLayers;
                const count = categoryCounts[category] || 0;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all font-geist cursor-pointer shrink-0 ${
                      isSelected
                        ? "bg-gradient-to-r from-[#6D3DF5] to-[#7C3AED] text-white shadow-[0_8px_20px_-4px_rgba(109,61,245,0.4)]"
                        : "bg-[#F8FAFC] text-[#475569] hover:bg-stone-100 hover:text-[#111827] border border-stone-200/80"
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        isSelected ? "text-white" : "text-[#6D3DF5]"
                      }`}
                    />
                    <span>{category}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-white text-stone-500 border border-stone-200/80"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Filters: Type & Difficulty */}
          <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3 z-10">
            {/* Format Type Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#64748B] font-exo mr-1.5">
                Format:
              </span>
              {allResourceTypes.map((type) => {
                const isSelected = selectedType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#111827] text-white shadow-sm"
                        : "bg-[#F8FAFC] border border-stone-200/80 text-[#475569] hover:border-[#6D3DF5]/30 hover:text-[#6D3DF5]"
                    }`}
                  >
                    {type === "All" ? "All Formats" : type}
                  </button>
                );
              })}
            </div>

            {/* Difficulty Filter + Reset */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#64748B] font-exo mr-1.5">
                Level:
              </span>
              {DIFFICULTY_LEVELS.map((level) => {
                const isSelected = selectedDifficulty === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSelectedDifficulty(level)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#6D3DF5] text-white shadow-sm"
                        : "bg-[#F8FAFC] border border-stone-200/80 text-[#475569] hover:border-[#6D3DF5]/30 hover:text-[#6D3DF5]"
                    }`}
                  >
                    {level === "All" ? "All Levels" : level}
                  </button>
                );
              })}

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-600 transition-colors py-1.5 px-3 rounded-xl bg-red-50 hover:bg-red-100/80 cursor-pointer"
                >
                  <FiX className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── 3. RESOURCE CARDS GRID ───────────────────────────────────────── */}
        <div ref={catalogRef} className="pt-2">
          {/* Header Count Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-7">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-geist text-xl sm:text-2xl font-bold text-[#111827]">
                {showSavedOnly
                  ? "My Bookmarked Resources"
                  : selectedCategory === "All"
                  ? "All Curated Resources"
                  : `${selectedCategory} Library`}
              </h3>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#6D3DF5]/10 text-[#6D3DF5] font-exo border border-[#6D3DF5]/20">
                {filteredResources.length} results
              </span>
            </div>

            {filteredResources.length > 0 && (
              <p className="text-xs text-[#64748B]">
                Tip: Click any skill badge on a card to filter by that topic
              </p>
            )}
          </div>

          {/* Empty State */}
          {filteredResources.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[28px] border border-dashed border-stone-300 bg-white p-10 sm:p-16 text-center max-w-xl mx-auto shadow-sm"
            >
              <div className="mx-auto w-16 h-16 rounded-2xl bg-[#6D3DF5]/10 flex items-center justify-center text-[#6D3DF5] mb-5">
                <FiCompass className="w-8 h-8" />
              </div>
              <h4 className="font-geist text-xl font-bold text-[#111827] mb-2">
                {searchQuery.trim()
                  ? `No resources matched "${searchQuery.trim()}"`
                  : "No matching resources"}
              </h4>
              <p className="text-[#64748B] text-xs sm:text-sm mb-6 leading-relaxed">
                {showSavedOnly
                  ? "You haven't bookmarked any resources matching these filters yet. Click the bookmark icon on any card to save it."
                  : "Try searching a broader keyword (e.g. React, Python, DSA, Docker, Hindi) or reset your active filters."}
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6D3DF5] to-[#9577F4] text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer font-geist"
              >
                Reset All Filters
              </button>
            </motion.div>
          ) : (
            /* Responsive Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredResources.map((item, index) => {
                const isBookmarked = bookmarkedIds.includes(item.id);
                const DomainIcon = CATEGORY_ICONS[item.category] || FiLayers;

                return (
                  <motion.a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: Math.min(index * 0.02, 0.25),
                      ease: "easeOut",
                    }}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-stone-200/90 bg-white p-5 sm:p-6 shadow-[0_8px_28px_-8px_rgba(17,24,39,0.04)] hover:shadow-[0_22px_45px_-12px_rgba(109,61,245,0.16)] hover:border-[#6D3DF5]/40 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
                  >
                    {/* Top Gradient Accent Bar */}
                    <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#6D3DF5] via-[#7C3AED] to-[#A855F7] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div>
                      {/* Card Top Row: Provider + Category + Bookmark */}
                      <div className="flex items-center justify-between gap-2 mb-3.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#6D3DF5]/[0.08] border border-[#6D3DF5]/15 text-[#6D3DF5]">
                            <DomainIcon className="w-3.5 h-3.5" />
                          </span>
                          <div className="truncate">
                            <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#6D3DF5] font-exo truncate">
                              {item.category}
                            </span>
                            <span className="block text-[11px] font-medium text-[#64748B] truncate">
                              {item.provider}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {/* Bookmark Button */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleBookmark(e, item.id)}
                            title={
                              isBookmarked
                                ? "Remove bookmark"
                                : isAuthenticated
                                ? "Save resource"
                                : "Log in to save"
                            }
                            className={`p-2 rounded-xl border transition-all cursor-pointer ${
                              isBookmarked
                                ? "text-[#6D3DF5] bg-[#6D3DF5]/10 border-[#6D3DF5]/25"
                                : "text-stone-400 border-transparent hover:text-[#6D3DF5] hover:bg-stone-100"
                            }`}
                          >
                            {isBookmarked ? (
                              <FaBookmark className="w-3.5 h-3.5" />
                            ) : (
                              <FiBookmark className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* External Link Icon */}
                          <div className="p-2 rounded-xl text-stone-400 group-hover:text-[#6D3DF5] group-hover:bg-[#6D3DF5]/[0.07] transition-all">
                            <FiExternalLink className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                      {/* Resource Title */}
                      <h4 className="font-geist text-base sm:text-[18px] font-bold text-[#111827] group-hover:text-[#6D3DF5] transition-colors leading-snug mb-2">
                        {item.title}
                      </h4>

                      {/* Description */}
                      <p className="text-[#64748B] text-xs sm:text-[13px] leading-relaxed line-clamp-2 mb-4 font-inter">
                        {item.description}
                      </p>

                      {/* Interactive Skill Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {(item.skills || []).map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSearchQuery(skill);
                            }}
                            title={`Filter by ${skill}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F8FAFC] hover:bg-[#6D3DF5]/10 border border-stone-200/80 hover:border-[#6D3DF5]/30 text-[11px] font-semibold text-[#334155] hover:text-[#6D3DF5] transition-colors cursor-pointer"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-[#6D3DF5]/60" />
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Metadata Badges */}
                    <div className="pt-3.5 border-t border-stone-100 flex items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {/* Type Badge */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            TYPE_STYLES[item.type] ||
                            "bg-stone-100 text-stone-700 border-stone-200"
                          }`}
                        >
                          {item.type}
                        </span>

                        {/* Difficulty Badge */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            DIFFICULTY_STYLES[item.difficulty] ||
                            "bg-stone-100 text-stone-700"
                          }`}
                        >
                          {item.difficulty}
                        </span>
                      </div>

                      {/* 100% Free Tag */}
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70 font-exo shrink-0">
                        <FiCheck className="w-3 h-3 text-emerald-600 stroke-[3]" />
                        100% Free
                      </span>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Resources;