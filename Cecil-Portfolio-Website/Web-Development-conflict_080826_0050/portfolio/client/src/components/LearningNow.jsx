import { motion } from 'framer-motion';
import { FaReact, FaAws, FaNetworkWired, FaShieldAlt, FaCloud, FaDocker } from 'react-icons/fa';
import { SectionHeading } from './SectionHeading.jsx';
import { Reveal } from './Reveal.jsx';
import { GlowCard } from './GlowCard.jsx';

const LEARNING = [
  {
    Icon: FaReact,
    title: 'MERN Stack',
    detail: 'MongoDB · Express · React · Node — building full apps end to end.',
    progress: 72,
  },
  {
    Icon: FaAws,
    title: 'AWS',
    detail: 'Cloud fundamentals: EC2, S3, IAM and how deployments really work.',
    progress: 38,
  },
];

const GOALS = [
  { Icon: FaNetworkWired, title: 'CCNA', detail: 'Networking fundamentals, routing & switching.' },
  { Icon: FaShieldAlt, title: 'DevSecOps', detail: 'Security baked into every stage of the pipeline.' },
  { Icon: FaCloud, title: 'Cloud Security', detail: 'IAM hardening, misconfig hunting, guardrails.' },
  { Icon: FaDocker, title: 'Container Security', detail: 'Docker & Kubernetes, secured from the image up.' },
];

export default function LearningNow() {
  return (
    <section id="learning" data-testid="learning-section" className="bg-secondary/40 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          number="06"
          eyebrow="Learning Now"
          title="Currently in progress."
          description="What's open in my tabs this month — and what's queued behind it."
        />

        {/* Currently learning */}
        <div className="grid gap-5 md:grid-cols-2">
          {LEARNING.map(({ Icon, title, detail, progress }, i) => (
            <Reveal key={title} delay={i * 0.1}>
              <GlowCard className="p-7">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="text-3xl text-accent" />
                    <h3 className="font-display text-lg font-semibold">{title}</h3>
                  </div>
                  <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent">
                    Currently Learning
                  </span>
                </div>
                <p className="mb-5 text-sm text-muted">{detail}</p>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-accent/60 to-accent"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                  />
                </div>
                <p className="mt-2 text-right font-mono text-xs text-muted">{progress}% there</p>
              </GlowCard>
            </Reveal>
          ))}
        </div>

        {/* Future goals */}
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {GOALS.map(({ Icon, title, detail }, i) => (
            <Reveal key={title} delay={0.15 + i * 0.08}>
              <GlowCard className="h-full border-dashed p-6">
                <Icon className="mb-4 text-2xl text-muted/60" />
                <h3 className="font-display text-base font-semibold text-muted">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted/70">{detail}</p>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
