import { FaGithub, FaChartLine, FaCode, FaFire, FaExternalLinkAlt } from 'react-icons/fa';
import { SectionHeading } from './SectionHeading.jsx';
import { Reveal } from './Reveal.jsx';
import { site } from '../config/site.js';

const PANELS = [
  { Icon: FaFire, title: 'Contributions', hint: 'Contribution graph lights up here.' },
  { Icon: FaChartLine, title: 'GitHub Stats', hint: 'Stars, commits and PRs at a glance.' },
  { Icon: FaCode, title: 'Most Used Languages', hint: 'Language breakdown across repos.' },
];

// Placeholder panels — connect later by swapping each panel for a live card
// e.g. https://github-readme-stats.vercel.app/api?username=<you> or ghchart.
export default function GithubStats() {
  return (
    <section id="github" data-testid="github-section" className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading
        number="07"
        eyebrow="GitHub"
        title="Code in public."
        description="A live window into my GitHub activity — panels ready to connect."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {PANELS.map(({ Icon, title, hint }, i) => (
          <Reveal key={title} delay={i * 0.08}>
            <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center">
              <Icon className="mb-3 text-2xl text-accent/50" />
              <h3 className="font-display text-sm font-semibold text-white">{title}</h3>
              <p className="mt-1 font-mono text-xs text-muted">{hint}</p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted/60">
                connect in src/config/site.js
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2} className="mt-8 text-center">
        <a
          data-testid="github-profile-link"
          href={site.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 font-mono text-sm text-accent hover:underline"
        >
          <FaGithub /> github.com/{site.githubUsername} <FaExternalLinkAlt size={11} />
        </a>
      </Reveal>
    </section>
  );
}
