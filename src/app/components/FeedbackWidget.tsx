import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThumbsUp, ThumbsDown, Check, MessageSquare, Send, X } from 'lucide-react';
import { submitFeedback, getFeedbackStats } from '../lib/supabase';

interface FeedbackWidgetProps {
  component: string;
}

export function FeedbackWidget({ component }: FeedbackWidgetProps) {
  const [stats, setStats] = useState<{ up: number; down: number }>({ up: 0, down: 0 });
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Check if user already voted on this component in this session
    const stored = sessionStorage.getItem(`feedback-${component}`);
    if (stored) setVoted(stored as 'up' | 'down');

    // Fetch current stats
    getFeedbackStats(component)
      .then(setStats)
      .catch((err) => console.warn('Failed to fetch feedback stats:', err));
  }, [component]);

  const handleVote = async (rating: 'up' | 'down') => {
    if (voted) return;
    setVoted(rating);
    sessionStorage.setItem(`feedback-${component}`, rating);

    // Optimistic update
    setStats((prev) => ({ ...prev, [rating]: prev[rating] + 1 }));

    try {
      const result = await submitFeedback({
        component,
        rating,
        timestamp: new Date().toISOString(),
      });
      if (result.stats) setStats(result.stats);
    } catch (err) {
      console.warn('Failed to submit feedback:', err);
    }
  };

  const handleSubmitComment = async () => {
    if (!comment.trim() || submitting) return;
    setSubmitting(true);

    try {
      await submitFeedback({
        component,
        rating: voted || 'up',
        comment: comment.trim(),
        timestamp: new Date().toISOString(),
      });
      setSubmitted(true);
      setComment('');
      setTimeout(() => {
        setShowComment(false);
        setSubmitted(false);
      }, 2000);
    } catch (err) {
      console.warn('Failed to submit comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="mt-12 mb-4 pt-8 border-t border-border"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <p className="text-[13px]" style={{ fontWeight: 600 }}>
            Was this component helpful?
          </p>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            Your feedback helps us improve Cosmos
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Thumbs Up */}
          <motion.button
            whileHover={!voted ? { scale: 1.08 } : undefined}
            whileTap={!voted ? { scale: 0.92 } : undefined}
            onClick={() => handleVote('up')}
            disabled={!!voted}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] transition-all cursor-pointer border ${
              voted === 'up'
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400'
                : voted
                  ? 'opacity-40 border-border bg-muted/30 cursor-default'
                  : 'border-border bg-card hover:border-emerald-500/25 hover:bg-emerald-500/5 text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
            style={{ fontWeight: 500 }}
          >
            {voted === 'up' ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <ThumbsUp className="w-3.5 h-3.5" />
            )}
            <span>{stats.up}</span>
          </motion.button>

          {/* Thumbs Down */}
          <motion.button
            whileHover={!voted ? { scale: 1.08 } : undefined}
            whileTap={!voted ? { scale: 0.92 } : undefined}
            onClick={() => handleVote('down')}
            disabled={!!voted}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] transition-all cursor-pointer border ${
              voted === 'down'
                ? 'bg-rose-500/10 border-rose-500/25 text-rose-600 dark:text-rose-400'
                : voted
                  ? 'opacity-40 border-border bg-muted/30 cursor-default'
                  : 'border-border bg-card hover:border-rose-500/25 hover:bg-rose-500/5 text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400'
            }`}
            style={{ fontWeight: 500 }}
          >
            {voted === 'down' ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <ThumbsDown className="w-3.5 h-3.5" />
            )}
            <span>{stats.down}</span>
          </motion.button>

          {/* Comment toggle */}
          {voted && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowComment(!showComment)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] border border-border bg-card hover:bg-accent/30 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              style={{ fontWeight: 500 }}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Add comment
            </motion.button>
          )}
        </div>
      </div>

      {/* Comment form */}
      <AnimatePresence>
        {showComment && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4 flex gap-2">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-[12px] text-emerald-600 dark:text-emerald-400 px-3 py-2"
                >
                  <Check className="w-3.5 h-3.5" />
                  Thanks for your feedback!
                </motion.div>
              ) : (
                <>
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
                    placeholder="Tell us more..."
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-[12px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmitComment}
                    disabled={!comment.trim() || submitting}
                    className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-[12px] disabled:opacity-50 transition-opacity cursor-pointer"
                    style={{ fontWeight: 500 }}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
