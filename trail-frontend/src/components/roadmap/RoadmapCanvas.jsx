import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import {
  FiBookmark,
  FiCheck,
  FiDownload,
  FiActivity,
  FiPlay,
} from "react-icons/fi";

import SkillNode from "./SkillNode";
import SkillDetailPanel from "./SkillDetailPanel";
import {
  fetchProgress,
  updateSkillStatus,
  saveRoadmap,
  unsaveRoadmap,
  isRoadmapSaved,
  exportRoadmapData,
  startJourney,
  isJourneyStarted,
} from "../../services/api";

const nodeWidth = 270;
const nodeHeight = 115;

const layoutGraph = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: "TB",
    ranksep: 70,
    nodesep: 45,
    marginx: 30,
    marginy: 30,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPos = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: "top",
      sourcePosition: "bottom",
      position: {
        x: nodeWithPos.x - nodeWidth / 2,
        y: nodeWithPos.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const nodeTypes = {
  skillNode: SkillNode,
};

const RoadmapCanvas = ({
  roadmapData,
  isLoggedIn = false,
  onSaveStateChange,
}) => {
  const navigate = useNavigate();
  const reactFlowWrapper = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const [skillsMap, setSkillsMap] = useState({});
  const [progressStats, setProgressStats] = useState({
    completed: 0,
    total: 0,
    pct: 0,
  });

  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasStartedJourney, setHasStartedJourney] = useState(false);
  const [startingJourney, setStartingJourney] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);

  const slug = roadmapData?.roadmap?.slug || "";
  const roleName = roadmapData?.roadmap?.role || "Career Roadmap";

  // Check saved state, journey state, and user progress
  useEffect(() => {
    let isMounted = true;
    if (slug) {
      isRoadmapSaved(slug).then((saved) => {
        if (isMounted) setIsSaved(saved);
      });

      isJourneyStarted(slug).then((started) => {
        if (isMounted) setHasStartedJourney(started);
      });

      fetchProgress(slug)
        .then((prog) => {
          if (!isMounted) return;
          const sMap = prog.skillsMap || {};
          setSkillsMap(sMap);
          const total = roadmapData?.nodes?.length || 10;
          const completed = prog.completedSkills?.length || 0;
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
          setProgressStats({ completed, total, pct });
        })
        .catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, [slug, roadmapData?.nodes?.length]);

  // Handle node click to open details panel
  const handleNodeClick = useCallback(
    (skillData) => {
      setSelectedSkill(skillData);
      setIsPanelOpen(true);
    },
    []
  );

  // Compute graph layout whenever roadmapData or skillsMap changes
  useEffect(() => {
    if (!roadmapData?.nodes || !roadmapData?.edges) return;

    const rawNodes = roadmapData.nodes.map((n) => {
      const status = skillsMap[n.id] || "not-started";
      return {
        id: n.id,
        type: "skillNode",
        data: {
          ...n,
          status,
          onClick: () => handleNodeClick(n),
        },
        position: { x: 0, y: 0 },
      };
    });

    const completedIds = new Set(
      Object.keys(skillsMap).filter((id) => skillsMap[id] === "completed")
    );
    const inProgressIds = new Set(
      Object.keys(skillsMap).filter((id) => skillsMap[id] === "in-progress")
    );

    const rawEdges = roadmapData.edges.map((e) => {
      const isSourceActive = completedIds.has(e.source) || inProgressIds.has(e.source);
      const isTargetActive = completedIds.has(e.target) || inProgressIds.has(e.target);
      const isPathActive = isSourceActive && (isTargetActive || completedIds.has(e.source));

      return {
        id: e.id || `e-${e.source}-${e.target}`,
        source: e.source,
        target: e.target,
        type: "smoothstep",
        animated: isPathActive,
        style: {
          stroke: isPathActive ? "#6D3DF5" : "#CBD5E1",
          strokeWidth: isPathActive ? 2.5 : 1.5,
          filter: isPathActive ? "drop-shadow(0 0 3px rgba(109,61,245,0.4))" : "none",
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 14,
          height: 14,
          color: isPathActive ? "#6D3DF5" : "#94A3B8",
        },
      };
    });

    const { nodes: layoutedNodes, edges: layoutedEdges } = layoutGraph(
      rawNodes,
      rawEdges
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [roadmapData, skillsMap, handleNodeClick, setNodes, setEdges]);

  // Handle Start Journey button click
  const handleStartJourney = async () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/explore/${slug}` } });
      return;
    }

    setStartingJourney(true);
    try {
      await startJourney(slug);
      setHasStartedJourney(true);
    } catch {
      // ignore
    } finally {
      setStartingJourney(false);
    }
  };

  // Handle skill status update
  const handleStatusChange = async (skillId, newStatus) => {
    // If not yet started journey, auto-mark journey started
    if (!hasStartedJourney) {
      setHasStartedJourney(true);
    }

    // Optimistic state update
    const updatedMap = { ...skillsMap, [skillId]: newStatus };
    setSkillsMap(updatedMap);

    const total = roadmapData?.nodes?.length || 10;
    const completedCount = Object.values(updatedMap).filter(
      (s) => s === "completed"
    ).length;
    const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    setProgressStats({ completed: completedCount, total, pct });

    try {
      await updateSkillStatus(slug, skillId, newStatus);
    } catch {
      // ignore
    }
  };

  // Handle Save / Unsave
  const handleToggleSave = async () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/explore/${slug}` } });
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        await unsaveRoadmap(slug);
        setIsSaved(false);
      } else {
        await saveRoadmap(slug);
        setIsSaved(true);
      }
      if (onSaveStateChange) onSaveStateChange(!isSaved);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  // Handle Export / Download
  const handleExport = async () => {
    try {
      const exportPayload = await exportRoadmapData(slug);
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${slug}-trail-roadmap.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setExportNotice(true);
      setTimeout(() => setExportNotice(false), 3000);
    } catch {
      // ignore
    }
  };

  const stagesList = useMemo(() => {
    return [
      { name: "Foundation", color: "bg-blue-50 text-blue-700 border-blue-200" },
      { name: "Core", color: "bg-purple-50 text-purple-700 border-purple-200" },
      { name: "Database", color: "bg-teal-50 text-teal-700 border-teal-200" },
      { name: "Advanced", color: "bg-amber-50 text-amber-700 border-amber-200" },
      { name: "Tools & Deployment", color: "bg-rose-50 text-rose-700 border-rose-200" },
    ];
  }, []);

  return (
    <div className="relative w-full rounded-3xl border border-stone-200/90 bg-white overflow-hidden shadow-[0_15px_45px_-12px_rgba(17,24,39,0.06)]">
      {/* ── Top Header Controls Bar (Light Theme) ─────────────────────────── */}
      <div className="relative z-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 sm:p-6 border-b border-stone-200/80 bg-white/95 backdrop-blur-md">
        {/* Left: Role info */}
        <div>
          <h2 className="text-xl sm:text-2xl font-geist font-bold text-[#111827] tracking-tight">
            {roleName}
          </h2>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            Based on live job market demand
          </p>
        </div>

        {/* Right: Progress bar & Actions */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Progress bar (for logged-in user) */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3 bg-[#FAF9FF] px-4 py-2.5 rounded-2xl border border-stone-200">
              <div className="text-right">
                <div className="text-xs font-bold text-[#111827]">
                  {progressStats.pct}% Mastered
                </div>
                <div className="text-[11px] text-stone-500">
                  {progressStats.completed} / {progressStats.total} skills
                </div>
              </div>

              <div className="w-24 sm:w-28 h-2 rounded-full bg-stone-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#6D3DF5] to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressStats.pct}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-stone-500 bg-[#FAF9FF] px-3.5 py-2 rounded-xl border border-stone-200">
              <FiActivity className="w-3.5 h-3.5 text-[#6D3DF5]" />
              <span className="font-medium">{roadmapData?.nodes?.length || 0} Modules</span>
            </div>
          )}

          {/* Start Journey Primary Action */}
          <button
            onClick={handleStartJourney}
            disabled={startingJourney}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm ${
              hasStartedJourney
                ? "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100"
                : "bg-gradient-to-r from-[#6D3DF5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#9577F4] text-white shadow-md shadow-[#6D3DF5]/25 active:scale-[0.98]"
            }`}
          >
            {hasStartedJourney ? (
              <>
                <FiCheck className="w-4 h-4 text-emerald-600" />
                <span>In Progress</span>
              </>
            ) : (
              <>
                <FiPlay className="w-3.5 h-3.5" />
                <span>Start Journey</span>
              </>
            )}
          </button>

          {/* Action buttons: Save & Export */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSave}
              disabled={saving}
              className={`p-2.5 rounded-xl border transition-all ${
                isSaved
                  ? "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100"
                  : "bg-white text-stone-600 border-stone-200 hover:border-[#6D3DF5]/40 hover:text-[#6D3DF5] hover:bg-[#FAF9FF]"
              }`}
              title={isSaved ? "Saved to your list" : "Bookmark this roadmap"}
            >
              <FiBookmark className={`w-4 h-4 ${isSaved ? "fill-amber-500" : ""}`} />
            </button>

            <button
              onClick={handleExport}
              title="Download roadmap JSON data"
              className="p-2.5 rounded-xl bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 hover:text-[#111827] transition-colors"
            >
              <FiDownload className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Export notification toast */}
      {exportNotice && (
        <div className="absolute top-20 right-6 z-30 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg flex items-center gap-1.5 animate-bounce">
          <FiCheck className="w-4 h-4" />
          Roadmap exported successfully!
        </div>
      )}

      {/* ── React Flow Canvas Container (Light Theme) ─────────────────────── */}
      <div
        ref={reactFlowWrapper}
        data-lenis-prevent
        className="w-full h-[520px] sm:h-[660px] relative bg-[#FAF9FF]"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.22 }}
          minZoom={0.25}
          maxZoom={1.5}
          zoomOnScroll={true}
          panOnDrag={true}
          preventScrolling={false}
          className="react-flow-trail-light"
        >
          <Background
            color="#7C3AED"
            gap={26}
            size={1}
            style={{ opacity: 0.08 }}
          />

          <Controls
            className="!bg-white !border !border-stone-200 !rounded-xl !shadow-md !overflow-hidden [&>button]:!bg-white [&>button]:!border-b [&>button]:!border-stone-200 [&>button]:!text-stone-700 hover:[&>button]:!bg-[#FAF9FF] hover:[&>button]:!text-[#6D3DF5]"
          />

          <MiniMap
            zoomable
            pannable
            nodeColor={(node) => {
              const status = node.data?.status;
              if (status === "completed") return "#10B981";
              if (status === "in-progress") return "#8B5CF6";
              return "#E2E8F0";
            }}
            className="!bg-white !border !border-stone-200 !rounded-xl !overflow-hidden !shadow-md"
            maskColor="rgba(241, 245, 249, 0.75)"
          />
        </ReactFlow>

        {/* Floating Stage Legend Pill (Light Theme) */}
        <div className="pointer-events-none absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-2 p-2 rounded-xl bg-white/95 border border-stone-200 shadow-sm backdrop-blur-md">
          <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider font-exo pl-1">
            Stages:
          </span>
          {stagesList.map((st) => (
            <span
              key={st.name}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${st.color}`}
            >
              {st.name}
            </span>
          ))}
        </div>
      </div>

      {/* ── Slide-in Node Detail Drawer (Light Theme) ─────────────────────── */}
      <SkillDetailPanel
        skill={selectedSkill}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        currentStatus={
          selectedSkill ? skillsMap[selectedSkill.id] || "not-started" : "not-started"
        }
        onStatusChange={handleStatusChange}
        isLoggedIn={isLoggedIn}
        roadmapSlug={slug}
        allNodes={roadmapData?.nodes || []}
        allEdges={roadmapData?.edges || []}
        roleName={roleName}
        onSelectSkill={(skillId) => {
          const found = (roadmapData?.nodes || []).find((n) => n.id === skillId);
          if (found) setSelectedSkill(found);
        }}
        hasStartedJourney={hasStartedJourney}
        onStartJourney={handleStartJourney}
        startingJourney={startingJourney}
      />
    </div>
  );
};

export default RoadmapCanvas;