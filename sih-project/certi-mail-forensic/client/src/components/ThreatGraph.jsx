import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

export default function ThreatGraph({ graphData }) {
  const containerRef = useRef(null);
  const fgRef = useRef(null);

  const [dimensions, setDimensions] = useState({
    width: 300,
    height: 260,
  });

  // Responsive graph size
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth || 300,
          height: containerRef.current.clientHeight || 260,
        });
      }
    };

    updateDimensions();

    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Auto-fit graph whenever data changes
  useEffect(() => {
    if (fgRef.current && graphData?.nodes?.length > 0) {
      setTimeout(() => {
        fgRef.current.zoomToFit(500, 40);
      }, 400);
    }
  }, [graphData]);

  // Empty state
  if (!graphData?.nodes?.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-500 text-xs">
        No correlation graph data available.
      </div>
    );
  }

  const formattedData = {
    nodes: graphData.nodes.map((node) => ({
      id: node.id,
      label: node.label || node.id,
      type: node.type || 'default',
    })),

    links: (graphData.links || []).map((link) => ({
      source: link.source,
      target: link.target,
      relation: link.relation || '',
    })),
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-slate-400">
          Threat Relationship Graph
        </h4>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[10px]">

          <span className="flex items-center gap-1 text-sky-400">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            Domain
          </span>

          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            IP
          </span>

          <span className="flex items-center gap-1 text-purple-400">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            ISP
          </span>

          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            User
          </span>

        </div>
      </div>

      {/* Graph */}
      <div
        ref={containerRef}
        className="h-72 border border-slate-800 rounded-lg overflow-hidden bg-slate-950 relative"
      >

        <ForceGraph2D
          ref={fgRef}

          width={dimensions.width}
          height={dimensions.height}

          graphData={formattedData}

          /*
           * IMPORTANT:
           * Let react-force-graph draw the actual
           * connection lines itself.
           */
          linkColor={() => '#64748b'}
          linkWidth={2}

          /*
           * Arrow
           */
          linkDirectionalArrowLength={6}
          linkDirectionalArrowRelPos={0.9}
          linkDirectionalArrowColor={() => '#38bdf8'}

          /*
           * Physics
           */
          cooldownTicks={120}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}

          /*
           * More separation between nodes
           */
          d3Force="charge"

          onEngineStop={() => {
            if (fgRef.current) {
              fgRef.current.zoomToFit(500, 40);
            }
          }}

          /*
           * Node size
           */
          nodeRelSize={7}

          /*
           * Custom Node Rendering
           */
          nodeCanvasObject={(node, ctx, globalScale) => {

            if (
              typeof node.x !== 'number' ||
              typeof node.y !== 'number'
            ) {
              return;
            }

            const label = node.label || node.id;

            const fontSize = Math.max(
              11 / globalScale,
              3.5
            );

            /*
             * Node colors
             */
            let nodeColor = '#94a3b8';

            if (node.type === 'domain') {
              nodeColor = '#38bdf8';
            }

            else if (node.type === 'ip') {
              nodeColor = '#f43f5e';
            }

            else if (node.type === 'isp') {
              nodeColor = '#c084fc';
            }

            else if (node.type === 'user') {
              nodeColor = '#34d399';
            }

            /*
             * Outer Glow
             */
            ctx.beginPath();

            ctx.arc(
              node.x,
              node.y,
              9,
              0,
              Math.PI * 2
            );

            ctx.fillStyle = `${nodeColor}33`;

            ctx.fill();

            /*
             * Main Dot
             */
            ctx.beginPath();

            ctx.arc(
              node.x,
              node.y,
              5,
              0,
              Math.PI * 2
            );

            ctx.fillStyle = nodeColor;

            ctx.fill();

            /*
             * Dot Border
             */
            ctx.beginPath();

            ctx.arc(
              node.x,
              node.y,
              6,
              0,
              Math.PI * 2
            );

            ctx.strokeStyle = nodeColor;

            ctx.lineWidth = 1;

            ctx.stroke();

            /*
             * Node Label
             */
            ctx.font = `600 ${fontSize}px Inter, sans-serif`;

            ctx.textAlign = 'left';

            ctx.textBaseline = 'middle';

            ctx.fillStyle = '#f8fafc';

            ctx.fillText(
              label,
              node.x + 10,
              node.y
            );
          }}

          /*
           * Relationship text is drawn AFTER
           * the normal graph links.
           *
           * The line itself is handled by
           * react-force-graph.
           */
          linkCanvasObjectMode={() => 'after'}

          linkCanvasObject={(link, ctx, globalScale) => {

            if (!link.relation) {
              return;
            }

            const start = link.source;
            const end = link.target;

            if (
              !start ||
              !end ||
              typeof start.x !== 'number' ||
              typeof start.y !== 'number' ||
              typeof end.x !== 'number' ||
              typeof end.y !== 'number'
            ) {
              return;
            }

            /*
             * Find midpoint of connection
             */
            const midX =
              (start.x + end.x) / 2;

            const midY =
              (start.y + end.y) / 2;

            /*
             * Font size
             */
            const fontSize = Math.max(
              9 / globalScale,
              3
            );

            ctx.font = `500 ${fontSize}px Inter, sans-serif`;

            /*
             * Text dimensions
             */
            const textWidth =
              ctx.measureText(link.relation).width;

            const paddingX = 5;
            const paddingY = 3;

            const boxWidth =
              textWidth + paddingX * 2;

            const boxHeight =
              fontSize + paddingY * 2;

            /*
             * Background behind relationship
             *
             * This hides only the small section
             * of the line underneath the text.
             */
            ctx.fillStyle = '#020617';

            ctx.beginPath();

            ctx.roundRect(
              midX - boxWidth / 2,
              midY - boxHeight / 2,
              boxWidth,
              boxHeight,
              3
            );

            ctx.fill();

            /*
             * Relationship border
             */
            ctx.strokeStyle = '#334155';

            ctx.lineWidth = 0.8;

            ctx.stroke();

            /*
             * Relationship text
             */
            ctx.textAlign = 'center';

            ctx.textBaseline = 'middle';

            ctx.fillStyle = '#cbd5e1';

            ctx.fillText(
              link.relation,
              midX,
              midY
            );
          }}

          /*
           * Interaction
           */
          enableNodeDrag={true}
          enableZoomInteraction={true}
          enablePanInteraction={true}

          /*
           * Node hover/click area
           */
          nodePointerAreaPaint={(node, color, ctx) => {

            ctx.fillStyle = color;

            ctx.beginPath();

            ctx.arc(
              node.x,
              node.y,
              12,
              0,
              Math.PI * 2
            );

            ctx.fill();
          }}

        />

      </div>
    </div>
  );
}