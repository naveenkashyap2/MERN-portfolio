import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export default function Card({ children, className, elevated = false, hover = false, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(elevated ? 'card-elevated' : 'card', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
