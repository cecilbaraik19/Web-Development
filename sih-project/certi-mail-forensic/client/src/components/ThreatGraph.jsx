import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import * as d3 from 'd3';
import { Maximize2, X, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

export default function ThreatGraph({ graphData, title = "Threat Relationship Graph" }) {
  const containerRef = useRef(null);
  const fgRef = useRef(null);
  const fullscreenWrapperRef = useRef(null);
  const fullscreenFgRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [dimensions, setDimensions] = useState({ width: 300, height: 260 });
  const [fsDimensions, setFsDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth || 300,
          height: containerRef.current.clientHeight || 260,
        });
      }
      setFsDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 70,
      });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Applies stronger repulsion + collision detection so nodes spread out
  // instead of clumping together — this is what actually fixes overlap,
  // not just making the canvas bigger.
  const tuneForces = (ref, nodeCount) => {
    if (!ref.current) return;
    const spread = nodeCount > 12 ? 260 : nodeCount > 6 ? 180 : 120;
    ref.current.d3Force('charge', d3.forceManyBody().strength(-spread));
    ref.current.d3Force('link').distance(90).strength(0.5);
    ref.current.d3Force('collide', d3.forceCollide().radius((n) =>
      (n.type === 'current_case' || n.type === 'related_case') ? 34 : 26
    ).strength(0.9));
  };

  useEffect(() => {
    if (fgRef.current && graphData?.nodes?.length > 0) {
      tuneForces(fgRef, graphData.nodes.length);
      setTimeout(() => fgRef.current.zoomToFit(600, 50), 500);
    }
  }, [graphData]);

  useEffect(() => {
    if (isFullscreen && fullscreenFgRef.current && graphData?.nodes?.length > 0) {
      tuneForces(fullscreenFgRef, graphData.nodes.length);
      setTimeout(() => fullscreenFgRef.current.zoomToFit(600, 90), 550);
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const enterFullscreen = async () => {
    try {
      if (fullscreenWrapperRef.current?.requestFullscreen) {
        await fullscreenWrapperRef.current.requestFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen request failed:', err);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Exit fullscreen failed:', err);
    }
  };

  const resetView = () => {
    const ref = isFullscreen ? fullscreenFgRef : fgRef;
    if (ref.current) ref.current.zoomToFit(600, isFullscreen ? 90 : 50);
  };

  const zoomBy = (factor) => {
    const ref = isFullscreen ? fullscreenFgRef : fgRef;
    if (ref.current) {
      const currentZoom = ref.current.zoom();
      ref.current.zoom(currentZoom * factor, 300);
    }
  };

  if (!graphData?.nodes?.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-500 text-xs">
        No correlation graph data available.
      </div>
    );
  }

  const formattedData = {
    nodes: graphData.nodes.map((node) => ({ id: node.id, label: node.label || node.id, type: node.type || 'default' })),
    links: (graphData.links || []).map((link) => ({ source: link.source, target: link.target, relation: link.relation || '' })),
  };

  const nodeColor = (type) => {
    switch (type) {
      case 'domain': return '#38bdf8';
      case 'ip': return '#f43f5e';
      case 'isp': return '#c084fc';
      case 'user': return '#34d399';
      case 'current_case': return '#facc15';
      case 'related_case': return '#fb923c';
      default: return '#94a3b8';
    }
  };

  // Labels declutter automatically based on zoom level: when zoomed out on a
  // dense graph, only the most important labels (current case, IP, ISP,
  // domain) show, to avoid a wall of overlapping text. Zooming in (scroll
  // wheel or pinch) reveals every label clearly, one at a time as space opens up.
  const nodeCanvasObjectFn = (labelScale = 1, declutterThreshold = 0.55) => (node, ctx, globalScale) => {
    if (typeof node.x !== 'number' || typeof node.y !== 'number') return;
    const label = node.label || node.id;
    const color = nodeColor(node.type);
    const radius = (node.type === 'current_case' || node.type === 'related_case') ? 6 : 5;

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius + 4, 0, Math.PI * 2);
    ctx.fillStyle = `${color}33`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius + 1, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();

    const isPriority = node.type === 'current_case' || node.type === 'ip' || node.type === 'isp';
    const shouldShowLabel = globalScale >= declutterThreshold || isPriority;
    if (!shouldShowLabel) return;

    const fontSize = Math.max((11 * labelScale) / globalScale, 3.5 * labelScale);
    ctx.font = `600 ${fontSize}px Inter, sans-serif`;
    const textWidth = ctx.measureText(label).width;
    const padX = 4;
    ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
    ctx.fillRect(node.x + radius + 3, node.y - fontSize / 2 - 2, textWidth + padX * 2, fontSize + 4);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(label, node.x + radius + 3 + padX, node.y);
  };

  const linkCanvasObjectFn = (labelScale = 1, declutterThreshold = 0.7) => (link, ctx, globalScale) => {
    if (!link.relation || globalScale < declutterThreshold) return;
    const start = link.source, end = link.target;
    if (!start || !end || typeof start.x !== 'number' || typeof end.x !== 'number') return;

    const midX = (start.x + end.x) / 2, midY = (start.y + end.y) / 2;
    const fontSize = Math.max((9 * labelScale) / globalScale, 3 * labelScale);
    ctx.font = `500 ${fontSize}px Inter, sans-serif`;
    const textWidth = ctx.measureText(link.relation).width;
    const boxWidth = textWidth + 10, boxHeight = fontSize + 6;

    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.roundRect(midX - boxWidth / 2, midY - boxHeight / 2, boxWidth, boxHeight, 3);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(link.relation, midX, midY);
  };

  const Legend = () => (
    <div className="flex items-center gap-3 text-[10px] flex-wrap">
      <span className="flex items-center gap-1 text-sky-400"><span className="w-2 h-2 rounded-full bg-sky-400"></span> Domain</span>
      <span className="flex items-center gap-1 text-rose-400"><span className="w-2 h-2 rounded-full bg-rose-400"></span> IP</span>
      <span className="flex items-center gap-1 text-purple-400"><span className="w-2 h-2 rounded-full bg-purple-400"></span> ISP</span>
      <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> User</span>
      {formattedData.nodes.some(n => n.type === 'current_case' || n.type === 'related_case') && (
        <>
          <span className="flex items-center gap-1 text-yellow-400"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> This Case</span>
          <span className="flex items-center gap-1 text-orange-400"><span className="w-2 h-2 rounded-full bg-orange-400"></span> Related Case</span>
        </>
      )}
    </div>
  );

  const ViewControls = () => (
    <div className="flex items-center gap-1">
      <button onClick={() => zoomBy(1.4)} className="p-1.5 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded transition-colors" title="Zoom in">
        <ZoomIn size={13} />
      </button>
      <button onClick={() => zoomBy(0.7)} className="p-1.5 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded transition-colors" title="Zoom out">
        <ZoomOut size={13} />
      </button>
      <button onClick={resetView} className="p-1.5 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded transition-colors" title="Reset view / fit all nodes">
        <RotateCcw size={13} />
      </button>
    </div>
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-slate-400">{title}</h4>
        <div className="flex items-center gap-3">
          <Legend />
          <ViewControls />
          <button
            onClick={enterFullscreen}
            className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 bg-slate-950 border border-slate-800 px-2 py-1 rounded transition-colors shrink-0"
            title="Open fullscreen"
          >
            <Maximize2 size={11} /> Fullscreen
          </button>
        </div>
      </div>

      <p className="text-[10px] text-slate-500 mb-2">
        Scroll or use +/- to zoom in — labels appear clearly as you zoom. Drag nodes to rearrange.
      </p>

      <div
        ref={fullscreenWrapperRef}
        className={isFullscreen ? "bg-slate-950 flex flex-col w-screen h-screen" : ""}
      >
        {isFullscreen && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0 bg-slate-950">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <Legend />
              <ViewControls />
            </div>
            <button
              onClick={exitFullscreen}
              className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <X size={14} /> Exit Fullscreen (Esc)
            </button>
          </div>
        )}

        <div
          ref={containerRef}
          className={isFullscreen ? "flex-1 relative bg-slate-950" : "h-72 border border-slate-800 rounded-lg overflow-hidden bg-slate-950 relative"}
        >
          <ForceGraph2D
            ref={isFullscreen ? fullscreenFgRef : fgRef}
            width={isFullscreen ? fsDimensions.width : dimensions.width}
            height={isFullscreen ? fsDimensions.height : dimensions.height}
            graphData={formattedData}
            linkColor={() => '#64748b'}
            linkWidth={isFullscreen ? 2.5 : 2}
            linkDirectionalArrowLength={isFullscreen ? 8 : 6}
            linkDirectionalArrowRelPos={0.9}
            linkDirectionalArrowColor={() => '#38bdf8'}
            cooldownTicks={200}
            d3AlphaDecay={0.012}
            d3VelocityDecay={0.35}
            warmupTicks={50}
            onEngineStop={() => {
              const ref = isFullscreen ? fullscreenFgRef : fgRef;
              if (ref.current) ref.current.zoomToFit(600, isFullscreen ? 90 : 50);
            }}
            nodeRelSize={isFullscreen ? 9 : 7}
            nodeCanvasObject={nodeCanvasObjectFn(isFullscreen ? 1.6 : 1, isFullscreen ? 0.4 : 0.55)}
            linkCanvasObjectMode={() => 'after'}
            linkCanvasObject={linkCanvasObjectFn(isFullscreen ? 1.6 : 1, isFullscreen ? 0.5 : 0.7)}
            enableNodeDrag={true}
            enableZoomInteraction={true}
            enablePanInteraction={true}
            nodePointerAreaPaint={(node, color, ctx) => {
              ctx.fillStyle = color;
              ctx.beginPath();
              ctx.arc(node.x, node.y, isFullscreen ? 16 : 12, 0, Math.PI * 2);
              ctx.fill();
            }}
          />
        </div>
      </div>
    </div>
  );
}