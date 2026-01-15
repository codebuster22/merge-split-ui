import { motion } from 'framer-motion';
import { formatAmount } from '../../utils/formatters';

interface EventAnimationProps {
  operation: 'merge' | 'split';
  amount: bigint;
  isAnimating: boolean;
}

export function EventAnimation({ operation, amount, isAnimating }: EventAnimationProps) {
  const formattedAmount = formatAmount(amount);
  const hasAmount = amount > 0n;

  if (operation === 'merge') {
    return (
      <div className="flex items-center justify-center gap-4 py-6">
        {/* YES Token */}
        <motion.div
          animate={
            isAnimating
              ? { x: 40, opacity: 0, scale: 0.5 }
              : { x: 0, opacity: 1, scale: 1 }
          }
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
            <span className="text-green-400 font-bold">YES</span>
          </div>
          {hasAmount && (
            <span className="text-sm text-slate-400 mt-2">{formattedAmount}</span>
          )}
        </motion.div>

        {/* Plus sign */}
        <motion.span
          animate={isAnimating ? { opacity: 0 } : { opacity: 1 }}
          className="text-2xl text-slate-400"
        >
          +
        </motion.span>

        {/* NO Token */}
        <motion.div
          animate={
            isAnimating
              ? { x: -40, opacity: 0, scale: 0.5 }
              : { x: 0, opacity: 1, scale: 1 }
          }
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
            <span className="text-red-400 font-bold">NO</span>
          </div>
          {hasAmount && (
            <span className="text-sm text-slate-400 mt-2">{formattedAmount}</span>
          )}
        </motion.div>

        {/* Arrow */}
        <motion.div
          animate={isAnimating ? { scale: 1.2 } : { scale: 1 }}
          className="mx-4"
        >
          <svg
            className="w-8 h-8 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </motion.div>

        {/* USDC */}
        <motion.div
          animate={
            isAnimating
              ? { scale: 1.2, opacity: 1 }
              : { scale: 1, opacity: hasAmount ? 1 : 0.5 }
          }
          transition={{ duration: 0.5, delay: isAnimating ? 0.3 : 0 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center">
            <span className="text-blue-400 font-bold text-sm">USDC</span>
          </div>
          {hasAmount && (
            <span className="text-sm text-slate-400 mt-2">{formattedAmount}</span>
          )}
        </motion.div>
      </div>
    );
  }

  // Split operation
  return (
    <div className="flex items-center justify-center gap-4 py-6">
      {/* USDC */}
      <motion.div
        animate={
          isAnimating
            ? { scale: 0.5, opacity: 0 }
            : { scale: 1, opacity: hasAmount ? 1 : 0.5 }
        }
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center">
          <span className="text-blue-400 font-bold text-sm">USDC</span>
        </div>
        {hasAmount && (
          <span className="text-sm text-slate-400 mt-2">{formattedAmount}</span>
        )}
      </motion.div>

      {/* Arrow */}
      <motion.div
        animate={isAnimating ? { scale: 1.2 } : { scale: 1 }}
        className="mx-4"
      >
        <svg
          className="w-8 h-8 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </motion.div>

      {/* YES Token */}
      <motion.div
        animate={
          isAnimating
            ? { x: -20, opacity: 1, scale: 1.1 }
            : { x: 0, opacity: hasAmount ? 1 : 0.5, scale: 1 }
        }
        transition={{ duration: 0.5, delay: isAnimating ? 0.3 : 0 }}
        className="flex flex-col items-center"
      >
        <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
          <span className="text-green-400 font-bold">YES</span>
        </div>
        {hasAmount && (
          <span className="text-sm text-slate-400 mt-2">{formattedAmount}</span>
        )}
      </motion.div>

      {/* Plus sign */}
      <motion.span
        animate={isAnimating ? { opacity: 1 } : { opacity: hasAmount ? 1 : 0.5 }}
        transition={{ delay: isAnimating ? 0.3 : 0 }}
        className="text-2xl text-slate-400"
      >
        +
      </motion.span>

      {/* NO Token */}
      <motion.div
        animate={
          isAnimating
            ? { x: 20, opacity: 1, scale: 1.1 }
            : { x: 0, opacity: hasAmount ? 1 : 0.5, scale: 1 }
        }
        transition={{ duration: 0.5, delay: isAnimating ? 0.3 : 0 }}
        className="flex flex-col items-center"
      >
        <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
          <span className="text-red-400 font-bold">NO</span>
        </div>
        {hasAmount && (
          <span className="text-sm text-slate-400 mt-2">{formattedAmount}</span>
        )}
      </motion.div>
    </div>
  );
}
