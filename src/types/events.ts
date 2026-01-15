import type { Address, Log } from 'viem';

// Vault Events
export interface VaultDepositEvent {
  user: Address;
  tokenId: bigint;
  amount: bigint;
}

export interface VaultWithdrawEvent {
  user: Address;
  tokenId: bigint;
  amount: bigint;
}

export interface VaultMergeEvent {
  amount: bigint;
}

export interface VaultSplitEvent {
  amount: bigint;
}

// CTF Events
export interface PositionSplitEvent {
  stakeholder: Address;
  collateralToken: Address;
  parentCollectionId: `0x${string}`;
  conditionId: `0x${string}`;
  partition: bigint[];
  amount: bigint;
}

export interface PositionsMergeEvent {
  stakeholder: Address;
  collateralToken: Address;
  parentCollectionId: `0x${string}`;
  conditionId: `0x${string}`;
  partition: bigint[];
  amount: bigint;
}

// ERC-1155 Events
export interface TransferSingleEvent {
  operator: Address;
  from: Address;
  to: Address;
  id: bigint;
  value: bigint;
}

export interface TransferBatchEvent {
  operator: Address;
  from: Address;
  to: Address;
  ids: bigint[];
  values: bigint[];
}

// ERC-20 Events
export interface ERC20TransferEvent {
  from: Address;
  to: Address;
  value: bigint;
}

export type DecodedEventLog = {
  eventName: string;
  args: Record<string, unknown>;
  log: Log;
};
