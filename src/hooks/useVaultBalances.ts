import { useReadContracts } from 'wagmi';
import {
  CTFVaultAddress,
  CTFVaultAbi,
} from '../constants';
import type { VaultBalances } from '../types';

export function useVaultBalances() {
  const { data, isLoading, isError, error, refetch } = useReadContracts({
    contracts: [
      {
        address: CTFVaultAddress as `0x${string}`,
        abi: CTFVaultAbi,
        functionName: 'getVaultBalances',
      },
      {
        address: CTFVaultAddress as `0x${string}`,
        abi: CTFVaultAbi,
        functionName: 'getCompleteSets',
      },
      {
        address: CTFVaultAddress as `0x${string}`,
        abi: CTFVaultAbi,
        functionName: 'totalSupply',
      },
    ],
    query: {
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  });

  const vaultBalances: VaultBalances | null = data
    ? {
        yesBalance: (data[0].result as [bigint, bigint, bigint])?.[0] ?? 0n,
        noBalance: (data[0].result as [bigint, bigint, bigint])?.[1] ?? 0n,
        usdcBalance: (data[0].result as [bigint, bigint, bigint])?.[2] ?? 0n,
        completeSets: (data[1].result as bigint) ?? 0n,
        totalShares: (data[2].result as bigint) ?? 0n,
      }
    : null;

  return {
    data: vaultBalances,
    isLoading,
    isError,
    error,
    refetch,
  };
}
