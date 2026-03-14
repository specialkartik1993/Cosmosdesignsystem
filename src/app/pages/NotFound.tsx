import { NavLink } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';

export function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6"
        >
          <Sparkles className="w-10 h-10 text-primary" />
        </motion.div>
        <h1 className="text-[3rem] mb-2" style={{ fontWeight: 800 }}>404</h1>
        <p className="text-muted-foreground text-[15px] mb-6">This page doesn't exist in the Cosmos... yet.</p>
        <NavLink to="/">
          <Button><ArrowLeft className="w-4 h-4 mr-2" /> Back to Overview</Button>
        </NavLink>
      </motion.div>
    </div>
  );
}
