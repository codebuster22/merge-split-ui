import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CTFVaultAddress, CTFVaultAbi } from '../constants';
import { parseTransactionEvents } from '../utils/eventParser';
import type { ParsedEvent } from '../types';

export function useSplit() {
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

  const split = (amount: bigint) => {
    writeContract({
      address: CTFVaultAddress as `0x${string}`,
      abi: CTFVaultAbi,
      functionName: 'split',
      args: [amount],
    });
  };

  // Parse events from receipt
  const parsedEvents: ParsedEvent[] = receipt
    ? parseTransactionEvents(receipt, 'split')
    : [];

  return {
    split,
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
