import { FaGithub, FaLinkedin, FaEnvelope, FaShieldAlt } from 'react-icons/fa';
import { site, navLinks } from '../config/site.js';
import { scrollToSection } from '../utils/scroll.js';

export default function Footer() {
  return (
    <footer data-testid="footer" className="border-t border-white/5 bg-secondary/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
            <FaShieldAlt className="text-accent" />
            {site.name}
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            This portfolio is created for learning, showcasing projects, and career development.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted">Navigate</h4>
          <ul className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  data-testid={`footer-link-${link.id}`}
                  onClick={() => scrollToSection(link.id)}
                  className="text-sm text-muted transition-colors hover:text-accent"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted">Connect</h4>
          <div className="flex gap-3">
            <a
              data-testid="footer-github"
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className="glass rounded-lg p-3 text-muted transition-all hover:border-accent/50 hover:text-accent"
            >
              <FaGithub />
            </a>
            <a
              data-testid="footer-linkedin"
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
              className="glass rounded-lg p-3 text-muted transition-all hover:border-accent/50 hover:text-accent"
            >
              <FaLinkedin />
            </a>
            <a
              data-testid="footer-email"
              href={`mailto:${site.email}`}
              className="glass rounded-lg p-3 text-muted transition-all hover:border-accent/50 hover:text-accent"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-5 text-center font-mono text-xs text-muted">
        © {new Date().getFullYear()} {site.name}. Built with the MERN stack.
      </div>
    </footer>
  );
}
