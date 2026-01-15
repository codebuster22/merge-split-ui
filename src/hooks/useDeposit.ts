import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { encodeFunctionData } from 'viem';
import { useWalletMode } from '../contexts/WalletModeContext';
import { useSafeTransaction } from './useSafeTransaction';
import { CTFVaultAddress, CTFVaultAbi } from '../constants';

export function useDeposit() {
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

  const deposit = async (tokenId: bigint, amount: bigint) => {
    if (mode === 'eoa') {
      writeContract({
        address: CTFVaultAddress as `0x${string}`,
        abi: CTFVaultAbi,
        functionName: 'deposit',
        args: [tokenId, amount],
      });
    } else {
      const data = encodeFunctionData({
        abi: CTFVaultAbi,
        functionName: 'deposit',
        args: [tokenId, amount],
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

  const reset = () => {
    if (mode === 'eoa') {
      resetEoa();
    } else {
      resetSafe();
    }
  };

  return {
    deposit,
    hash,
    isPending,
    isSuccess,
    isError,
    error,
    receipt,
    reset,
  };
}
