import { useEffect, useState } from 'react';
import { FaAward, FaExternalLinkAlt } from 'react-icons/fa';
import { SectionHeading } from './SectionHeading.jsx';
import { Reveal } from './Reveal.jsx';
import { GlowCard } from './GlowCard.jsx';
import { certificationService } from '../services/certificationService.js';
import { formatDate } from '../utils/formatDate.js';

const STATUS_STYLE = {
  Earned: 'border-success/40 bg-success/10 text-success',
  'In Progress': 'border-accent/40 bg-accent/10 text-accent',
  Planned: 'border-dashed border-white/20 text-muted',
};

export default function Certifications() {
  const [certs, setCerts] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    certificationService
      .getAll()
      .then(setCerts)
      .catch(() => setError(true));
  }, []);

  return (
    <section id="certifications" data-testid="certifications-section" className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading
        number="05"
        eyebrow="Certifications"
        title="Proof of work."
        description="What I've earned so far — and the milestones already on the board."
      />

      {error && (
        <p className="font-mono text-sm text-muted">Could not load certifications — is the backend running?</p>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certs.map((cert, i) => (
          <Reveal key={cert._id} delay={(i % 3) * 0.08}>
            <GlowCard data-testid={`cert-card-${cert._id}`} className="h-full p-6" hover={cert.status === 'Earned'}>
              <div className="mb-4 flex items-start justify-between">
                <FaAward
                  className={`text-2xl ${cert.status === 'Earned' ? 'text-accent' : 'text-muted/50'}`}
                />
                <span
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${STATUS_STYLE[cert.status]}`}
                >
                  {cert.status === 'Planned' ? 'Up Next' : cert.status}
                </span>
              </div>
              <h3
                className={`font-display text-base font-semibold ${
                  cert.status === 'Planned' ? 'text-muted' : 'text-white'
                }`}
              >
                {cert.title}
              </h3>
              <p className="mt-1 font-mono text-xs text-muted">
                {cert.issuer}
                {cert.issueDate ? ` · ${formatDate(cert.issueDate)}` : ''}
              </p>
              {cert.credentialUrl && (
                <a
                  data-testid={`cert-link-${cert._id}`}
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:underline"
                >
                  View credential <FaExternalLinkAlt size={10} />
                </a>
              )}
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
