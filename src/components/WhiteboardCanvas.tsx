import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Pen,
  Highlighter,
  Eraser,
  Move,
  StickyNote,
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Copy,
  Check,
  Grid,
  FileText,
  Share2,
  Maximize2,
  Minimize2,
  Sparkles,
  Link2,
  Target,
  ArrowRight,
  HelpCircle,
  Unlink,
  RefreshCw,
  Search
} from "lucide-react";

export interface CanvasNode {
  id: string;
  type: "sticky" | "problem-card" | "hmw-card" | "metric-card";
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  content: string;
  color: string;
  category?: string;
  justification?: string;
  connectedTo?: string[];
}

export interface DrawingPath {
  points: { x: number; y: number }[];
  color: string;
  width: number;
  tool: "pen" | "highlighter";
}

const DEFAULT_NODES: CanvasNode[] = [
  {
    id: "node-1",
    type: "problem-card",
    x: 80,
    y: 90,
    width: 320,
    height: 220,
    title: "01. Core Problem Statement",
    category: "Root Failure Mode",
    content: "Digital whiteboards lack cognitive scaffolding. Distributed teams succumb to unconstrained post-it sprawl and premature wireframing before defining root failure vectors.",
    justification: "Teams solve the wrong problem 74% of the time when architectural intent is not causally grounded.",
    color: "#EFECE6",
    connectedTo: ["node-2", "node-3"]
  },
  {
    id: "node-2",
    type: "sticky",
    x: 450,
    y: 80,
    width: 240,
    height: 180,
    title: "Hypothesis: Particle Physics",
    category: "Cognitive Feedback",
    content: "Simulating material inertia (100k liquid particles) provides visual weight to early ideas—turning nebulous brainstorms into physical-feeling commitments.",
    color: "#FDE68A", // warm amber
    connectedTo: ["node-4"]
  },
  {
    id: "node-3",
    type: "hmw-card",
    x: 450,
    y: 290,
    width: 270,
    height: 190,
    title: "How Might We?",
    category: "Cross-Disciplinary",
    content: "How might we automatically compile designer affordances, engineering state machines, and product retention metrics into one unified visual problem topology?",
    justification: "Bridges the 41% specification handoff gap between Design & Eng.",
    color: "#E0E7FF", // soft indigo
    connectedTo: ["node-5"]
  },
  {
    id: "node-4",
    type: "metric-card",
    x: 770,
    y: 90,
    width: 240,
    height: 170,
    title: "Verification Metric",
    category: "Empirical Proof",
    content: "Target: 82% First-pass architectural consensus. Zero requirement rework attributable to unverified assumptions.",
    color: "#DCFCE7", // soft emerald
  },
  {
    id: "node-5",
    type: "sticky",
    x: 770,
    y: 300,
    width: 240,
    height: 180,
    title: "AI Prompt Synthesis",
    category: "Continuous Traceability",
    content: "Directly synthesize whiteboard nodes into structured LLM prompts. Prevents intent evaporation during downstream implementation.",
    color: "#FCE7F3", // soft rose
  }
];

const FIVE_WHYS_TEMPLATE: CanvasNode[] = [
  {
    id: "why-1",
    type: "problem-card",
    x: 60,
    y: 120,
    width: 280,
    height: 190,
    title: "1. Surface Symptom",
    category: "Initial Failure",
    content: "Engineers built a feature that customers rejected within 2 weeks of launch.",
    justification: "Why did this happen? The requirements were based on untested opinions.",
    color: "#FEE2E2",
    connectedTo: ["why-2"]
  },
  {
    id: "why-2",
    type: "sticky",
    x: 380,
    y: 120,
    width: 260,
    height: 180,
    title: "2. Why? Premature Wireframes",
    category: "Process Vulnerability",
    content: "Designers jumped directly to Figma screens during the brainstorm without articulating problem criteria.",
    justification: "Why? Traditional whiteboards reward high-fidelity drawing over causal reasoning.",
    color: "#FEF3C7",
    connectedTo: ["why-3"]
  },
  {
    id: "why-3",
    type: "problem-card",
    x: 680,
    y: 120,
    width: 290,
    height: 200,
    title: "3. Root Cause & Solution",
    category: "Causal Resolution",
    content: "Enforce 'Why Before What' node gating in FORMA Whiteboard: no UI card exists without an empirical justification parent.",
    justification: "Blocks 74% of premature convergence failure modes.",
    color: "#D1FAE5"
  }
];

