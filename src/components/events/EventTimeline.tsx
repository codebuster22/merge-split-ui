import { motion, AnimatePresence } from 'framer-motion';
import { EventCard } from './EventCard';
import type { ParsedEvent } from '../../types';

interface EventTimelineProps {
  events: ParsedEvent[];
  isAnimating: boolean;
}

export function EventTimeline({ events, isAnimating }: EventTimelineProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
      className="bg-slate-800/50 rounded-lg p-4"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
        Transaction Events
        {isAnimating && (
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-sm text-green-400 font-normal"
          >
            (Success!)
          </motion.span>
        )}
      </h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-700" />

        {/* Events */}
        <AnimatePresence>
          <div className="space-y-3 relative">
            {events.map((event, index) => (
              <div key={event.id} className="relative">
                {/* Timeline dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.15, duration: 0.2 }}
                  className="absolute left-4 top-6 w-4 h-4 bg-slate-600 border-2 border-slate-400 rounded-full z-10"
                />

                {/* Event card */}
                <div className="ml-12">
                  <EventCard event={event} index={index} />
                </div>
              </div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
