import React, { useState } from 'react';
import { Header } from './Header';
import { TabNavigation, TabId } from './TabNavigation';
import { ClassGenerator } from '../generator/ClassGenerator';
import { TreadCalculator } from '../calculator/TreadCalculator';
import { BlockLibrary } from '../library/BlockLibrary';

export function AppLayout() {
  const [activeTab, setActiveTab] = useState<TabId>('generator');

  const renderContent = () => {
    switch (activeTab) {
      case 'generator':
        return <ClassGenerator />;
      case 'calculator':
        return <TreadCalculator />;
      case 'blocks':
        return <BlockLibrary />;
      default:
        return <ClassGenerator />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderContent()}
      </main>
    </div>
  );
}
