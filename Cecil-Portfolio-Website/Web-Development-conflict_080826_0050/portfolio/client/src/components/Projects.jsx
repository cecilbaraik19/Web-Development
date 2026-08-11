import { useEffect, useState } from 'react';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { SectionHeading } from './SectionHeading.jsx';
import { Reveal } from './Reveal.jsx';
import ProjectCard from './ProjectCard.jsx';
import { projectService } from '../services/projectService.js';

const CATEGORIES = ['All', 'Frontend', 'Backend', 'MERN', 'Cybersecurity', 'Cloud'];
const PAGE_SIZE = 6;

export default function Projects() {
  const [category, setCategory] = useState('All');
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ projects: [], pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Debounce the search box
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(input);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [input]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    projectService
      .getAll({ category, search, page, limit: PAGE_SIZE })
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [category, search, page]);

  return (
    <section id="projects" data-testid="projects-section" className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading
        number="03"
        eyebrow="Projects"
        title="Things I've built."
        description="Each project taught me something new. Managed from the admin page — no redeploy needed to add more."
      />

      {/* Filters */}
      <Reveal className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" data-testid="project-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              data-testid={`filter-${cat.toLowerCase().replace(' ', '-')}`}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
              className={`rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-widest transition-all ${
                category === cat
                  ? 'border-accent bg-accent/10 text-accent shadow-glow-sm'
                  : 'border-white/10 text-muted hover:border-accent/40 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={13} />
          <input
            data-testid="project-search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-4 font-mono text-sm text-white outline-none transition-colors focus:border-accent/60 lg:w-64"
          />
        </div>
      </Reveal>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass h-80 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <p data-testid="projects-error" className="font-mono text-sm text-muted">
          Could not load projects — is the backend running?
        </p>
      ) : data.projects.length === 0 ? (
        <p data-testid="projects-empty" className="font-mono text-sm text-muted">
          No projects match that search.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.projects.map((project, i) => (
            <Reveal key={project._id} delay={(i % 3) * 0.08}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data.pages > 1 && (
        <div data-testid="project-pagination" className="mt-12 flex items-center justify-center gap-2">
          <button
            data-testid="pagination-prev"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="glass rounded-lg p-2.5 text-muted transition-colors enabled:hover:border-accent/50 enabled:hover:text-accent disabled:opacity-30"
          >
            <FaChevronLeft size={12} />
          </button>
          {Array.from({ length: data.pages }).map((_, i) => (
            <button
              key={i}
              data-testid={`pagination-page-${i + 1}`}
              onClick={() => setPage(i + 1)}
              className={`h-9 w-9 rounded-lg font-mono text-sm transition-all ${
                page === i + 1
                  ? 'bg-accent font-semibold text-primary shadow-glow-sm'
                  : 'glass text-muted hover:border-accent/50 hover:text-accent'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            data-testid="pagination-next"
            disabled={page === data.pages}
            onClick={() => setPage((p) => p + 1)}
            className="glass rounded-lg p-2.5 text-muted transition-colors enabled:hover:border-accent/50 enabled:hover:text-accent disabled:opacity-30"
          >
            <FaChevronRight size={12} />
          </button>
        </div>
      )}
    </section>
  );
}