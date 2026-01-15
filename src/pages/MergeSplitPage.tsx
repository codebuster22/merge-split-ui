import { useState } from 'react';
import { VaultStatusCard } from '../components/vault/VaultStatusCard';
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
    <div className="space-y-6">
      <VaultStatusCard />

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
    </div>
  );
}
