import { useState, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { TokenSelector } from '../common/TokenSelector';
import { TokenInput } from '../common/TokenInput';
import { TransactionButton } from '../common/TransactionButton';
import { useUserState } from '../../hooks/useUserState';
import { useVaultBalances } from '../../hooks/useVaultBalances';
import { useWithdraw } from '../../hooks/useWithdraw';
import { parseAmount, formatAmount } from '../../utils/formatters';
import { YES_TOKEN_ID, NO_TOKEN_ID } from '../../constants';
import type { TokenType } from '../../types';

export function WithdrawForm() {
  const { isConnected } = useAccount();
  const { data: userState, refetch: refetchUserState } = useUserState();
  const { data: vaultBalances, refetch: refetchVaultBalances } = useVaultBalances();
  const { withdraw, isPending, isSuccess, isError, error, reset } = useWithdraw();

  const [selectedToken, setSelectedToken] = useState<TokenType>('YES');
  const [amount, setAmount] = useState('');

  // Determine which token types are available for withdrawal
  const availableTokens = useMemo(() => {
    const available: TokenType[] = [];
    if (userState?.yesDeposits && userState.yesDeposits > 0n) {
      available.push('YES');
    }
    if (userState?.noDeposits && userState.noDeposits > 0n) {
      available.push('NO');
    }
    return available;
  }, [userState?.yesDeposits, userState?.noDeposits]);

  // Disabled options are tokens the user hasn't deposited
  const disabledOptions = useMemo(() => {
    const disabled: TokenType[] = [];
    if (!availableTokens.includes('YES')) disabled.push('YES');
    if (!availableTokens.includes('NO')) disabled.push('NO');
    return disabled;
  }, [availableTokens]);

  // Get user deposits and vault balance for selected token
  const userDeposits =
    selectedToken === 'YES'
      ? userState?.yesDeposits ?? 0n
      : userState?.noDeposits ?? 0n;

  const vaultBalance =
    selectedToken === 'YES'
      ? vaultBalances?.yesBalance ?? 0n
      : vaultBalances?.noBalance ?? 0n;

  // Max withdrawal is min(user deposits, vault balance)
  const maxWithdraw = userDeposits < vaultBalance ? userDeposits : vaultBalance;

  const tokenId = selectedToken === 'YES' ? BigInt(YES_TOKEN_ID) : BigInt(NO_TOKEN_ID);
  const parsedAmount = parseAmount(amount);
  const isValidAmount = parsedAmount > 0n && parsedAmount <= maxWithdraw;

  // Auto-select first available token
  useEffect(() => {
    if (availableTokens.length > 0 && !availableTokens.includes(selectedToken)) {
      setSelectedToken(availableTokens[0]);
    }
  }, [availableTokens, selectedToken]);

  // Handle successful withdrawal
  useEffect(() => {
    if (isSuccess) {
      setAmount('');
      refetchUserState();
      refetchVaultBalances();
      reset();
    }
  }, [isSuccess, refetchUserState, refetchVaultBalances, reset]);

  const handleWithdraw = () => {
    if (isValidAmount) {
      withdraw(parsedAmount, tokenId);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">Connect your wallet to withdraw tokens</p>
      </div>
    );
  }

  if (availableTokens.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">You have no deposits to withdraw</p>
        <p className="text-sm text-slate-500 mt-2">
          Deposit YES or NO tokens first to be able to withdraw
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="label">Select Token to Withdraw</label>
        <TokenSelector
          value={selectedToken}
          onChange={setSelectedToken}
          disabledOptions={disabledOptions}
        />
        {disabledOptions.length > 0 && (
          <p className="text-xs text-slate-500 mt-2">
            You can only withdraw token types you have deposited
          </p>
        )}
      </div>

      <TokenInput
        label="Amount to Withdraw"
        value={amount}
        onChange={setAmount}
        max={maxWithdraw}
        placeholder="0.00"
      />

      <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Your {selectedToken} Deposits:</span>
          <span className="text-white">{formatAmount(userDeposits)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Vault {selectedToken} Balance:</span>
          <span className="text-white">{formatAmount(vaultBalance)}</span>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t border-slate-600">
          <span className="text-slate-400">Max Withdrawable:</span>
          <span className="text-white font-medium">{formatAmount(maxWithdraw)}</span>
        </div>
      </div>

      {parsedAmount > 0n && (
        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-2">You will burn:</p>
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

      <TransactionButton
        onClick={handleWithdraw}
        disabled={!isValidAmount}
        loading={isPending}
        variant="danger"
      >
        Withdraw {selectedToken} Tokens
      </TransactionButton>

      <p className="text-xs text-slate-500 text-center">
        1 vault share will be burned for each token withdrawn
      </p>
    </div>
  );
}
