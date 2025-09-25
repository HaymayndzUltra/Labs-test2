import { useMemo } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import type { TabDefinition } from '../../data/types';

export function ModuleTabs({ tabs }: { tabs: TabDefinition[] }) {
  const { activeTab, setFilter } = useDashboardStore((state) => ({
    activeTab: state.filters.vertical,
    setFilter: state.setFilter,
  }));

  const accentStyles = useMemo(() => {
    return tabs.reduce<Record<string, React.CSSProperties>>((acc, tab) => {
      acc[tab.id] = {
        backgroundImage: `var(--${tab.accent})`,
        color: '#fff',
        boxShadow: '0 18px 32px -20px rgba(15, 23, 42, 0.32)',
      };
      return acc;
    }, {});
  }, [tabs]);

  return (
    <div role="tablist" aria-label="Module selector" className="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`${tab.id}-panel`}
            id={`${tab.id}-tab`}
            type="button"
            onClick={() => setFilter('vertical', tab.id)}
            style={isActive ? accentStyles[tab.id] : undefined}
          >
            <span style={{ fontWeight: 600 }}>{tab.label}</span>
            <span className="tab-caption" style={isActive ? { color: 'rgba(255,255,255,0.88)' } : undefined}>
              {tab.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
