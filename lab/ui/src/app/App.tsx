import React, { useState, useEffect } from 'react';
import { WorkbenchHeader, type WorkbenchView } from '@/widgets/WorkbenchHeader/ui/WorkbenchHeader';
import { WorkbenchPage } from '@/pages/WorkbenchPage/ui/WorkbenchPage';
import { ComparePage } from '@/pages/ComparePage/ui/ComparePage';
import { HistoryPage } from '@/pages/HistoryPage/ui/HistoryPage';
import { apiClient } from '@/shared/api/apiClient';
import type { ArchetypeInfo, BenchmarkRunResult } from '@/shared/types/index.js';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<WorkbenchView>('workbench');
  const [archetypes, setArchetypes] = useState<ArchetypeInfo[]>([]);
  const [runs, setRuns] = useState<BenchmarkRunResult[]>([]);

  useEffect(() => {
    apiClient
      .getArchetypes()
      .then(setArchetypes)
      .catch((err) => console.error('Failed to load archetypes:', err));

    apiClient
      .getRuns()
      .then(setRuns)
      .catch((err) => console.error('Failed to load runs:', err));
  }, []);

  const handleTriggerBenchmark = async (
    archetypeId: string,
    targetFramework: string,
    version: string
  ): Promise<BenchmarkRunResult> => {
    const result = await apiClient.startBenchmark({
      archetypeId,
      targetFramework,
      metamorphVersion: version,
      useMockLLM: true,
    });
    setRuns((prev) => [result, ...prev]);
    return result;
  };

  const activeRuns = runs.filter((r) => r.status === 'running' || r.status === 'pending');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030712', display: 'flex', flexDirection: 'column' }}>
      <WorkbenchHeader
        currentView={currentView}
        onViewChange={setCurrentView}
        activeRunsCount={activeRuns.length}
      />

      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        {currentView === 'workbench' && (
          <WorkbenchPage
            archetypes={archetypes}
            onTriggerBenchmark={handleTriggerBenchmark}
          />
        )}
        {currentView === 'compare' && (
          <ComparePage archetypes={archetypes} runs={runs} />
        )}
        {currentView === 'history' && (
          <HistoryPage runs={runs} />
        )}
      </main>
    </div>
  );
};
