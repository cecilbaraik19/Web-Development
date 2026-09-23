import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Maximize2, X } from 'lucide-react';

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

  useEffect(() => {
    if (fgRef.current && graphData?.nodes?.length > 0) {
      setTimeout(() => fgRef.current.zoomToFit(500, 40), 400);
    }
  }, [graphData]);

  useEffect(() => {
    if (isFullscreen && fullscreenFgRef.current) {
      setTimeout(() => fullscreenFgRef.current.zoomToFit(500, 80), 450);
    }
  }, [isFullscreen]);

  // Sync React state with the browser's REAL fullscreen state — this is what
  // actually takes over the entire physical screen (hides tabs/address bar),
  // not just a large div. Works regardless of any parent CSS.
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

  const nodeCanvasObjectFn = (labelScale = 1) => (node, ctx, globalScale) => {
    if (typeof node.x !== 'number' || typeof node.y !== 'number') return;
    const label = node.label || node.id;
    const fontSize = Math.max((11 * labelScale) / globalScale, 3.5 * labelScale);
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

    ctx.font = `600 ${fontSize}px Inter, sans-serif`;
    const textWidth = ctx.measureText(label).width;
    const padX = 4;
    ctx.fillStyle = 'rgba(2, 6, 23, 0.8)';
    ctx.fillRect(node.x + radius + 3, node.y - fontSize / 2 - 2, textWidth + padX * 2, fontSize + 4);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(label, node.x + radius + 3 + padX, node.y);
  };

  const linkCanvasObjectFn = (labelScale = 1) => (link, ctx, globalScale) => {
    if (!link.relation) return;
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

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-slate-400">{title}</h4>
        <div className="flex items-center gap-3">
          <Legend />
          <button
            onClick={enterFullscreen}
            className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 bg-slate-950 border border-slate-800 px-2 py-1 rounded transition-colors shrink-0"
            title="Open fullscreen"
          >
            <Maximize2 size={11} /> Fullscreen
          </button>
        </div>
      </div>

      {/* This wrapper is what actually goes fullscreen via the browser's native API.
          When isFullscreen is true, it fills the ENTIRE physical screen (no browser
          chrome), guaranteed by the browser itself — not dependent on any CSS. */}
      <div
        ref={fullscreenWrapperRef}
        className={isFullscreen ? "bg-slate-950 flex flex-col w-screen h-screen" : ""}
      >
        {isFullscreen && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0 bg-slate-950">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <Legend />
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
            cooldownTicks={isFullscreen ? 150 : 120}
            d3AlphaDecay={isFullscreen ? 0.015 : 0.02}
            d3VelocityDecay={0.3}
            d3Force="charge"
            onEngineStop={() => {
              const ref = isFullscreen ? fullscreenFgRef : fgRef;
              if (ref.current) ref.current.zoomToFit(500, isFullscreen ? 80 : 40);
            }}
            nodeRelSize={isFullscreen ? 9 : 7}
            nodeCanvasObject={nodeCanvasObjectFn(isFullscreen ? 1.6 : 1)}
            linkCanvasObjectMode={() => 'after'}
            linkCanvasObject={linkCanvasObjectFn(isFullscreen ? 1.6 : 1)}
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