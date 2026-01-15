import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { polygon } from 'wagmi/chains';

export function ConnectButton() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const isWrongNetwork = isConnected && chain?.id !== polygon.id;

  if (!isConnected) {
    return (
      <button
        onClick={() => connect({ connector: connectors[0] })}
        disabled={isPending}
        className="btn-primary"
      >
        {isPending ? 'Connecting...' : 'Connect Wallet'}
      </button>
    );
  }

  if (isWrongNetwork) {
    return (
      <button
        onClick={() => switchChain({ chainId: polygon.id })}
        className="btn-danger"
      >
        Switch to Polygon
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-700 rounded-lg">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <span className="text-sm text-white font-mono">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
      </div>
      <button
        onClick={() => disconnect()}
        className="btn-secondary text-sm"
      >
        Disconnect
      </button>
    </div>
  );
}
