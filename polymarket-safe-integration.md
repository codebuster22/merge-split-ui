# Polymarket Safe Wallet Integration - Implementation Plan

## Overview

Integrate Polymarket Safe (Proxy Wallet) support so users can interact with the CTF Vault using their Polymarket Safe address. Users pay their own gas (no relayer needed).

## Key Concept

Polymarket users have a **deterministic Safe wallet** derived from their EOA:
- Same EOA → Same Safe address (always)
- The Safe holds their conditional tokens (YES/NO)
- Safe is a 1-of-1 multisig (single owner = EOA, threshold = 1)
- User signs with EOA, transaction executes from Safe

## Architecture

```
User connects EOA (MetaMask)
        ↓
Derive Polymarket Safe address
        ↓
User chooses: "Use EOA" or "Use Safe"
        ↓
┌─────────────────┬─────────────────────────┐
│   EOA Mode      │      Safe Mode          │
├─────────────────┼─────────────────────────┤
│ Read from EOA   │ Read from Safe address  │
│ Write from EOA  │ Write via Safe.execute  │
│ (existing flow) │ (new flow)              │
└─────────────────┴─────────────────────────┘
```

## Dependencies to Add

```bash
# For Safe address derivation (lightweight - only using derive function)
bun add @polymarket/builder-relayer-client

# For Safe transaction execution
bun add @safe-global/protocol-kit @safe-global/types-kit

# Ethers v5 required by Safe SDK and Polymarket SDK
bun add ethers@^5.7.2
```

## Implementation Steps

### Step 1: Create Safe Address Derivation Utility

**File: `src/utils/safeDerivation.ts`**

```typescript
import { deriveSafe } from "@polymarket/builder-relayer-client/dist/builder/derive";
import { getContractConfig } from "@polymarket/builder-relayer-client/dist/config";

const POLYGON_CHAIN_ID = 137;

export function derivePolymarketSafeAddress(eoaAddress: string): string {
  const config = getContractConfig(POLYGON_CHAIN_ID);
  return deriveSafe(eoaAddress, config.SafeContracts.SafeFactory);
}
```

### Step 2: Create Safe Deployment Check Hook

**File: `src/hooks/useSafeStatus.ts`**

```typescript
import { useReadContract } from 'wagmi';
import { derivePolymarketSafeAddress } from '../utils/safeDerivation';

export function useSafeStatus(eoaAddress: string | undefined) {
  const safeAddress = eoaAddress ? derivePolymarketSafeAddress(eoaAddress) : undefined;

  // Check if Safe is deployed by checking code at address
  const { data: code } = useReadContract({
    // ... check bytecode at safeAddress
  });

  const isDeployed = code && code !== '0x';

  return {
    safeAddress,
    isDeployed,
  };
}
```

### Step 3: Create Wallet Mode Context

**File: `src/contexts/WalletModeContext.tsx`**

```typescript
type WalletMode = 'eoa' | 'safe';

interface WalletModeContextType {
  mode: WalletMode;
  setMode: (mode: WalletMode) => void;
  activeAddress: string | undefined;  // EOA or Safe based on mode
  eoaAddress: string | undefined;
  safeAddress: string | undefined;
  isSafeDeployed: boolean;
}
```

This context wraps the app and provides:
- Current wallet mode (EOA or Safe)
- The active address for reads/writes
- Safe deployment status

### Step 4: Create Safe Transaction Executor Hook

**File: `src/hooks/useSafeTransaction.ts`**

```typescript
import Safe from '@safe-global/protocol-kit';
import { MetaTransactionData, OperationType } from '@safe-global/types-kit';

export function useSafeTransaction() {
  const { walletClient } = useWalletClient();
  const { safeAddress } = useWalletMode();

  const executeSafeTransaction = async (
    to: string,
    data: string,
    value: string = '0'
  ) => {
    // 1. Initialize Protocol Kit with user's wallet
    const protocolKit = await Safe.init({
      provider: RPC_URL,
      signer: walletClient,  // User's connected wallet
      safeAddress: safeAddress,
    });

    // 2. Create transaction
    const transaction: MetaTransactionData = {
      to,
      data,
      value,
      operation: OperationType.Call,
    };

    const safeTransaction = await protocolKit.createTransaction({
      transactions: [transaction],
    });

    // 3. Sign and execute (1-of-1 Safe, so immediate execution)
    const txResponse = await protocolKit.executeTransaction(safeTransaction);

    return txResponse;
  };

  return { executeSafeTransaction };
}
```

### Step 5: Modify Existing Hooks for Dual Mode

Update each transaction hook to support both EOA and Safe modes:

**Example: `src/hooks/useDeposit.ts`**

