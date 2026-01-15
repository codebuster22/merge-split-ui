import { useState } from 'react';
import { VaultStatusCard } from '../components/vault/VaultStatusCard';
import { UserPositionCard } from '../components/vault/UserPositionCard';
import { TabGroup } from '../components/layout/TabGroup';
import { DepositForm } from '../components/deposit-withdraw/DepositForm';
import { WithdrawForm } from '../components/deposit-withdraw/WithdrawForm';

type TabType = 'deposit' | 'withdraw';

export function DepositWithdrawPage() {
  const [activeTab, setActiveTab] = useState<TabType>('deposit');

  const tabs = [
    { id: 'deposit' as const, label: 'Deposit' },
    { id: 'withdraw' as const, label: 'Withdraw' },
  ];

  return (
    <div className="space-y-6">
      <VaultStatusCard />
      <UserPositionCard />

      <div className="card">
        <TabGroup
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as TabType)}
        />

        <div className="mt-6">
          {activeTab === 'deposit' ? <DepositForm /> : <WithdrawForm />}
        </div>
      </div>
    </div>
  );
}
