import { useState } from 'react';
import { VaultStatusCard } from '../components/vault/VaultStatusCard';
import { UserPositionCard } from '../components/vault/UserPositionCard';
import { TabGroup } from '../components/layout/TabGroup';
import { MergeSection } from '../components/merge-split/MergeSection';
import { SplitSection } from '../components/merge-split/SplitSection';

type TabType = 'merge' | 'split';

export function MergeSplitPage() {
  const [activeTab, setActiveTab] = useState<TabType>('merge');

  const tabs = [
    { id: 'merge' as const, label: 'Merge' },
    { id: 'split' as const, label: 'Split' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
      {/* Left Column - Action Forms */}
      <div className="card">
        <TabGroup
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as TabType)}
        />

        <div className="mt-6">
          {activeTab === 'merge' ? <MergeSection /> : <SplitSection />}
        </div>
      </div>

      {/* Right Column - Read-only Data */}
      <div className="space-y-6">
        <VaultStatusCard />
        <UserPositionCard />
      </div>
    </div>
  );
}
