import { NavLink } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ConnectButton } from '../wallet/ConnectButton';
import { WalletModeSelector } from '../wallet/WalletModeSelector';
import { ConditionName } from '../../constants';

export function Header() {
  const { isConnected } = useAccount();

  return (
    <header className="bg-slate-800 border-b border-slate-700">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-white">CTF Vault</h1>
            <nav className="flex gap-1">
              <NavLink
                to="/deposit-withdraw"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`
                }
              >
                Deposit / Withdraw
              </NavLink>
              <NavLink
                to="/merge-split"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`
                }
              >
                Merge / Split
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {isConnected && <WalletModeSelector />}
            <ConnectButton />
          </div>
        </div>
        <div className="pb-3 -mt-1">
          <p className="text-sm text-slate-400">
            Market: <span className="text-white">{ConditionName}</span>
          </p>
        </div>
      </div>
    </header>
  );
}
