import { deriveSafe } from '@polymarket/builder-relayer-client/dist/builder/derive';
import { getContractConfig } from '@polymarket/builder-relayer-client/dist/config';
import type { Address } from 'viem';

const POLYGON_CHAIN_ID = 137;

/**
 * Derives the deterministic Polymarket Safe address from an EOA.
 * The Safe address is computed using CREATE2 and is the same for the same EOA.
 */
export function derivePolymarketSafeAddress(eoaAddress: Address): Address {
  const config = getContractConfig(POLYGON_CHAIN_ID);
  return deriveSafe(eoaAddress, config.SafeContracts.SafeFactory) as Address;
}
