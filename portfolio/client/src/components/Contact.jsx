import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaPaperPlane, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { SectionHeading } from './SectionHeading.jsx';
import { Reveal } from './Reveal.jsx';
import { GlowCard } from './GlowCard.jsx';
import { contactService } from '../services/contactService.js';
import { site } from '../config/site.js';

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY = { name: '', email: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!EMAIL_RX.test(form.email.trim())) next.email = 'Enter a valid email';
    if (!form.message.trim()) next.message = 'Message is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate() || status === 'sending') return;
    setStatus('sending');
    try {
      await contactService.send(form);
      setStatus('success');
      setForm(EMPTY);
    } catch {
      setStatus('error');
    }
  };

  const inputClass = (field) =>
    `w-full rounded-lg border bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-muted/50 ${
      errors[field] ? 'border-red-400/60' : 'border-white/10 focus:border-accent/60'
    }`;

  return (
    <section id="contact" data-testid="contact-section" className="bg-secondary/40 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          number="08"
          eyebrow="Contact"
          title="Say hello."
          description="Open to feedback on my projects, collaboration on learning builds, or just a good security conversation."
        />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* Info panel */}
          <Reveal>
            <div className="flex h-full flex-col justify-between gap-10">
              <div>
                <p className="text-base leading-relaxed text-muted md:text-lg">
                  The fastest way to reach me is email or LinkedIn. Messages sent through this form
                  land directly in my database — I read every one.
                </p>
                <a
                  data-testid="contact-email-link"
                  href={`mailto:${site.email}`}
                  className="mt-4 inline-block font-mono text-sm text-accent hover:underline"
                >
                  {site.email}
                </a>
              </div>
              <div className="flex gap-3">
                <a
                  data-testid="contact-github"
                  href={site.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="glass rounded-xl p-4 text-muted transition-all hover:border-accent/50 hover:text-accent"
                >
                  <FaGithub size={20} />
                </a>
                <a
                  data-testid="contact-linkedin"
                  href={site.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="glass rounded-xl p-4 text-muted transition-all hover:border-accent/50 hover:text-accent"
                >
                  <FaLinkedin size={20} />
                </a>
                <a
                  data-testid="contact-email-icon"
                  href={`mailto:${site.email}`}
                  aria-label="Email"
                  className="glass rounded-xl p-4 text-muted transition-all hover:border-accent/50 hover:text-accent"
                >
                  <FaEnvelope size={20} />
                </a>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.15}>
            <GlowCard hover={false} className="p-7">
              <form data-testid="contact-form" onSubmit={submit} noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <input
                      data-testid="contact-name"
                      value={form.name}
                      onChange={set('name')}
                      placeholder="Your name"
                      className={inputClass('name')}
                    />
                    {errors.name && <p className="mt-1 font-mono text-xs text-red-400">{errors.name}</p>}
                  </div>
                  <div>
                    <input
                      data-testid="contact-email"
                      type="email"
                      value={form.email}
                      onChange={set('email')}
                      placeholder="Your email"
                      className={inputClass('email')}
                    />
                    {errors.email && <p className="mt-1 font-mono text-xs text-red-400">{errors.email}</p>}
                  </div>
                </div>
                <div className="mt-5">
                  <textarea
                    data-testid="contact-message"
                    value={form.message}
                    onChange={set('message')}
                    placeholder="Your message..."
                    rows={5}
                    className={`${inputClass('message')} resize-none`}
                  />
                  {errors.message && <p className="mt-1 font-mono text-xs text-red-400">{errors.message}</p>}
                </div>

                <button
                  data-testid="contact-submit"
                  type="submit"
                  disabled={status === 'sending'}
                  className="mt-6 flex items-center gap-2 rounded-full bg-accent px-7 py-3 font-mono text-sm font-semibold uppercase tracking-widest text-primary transition-shadow hover:shadow-glow disabled:opacity-60"
                >
                  <FaPaperPlane size={13} />
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>

                <AnimatePresence>
                  {status === 'success' && (
                    <motion.p
                      data-testid="contact-success"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 flex items-center gap-2 font-mono text-sm text-success"
                    >
                      <FaCheckCircle /> Message sent — I'll get back to you soon.
                    </motion.p>
                  )}
                  {status === 'error' && (
                    <motion.p
                      data-testid="contact-error"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 flex items-center gap-2 font-mono text-sm text-red-400"
                    >
                      <FaExclamationCircle /> Something went wrong — is the backend running?
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </GlowCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
