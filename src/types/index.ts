import type { Address } from 'viem';

export type TokenType = 'YES' | 'NO';

export interface VaultBalances {
  yesBalance: bigint;
  noBalance: bigint;
  usdcBalance: bigint;
  completeSets: bigint;
  totalShares: bigint;
}

export interface UserState {
  shares: bigint;
  yesDeposits: bigint;
  noDeposits: bigint;
  yesTokenBalance: bigint;
  noTokenBalance: bigint;
}

export interface TransactionState {
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  hash: `0x${string}` | undefined;
}

export interface ParsedEvent {
  id: string;
  type: 'vault' | 'ctf' | 'erc20' | 'erc1155';
  name: string;
  data: Record<string, unknown>;
  order: number;
  description: string;
  contractAddress: Address;
}

export interface TokenInfo {
  type: TokenType;
  tokenId: bigint;
  name: string;
  color: string;
}
