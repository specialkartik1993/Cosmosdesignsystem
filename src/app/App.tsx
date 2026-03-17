import { useState, useEffect, useCallback } from 'react';
import { RouterProvider } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { router } from './routes';
import { ThemeProvider } from './context/ThemeContext';
import { DesignThemeProvider } from './context/DesignThemeContext';
import { CosmosLoader } from './components/CosmosLoader';
import { Onboarding } from './pages/Onboarding';

const ONBOARDING_KEY = 'cosmos-ds-onboarded';

export default function App() {
  const [phase, setPhase] = useState<'loading' | 'onboarding' | 'app'>('loading');
  const [progress, setProgress] = useState(0);

  // Simulated loading with realistic progress curve
  useEffect(() => {
    if (phase !== 'loading') return;

    const steps = [
      { target: 25, delay: 200 },
      { target: 50, delay: 500 },
      { target: 72, delay: 800 },
      { target: 88, delay: 1100 },
      { target: 96, delay: 1500 },
      { target: 100, delay: 1800 },
    ];

    const timers = steps.map(({ target, delay }) =>
      setTimeout(() => setProgress(target), delay)
    );

    // Transition out of loading
    const doneTimer = setTimeout(() => {
      const seen = localStorage.getItem(ONBOARDING_KEY);
      setPhase(seen ? 'app' : 'onboarding');
    }, 2400);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(doneTimer);
    };
  }, [phase]);

  const handleOnboardingComplete = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setPhase('app');
  }, []);

  return (
    <ThemeProvider>
      <DesignThemeProvider>
      {/* Overlay phases (loader / onboarding) rendered above the app */}
      <AnimatePresence>
        {phase === 'loading' && (
          <motion.div
            key="loader"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CosmosLoader progress={progress} />
          </motion.div>
        )}

        {phase === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Onboarding onComplete={handleOnboardingComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Router always mounts once past loading to avoid destroying/recreating router state */}
      {phase !== 'loading' && (
        <div className="h-screen">
          <RouterProvider router={router} />
        </div>
      )}
      </DesignThemeProvider>
    </ThemeProvider>
  );
}