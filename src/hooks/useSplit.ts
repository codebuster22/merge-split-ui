import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { encodeFunctionData } from 'viem';
import { useWalletMode } from '../contexts/WalletModeContext';
import { useSafeTransaction } from './useSafeTransaction';
import { CTFVaultAddress, CTFVaultAbi } from '../constants';
import { parseTransactionEvents } from '../utils/eventParser';
import type { ParsedEvent } from '../types';

export function useSplit() {
  const { mode } = useWalletMode();
  const {
    executeSafeTransaction,
    state: safeState,
    reset: resetSafe,
  } = useSafeTransaction();

  // EOA transaction hooks
  const {
    writeContract,
    data: eoaHash,
    isPending: isEoaPending,
    isError: isEoaError,
    error: eoaError,
    reset: resetEoa,
  } = useWriteContract();

  const {
    isLoading: isEoaConfirming,
    isSuccess: isEoaSuccess,
    data: eoaReceipt,
  } = useWaitForTransactionReceipt({
    hash: eoaHash,
  });

  // Safe transaction receipt
  const { data: safeReceipt } = useWaitForTransactionReceipt({
    hash: safeState.hash,
  });

  const split = async (amount: bigint) => {
    if (mode === 'eoa') {
      writeContract({
        address: CTFVaultAddress as `0x${string}`,
        abi: CTFVaultAbi,
        functionName: 'split',
        args: [amount],
      });
    } else {
      const data = encodeFunctionData({
        abi: CTFVaultAbi,
        functionName: 'split',
        args: [amount],
      });

      await executeSafeTransaction(CTFVaultAddress as `0x${string}`, data);
    }
  };

  // Unified state based on mode
  const hash = mode === 'eoa' ? eoaHash : safeState.hash;
  const isPending =
    mode === 'eoa' ? isEoaPending || isEoaConfirming : safeState.isPending;
  const isSuccess = mode === 'eoa' ? isEoaSuccess : safeState.isSuccess;
  const isError = mode === 'eoa' ? isEoaError : safeState.isError;
  const error = mode === 'eoa' ? eoaError : safeState.error;
  const receipt = mode === 'eoa' ? eoaReceipt : safeReceipt;

  // Parse events from receipt
  const parsedEvents: ParsedEvent[] = receipt
    ? parseTransactionEvents(receipt, 'split')
    : [];

  const reset = () => {
    if (mode === 'eoa') {
      resetEoa();
    } else {
      resetSafe();
    }
  };

  return {
    split,
    hash,
    isPending,
    isSuccess,
    isError,
    error,
    receipt,
    parsedEvents,
    reset,
  };
}
