const ITEMS = [
  'FULL STACK DEVELOPMENT',
  'CYBERSECURITY',
  'CLOUD',
  'NETWORKING',
  'DEVSECOPS',
  'BUG BOUNTY',
];

// Slow editorial marquee strip
export default function Marquee() {
  return (
    <div className="overflow-hidden border-y border-white/5 bg-secondary/60 py-4">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap font-mono text-sm tracking-[0.3em] text-muted">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="flex items-center gap-12">
            <span>{item}</span>
            <span className="text-accent">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
