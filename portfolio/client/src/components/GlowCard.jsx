import { motion } from 'framer-motion';

// Glass card with lift + cyan glow on hover
export const GlowCard = ({ children, className = '', hover = true, ...rest }) => (
  <motion.div
    whileHover={hover ? { y: -6 } : undefined}
    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    className={`glass rounded-2xl ${
      hover ? 'transition-colors hover:border-accent/40 hover:shadow-glow' : ''
    } ${className}`}
    {...rest}
  >
    {children}
  </motion.div>
);
