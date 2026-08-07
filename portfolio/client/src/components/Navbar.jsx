import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaShieldAlt } from 'react-icons/fa';
import { site, navLinks } from '../config/site.js';
import { scrollToSection } from '../utils/scroll.js';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <header
      data-testid="navbar"
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled ? 'glass border-x-0 border-t-0 bg-primary/80' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6">
        <button
          data-testid="nav-logo"
          onClick={() => go('home')}
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-wide"
        >
          <FaShieldAlt className="text-accent" />
          {site.name.split(' ')[0]}
          <span className="text-accent">{site.name.split(' ')[1]}</span>
        </button>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <li key={link.id}>
              <button
                data-testid={`nav-link-${link.id}`}
                onClick={() => go(link.id)}
                className="group relative font-mono text-[13px] uppercase tracking-widest text-muted transition-colors hover:text-white"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-[width] duration-300 group-hover:w-full" />
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          data-testid="nav-hamburger"
          onClick={() => setOpen((o) => !o)}
          className="text-xl text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.ul
            data-testid="nav-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="glass overflow-hidden border-x-0 lg:hidden"
          >
            {navLinks.map((link) => (
              <li key={link.id} className="border-b border-white/5 last:border-0">
                <button
                  data-testid={`nav-mobile-link-${link.id}`}
                  onClick={() => go(link.id)}
                  className="block w-full px-6 py-4 text-left font-mono text-sm uppercase tracking-widest text-muted transition-colors hover:text-accent"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
