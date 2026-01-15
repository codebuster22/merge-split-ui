import { ConditionName } from '../../constants';

export function MarketInfoBar() {
  return (
    <div className="bg-slate-800/50 border-b border-slate-700/50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between py-2">
          <p className="text-sm text-slate-400">
            Market:{' '}
            <a
              href="https://polymarket.com/event/bitcoin-up-or-down-on-january-16"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-purple-400 transition-colors"
            >
              {ConditionName}
            </a>
          </p>
          <a
            href="https://polygonscan.com/address/0x28a702e64e53935e4d469b82d149ce7be86fa2ae"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            View Vault Contract
          </a>
        </div>
      </div>
    </div>
  );
}
