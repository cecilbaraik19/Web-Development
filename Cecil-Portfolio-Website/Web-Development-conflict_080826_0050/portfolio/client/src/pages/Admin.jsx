import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowLeft,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSignOutAlt,
  FaShieldAlt,
  FaEnvelopeOpen,
} from 'react-icons/fa';
import { useAdmin } from '../context/AdminContext.jsx';
import { projectService } from '../services/projectService.js';
import { certificationService } from '../services/certificationService.js';
import { contactService } from '../services/contactService.js';
import { journeyService } from '../services/journeyService.js';
import { formatDate } from '../utils/formatDate.js';

const TABS = ['Projects', 'Certifications', 'Journey', 'Messages'];

const inputCls =
  'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-accent/60 placeholder:text-muted/50';

const Field = ({ label, as = 'input', children, ...props }) => (
  <label className="block">
    <span className="mb-1 block font-mono text-[11px] uppercase tracking-widest text-muted">
      {label}
    </span>
    {as === 'textarea' ? (
      <textarea rows={3} className={`${inputCls} resize-none`} {...props} />
    ) : as === 'select' ? (
      <select className={inputCls} {...props}>
        {children}
      </select>
    ) : (
      <input className={inputCls} {...props} />
    )}
  </label>
);

const EMPTY_PROJECT = {
  title: '',
  description: '',
  techStack: '',
  githubUrl: '',
  liveUrl: '',
  image: '',
  category: 'MERN',
  status: 'Planned',
  completedAt: '',
};

const EMPTY_CERT = {
  title: '',
  issuer: '',
  credentialUrl: '',
  image: '',
  status: 'Planned',
  order: 0,
};

const EMPTY_STEP = {
  title: '',
  description: '',
  period: '',
  status: 'next',
  order: 0,
};

