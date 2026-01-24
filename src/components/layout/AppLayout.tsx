import React, { useState } from 'react';
import { Header } from './Header';
import { TabNavigation, TabId } from './TabNavigation';
import { ClassGenerator } from '../generator/ClassGenerator';
import { TreadCalculator } from '../calculator/TreadCalculator';
import { Library } from '../library/Library';
import { ClassHistory } from '../history/ClassHistory';
import { SearchPage } from '../search/SearchPage';
import { ImportPage } from '../import/ImportPage';
import { AnalyticsPage, DraftClassForComparison } from '../analytics/AnalyticsPage';

export function AppLayout() {
  const [activeTab, setActiveTab] = useState<TabId>('generator');
  const [draftClassForComparison, setDraftClassForComparison] = useState<DraftClassForComparison | undefined>();

  const handleCompareClass = (draftClass: DraftClassForComparison) => {
    setDraftClassForComparison(draftClass);
    setActiveTab('analytics');
  };

  const handleTabChange = (tab: TabId) => {
    // Clear draft comparison if leaving analytics
    if (tab !== 'analytics') {
      setDraftClassForComparison(undefined);
    }
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'generator':
        return <ClassGenerator onCompareClass={handleCompareClass} />;
      case 'calculator':
        return <TreadCalculator />;
      case 'blocks':
        return <Library />;
      case 'history':
        return <ClassHistory />;
      case 'search':
        return <SearchPage />;
      case 'import':
        return <ImportPage />;
      case 'analytics':
        return (
          <AnalyticsPage
            draftClass={draftClassForComparison}
            initialTab={draftClassForComparison ? 'compare' : undefined}
          />
        );
      default:
        return <ClassGenerator onCompareClass={handleCompareClass} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderContent()}
      </main>
    </div>
  );
}