```typescript
export function useDeposit() {
  const { mode, activeAddress, safeAddress } = useWalletMode();
  const { executeSafeTransaction } = useSafeTransaction();
  const { writeContract } = useWriteContract();

  const deposit = async (tokenId: bigint, amount: bigint) => {
    if (mode === 'eoa') {
      // Existing EOA flow
      writeContract({
        address: CTFVaultAddress,
        abi: CTFVaultAbi,
        functionName: 'deposit',
        args: [tokenId, amount],
      });
    } else {
      // Safe flow - encode call data and execute through Safe
      const data = encodeFunctionData({
        abi: CTFVaultAbi,
        functionName: 'deposit',
        args: [tokenId, amount],
      });

      await executeSafeTransaction(CTFVaultAddress, data);
    }
  };

  return { deposit, ... };
}
```

### Step 6: Update Read Hooks for Active Address

**Example: `src/hooks/useUserState.ts`**

```typescript
export function useUserState() {
  const { activeAddress } = useWalletMode();  // Use active address (EOA or Safe)

  // Query balances for activeAddress instead of EOA directly
  const { data } = useReadContracts({
    contracts: [
      {
        address: CTFVaultAddress,
        abi: CTFVaultAbi,
        functionName: 'balanceOf',
        args: [activeAddress],
      },
      // ... other queries using activeAddress
    ],
  });
}
```

### Step 7: Add Wallet Mode Selector UI

**File: `src/components/wallet/WalletModeSelector.tsx`**

```typescript
export function WalletModeSelector() {
  const { mode, setMode, eoaAddress, safeAddress, isSafeDeployed } = useWalletMode();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setMode('eoa')}
        className={mode === 'eoa' ? 'active' : ''}
      >
        EOA Wallet
        <span>{formatAddress(eoaAddress)}</span>
      </button>

      <button
        onClick={() => setMode('safe')}
        disabled={!isSafeDeployed}
        className={mode === 'safe' ? 'active' : ''}
      >
        Polymarket Safe
        <span>{formatAddress(safeAddress)}</span>
        {!isSafeDeployed && <span>(Not deployed)</span>}
      </button>
    </div>
  );
}
```

### Step 8: Update Header Component

Add the wallet mode selector to the header when connected:

```typescript
// In Header.tsx
{isConnected && <WalletModeSelector />}
```

## File Changes Summary

### New Files
| File | Purpose |
|------|---------|
| `src/utils/safeDerivation.ts` | Derive Safe address from EOA |
| `src/contexts/WalletModeContext.tsx` | Wallet mode state management |
| `src/hooks/useSafeStatus.ts` | Check Safe deployment status |
| `src/hooks/useSafeTransaction.ts` | Execute transactions through Safe |
| `src/components/wallet/WalletModeSelector.tsx` | UI for mode selection |

### Modified Files
| File | Changes |
|------|---------|
| `src/main.tsx` | Add WalletModeProvider |
| `src/hooks/useUserState.ts` | Use activeAddress from context |
| `src/hooks/useDeposit.ts` | Add Safe execution path |
| `src/hooks/useWithdraw.ts` | Add Safe execution path |
| `src/hooks/useMerge.ts` | Add Safe execution path |
| `src/hooks/useSplit.ts` | Add Safe execution path |
| `src/hooks/useApprovals.ts` | Add Safe approval path |
| `src/components/layout/Header.tsx` | Add WalletModeSelector |

## Important Notes

### 1. Safe Approval for CTF
When using Safe mode, the **Safe address** needs to approve the vault for ERC-1155:
```typescript
// Approve vault from Safe (not EOA)
CTF.setApprovalForAll(vaultAddress, true)  // Called FROM Safe
```

### 2. Token Balances
In Safe mode, read token balances from Safe address:
```typescript
CTF.balanceOf(safeAddress, tokenId)  // Safe holds the tokens
```

### 3. Vault Deposits Track Safe
When depositing from Safe, the vault tracks the Safe as the depositor:
```typescript
vault.userYesDeposits(safeAddress)  // Not EOA
```

### 4. No Relayer = User Pays Gas
Since we're not using Polymarket's relayer:
- User signs transaction with their EOA
- Safe executes the transaction
- Gas is paid from user's EOA (not Safe)

## Testing Plan

1. Connect wallet (EOA)
2. Verify Safe address is derived correctly
3. Check if Safe is deployed
4. Switch to Safe mode
5. Test reading balances from Safe
6. Test deposit from Safe (if Safe has tokens)
7. Test withdraw from Safe
8. Test merge/split operations
9. Verify event parsing works correctly

## Edge Cases

1. **Safe not deployed**: Disable Safe mode, show message
2. **Safe has no tokens**: Show empty balances, still allow switching
3. **Transaction fails**: Handle errors, show user-friendly message
4. **Wrong network**: Prompt to switch to Polygon (existing logic)

## Future Enhancements

1. **Deploy Safe**: Could add button to deploy Safe if not exists
2. **Import from Polymarket**: Could add flow to import positions
3. **Batch transactions**: Safe supports MultiSend for multiple operations
