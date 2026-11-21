/**
 * TRAIL — API Service Layer (src/services/api.js)
 * 
 * Centralized service layer for all backend communications.
 * Connected directly to the Node.js/Express/MongoDB backend
 * at VITE_API_BASE_URL with Bearer token authentication.
 */

export const USE_MOCK = false;

export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "https://trail-backend-agdl.onrender.com/api/v1";

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

// Prebuilt roles metadata used for gallery cards, gradients, and fallback display

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

// Helper to normalize status representation between backend ('not_started') and frontend ('not-started')
function normalizeStatus(st) {
  if (!st) return "not-started";
  return st.replace("_", "-");
}

function toBackendStatus(st) {
  if (!st) return "not_started";
  return st.replace("-", "_");
}

// Backend API service functions

/**
 * Fetch list of all ready-made roadmaps from backend
 */
export async function fetchRoadmaps() {
  try {
    const res = await fetch(`${API_BASE}/roadmaps`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch roadmaps");
    const data = await res.json();
    return data.roadmaps || data || PREBUILT_ROLES;
  } catch (err) {
    console.warn("fetchRoadmaps network fallback:", err.message);
    return PREBUILT_ROLES;
  }
}

/**
 * Fetch a roadmap by slug from backend
 */
export async function fetchRoadmapBySlug(slug) {
  const normSlug = (slug || "").toLowerCase().trim();
  const res = await fetch(`${API_BASE}/roadmaps/${normSlug}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `Roadmap not found for slug: ${slug}`);
  }

  const data = await res.json();

  // Normalize shape: ensures data.roadmap, data.nodes, data.edges are populated
  const roadmapObj = data.roadmap || data;
  const nodes = data.nodes || roadmapObj.nodes || [];
  const edges = data.edges || roadmapObj.edges || [];

  return {
    roadmap: {
      role: roadmapObj.role,
      slug: roadmapObj.slug || normSlug,
      source: roadmapObj.source || "verified",
      description: roadmapObj.description || "",
      totalJobs: roadmapObj.totalJobs || 0,
      marketDemandAvg: roadmapObj.marketDemandAvg || "90%",
      gradient: roadmapObj.gradient || "from-[#6D3DF5] to-[#9577F4]",
    },
    nodes,
    edges,
  };
}

/**
 * Dynamically generate or retrieve a roadmap for a given role query via backend
 */
export async function generateRoadmap(roleName) {
  const res = await fetch(`${API_BASE}/roadmaps/generate`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ role: roleName }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `Failed to generate roadmap for "${roleName}"`);
  }

  const data = await res.json();
  const roadmapObj = data.roadmap || data;
  const nodes = data.nodes || roadmapObj.nodes || [];
  const edges = data.edges || roadmapObj.edges || [];

  return {
    roadmap: {
      role: roadmapObj.role || roleName,
      slug: roadmapObj.slug || roleName.toLowerCase().replace(/\s+/g, "-"),
      source: roadmapObj.source || "market-generated",
      description: roadmapObj.description || `Learning path for ${roleName}`,
      totalJobs: roadmapObj.totalJobs || 0,
    },
    nodes,
    edges,
  };
}

/**
 * Check if the user has saved / started a journey for this roadmap
 */
export async function isJourneyStarted(slug) {
  const normSlug = slug?.toLowerCase().trim();
  const token = localStorage.getItem("trail_auth_token");
  if (!token) return false;

  try {
    const res = await fetch(`${API_BASE}/roadmaps/saved`, { headers: getAuthHeaders() });
    if (!res.ok) return false;
    const data = await res.json();
    const savedList = data.saved || (Array.isArray(data) ? data : []);
    return savedList.some((item) => (item.roadmap?.slug || item.slug) === normSlug);
  } catch {
    return false;
  }
}

/**
 * Start a learning journey on a roadmap (saves roadmap to user's Progress)
 */
export async function startJourney(slug) {
  const normSlug = slug?.toLowerCase().trim();
  const res = await fetch(`${API_BASE}/roadmaps/${normSlug}/save`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  // 409 means already saved, which is a success state for startJourney
  if (res.status === 409) {
    return { success: true, started: true, slug: normSlug };
  }

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to start journey");
  }

  return res.json();
}

/**
 * Fetch all journeys started by the user with stage checklists and progress
 */
export async function fetchMyJourneys() {
  const token = localStorage.getItem("trail_auth_token");
  if (!token) return [];

  const res = await fetch(`${API_BASE}/roadmaps/saved`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch journeys");
  }

  const data = await res.json();
  const savedRecords = data.saved || (Array.isArray(data) ? data : []);
  const journeys = [];

  for (const record of savedRecords) {
    const roadmapMeta = record.roadmap || record;
    const slug = roadmapMeta.slug;
    if (!slug) continue;

    try {
      // Fetch full roadmap nodes + edges and progress in parallel
      const [rData, progData] = await Promise.all([
        fetchRoadmapBySlug(slug).catch(() => null),
        fetchProgress(slug).catch(() => null),
      ]);

      if (!rData) continue;

      const removedSkills = progData?.removedSkills || [];
      const skillsMap = progData?.skillsMap || {};
      const activeNodes = (rData.nodes || []).filter((node) => !removedSkills.includes(node.id));
      const totalNodes = activeNodes.length;

      let completedCount = 0;
      let inProgressCount = 0;

      const enrichedNodes = activeNodes.map((node) => {
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

      const progressPct =
        totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : record.completionPercentage || 0;

      journeys.push({
        slug,
        role: rData.roadmap.role || roadmapMeta.role,
        description: rData.roadmap.description || roadmapMeta.description || "",
        totalSkills: totalNodes,
        completedCount,
        inProgressCount,
        notStartedCount: Math.max(0, totalNodes - completedCount - inProgressCount),
        progressPct,
        nodes: enrichedNodes,
        stages: stagesList,
        isSaved: true,
        startedAt: record.createdAt || null,
      });
    } catch {
      // Continue next journey
    }
  }

  return journeys;
}

/**
 * Fetch user progress for a specific roadmap
 */
export async function fetchProgress(roadmapSlug) {
  const normSlug = roadmapSlug?.toLowerCase().trim();
  const token = localStorage.getItem("trail_auth_token");

  if (!token) {
    return {
      roadmapSlug: normSlug,
      progressPct: 0,
      completedSkills: [],
      inProgressSkills: [],
      notStartedSkills: [],
      totalSkills: 0,
      skillsMap: {},
      removedSkills: [],
    };
  }

  const res = await fetch(`${API_BASE}/progress/${normSlug}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    // If not saved yet, return empty progress without throwing
    return {
      roadmapSlug: normSlug,
      progressPct: 0,
      completedSkills: [],
      inProgressSkills: [],
      notStartedSkills: [],
      totalSkills: 0,
      skillsMap: {},
      removedSkills: [],
    };
  }

  const data = await res.json();
  const skillsMap = data.skillsMap || {};

  if (Array.isArray(data.skills) && (!data.skillsMap || Object.keys(data.skillsMap).length === 0)) {
    data.skills.forEach((s) => {
      skillsMap[s.skillId] = normalizeStatus(s.status);
    });
  }

  const completed = Object.keys(skillsMap).filter((k) => skillsMap[k] === "completed");
  const inProgress = Object.keys(skillsMap).filter((k) => skillsMap[k] === "in-progress");
  const notStarted = Object.keys(skillsMap).filter((k) => skillsMap[k] === "not-started");

  return {
    roadmapSlug: normSlug,
    progressPct: data.completionPercentage || data.progressPct || 0,
    completedSkills: completed,
    inProgressSkills: inProgress,
    notStartedSkills: notStarted,
    totalSkills: Object.keys(skillsMap).length,
    skillsMap,
    removedSkills: data.removedSkills || [],
  };
}

/**
 * Remove an entire learning journey (unsaves roadmap)
 */
export async function removeJourney(slug) {
  const normSlug = slug?.toLowerCase().trim();
  const res = await fetch(`${API_BASE}/roadmaps/${normSlug}/save`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to remove journey");
  return res.json();
}

/**
 * Remove an individual skill from a journey
 */
export async function removeSkillFromJourney(roadmapSlug, skillId) {
  const normSlug = roadmapSlug?.toLowerCase().trim();
  const res = await fetch(`${API_BASE}/progress/${normSlug}/skills/${skillId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to remove skill");
  return res.json();
}

/**
 * Restore a previously removed skill to a journey
 */
export async function restoreSkillToJourney(roadmapSlug, skillId, previousStatus = "not-started") {
  const normSlug = roadmapSlug?.toLowerCase().trim();
  const res = await fetch(`${API_BASE}/progress/${normSlug}/skills/${skillId}/restore`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status: toBackendStatus(previousStatus) }),
  });

  if (!res.ok) throw new Error("Failed to restore skill");
  return res.json();
}

/**
 * Reset and restore all original skills for a journey
 */
export async function resetJourneySkills(roadmapSlug) {
  const normSlug = roadmapSlug?.toLowerCase().trim();
  const res = await fetch(`${API_BASE}/progress/${normSlug}/reset-skills`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to reset skills");
  return res.json();
}

/**
 * Update a skill's status in a roadmap
 * status: 'not-started' | 'in-progress' | 'completed'
 */
export async function updateSkillStatus(roadmapSlug, skillId, status) {
  const normSlug = roadmapSlug?.toLowerCase().trim();
  const res = await fetch(`${API_BASE}/progress/${normSlug}/skills/${skillId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status: toBackendStatus(status) }),
  });

  if (!res.ok) throw new Error("Failed to update skill status");
  return fetchProgress(normSlug);
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
  const normSlug = slug?.toLowerCase().trim();
  const res = await fetch(`${API_BASE}/roadmaps/${normSlug}/save`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (res.status === 409) {
    return { success: true, saved: true, slug: normSlug };
  }

  if (!res.ok) throw new Error("Failed to save roadmap");
  return res.json();
}

/**
 * Unsave a roadmap
 */
export async function unsaveRoadmap(slug) {
  const normSlug = slug?.toLowerCase().trim();
  const res = await fetch(`${API_BASE}/roadmaps/${normSlug}/save`, {
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
  return isJourneyStarted(slug);
}

/**
 * Fetch saved roadmaps for current user
 */
export async function fetchSavedRoadmaps() {
  const res = await fetch(`${API_BASE}/roadmaps/saved`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch saved roadmaps");
  const data = await res.json();
  const records = data.saved || (Array.isArray(data) ? data : []);
  return records.map((r) => r.roadmap || r);
}

/**
 * Export roadmap data payload for download / sharing
 */
export async function exportRoadmapData(slug) {
  const normSlug = slug?.toLowerCase().trim();
  const res = await fetch(`${API_BASE}/roadmaps/${normSlug}/export-data`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    // Fallback: fetch roadmap directly and build export payload
    const rData = await fetchRoadmapBySlug(normSlug);
    return {
      exportedAt: new Date().toISOString(),
      platform: "TRAIL Career Roadmaps",
      data: rData,
    };
  }

  return res.json();
}

/**
 * Fetch curated learning resources from backend with search and filtering
 */
export async function fetchResources(params = {}) {
  const query = new URLSearchParams();
  if (params.category && params.category !== "All") query.set("category", params.category);
  if (params.type && params.type !== "All") query.set("type", params.type);
  if (params.difficulty && params.difficulty !== "All") query.set("difficulty", params.difficulty);
  if (params.search) query.set("search", params.search);
  if (params.skillSlug) query.set("skillSlug", params.skillSlug);

  const url = `${API_BASE}/resources${query.toString() ? `?${query.toString()}` : ""}`;
  const res = await fetch(url, { headers: getAuthHeaders() });

  if (!res.ok) throw new Error("Failed to fetch resources");
  const data = await res.json();
  return data.resources || [];
}

/**
 * Resource Bookmarks via Backend API (with graceful localStorage sync)
 */
export async function fetchBookmarkedResourceIds() {
  const token = localStorage.getItem("trail_auth_token");
  const userId = getCurrentUserId();

  if (!token || userId === "guest") {
    try {
      const raw = localStorage.getItem(`trail_saved_resources_guest`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  try {
    const res = await fetch(`${API_BASE}/resources/bookmarks`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.bookmarkedIds || [];
  } catch {
    const raw = localStorage.getItem(`trail_saved_resources_${userId}`);
    return raw ? JSON.parse(raw) : [];
  }
}

export async function toggleBookmarkResource(resourceId) {
  const token = localStorage.getItem("trail_auth_token");
  const userId = getCurrentUserId();

  if (!token || userId === "guest") {
    throw new Error("Login to save resources");
  }

  try {
    const res = await fetch(`${API_BASE}/resources/bookmarks/${resourceId}`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error();
    const data = await res.json();
    localStorage.setItem(`trail_saved_resources_${userId}`, JSON.stringify(data.bookmarkedIds));
    return { isBookmarked: data.isBookmarked, bookmarkedIds: data.bookmarkedIds };
  } catch {
    // Local fallback
    const raw = localStorage.getItem(`trail_saved_resources_${userId}`);
    const current = raw ? JSON.parse(raw) : [];
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
}
