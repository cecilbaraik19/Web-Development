import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';

export default function ThreatGraph({ graphData }) {
  if (!graphData || !graphData.nodes) {
    return <div className="text-slate-500 text-xs p-4">No correlation graph data available.</div>;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <h4 className="text-xs font-semibold text-slate-400 mb-2">Threat Relationship Graph</h4>
      <div className="h-64 border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
        <ForceGraph2D
          graphData={graphData}
          nodeAutoColorBy="id"
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.label || node.id;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.fillStyle = '#e2e8f0';
            ctx.fillText(label, node.x + 8, node.y + 4);
          }}
          linkColor={() => '#475569'}
          linkWidth={1.5}
        />
      </div>
    </div>
  );
}