import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import {
  CTFVaultAddress,
  ConditionalTokensAddress,
  ConditionalTokensAbi,
} from '../constants';

export function useApprovals() {
  const { address, isConnected } = useAccount();

  // Check if vault is approved for CTF (ERC-1155)
  const { data: isApproved, refetch: refetchApproval } = useReadContract({
    address: ConditionalTokensAddress as `0x${string}`,
    abi: ConditionalTokensAbi,
    functionName: 'isApprovedForAll',
    args: [address!, CTFVaultAddress as `0x${string}`],
    query: {
      enabled: isConnected && !!address,
    },
  });

  // Approve vault for CTF
  const {
    writeContract: writeApprove,
    data: approveHash,
    isPending: isApprovePending,
    isError: isApproveError,
    error: approveError,
    reset: resetApprove,
  } = useWriteContract();

  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } =
    useWaitForTransactionReceipt({
      hash: approveHash,
    });

  const approve = () => {
    writeApprove({
      address: ConditionalTokensAddress as `0x${string}`,
      abi: ConditionalTokensAbi,
      functionName: 'setApprovalForAll',
      args: [CTFVaultAddress as `0x${string}`, true],
    });
  };

  // Refetch approval status after successful approval
  if (isApproveSuccess) {
    refetchApproval();
    resetApprove();
  }

  return {
    isApproved: isApproved ?? false,
    approve,
    isApprovePending: isApprovePending || isApproveConfirming,
    isApproveError,
    approveError,
    refetchApproval,
  };
}
