import { FaAward, FaExternalLinkAlt } from 'react-icons/fa';
import { SectionHeading } from './SectionHeading.jsx';
import { Reveal } from './Reveal.jsx';
import { GlowCard } from './GlowCard.jsx';

const certificates = [
  {
    id: 1,
    title: 'Diploma in Information Technology',
    issuer: 'Argus Academy, Ranchi',
    date: '2024',
    status: 'Grade: A+',
    image: '/certificates/Diploma_Information_Technology_Argus_Academy.jpeg',
  },
  {
    id: 2,
    title: 'MERN Full Stack Development',
    issuer: 'Briztech Infosystems Pvt. Ltd., Ranchi',
    date: '2025',
    status: 'Grade: A+',
    image: '/certificates/MERN_Full_Stack_Briztech.jpeg',
  },
  {
    id: 3,
    title: 'Hack Horizon 2.0',
    issuer: 'ARKA JAIN University, Jharkhand',
    date: 'April 2026',
    status: 'Certificate of Participation',
    image: '/certificates/Hack_Horizon_2_Certificate.jpeg',
  },
];

export default function Certifications() {
  return (
    <section id="certifications">
      <SectionHeading
        eyebrow="Credentials"
        title="Certifications & Achievements"
        description="Technical certifications, training, and hackathon participation."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert, i) => (
          <Reveal key={cert.id} delay={(i % 3) * 0.08}>
            <GlowCard className="h-full overflow-hidden" hover>

              {/* Certificate Image */}
              <div className="bg-black/20 p-3">
                <img
                  src={cert.image}
                  alt={`${cert.title} certificate`}
                  className="h-56 w-full object-contain rounded-lg"
                />
              </div>

              {/* Certificate Details */}
              <div className="p-6">

                <div className="mb-4 flex items-start justify-between gap-3">
                  <FaAward className="text-2xl text-accent" />

                  <span className="rounded-full border border-success/40 bg-success/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-success">
                    Earned
                  </span>
                </div>

                <h3 className="font-display text-base font-semibold text-white">
                  {cert.title}
                </h3>

                <p className="mt-2 font-mono text-xs leading-relaxed text-muted">
                  {cert.issuer}
                </p>

                <p className="mt-2 font-mono text-xs text-muted">
                  {cert.date} · {cert.status}
                </p>

                <a
                  href={cert.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:underline"
                >
                  View Certificate
                  <FaExternalLinkAlt size={10} />
                </a>

              </div>
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}