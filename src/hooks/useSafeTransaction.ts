import { useState, useCallback } from 'react';
import { useWalletClient } from 'wagmi';
import Safe from '@safe-global/protocol-kit';
import { type MetaTransactionData, OperationType } from '@safe-global/types-kit';
import { useWalletMode } from '../contexts/WalletModeContext';
import type { Hash, Address } from 'viem';

interface SafeTransactionState {
  hash: Hash | undefined;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
}

interface SafeTransactionResult {
  executeSafeTransaction: (
    to: Address,
    data: `0x${string}`,
    value?: string
  ) => Promise<Hash | undefined>;
  state: SafeTransactionState;
  reset: () => void;
}

export function useSafeTransaction(): SafeTransactionResult {
  const { data: walletClient } = useWalletClient();
  const { safeAddress, eoaAddress } = useWalletMode();

  const [state, setState] = useState<SafeTransactionState>({
    hash: undefined,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
  });

  const reset = useCallback(() => {
    setState({
      hash: undefined,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    });
  }, []);

  const executeSafeTransaction = useCallback(
    async (
      to: Address,
      data: `0x${string}`,
      value: string = '0'
    ): Promise<Hash | undefined> => {
      if (!walletClient || !safeAddress || !eoaAddress) {
        const error = new Error(
          'Wallet not connected or Safe address not available'
        );
        setState((prev) => ({ ...prev, isError: true, error }));
        throw error;
      }

      setState({
        hash: undefined,
        isPending: true,
        isSuccess: false,
        isError: false,
        error: null,
      });

      try {
        // Use window.ethereum as the EIP-1193 provider
        // Safe SDK will use this to send transactions
        const provider = window.ethereum;
        if (!provider) {
          throw new Error('No ethereum provider found');
        }

        // Initialize Safe Protocol Kit
        // The signer is the EOA address - Safe SDK will prompt for signature
        const protocolKit = await Safe.init({
          provider,
          signer: eoaAddress,
          safeAddress: safeAddress,
        });

        // Create the transaction
        const transaction: MetaTransactionData = {
          to,
          data,
          value,
          operation: OperationType.Call,
        };

        const safeTransaction = await protocolKit.createTransaction({
          transactions: [transaction],
        });

        // For 1-of-1 Safe, signing and executing in one step
        const executedTx = await protocolKit.executeTransaction(safeTransaction);

        // Extract transaction hash
        const txHash = executedTx.hash as Hash;

        setState({
          hash: txHash,
          isPending: false,
          isSuccess: true,
          isError: false,
          error: null,
        });

        return txHash;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Safe transaction failed');
        setState({
          hash: undefined,
          isPending: false,
          isSuccess: false,
          isError: true,
          error,
        });
        throw error;
      }
    },
    [walletClient, safeAddress, eoaAddress]
  );

  return {
    executeSafeTransaction,
    state,
    reset,
  };
}
