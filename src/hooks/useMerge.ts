import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CTFVaultAddress, CTFVaultAbi } from '../constants';
import { parseTransactionEvents } from '../utils/eventParser';
import type { ParsedEvent } from '../types';

export function useMerge() {
  const {
    writeContract,
    data: hash,
    isPending,
    isError,
    error,
    reset,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const merge = () => {
    writeContract({
      address: CTFVaultAddress as `0x${string}`,
      abi: CTFVaultAbi,
      functionName: 'merge',
    });
  };

  // Parse events from receipt
  const parsedEvents: ParsedEvent[] = receipt
    ? parseTransactionEvents(receipt, 'merge')
    : [];

  return {
    merge,
    hash,
    isPending: isPending || isConfirming,
    isSuccess,
    isError,
    error,
    receipt,
    parsedEvents,
    reset,
  };
}