// ── Projects tab ──────────────────────────────────────────────
function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(EMPTY_PROJECT);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(
    () => projectService.getAll({ limit: 50 }).then((d) => setProjects(d.projects)),
    []
  );
  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const edit = (p) => {
    setEditingId(p._id);
    setForm({
      ...p,
      techStack: p.techStack.join(', '),
      completedAt: p.completedAt ? p.completedAt.slice(0, 10) : '',
    });
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      techStack: form.techStack
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      completedAt: form.completedAt || null,
    };
    if (editingId) await projectService.update(editingId, payload);
    else await projectService.create(payload);
    setForm(EMPTY_PROJECT);
    setEditingId(null);
    setShowForm(false);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    await projectService.remove(id);
    load();
  };

  return (
    <div>
      <button
        data-testid="admin-add-project"
        onClick={() => {
          setForm(EMPTY_PROJECT);
          setEditingId(null);
          setShowForm((s) => !s);
        }}
        className="mb-6 flex items-center gap-2 rounded-full bg-accent px-5 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary"
      >
        <FaPlus size={10} /> {showForm ? 'Close form' : 'Add project'}
      </button>

      {showForm && (
        <form
          data-testid="admin-project-form"
          onSubmit={submit}
          className="glass mb-8 grid gap-4 rounded-2xl p-6 sm:grid-cols-2"
        >
          <Field label="Title" value={form.title} onChange={set('title')} required data-testid="admin-project-title" />
          <Field label="Image URL (optional)" value={form.image} onChange={set('image')} placeholder="Leave empty for a generated cover" />
          <div className="sm:col-span-2">
            <Field as="textarea" label="Description" value={form.description} onChange={set('description')} required data-testid="admin-project-description" />
          </div>
          <Field label="Tech stack (comma separated)" value={form.techStack} onChange={set('techStack')} placeholder="React, Node.js, MongoDB" />
          <Field label="GitHub URL" value={form.githubUrl} onChange={set('githubUrl')} />
          <Field label="Live demo URL" value={form.liveUrl} onChange={set('liveUrl')} />
          <Field as="select" label="Category" value={form.category} onChange={set('category')} data-testid="admin-project-category">
            {['Frontend', 'Backend', 'MERN', 'Cybersecurity', 'Cloud', 'Other'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Field>
          <Field as="select" label="Status" value={form.status} onChange={set('status')} data-testid="admin-project-status">
            {['Completed', 'In Progress', 'Planned'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Field>
          <Field label="Completion date" type="date" value={form.completedAt} onChange={set('completedAt')} />
          <div className="sm:col-span-2">
            <button
              data-testid="admin-project-save"
              type="submit"
              className="rounded-full bg-accent px-6 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary"
            >
              {editingId ? 'Update project' : 'Create project'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {projects.map((p) => (
          <div
            key={p._id}
            data-testid={`admin-project-row-${p._id}`}
            className="glass flex flex-wrap items-center justify-between gap-3 rounded-xl px-5 py-4"
          >
            <div>
              <p className="font-display text-sm font-semibold text-white">{p.title}</p>
              <p className="font-mono text-[11px] text-muted">
                {p.category} · {p.status}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                data-testid={`admin-project-edit-${p._id}`}
                onClick={() => edit(p)}
                className="glass rounded-lg p-2 text-muted hover:border-accent/50 hover:text-accent"
              >
                <FaEdit size={13} />
              </button>
              <button
                data-testid={`admin-project-delete-${p._id}`}
                onClick={() => remove(p._id)}
                className="glass rounded-lg p-2 text-muted hover:border-red-400/50 hover:text-red-400"
              >
                <FaTrash size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Certifications tab ────────────────────────────────────────
function CertificationsAdmin() {
  const [certs, setCerts] = useState([]);
  const [form, setForm] = useState(EMPTY_CERT);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(() => certificationService.getAll().then(setCerts), []);
  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, order: Number(form.order) || 0 };
    if (editingId) await certificationService.update(editingId, payload);
    else await certificationService.create(payload);
    setForm(EMPTY_CERT);
    setEditingId(null);
    setShowForm(false);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this certification?')) return;
    await certificationService.remove(id);
    load();
  };

  return (
    <div>
      <button
        data-testid="admin-add-cert"
        onClick={() => {
          setForm(EMPTY_CERT);
          setEditingId(null);
          setShowForm((s) => !s);
        }}
        className="mb-6 flex items-center gap-2 rounded-full bg-accent px-5 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary"
      >
        <FaPlus size={10} /> {showForm ? 'Close form' : 'Add certification'}
      </button>

      {showForm && (
        <form
          data-testid="admin-cert-form"
          onSubmit={submit}
          className="glass mb-8 grid gap-4 rounded-2xl p-6 sm:grid-cols-2"
        >
          <Field label="Title" value={form.title} onChange={set('title')} required data-testid="admin-cert-title" />
          <Field label="Issuer" value={form.issuer} onChange={set('issuer')} placeholder="Cisco, OffSec, AWS..." />
          <Field as="select" label="Status" value={form.status} onChange={set('status')} data-testid="admin-cert-status">
            {['Earned', 'In Progress', 'Planned'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Field>
          <Field label="Order" type="number" value={form.order} onChange={set('order')} />
          <Field label="Credential URL" value={form.credentialUrl} onChange={set('credentialUrl')} />
          <Field label="Image URL (optional)" value={form.image} onChange={set('image')} />
          <div className="sm:col-span-2">
            <button
              data-testid="admin-cert-save"
              type="submit"
              className="rounded-full bg-accent px-6 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary"
            >
              {editingId ? 'Update certification' : 'Create certification'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {certs.map((c) => (
          <div
            key={c._id}
            data-testid={`admin-cert-row-${c._id}`}
            className="glass flex flex-wrap items-center justify-between gap-3 rounded-xl px-5 py-4"
          >
            <div>
              <p className="font-display text-sm font-semibold text-white">{c.title}</p>
              <p className="font-mono text-[11px] text-muted">
                {c.issuer} · {c.status}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                data-testid={`admin-cert-edit-${c._id}`}
                onClick={() => {
                  setEditingId(c._id);
                  setForm({ ...EMPTY_CERT, ...c });
                  setShowForm(true);
                }}
                className="glass rounded-lg p-2 text-muted hover:border-accent/50 hover:text-accent"
              >
                <FaEdit size={13} />
              </button>
              <button
                data-testid={`admin-cert-delete-${c._id}`}
                onClick={() => remove(c._id)}
                className="glass rounded-lg p-2 text-muted hover:border-red-400/50 hover:text-red-400"
              >
                <FaTrash size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Journey tab ───────────────────────────────────────────────
function JourneyAdmin() {
  const [steps, setSteps] = useState([]);
  const [form, setForm] = useState(EMPTY_STEP);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(() => journeyService.getAll().then(setSteps), []);
  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, order: Number(form.order) || 0 };
    if (editingId) await journeyService.update(editingId, payload);
    else await journeyService.create(payload);
    setForm(EMPTY_STEP);
    setEditingId(null);
    setShowForm(false);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this journey step?')) return;
    await journeyService.remove(id);
    load();
  };

  return (
    <div>
      <button
        data-testid="admin-add-step"
        onClick={() => {
          setForm(EMPTY_STEP);
          setEditingId(null);
          setShowForm((s) => !s);
        }}
        className="mb-6 flex items-center gap-2 rounded-full bg-accent px-5 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary"
      >
        <FaPlus size={10} /> {showForm ? 'Close form' : 'Add step'}
      </button>

      {showForm && (
        <form
          data-testid="admin-step-form"
          onSubmit={submit}
          className="glass mb-8 grid gap-4 rounded-2xl p-6 sm:grid-cols-2"
        >
          <Field label="Title" value={form.title} onChange={set('title')} required data-testid="admin-step-title" />
          <Field label="Period (e.g. 2024, Now, Next)" value={form.period} onChange={set('period')} />
          <div className="sm:col-span-2">
            <Field as="textarea" label="Description" value={form.description} onChange={set('description')} />
          </div>
          <Field as="select" label="Status" value={form.status} onChange={set('status')} data-testid="admin-step-status">
            <option value="done">done</option>
            <option value="current">current</option>
            <option value="next">next</option>
          </Field>
          <Field label="Order" type="number" value={form.order} onChange={set('order')} />
          <div className="sm:col-span-2">
            <button
              data-testid="admin-step-save"
              type="submit"
              className="rounded-full bg-accent px-6 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary"
            >
              {editingId ? 'Update step' : 'Create step'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {steps.map((s) => (
          <div
            key={s._id}
            data-testid={`admin-step-row-${s._id}`}
            className="glass flex flex-wrap items-center justify-between gap-3 rounded-xl px-5 py-4"
          >
            <div>
              <p className="font-display text-sm font-semibold text-white">{s.title}</p>
              <p className="font-mono text-[11px] text-muted">
                {s.period} · {s.status} · order {s.order}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                data-testid={`admin-step-edit-${s._id}`}
                onClick={() => {
                  setEditingId(s._id);
                  setForm({ ...EMPTY_STEP, ...s });
                  setShowForm(true);
                }}
                className="glass rounded-lg p-2 text-muted hover:border-accent/50 hover:text-accent"
              >
                <FaEdit size={13} />
              </button>
              <button
                data-testid={`admin-step-delete-${s._id}`}
                onClick={() => remove(s._id)}
                className="glass rounded-lg p-2 text-muted hover:border-red-400/50 hover:text-red-400"
              >
                <FaTrash size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Messages tab ──────────────────────────────────────────────
function MessagesAdmin() {
  const [messages, setMessages] = useState([]);

  const load = useCallback(() => contactService.getAll().then(setMessages), []);
  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const markRead = async (id) => {
    await contactService.markRead(id);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    await contactService.remove(id);
    load();
  };

  if (messages.length === 0) {
    return <p className="font-mono text-sm text-muted">No messages yet.</p>;
  }

  return (
    <div className="space-y-3">
      {messages.map((m) => (
        <div
          key={m._id}
          data-testid={`admin-message-row-${m._id}`}
          className={`glass rounded-xl px-5 py-4 ${m.read ? 'opacity-60' : ''}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-sm font-semibold text-white">
                {m.name}{' '}
                <span className="font-mono text-xs font-normal text-accent">{m.email}</span>
              </p>
              <p className="font-mono text-[11px] text-muted">{formatDate(m.createdAt)}</p>
            </div>
            <div className="flex gap-2">
              {!m.read && (
                <button
                  data-testid={`admin-message-read-${m._id}`}
                  onClick={() => markRead(m._id)}
                  className="glass rounded-lg p-2 text-muted hover:border-success/50 hover:text-success"
                  title="Mark as read"
                >
                  <FaEnvelopeOpen size={13} />
                </button>
              )}
              <button
                data-testid={`admin-message-delete-${m._id}`}
                onClick={() => remove(m._id)}
                className="glass rounded-lg p-2 text-muted hover:border-red-400/50 hover:text-red-400"
              >
                <FaTrash size={13} />
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">{m.message}</p>
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function Admin() {
  const { isAdmin, login, logout } = useAdmin();
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('Projects');

  const submitLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(key);
    } catch {
      setError('Invalid admin key.');
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <div className="bg-grid pointer-events-none fixed inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      <div className="relative mx-auto max-w-4xl px-6 py-16">
        <Link
          data-testid="admin-back-home"
          to="/"
          className="mb-10 inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-accent"
        >
          <FaArrowLeft size={10} /> back to portfolio
        </Link>

        {!isAdmin ? (
          <div className="mx-auto mt-16 max-w-sm">
            <div className="glass rounded-2xl p-8 text-center">
              <FaShieldAlt className="mx-auto mb-4 text-3xl text-accent" />
              <h1 className="font-display text-xl font-semibold">Admin Access</h1>
              <p className="mt-2 font-mono text-xs text-muted">
                Enter the ADMIN_KEY from your server .env
              </p>
              <form data-testid="admin-login-form" onSubmit={submitLogin} className="mt-6">
                <input
                  data-testid="admin-key-input"
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="admin key"
                  className={`${inputCls} text-center`}
                />
                {error && (
                  <p data-testid="admin-login-error" className="mt-2 font-mono text-xs text-red-400">
                    {error}
                  </p>
                )}
                <button
                  data-testid="admin-login-submit"
                  type="submit"
                  className="mt-4 w-full rounded-full bg-accent py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-primary"
                >
                  Unlock
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <h1 className="font-display text-2xl font-semibold">
                Dashboard <span className="text-accent">/ admin</span>
              </h1>
              <button
                data-testid="admin-logout"
                onClick={logout}
                className="glass flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs text-muted hover:border-red-400/50 hover:text-red-400"
              >
                <FaSignOutAlt size={11} /> Logout
              </button>
            </div>

            <div className="mb-8 flex gap-2" data-testid="admin-tabs">
              {TABS.map((t) => (
                <button
                  key={t}
                  data-testid={`admin-tab-${t.toLowerCase()}`}
                  onClick={() => setTab(t)}
                  className={`rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-widest transition-all ${
                    tab === t
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-white/10 text-muted hover:border-accent/40'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === 'Projects' && <ProjectsAdmin />}
            {tab === 'Certifications' && <CertificationsAdmin />}
            {tab === 'Journey' && <JourneyAdmin />}
            {tab === 'Messages' && <MessagesAdmin />}
          </>
        )}
      </div>
    </div>
  );
}
