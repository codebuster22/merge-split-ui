import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CTFVaultAddress, CTFVaultAbi } from '../constants';

export function useWithdraw() {
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

  const withdraw = (shares: bigint, tokenId: bigint) => {
    writeContract({
      address: CTFVaultAddress as `0x${string}`,
      abi: CTFVaultAbi,
      functionName: 'withdraw',
      args: [shares, tokenId],
    });
  };

  return {
    withdraw,
    hash,
    isPending: isPending || isConfirming,
    isSuccess,
    isError,
    error,
    receipt,
    reset,
  };
}
