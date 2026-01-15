import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from 'wagmi';
import { encodeFunctionData } from 'viem';
import { useWalletMode } from '../contexts/WalletModeContext';
import { useSafeTransaction } from './useSafeTransaction';
import {
  CTFVaultAddress,
  ConditionalTokensAddress,
  ConditionalTokensAbi,
} from '../constants';

export function useApprovals() {
  const { isConnected } = useAccount();
  const { mode, activeAddress } = useWalletMode();
  const {
    executeSafeTransaction,
    state: safeState,
    reset: resetSafe,
  } = useSafeTransaction();

  // Check if vault is approved for CTF (from active address - EOA or Safe)
  const { data: isApproved, refetch: refetchApproval } = useReadContract({
    address: ConditionalTokensAddress as `0x${string}`,
    abi: ConditionalTokensAbi,
    functionName: 'isApprovedForAll',
    args: [activeAddress!, CTFVaultAddress as `0x${string}`],
    query: {
      enabled: isConnected && !!activeAddress,
    },
  });

  // EOA approval via wagmi
  const {
    writeContract: writeApprove,
    data: approveHash,
    isPending: isEoaApprovePending,
    isError: isEoaApproveError,
    error: eoaApproveError,
    reset: resetEoaApprove,
  } = useWriteContract();

  const { isLoading: isEoaApproveConfirming, isSuccess: isEoaApproveSuccess } =
    useWaitForTransactionReceipt({
      hash: approveHash,
    });

  const approve = async () => {
    if (mode === 'eoa') {
      // Existing EOA flow
      writeApprove({
        address: ConditionalTokensAddress as `0x${string}`,
        abi: ConditionalTokensAbi,
        functionName: 'setApprovalForAll',
        args: [CTFVaultAddress as `0x${string}`, true],
      });
    } else {
      // Safe flow - execute approval from Safe
      const data = encodeFunctionData({
        abi: ConditionalTokensAbi,
        functionName: 'setApprovalForAll',
        args: [CTFVaultAddress as `0x${string}`, true],
      });

      await executeSafeTransaction(
        ConditionalTokensAddress as `0x${string}`,
        data
      );
    }
  };

  // Determine pending/success state based on mode
  const isPending =
    mode === 'eoa'
      ? isEoaApprovePending || isEoaApproveConfirming
      : safeState.isPending;

  const isSuccess = mode === 'eoa' ? isEoaApproveSuccess : safeState.isSuccess;
  const isError = mode === 'eoa' ? isEoaApproveError : safeState.isError;
  const error = mode === 'eoa' ? eoaApproveError : safeState.error;

  // Refetch approval status after successful approval
  if (isSuccess) {
    refetchApproval();
    if (mode === 'eoa') {
      resetEoaApprove();
    } else {
      resetSafe();
    }
  }

  return {
    isApproved: isApproved ?? false,
    approve,
    isApprovePending: isPending,
    isApproveError: isError,
    approveError: error,
    refetchApproval,
  };
}
