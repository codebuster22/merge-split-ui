import { decodeEventLog, type TransactionReceipt, type Log } from 'viem';
import {
  CTFVaultAddress,
  CTFVaultAbi,
  ConditionalTokensAddress,
  ConditionalTokensAbi,
  USDCAddress,
  USDCAbi,
  YES_TOKEN_ID,
  NO_TOKEN_ID,
} from '../constants';
import type { ParsedEvent } from '../types';
import { formatAmount } from './formatters';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

type OperationType = 'merge' | 'split';

interface DecodedEvent {
  eventName: string;
  args: Record<string, unknown>;
  address: `0x${string}`;
}

function tryDecodeLog(log: Log): DecodedEvent | null {
  const address = log.address.toLowerCase();

  // Try Vault ABI
  if (address === CTFVaultAddress.toLowerCase()) {
    try {
      const decoded = decodeEventLog({
        abi: CTFVaultAbi,
        data: log.data,
        topics: log.topics,
      });
      return {
        eventName: decoded.eventName,
        args: decoded.args as Record<string, unknown>,
        address: log.address as `0x${string}`,
      };
    } catch {
      // Not a vault event
    }
  }

  // Try CTF ABI
  if (address === ConditionalTokensAddress.toLowerCase()) {
    try {
      const decoded = decodeEventLog({
        abi: ConditionalTokensAbi,
        data: log.data,
        topics: log.topics,
      });
      return {
        eventName: decoded.eventName,
        args: decoded.args as Record<string, unknown>,
        address: log.address as `0x${string}`,
      };
    } catch {
      // Not a CTF event
    }
  }

  // Try USDC ABI
  if (address === USDCAddress.toLowerCase()) {
    try {
      const decoded = decodeEventLog({
        abi: USDCAbi,
        data: log.data,
        topics: log.topics,
      });
      return {
        eventName: decoded.eventName,
        args: decoded.args as Record<string, unknown>,
        address: log.address as `0x${string}`,
      };
    } catch {
      // Not a USDC event
    }
  }

  return null;
}

function getTokenName(tokenId: bigint): string {
  if (tokenId.toString() === YES_TOKEN_ID) return 'YES';
  if (tokenId.toString() === NO_TOKEN_ID) return 'NO';
  return 'Unknown';
}

function getEventType(address: string): 'vault' | 'ctf' | 'erc20' | 'erc1155' {
  const addr = address.toLowerCase();
  if (addr === CTFVaultAddress.toLowerCase()) return 'vault';
  if (addr === ConditionalTokensAddress.toLowerCase()) return 'ctf';
  if (addr === USDCAddress.toLowerCase()) return 'erc20';
  return 'erc1155';
}

function createParsedEvent(
  decoded: DecodedEvent,
  operation: OperationType,
  index: number
): ParsedEvent | null {
  const { eventName, args, address } = decoded;
  const eventType = getEventType(address);

  switch (eventName) {
    case 'Merge':
      return {
        id: `merge-${index}`,
        type: eventType,
        name: 'Merge',
        data: args,
        order: 100,
        description: `Vault merged ${formatAmount(args.amount as bigint)} complete sets into USDC`,
        contractAddress: address,
      };

    case 'Split':
      return {
        id: `split-${index}`,
        type: eventType,
        name: 'Split',
        data: args,
        order: 100,
        description: `Vault split ${formatAmount(args.amount as bigint)} USDC into YES + NO tokens`,
        contractAddress: address,
      };

    case 'PositionsMerge':
      return {
        id: `positions-merge-${index}`,
        type: eventType,
        name: 'Positions Merge',
        data: args,
        order: 50,
        description: `CTF merged ${formatAmount(args.amount as bigint)} complete sets`,
        contractAddress: address,
      };

    case 'PositionSplit':
      return {
        id: `position-split-${index}`,
        type: eventType,
        name: 'Position Split',
        data: args,
        order: 50,
        description: `CTF split ${formatAmount(args.amount as bigint)} USDC into positions`,
        contractAddress: address,
      };

    case 'TransferSingle': {
      const from = args.from as string;
      const to = args.to as string;
      const tokenId = args.id as bigint;
      const value = args.value as bigint;
      const tokenName = getTokenName(tokenId);

      const isMint = from === ZERO_ADDRESS;
      const isBurn = to === ZERO_ADDRESS;

      let description = '';
      if (isMint) {
        description = `Minted ${formatAmount(value)} ${tokenName} tokens`;
      } else if (isBurn) {
        description = `Burned ${formatAmount(value)} ${tokenName} tokens`;
      } else {
        description = `Transferred ${formatAmount(value)} ${tokenName} tokens`;
      }

      return {
        id: `transfer-single-${index}`,
        type: eventType,
        name: isMint ? 'Token Mint' : isBurn ? 'Token Burn' : 'Token Transfer',
        data: args,
        order: isBurn ? 10 : 60,
        description,
        contractAddress: address,
      };
    }

    case 'TransferBatch': {
      const from = args.from as string;
      const to = args.to as string;
      const ids = args.ids as bigint[];
      const values = args.values as bigint[];

      const isMint = from === ZERO_ADDRESS;
      const isBurn = to === ZERO_ADDRESS;

      const transfers = ids.map((id, i) => ({
        tokenName: getTokenName(id),
        amount: values[i],
      }));

      const description = transfers
        .map((t) => `${formatAmount(t.amount)} ${t.tokenName}`)
        .join(' + ');

      return {
        id: `transfer-batch-${index}`,
        type: eventType,
        name: isMint ? 'Tokens Minted' : isBurn ? 'Tokens Burned' : 'Tokens Transferred',
        data: args,
        order: isBurn ? 10 : 60,
        description: `${isMint ? 'Minted' : isBurn ? 'Burned' : 'Transferred'} ${description}`,
        contractAddress: address,
      };
    }

    case 'Transfer': {
      // ERC-20 Transfer (USDC)
      const from = args.from as string;
      const to = args.to as string;
      const value = args.value as bigint;

      const isMint = from === ZERO_ADDRESS;
      const isBurn = to === ZERO_ADDRESS;

      let description = '';
      let eventOrder = 30;

      if (operation === 'merge') {
        // In merge, USDC is minted (from 0x0)
        if (isMint) {
          description = `Received ${formatAmount(value)} USDC from merged positions`;
          eventOrder = 70;
        } else {
          description = `Transferred ${formatAmount(value)} USDC`;
        }
      } else {
        // In split, USDC is sent to CTF
        if (isBurn) {
          description = `Burned ${formatAmount(value)} USDC for split`;
        } else {
          description = `Sent ${formatAmount(value)} USDC for split`;
          eventOrder = 5;
        }
      }

      return {
        id: `usdc-transfer-${index}`,
        type: eventType,
        name: isMint ? 'USDC Received' : isBurn ? 'USDC Burned' : 'USDC Transfer',
        data: args,
        order: eventOrder,
        description,
        contractAddress: address,
      };
    }

    default:
      return null;
  }
}

export function parseTransactionEvents(
  receipt: TransactionReceipt,
  operation: OperationType
): ParsedEvent[] {
  const events: ParsedEvent[] = [];

  receipt.logs.forEach((log, index) => {
    const decoded = tryDecodeLog(log);
    if (decoded) {
      const parsed = createParsedEvent(decoded, operation, index);
      if (parsed) {
        events.push(parsed);
      }
    }
  });

  // Sort by order
  return events.sort((a, b) => a.order - b.order);
}
