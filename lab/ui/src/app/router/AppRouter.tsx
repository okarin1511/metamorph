import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { WorkbenchPage } from '@/pages/WorkbenchPage/ui/WorkbenchPage';
import { ComparePage } from '@/pages/ComparePage/ui/ComparePage';
import { HistoryPage } from '@/pages/HistoryPage/ui/HistoryPage';
import type { ArchetypeInfo, BenchmarkRunResult } from '@/shared/types/index.js';

export interface AppRouterProps {
  archetypes: ArchetypeInfo[];
  runs: BenchmarkRunResult[];
  onTriggerBenchmark: (archetypeId: string, targetFramework: string, version: string) => Promise<BenchmarkRunResult>;
}

export const AppRouter: React.FC<AppRouterProps> = ({
  archetypes,
  runs,
  onTriggerBenchmark,
}) => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <WorkbenchPage
            archetypes={archetypes}
            onTriggerBenchmark={onTriggerBenchmark}
          />
        }
      />
      <Route path="/workbench" element={<Navigate to="/" replace />} />
      <Route
        path="/compare"
        element={<ComparePage archetypes={archetypes} runs={runs} />}
      />
      <Route path="/history" element={<HistoryPage runs={runs} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
