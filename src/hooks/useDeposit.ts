import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CTFVaultAddress, CTFVaultAbi } from '../constants';

export function useDeposit() {
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

  const deposit = (tokenId: bigint, amount: bigint) => {
    writeContract({
      address: CTFVaultAddress as `0x${string}`,
      abi: CTFVaultAbi,
      functionName: 'deposit',
      args: [tokenId, amount],
    });
  };

  return {
    deposit,
    hash,
    isPending: isPending || isConfirming,
    isSuccess,
    isError,
    error,
    receipt,
    reset,
  };
}
