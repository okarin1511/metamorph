import React, { useState, useEffect } from 'react';
import { Container } from '@/shared/ui/Container';
import { Card } from '@/shared/ui/Card';
import { SplitDiffViewer } from '@/widgets/SplitDiffViewer/ui/SplitDiffViewer';
import { RollbackButton } from '@/features/rollback-sandbox/ui/RollbackButton';
import { apiClient } from '@/shared/api/apiClient';
import type { ArchetypeInfo, BenchmarkRunResult, DiffFileEntry } from '@/shared/types/index.js';

export interface ComparePageProps {
  archetypes: ArchetypeInfo[];
  runs: BenchmarkRunResult[];
}

export const ComparePage: React.FC<ComparePageProps> = ({ archetypes, runs }) => {
  const [selectedRunId, setSelectedRunId] = useState<string>(runs[0]?.runId || '');
  const [diffFiles, setDiffFiles] = useState<DiffFileEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const selectedRun = runs.find((r) => r.runId === selectedRunId) || runs[0];
  const selectedArchetype = archetypes.find((a) => a.id === selectedRun?.archetypeId) || archetypes[0];

  useEffect(() => {
    if (selectedRun && selectedArchetype) {
      setIsLoading(true);
      apiClient
        .getDiff(selectedRun.runId, selectedArchetype.id)
        .then((res) => setDiffFiles(res.files))
        .catch(() => setDiffFiles([]))
        .finally(() => setIsLoading(false));
    }
  }, [selectedRun?.runId, selectedArchetype?.id]);

  return (
    <Container>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>
            Comparison & Diff Workbench
          </h2>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#94a3b8' }}>
            Split visual inspection between baseline source and migrated sandbox code.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select
            value={selectedRunId}
            onChange={(e) => setSelectedRunId(e.target.value)}
            style={{
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #334155',
              borderRadius: '0.375rem',
              padding: '0.45rem 0.75rem',
              fontSize: '0.875rem',
            }}
          >
            {runs.length === 0 ? (
              <option value="">No benchmark runs available</option>
            ) : (
              runs.map((r) => (
                <option key={r.runId} value={r.runId}>
                  {r.runId} ({r.archetypeId} - {r.status})
                </option>
              ))
            )}
          </select>

          {selectedRun && (
            <RollbackButton onRollback={() => console.log('Rollback', selectedRun.runId)} />
          )}
        </div>
      </div>

      {isLoading ? (
        <Card style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          Loading sandbox diffs...
        </Card>
      ) : (
        <SplitDiffViewer files={diffFiles} />
      )}
    </Container>
  );
};
