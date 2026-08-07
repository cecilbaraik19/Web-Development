import { motion, useScroll, useTransform } from 'framer-motion';
import {
  FaGithub,
  FaLinkedin,
  FaShieldAlt,
  FaLock,
  FaCloud,
  FaServer,
  FaTerminal,
  FaBug,
  FaDownload,
  FaChevronDown,
} from 'react-icons/fa';
import { site } from '../config/site.js';
import { useTypewriter } from '../hooks/useTypewriter.js';
import { scrollToSection } from '../utils/scroll.js';
import Particles from './Particles.jsx';

const TYPING_WORDS = [
  'Full Stack Development',
  'Cloud & AWS',
  'Networking',
  'Cybersecurity',
  'DevSecOps',
];

const FLOATING_ICONS = [
  { Icon: FaShieldAlt, top: '16%', left: '8%', size: 26, duration: 7 },
  { Icon: FaLock, top: '26%', left: '82%', size: 22, duration: 9 },
  { Icon: FaCloud, top: '64%', left: '12%', size: 28, duration: 8 },
  { Icon: FaServer, top: '70%', left: '86%', size: 24, duration: 10 },
  { Icon: FaTerminal, top: '44%', left: '90%', size: 20, duration: 7 },
  { Icon: FaBug, top: '12%', left: '60%', size: 18, duration: 11 },
];

// Masked line-by-line reveal used for the big name
const MaskedLine = ({ children, delay }) => (
  <span className="block overflow-hidden">
    <motion.span
      className="block"
      initial={{ y: '110%' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

export default function Hero() {
  const typed = useTypewriter(TYPING_WORDS);

  // Scroll parallax — content drifts down slowly, icons counter-drift for depth
  const { scrollY } = useScroll();
  const yContent = useTransform(scrollY, [0, 600], [0, 120]);
  const yIcons = useTransform(scrollY, [0, 600], [0, -90]);
  const fade = useTransform(scrollY, [0, 420], [1, 0]);

  return (
    <section id="home" data-testid="hero-section" className="relative flex min-h-screen items-center overflow-hidden">
      {/* Animated gradient blobs */}
      <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-accent/10 blur-[120px]" />
      <div className="absolute -bottom-40 -right-32 h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-[120px]" />

      {/* Grid pattern + particle network */}
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]" />
      <Particles />

      {/* Floating security icons (parallax layer) */}
      <motion.div style={{ y: yIcons }} className="pointer-events-none absolute inset-0 hidden md:block">
        {FLOATING_ICONS.map(({ Icon, top, left, size, duration }, i) => (
          <motion.div
            key={i}
            className="absolute text-accent/25"
            style={{ top, left }}
            animate={{ y: [0, -18, 0] }}
            transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
          >
            <Icon size={size} />
          </motion.div>
        ))}
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: yContent, opacity: fade }}
        className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-24"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-6 font-mono text-sm tracking-[0.4em] text-accent"
        >
          {'>'} HELLO WORLD, I AM
        </motion.p>

        <h1 className="font-display text-5xl font-bold leading-[1.05] sm:text-7xl lg:text-8xl">
          <MaskedLine delay={0.35}>CECIL</MaskedLine>
          <MaskedLine delay={0.5}>
            <span className="text-gradient">BARAIK</span>
          </MaskedLine>
        </h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="mt-6 font-display text-xl font-medium text-white sm:text-2xl"
        >
          Building Toward <span className="text-accent">DevSecOps</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.7 }}
          className="mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg"
        >
          {site.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          className="mt-6 h-6 font-mono text-sm text-accent"
          data-testid="hero-typing"
        >
          currently exploring: {typed}
          <span className="animate-pulse">▊</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35, duration: 0.7 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button
            data-testid="hero-view-projects"
            onClick={() => scrollToSection('projects')}
            className="rounded-full bg-accent px-7 py-3 font-mono text-sm font-semibold uppercase tracking-widest text-primary transition-shadow hover:shadow-glow"
          >
            View Projects
          </button>
          <motion.a
            data-testid="hero-download-resume"
            href={site.resumeUrl}
            download
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="group glass relative flex items-center gap-2 overflow-hidden rounded-full px-7 py-3 font-mono text-sm uppercase tracking-widest text-white transition-colors hover:border-accent/50 hover:text-accent"
          >
            {/* Shine sweep on hover */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            <FaDownload className="relative transition-transform duration-300 group-hover:translate-y-0.5 group-hover:animate-bounce" />
            <span className="relative">Resume</span>
            <span className="relative rounded border border-accent/30 px-1.5 py-0.5 text-[9px] text-accent">
              PDF
            </span>
          </motion.a>
          <div className="flex gap-3">
            <a
              data-testid="hero-github"
              href={site.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="glass rounded-full p-3 text-muted transition-all hover:border-accent/50 hover:text-accent"
            >
              <FaGithub size={18} />
            </a>
            <a
              data-testid="hero-linkedin"
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="glass rounded-full p-3 text-muted transition-all hover:border-accent/50 hover:text-accent"
            >
              <FaLinkedin size={18} />
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.button
        data-testid="hero-scroll-cue"
        onClick={() => scrollToSection('about')}
        style={{ opacity: fade }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted"
        aria-label="Scroll down"
      >
        <FaChevronDown />
      </motion.button>
    </section>
  );
}
