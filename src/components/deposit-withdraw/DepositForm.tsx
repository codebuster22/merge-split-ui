import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { TokenSelector } from '../common/TokenSelector';
import { TokenInput } from '../common/TokenInput';
import { TransactionButton } from '../common/TransactionButton';
import { useUserState } from '../../hooks/useUserState';
import { useApprovals } from '../../hooks/useApprovals';
import { useDeposit } from '../../hooks/useDeposit';
import { useVaultBalances } from '../../hooks/useVaultBalances';
import { parseAmount, formatAmount } from '../../utils/formatters';
import { YES_TOKEN_ID, NO_TOKEN_ID } from '../../constants';
import type { TokenType } from '../../types';

export function DepositForm() {
  const { isConnected } = useAccount();
  const { data: userState, refetch: refetchUserState } = useUserState();
  const { refetch: refetchVaultBalances } = useVaultBalances();
  const { isApproved, approve, isApprovePending } = useApprovals();
  const { deposit, isPending, isSuccess, isError, error, reset } = useDeposit();

  const [selectedToken, setSelectedToken] = useState<TokenType>('YES');
  const [amount, setAmount] = useState('');

  // Get the token ID and max balance based on selection
  const tokenId = selectedToken === 'YES' ? BigInt(YES_TOKEN_ID) : BigInt(NO_TOKEN_ID);
  const maxBalance =
    selectedToken === 'YES'
      ? userState?.yesTokenBalance ?? 0n
      : userState?.noTokenBalance ?? 0n;

  const parsedAmount = parseAmount(amount);
  const isValidAmount = parsedAmount > 0n && parsedAmount <= maxBalance;

  // Handle successful deposit
  useEffect(() => {
    if (isSuccess) {
      setAmount('');
      refetchUserState();
      refetchVaultBalances();
      reset();
    }
  }, [isSuccess, refetchUserState, refetchVaultBalances, reset]);

  const handleDeposit = () => {
    if (isValidAmount) {
      deposit(tokenId, parsedAmount);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">Connect your wallet to deposit tokens</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="label">Select Token</label>
        <TokenSelector value={selectedToken} onChange={setSelectedToken} />
      </div>

      <TokenInput
        label="Amount to Deposit"
        value={amount}
        onChange={setAmount}
        max={maxBalance}
        placeholder="0.00"
      />

      {parsedAmount > 0n && (
        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-2">You will receive:</p>
          <p className="text-lg font-semibold text-purple-400">
            {formatAmount(parsedAmount)} Vault Shares
          </p>
        </div>
      )}

      {isError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm">
            {error?.message || 'Transaction failed'}
          </p>
        </div>
      )}

      {!isApproved ? (
        <TransactionButton
          onClick={approve}
          loading={isApprovePending}
          variant="primary"
        >
          Approve Vault
        </TransactionButton>
      ) : (
        <TransactionButton
          onClick={handleDeposit}
          disabled={!isValidAmount}
          loading={isPending}
          variant="success"
        >
          Deposit {selectedToken} Tokens
        </TransactionButton>
      )}

      <p className="text-xs text-slate-500 text-center">
        You will receive 1 vault share for each token deposited
      </p>
    </div>
  );
}
