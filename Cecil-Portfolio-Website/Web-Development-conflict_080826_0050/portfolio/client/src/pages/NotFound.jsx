import { Link } from 'react-router-dom';
import { FaShieldAlt, FaArrowLeft } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <FaShieldAlt className="mb-6 text-5xl text-accent/40" />
      <h1 className="font-display text-6xl font-bold text-white">404</h1>
      <p className="mt-3 font-mono text-sm text-muted">
        {'>'} route not found — nothing exposed on this port.
      </p>
      <Link
        data-testid="notfound-home-link"
        to="/"
        className="glass mt-8 flex items-center gap-2 rounded-full px-6 py-3 font-mono text-sm text-white transition-colors hover:border-accent/50 hover:text-accent"
      >
        <FaArrowLeft size={12} /> Back home
      </Link>
    </div>
  );
}
