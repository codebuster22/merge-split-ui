import { useReadContracts, useAccount } from 'wagmi';
import {
  CTFVaultAddress,
  CTFVaultAbi,
  ConditionalTokensAddress,
  ConditionalTokensAbi,
  YES_TOKEN_ID,
  NO_TOKEN_ID,
} from '../constants';
import type { UserState } from '../types';

export function useUserState() {
  const { address, isConnected } = useAccount();

  const { data, isLoading, isError, error, refetch } = useReadContracts({
    contracts: [
      // Vault shares
      {
        address: CTFVaultAddress as `0x${string}`,
        abi: CTFVaultAbi,
        functionName: 'balanceOf',
        args: [address!],
      },
      // YES deposits
      {
        address: CTFVaultAddress as `0x${string}`,
        abi: CTFVaultAbi,
        functionName: 'userYesDeposits',
        args: [address!],
      },
      // NO deposits
      {
        address: CTFVaultAddress as `0x${string}`,
        abi: CTFVaultAbi,
        functionName: 'userNoDeposits',
        args: [address!],
      },
      // YES token balance (ERC-1155)
      {
        address: ConditionalTokensAddress as `0x${string}`,
        abi: ConditionalTokensAbi,
        functionName: 'balanceOf',
        args: [address!, BigInt(YES_TOKEN_ID)],
      },
      // NO token balance (ERC-1155)
      {
        address: ConditionalTokensAddress as `0x${string}`,
        abi: ConditionalTokensAbi,
        functionName: 'balanceOf',
        args: [address!, BigInt(NO_TOKEN_ID)],
      },
    ],
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 10000,
    },
  });

  const userState: UserState | null =
    data && isConnected
      ? {
          shares: (data[0].result as bigint) ?? 0n,
          yesDeposits: (data[1].result as bigint) ?? 0n,
          noDeposits: (data[2].result as bigint) ?? 0n,
          yesTokenBalance: (data[3].result as bigint) ?? 0n,
          noTokenBalance: (data[4].result as bigint) ?? 0n,
        }
      : null;

  return {
    data: userState,
    isLoading,
    isError,
    error,
    refetch,
    isConnected,
    address,
  };
}
