import { useEffect, useState } from 'react';
import { FaCode, FaServer, FaTerminal, FaCloud, FaShieldAlt, FaMapMarkedAlt } from 'react-icons/fa';
import { SectionHeading } from './SectionHeading.jsx';
import { Reveal } from './Reveal.jsx';
import { GlowCard } from './GlowCard.jsx';
import { contentService } from '../services/contentService.js';

const CATEGORY_ICONS = {
  Frontend: FaCode,
  Backend: FaServer,
  Programming: FaTerminal,
  Cloud: FaCloud,
  Cybersecurity: FaShieldAlt,
};

export default function Skills() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    contentService
      .getSkills()
      .then(setData)
      .catch(() => setError(true));
  }, []);

  return (
    <section id="skills" data-testid="skills-section" className="bg-secondary/40 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          number="02"
          eyebrow="Skills"
          title="Tools I work with."
          description="Honest snapshot: what I use today, and the roadmap of what comes next."
        />

        {error && (
          <p className="font-mono text-sm text-muted">
            Could not load skills — is the backend running?
          </p>
        )}

        {/* Current skills */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data?.current?.map((group, i) => {
            const Icon = CATEGORY_ICONS[group.category] || FaCode;
            return (
              <Reveal key={group.category} delay={i * 0.08}>
                <GlowCard className="h-full p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <Icon className="text-xl text-accent" />
                    <h3 className="font-display text-base font-semibold">{group.category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-muted transition-colors hover:border-accent/40 hover:text-accent"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </GlowCard>
              </Reveal>
            );
          })}

          {/* Future roadmap card */}
          {data?.future && (
            <Reveal delay={0.3} className="sm:col-span-2 lg:col-span-3">
              <GlowCard className="p-6" hover={false}>
                <div className="mb-2 flex items-center gap-3">
                  <FaMapMarkedAlt className="text-xl text-accent" />
                  <h3 className="font-display text-base font-semibold">Future Learning Roadmap</h3>
                  <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent">
                    Currently Learning
                  </span>
                </div>
                <p className="mb-5 text-sm text-muted">
                  Not claimed as skills yet — this is the queue I'm working through.
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.future.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-2 rounded-full border border-dashed border-white/15 px-3 py-1 font-mono text-xs text-muted transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
                      {skill}
                    </span>
                  ))}
                </div>
              </GlowCard>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