export default function WhiteboardCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Tools & States
  const [tool, setTool] = useState<"pen" | "highlighter" | "eraser" | "select">("select");
  const [strokeColor, setStrokeColor] = useState<string>("#151514");
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [gridStyle, setGridStyle] = useState<"dots" | "grid" | "none">("dots");

  // Nodes & Drawing paths
  const [nodes, setNodes] = useState<CanvasNode[]>(DEFAULT_NODES);
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [currentPath, setCurrentPath] = useState<DrawingPath | null>(null);
  const [activeDraggingNodeId, setActiveDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Node Linking State
  const [linkingFromId, setLinkingFromId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Resize canvas to container
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth;
    const height = container.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
    renderCanvas();
  }, [paths, currentPath, nodes, pan, zoom, gridStyle]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // Redraw canvas content (drawings, connectors, grid)
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply pan and zoom
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Render Grid
    if (gridStyle === "dots") {
      ctx.fillStyle = "rgba(100, 100, 100, 0.18)";
      const gridSize = 28;
      const startX = Math.floor(-pan.x / zoom / gridSize) * gridSize;
      const endX = startX + (container.clientWidth / zoom) + gridSize * 2;
      const startY = Math.floor(-pan.y / zoom / gridSize) * gridSize;
      const endY = startY + (container.clientHeight / zoom) + gridSize * 2;

      for (let x = startX; x < endX; x += gridSize) {
        for (let y = startY; y < endY; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2 / zoom, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (gridStyle === "grid") {
      ctx.strokeStyle = "rgba(100, 100, 100, 0.08)";
      ctx.lineWidth = 1 / zoom;
      const gridSize = 32;
      const startX = Math.floor(-pan.x / zoom / gridSize) * gridSize;
      const endX = startX + (container.clientWidth / zoom) + gridSize * 2;
      const startY = Math.floor(-pan.y / zoom / gridSize) * gridSize;
      const endY = startY + (container.clientHeight / zoom) + gridSize * 2;

      ctx.beginPath();
      for (let x = startX; x < endX; x += gridSize) {
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
      }
      for (let y = startY; y < endY; y += gridSize) {
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
      }
      ctx.stroke();
    }

    // Render Connectors between nodes
    nodes.forEach((node) => {
      if (node.connectedTo && node.connectedTo.length > 0) {
        node.connectedTo.forEach((targetId) => {
          const targetNode = nodes.find((n) => n.id === targetId);
          if (!targetNode) return;

          const startX = node.x + node.width;
          const startY = node.y + node.height / 2;
          const endX = targetNode.x;
          const endY = targetNode.y + targetNode.height / 2;

          ctx.save();
          ctx.strokeStyle = "rgba(140, 130, 120, 0.55)";
          ctx.lineWidth = 2.2;
          ctx.setLineDash([6, 4]);

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          const cp1x = startX + (endX - startX) * 0.5;
          const cp1y = startY;
          const cp2x = startX + (endX - startX) * 0.5;
          const cp2y = endY;
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
          ctx.stroke();

          // Arrowhead
          ctx.setLineDash([]);
          ctx.fillStyle = "rgba(140, 130, 120, 0.85)";
          ctx.beginPath();
          ctx.arc(endX, endY, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }
    });

    // Render Drawing Paths
    const allPaths = currentPath ? [...paths, currentPath] : paths;
    allPaths.forEach((p) => {
      if (p.points.length < 2) return;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(p.points[0].x, p.points[0].y);

      for (let i = 1; i < p.points.length; i++) {
        const xc = (p.points[i].x + p.points[i - 1].x) / 2;
        const yc = (p.points[i].y + p.points[i - 1].y) / 2;
        ctx.quadraticCurveTo(p.points[i - 1].x, p.points[i - 1].y, xc, yc);
      }

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (p.tool === "highlighter") {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.width * 2.5;
        ctx.globalAlpha = 0.35;
      } else {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.width;
        ctx.globalAlpha = 0.9;
      }

      ctx.stroke();
      ctx.restore();
    });

    ctx.restore();
  }, [pan, zoom, gridStyle, nodes, paths, currentPath]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Pointer Handlers for Canvas Drawing / Panning
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (linkingFromId) {
      // Cancel linking mode if clicking empty canvas
      setLinkingFromId(null);
      return;
    }

    if (tool === "select" || e.button === 1 || e.altKey) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    if (tool === "pen" || tool === "highlighter") {
      const coords = getCanvasCoords(e);
      setCurrentPath({
        points: [coords],
        color: strokeColor,
        width: strokeWidth,
        tool,
      });
    } else if (tool === "eraser") {
      const coords = getCanvasCoords(e);
      setPaths((prev) =>
        prev.filter((p) => {
          const isNear = p.points.some(
            (pt) => Math.hypot(pt.x - coords.x, pt.y - coords.y) < 18
          );
          return !isNear;
        })
      );
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      return;
    }

    if (currentPath && (tool === "pen" || tool === "highlighter")) {
      const coords = getCanvasCoords(e);
      setCurrentPath((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          points: [...prev.points, coords],
        };
      });
    }
  };

  const handlePointerUp = () => {
    if (isPanning) {
      setIsPanning(false);
    }
    if (currentPath) {
      setPaths((prev) => [...prev, currentPath]);
      setCurrentPath(null);
    }
  };

  // Node Dragging & Linking Handlers
  const handleNodePointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();

    // If in linking mode, toggle connection to this node
    if (linkingFromId) {
      if (linkingFromId !== id) {
        setNodes((prev) =>
          prev.map((n) => {
            if (n.id === linkingFromId) {
              const currentConnections = n.connectedTo || [];
              const alreadyConnected = currentConnections.includes(id);
              const updated = alreadyConnected
                ? currentConnections.filter((c) => c !== id)
                : [...currentConnections, id];
              return { ...n, connectedTo: updated };
            }
            return n;
          })
        );
      }
      setLinkingFromId(null);
      return;
    }

    setActiveDraggingNodeId(id);
    const node = nodes.find((n) => n.id === id);
    if (node) {
      setDragOffset({
        x: (e.clientX - pan.x) / zoom - node.x,
        y: (e.clientY - pan.y) / zoom - node.y,
      });
    }
  };

  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (linkingFromId === id) {
      setLinkingFromId(null);
    } else {
      setLinkingFromId(id);
    }
  };

  const handleGlobalPointerMove = (e: React.PointerEvent) => {
    if (activeDraggingNodeId) {
      const currentX = (e.clientX - pan.x) / zoom - dragOffset.x;
      const currentY = (e.clientY - pan.y) / zoom - dragOffset.y;

      setNodes((prev) =>
        prev.map((n) =>
          n.id === activeDraggingNodeId
            ? { ...n, x: Math.round(currentX), y: Math.round(currentY) }
            : n
        )
      );
    }
  };

  const handleGlobalPointerUp = () => {
    if (activeDraggingNodeId) {
      setActiveDraggingNodeId(null);
    }
  };

  // Add new nodes
  const addSticky = () => {
    const newNode: CanvasNode = {
      id: `sticky-${Date.now()}`,
      type: "sticky",
      x: Math.round(-pan.x / zoom + 200 + Math.random() * 80),
      y: Math.round(-pan.y / zoom + 160 + Math.random() * 80),
      width: 240,
      height: 180,
      title: "New Insight",
      category: "Ideation Note",
      content: "Type your observation, tension, or hypothesis here...",
      color: "#FEF08A",
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const addProblemCard = () => {
    const newNode: CanvasNode = {
      id: `problem-${Date.now()}`,
      type: "problem-card",
      x: Math.round(-pan.x / zoom + 220 + Math.random() * 80),
      y: Math.round(-pan.y / zoom + 180 + Math.random() * 80),
      width: 320,
      height: 220,
      title: "Problem Statement Vector",
      category: "Architectural Constraint",
      content: "Articulate the precise failure mode and who is affected...",
      justification: "State why resolving this constraint is non-negotiable.",
      color: "#F5F5F4",
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const deleteNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
  };

  const updateNodeContent = (id: string, content: string) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, content } : n))
    );
  };

  const updateNodeTitle = (id: string, title: string) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, title } : n))
    );
  };

  // Template loaders
  const loadTemplate = (type: "default" | "5whys" | "clear") => {
    if (type === "default") {
      setNodes(DEFAULT_NODES);
      setPaths([]);
    } else if (type === "5whys") {
      setNodes(FIVE_WHYS_TEMPLATE);
      setPaths([]);
    } else if (type === "clear") {
      setNodes([]);
      setPaths([]);
    }
  };

  // Zoom controls
  const handleZoom = (delta: number) => {
    setZoom((z) => Math.min(2.5, Math.max(0.4, z + delta)));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Copy PRD / Whiteboard Topology as Markdown
  const copyAsMarkdown = () => {
    let md = `# FORMA Spatial Whiteboard — Problem Topology Brief\n\n`;
    md += `*Generated from live interactive canvas on ${new Date().toLocaleDateString()}*\n\n`;
    md += `## 1. Problem Statement & Hypotheses\n\n`;
    nodes.forEach((n, i) => {
      md += `### Node 0${i + 1}: ${n.title} (${n.category || n.type})\n`;
      md += `**Description:** ${n.content}\n\n`;
      if (n.justification) {
        md += `**Justification Thesis:** ${n.justification}\n\n`;
      }
      if (n.connectedTo && n.connectedTo.length > 0) {
        md += `**Causally Linked Nodes:** ${n.connectedTo.join(", ")}\n\n`;
      }
    });
    navigator.clipboard.writeText(md);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  // Download snapshot
  const downloadSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `forma-whiteboard-problem-statement-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Filtered nodes
  const filteredNodes = searchTerm.trim()
    ? nodes.filter(
        (n) =>
          n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (n.category && n.category.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : nodes;

  return (
    <section id="whiteboard" className="py-16 px-4 md:px-10 lg:px-16 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-neutral-500 mb-2">
            <span>Spatial Engine</span>
            <span aria-hidden="true">·</span>
            <span>Live Whiteboard Canvas</span>
            <span aria-hidden="true">·</span>
            <span>Interactive Node Topology</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-normal tracking-tight text-neutral-900 dark:text-neutral-100">
            Collaborative Problem Framing Studio
          </h2>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 mt-2 max-w-2xl font-normal">
            Drag problem nodes, sketch conceptual connections, or formulate justification pillars in real-time. Notice how structural constraints anchor raw intuition.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-end">
          {/* Template Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-xs font-mono">
            <button
              onClick={() => loadTemplate("default")}
              className="px-2.5 py-1 rounded-full text-[11px] text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
              title="Load Default Architecture"
            >
              Default
            </button>
            <button
              onClick={() => loadTemplate("5whys")}
              className="px-2.5 py-1 rounded-full text-[11px] text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
              title="Load 5-Whys Root Cause Template"
            >
              5 Whys
            </button>
            <button
              onClick={() => loadTemplate("clear")}
              className="px-2.5 py-1 rounded-full text-[11px] text-neutral-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Clear Canvas"
            >
              Clear
            </button>
          </div>

          <button
            onClick={copyAsMarkdown}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            {copiedNotification ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Copied Brief</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Export Markdown</span>
              </>
            )}
          </button>
          <button
            onClick={downloadSnapshot}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 transition-opacity"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>
        </div>
      </div>

      {/* Linking Mode Active Banner */}
      {linkingFromId && (
        <div className="mb-3 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-mono flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-amber-600 animate-pulse" />
            <span><strong>Causal Linking Mode:</strong> Click any other card to connect or disconnect a topological link.</span>
          </div>
          <button
            onClick={() => setLinkingFromId(null)}
            className="text-xs underline hover:opacity-80"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Main Whiteboard Container */}
      <div
        ref={containerRef}
        onPointerMove={handleGlobalPointerMove}
        onPointerUp={handleGlobalPointerUp}
        className={`relative w-full overflow-hidden rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-[#F4F2ED] dark:bg-[#141413] shadow-inner select-none transition-all ${
          isFullscreen ? "fixed inset-4 z-50 h-[calc(100vh-2rem)]" : "h-[680px]"
        }`}
      >
        {/* Floating Top-Left Toolbar */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-md">
          {/* Tool Selector */}
          <button
            onClick={() => setTool("select")}
            title="Pan & Select Nodes (V)"
            className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
              tool === "select"
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <Move className="w-4 h-4" />
            <span className="hidden sm:inline">Select / Pan</span>
          </button>

          <button
            onClick={() => setTool("pen")}
            title="Freehand Sketch Pen (P)"
            className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
              tool === "pen"
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <Pen className="w-4 h-4" />
            <span className="hidden sm:inline">Pen</span>
          </button>

          <button
            onClick={() => setTool("highlighter")}
            title="Highlighter (H)"
            className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
              tool === "highlighter"
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <Highlighter className="w-4 h-4" />
            <span className="hidden sm:inline">Highlight</span>
          </button>

          <button
            onClick={() => setTool("eraser")}
            title="Stroke Eraser (E)"
            className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
              tool === "eraser"
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <Eraser className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-neutral-300 dark:bg-neutral-700 mx-1" />

          {/* Stroke Palette */}
          {tool === "pen" || tool === "highlighter" ? (
            <div className="flex items-center gap-1">
              {[
                { col: "#151514", label: "Charcoal" },
                { col: "#B45309", label: "Amber" },
                { col: "#1E40AF", label: "Cobalt" },
                { col: "#991B1B", label: "Crimson" },
                { col: "#065F46", label: "Forest" },
              ].map((c) => (
                <button
                  key={c.col}
                  onClick={() => setStrokeColor(c.col)}
                  className={`w-5 h-5 rounded-full border transition-transform ${
                    strokeColor === c.col ? "scale-110 border-neutral-900 dark:border-white ring-2 ring-neutral-400/40" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.col }}
                  title={c.label}
                />
              ))}
            </div>
          ) : null}

          {/* Add Elements */}
          <div className="flex items-center gap-1">
            <button
              onClick={addSticky}
              className="p-2 rounded-lg text-xs flex items-center gap-1 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Add Sticky Note"
            >
              <StickyNote className="w-4 h-4 text-amber-500" />
              <span className="hidden md:inline">+ Note</span>
            </button>
            <button
              onClick={addProblemCard}
              className="p-2 rounded-lg text-xs flex items-center gap-1 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Add Problem Statement Vector"
            >
              <Target className="w-4 h-4 text-indigo-500" />
              <span className="hidden md:inline">+ Problem Node</span>
            </button>
          </div>
        </div>

        {/* Floating Top-Right View Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1.5 rounded-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-md">
          <button
            onClick={() => handleZoom(0.15)}
            className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono px-1.5 text-neutral-600 dark:text-neutral-400 tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => handleZoom(-0.15)}
            className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Reset View (100%)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setGridStyle((s) => (s === "dots" ? "grid" : s === "grid" ? "none" : "dots"))}
            className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title={`Toggle Grid: ${gridStyle}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen((f) => !f)}
            className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Toggle Fullscreen Canvas"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* HTML Canvas Layer for Drawing & Connectors */}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`absolute inset-0 z-0 touch-none ${
            linkingFromId 
              ? "cursor-alias" 
              : tool === "select" 
              ? "cursor-grab active:cursor-grabbing" 
              : "cursor-crosshair"
          }`}
        />

        {/* HTML DOM Layer for Draggable Interactive Cards */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
          }}
        >
          {filteredNodes.map((node) => {
            const isLinkingSource = linkingFromId === node.id;
            return (
              <div
                key={node.id}
                onPointerDown={(e) => handleNodePointerDown(e, node.id)}
                className={`absolute pointer-events-auto shadow-md hover:shadow-xl transition-all rounded-xl p-4 border cursor-move group ${
                  isLinkingSource 
                    ? "ring-2 ring-amber-500 scale-[1.03] border-amber-500" 
                    : "border-neutral-300/80 dark:border-neutral-700/80"
                }`}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  width: `${node.width}px`,
                  backgroundColor: node.color,
                  color: "#151514",
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-black/10">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider opacity-60">
                      {node.category || node.type}
                    </span>
                    <input
                      value={node.title}
                      onChange={(e) => updateNodeTitle(node.id, e.target.value)}
                      className="font-serif font-medium text-sm w-full bg-transparent border-none p-0 focus:outline-none focus:ring-1 focus:ring-black/30 rounded"
                    />
                  </div>
                  <button
                    onClick={() => deleteNode(node.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-neutral-500 hover:text-red-700 rounded transition-opacity"
                    title="Delete Node"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Editable Body */}
                <textarea
                  value={node.content}
                  onChange={(e) => updateNodeContent(node.id, e.target.value)}
                  rows={3}
                  className="w-full text-xs bg-transparent border-none p-0 resize-none focus:outline-none focus:ring-1 focus:ring-black/20 rounded font-normal leading-relaxed text-neutral-800"
                />

                {/* Justification Footer (if applicable) */}
                {node.justification ? (
                  <div className="mt-2 pt-2 border-t border-black/10 text-[11px] leading-tight text-neutral-700">
                    <span className="font-mono text-[9px] uppercase tracking-wider block opacity-70 mb-0.5">
                      Why This Matters (Justification)
                    </span>
                    {node.justification}
                  </div>
                ) : null}

                {/* Interactive Connection handle */}
                <button
                  type="button"
                  onClick={(e) => handleLinkClick(e, node.id)}
                  className={`absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all shadow-md ${
                    isLinkingSource 
                      ? "bg-amber-600 text-white opacity-100 ring-2 ring-amber-300 scale-110" 
                      : "bg-neutral-900 text-white opacity-0 group-hover:opacity-100 hover:scale-110"
                  }`}
                  title={isLinkingSource ? "Click another card to complete link (or click to cancel)" : "Click to link to another card"}
                >
                  <Link2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Helper Bar */}
        <div className="absolute bottom-3 left-4 z-20 flex items-center gap-3 text-[11px] font-mono text-neutral-500 pointer-events-none">
          <span>Alt + Drag to Pan</span>
          <span aria-hidden="true">·</span>
          <span>Click cards to edit</span>
          <span aria-hidden="true">·</span>
          <span>Click link node icon to connect cards</span>
        </div>
      </div>
    </section>
  );
}
