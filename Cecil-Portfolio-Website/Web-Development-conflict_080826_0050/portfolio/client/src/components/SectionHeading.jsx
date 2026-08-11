import { Reveal } from './Reveal.jsx';

// Numbered chapter heading — 01 / eyebrow / title
export const SectionHeading = ({ number, eyebrow, title, description }) => (
  <Reveal className="mb-14">
    <div className="mb-5 flex items-center gap-4">
      <span className="font-mono text-sm text-accent">{number}</span>
      <span className="h-px w-12 bg-accent/40" />
      <span className="font-mono text-xs uppercase tracking-[0.35em] text-muted">{eyebrow}</span>
    </div>
    <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
      {title}
    </h2>
    {description && (
      <p className="mt-4 max-w-2xl text-base text-muted md:text-lg">{description}</p>
    )}
  </Reveal>
);