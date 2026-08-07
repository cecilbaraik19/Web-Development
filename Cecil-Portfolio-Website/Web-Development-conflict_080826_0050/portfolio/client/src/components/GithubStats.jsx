import { useEffect, useState } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { SectionHeading } from './SectionHeading.jsx';
import { Reveal } from './Reveal.jsx';
import { GlowCard } from './GlowCard.jsx';
import { site } from '../config/site.js';

// Live cards rendered straight from GitHub data (free services, no keys needed).
// Change the username in src/config/site.js and everything follows.
// If a card can't load (invalid username / service down) it falls back to a placeholder.

const Fallback = ({ title, hint }) => (
  <div className="flex h-full min-h-44 w-full flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center">
    <FaGithub className="mb-3 text-2xl text-accent/50" />
    <h3 className="font-display text-sm font-semibold text-white">{title}</h3>
    <p className="mt-1 font-mono text-xs text-muted">{hint}</p>
    <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted/60">
      set your username in src/config/site.js
    </p>
  </div>
);

const LiveCard = ({ src, alt, title, hint, wide = false, delay = 0, forceFallback = false }) => {
  const [failed, setFailed] = useState(false);
  return (
    <Reveal delay={delay} className={wide ? 'md:col-span-2' : ''}>
      <GlowCard hover={false} className="flex h-full items-center justify-center overflow-x-auto p-6">
        {failed || forceFallback ? (
          <Fallback title={title} hint={hint} />
        ) : (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            onError={() => setFailed(true)}
            className={wide ? 'min-w-[640px]' : 'max-w-full'}
          />
        )}
      </GlowCard>
    </Reveal>
  );
};

export default function GithubStats() {
  const user = site.githubUsername;
  const chartUrl = `https://ghchart.rshah.org/00E5FF/${user}`;
  const statsUrl = `https://github-profile-summary-cards.vercel.app/api/cards/stats?username=${user}&theme=transparent`;
  const langsUrl = `https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=${user}&theme=transparent`;

  // Preflight: if the username doesn't exist on GitHub, show placeholders
  // (the card services return error SVGs with HTTP 200, so onError can't catch it)
  const [userOk, setUserOk] = useState(true);
  useEffect(() => {
    fetch(`https://api.github.com/users/${user}`)
      .then((r) => setUserOk(r.ok))
      .catch(() => setUserOk(false));
  }, [user]);

  return (
    <section id="github" data-testid="github-section" className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading
        number="07"
        eyebrow="GitHub"
        title="Code in public."
        description="Live from my GitHub — these cards update themselves."
      />

      <div className="grid gap-5 md:grid-cols-2">
        <LiveCard
          wide
          forceFallback={!userOk}
          src={chartUrl}
          alt={`${user}'s GitHub contribution graph`}
          title="Contributions"
          hint="Contribution graph lights up here."
        />
        <LiveCard
          delay={0.08}
          forceFallback={!userOk}
          src={statsUrl}
          alt={`${user}'s GitHub stats`}
          title="GitHub Stats"
          hint="Stars, commits and PRs at a glance."
        />
        <LiveCard
          delay={0.16}
          forceFallback={!userOk}
          src={langsUrl}
          alt={`${user}'s most used languages`}
          title="Most Used Languages"
          hint="Language breakdown across repos."
        />
      </div>

      <Reveal delay={0.2} className="mt-8 text-center">
        <a
          data-testid="github-profile-link"
          href={site.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 font-mono text-sm text-accent hover:underline"
        >
          <FaGithub /> github.com/{user} <FaExternalLinkAlt size={11} />
        </a>
      </Reveal>
    </section>
  );
}
