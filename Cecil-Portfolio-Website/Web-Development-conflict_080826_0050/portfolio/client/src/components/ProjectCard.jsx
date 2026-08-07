import { FaGithub, FaExternalLinkAlt, FaLaptopCode, FaServer, FaLayerGroup, FaShieldAlt, FaCloud, FaCode } from 'react-icons/fa';
import { GlowCard } from './GlowCard.jsx';
import { formatDate } from '../utils/formatDate.js';

const CATEGORY_STYLE = {
  Frontend: { Icon: FaLaptopCode, grad: 'from-cyan-500/25 to-blue-600/10' },
  Backend: { Icon: FaServer, grad: 'from-emerald-500/25 to-teal-600/10' },
  MERN: { Icon: FaLayerGroup, grad: 'from-accent/25 to-sky-600/10' },
  Cybersecurity: { Icon: FaShieldAlt, grad: 'from-rose-500/20 to-accent/10' },
  Cloud: { Icon: FaCloud, grad: 'from-sky-400/25 to-indigo-500/10' },
  Other: { Icon: FaCode, grad: 'from-slate-500/25 to-slate-700/10' },
};

const STATUS_STYLE = {
  Completed: 'border-success/40 bg-success/10 text-success',
  'In Progress': 'border-accent/40 bg-accent/10 text-accent',
  Planned: 'border-dashed border-white/20 text-muted',
};

export default function ProjectCard({ project }) {
  const { Icon, grad } = CATEGORY_STYLE[project.category] || CATEGORY_STYLE.Other;

  return (
    <GlowCard data-testid={`project-card-${project._id}`} className="group flex h-full flex-col overflow-hidden">
      {/* Cover: uploaded image, or a generated gradient cover */}
      <div className="relative h-44 overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`relative h-full w-full bg-gradient-to-br ${grad}`}>
            <div className="bg-grid absolute inset-0" />
            <Icon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl text-white/15 transition-transform duration-500 group-hover:scale-110" />
          </div>
        )}
        <span className="glass absolute left-3 top-3 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
          {project.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-white">{project.title}</h3>
          <span
            className={`shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${STATUS_STYLE[project.status]}`}
          >
            {project.status}
          </span>
        </div>

        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted">{project.description}</p>

        <div className="mb-5 flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-muted"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="font-mono text-[11px] text-muted">
            {project.status === 'Completed' ? formatDate(project.completedAt) : project.status}
          </span>
          <div className="flex gap-2">
            {project.githubUrl && (
              <a
                data-testid={`project-github-${project._id}`}
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub repository"
                className="glass rounded-lg p-2 text-muted transition-colors hover:border-accent/50 hover:text-accent"
              >
                <FaGithub />
              </a>
            )}
            {project.liveUrl && (
              <a
                data-testid={`project-live-${project._id}`}
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Live demo"
                className="glass rounded-lg p-2 text-muted transition-colors hover:border-accent/50 hover:text-accent"
              >
                <FaExternalLinkAlt size={13} />
              </a>
            )}
          </div>
        </div>
      </div>
    </GlowCard>
  );
}
