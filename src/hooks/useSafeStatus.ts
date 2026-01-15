import { useAccount, usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { derivePolymarketSafeAddress } from '../utils/safeDerivation';
import type { Address } from 'viem';

interface SafeStatus {
  safeAddress: Address | undefined;
  isDeployed: boolean;
  isLoading: boolean;
  error: Error | null;
}

export function useSafeStatus(): SafeStatus {
  const { address: eoaAddress, isConnected } = useAccount();
  const publicClient = usePublicClient();

  const safeAddress = eoaAddress
    ? derivePolymarketSafeAddress(eoaAddress)
    : undefined;

  const { data: bytecode, isLoading, error } = useQuery({
    queryKey: ['safe-bytecode', safeAddress],
    queryFn: async () => {
      if (!safeAddress || !publicClient) return null;
      return publicClient.getCode({ address: safeAddress });
    },
    enabled: isConnected && !!safeAddress && !!publicClient,
    staleTime: 60000, // Cache for 1 minute
  });

  const isDeployed = !!bytecode && bytecode !== '0x';

  return {
    safeAddress,
    isDeployed,
    isLoading,
    error: error as Error | null,
  };
}
