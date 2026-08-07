import { useEffect, useState } from 'react';
import { FaCheckCircle, FaCircle, FaRegCircle } from 'react-icons/fa';
import { SectionHeading } from './SectionHeading.jsx';
import { Reveal } from './Reveal.jsx';
import { contentService } from '../services/contentService.js';

const STATUS_NODE = {
  done: <FaCheckCircle className="text-accent" />,
  current: <FaCircle className="animate-pulse-dot text-accent" />,
  next: <FaRegCircle className="text-muted" />,
};

export default function Journey() {
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    contentService
      .getJourney()
      .then(setSteps)
      .catch(() => setError(true));
  }, []);

  return (
    <section id="journey" data-testid="journey-section" className="bg-secondary/40 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          number="04"
          eyebrow="Journey"
          title="The road so far."
          description="Where I started, where I am, and where this is all heading."
        />

        {error && (
          <p className="font-mono text-sm text-muted">Could not load the journey — is the backend running?</p>
        )}

        <div className="relative ml-3 border-l border-white/10 pl-10 md:ml-6">
          {steps.map((step, i) => (
            <Reveal key={step._id} delay={i * 0.08} className="relative pb-12 last:pb-0">
              <span className="absolute -left-[47px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary md:-left-[55px]">
                {STATUS_NODE[step.status]}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
                {step.period}
              </span>
              <h3
                className={`mt-1 font-display text-xl font-semibold ${
                  step.status === 'next' ? 'text-muted' : 'text-white'
                }`}
              >
                {step.title}
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{step.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
