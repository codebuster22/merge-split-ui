import { motion } from 'framer-motion';
import type { ParsedEvent } from '../../types';

interface EventCardProps {
  event: ParsedEvent;
  index: number;
}

function getEventIcon(name: string) {
  if (name.includes('Burn') || name.includes('Merge')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    );
  }

  if (name.includes('Mint') || name.includes('Split')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    );
  }

  if (name.includes('Transfer') || name.includes('USDC')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    );
  }

  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function getTypeColor(type: ParsedEvent['type']): string {
  switch (type) {
    case 'vault':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'ctf':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'erc20':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'erc1155':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
}

function getTypeBadge(type: ParsedEvent['type']): string {
  switch (type) {
    case 'vault':
      return 'Vault';
    case 'ctf':
      return 'CTF';
    case 'erc20':
      return 'USDC';
    case 'erc1155':
      return 'ERC-1155';
    default:
      return 'Event';
  }
}

export function EventCard({ event, index }: EventCardProps) {
  const colorClass = getTypeColor(event.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15, duration: 0.3 }}
      className={`flex items-start gap-4 p-4 rounded-lg border ${colorClass}`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getEventIcon(event.name)}
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-white">{event.name}</span>
          <span className={`px-2 py-0.5 text-xs rounded-full ${colorClass}`}>
            {getTypeBadge(event.type)}
          </span>
        </div>
        <p className="text-sm text-slate-300">{event.description}</p>
      </div>
    </motion.div>
  );
}
