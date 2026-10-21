import React from 'react';
import { Container } from '@/shared/ui/Container';
import { ScorecardWidget } from '@/widgets/ScorecardWidget/ui/ScorecardWidget';
import { Scorecard } from '@/entities/run-result/ui/Scorecard';
import { Card } from '@/shared/ui/Card';
import { History } from 'lucide-react';
import type { BenchmarkRunResult } from '@/shared/types/index.js';

export interface HistoryPageProps {
  runs: BenchmarkRunResult[];
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ runs }) => {
  return (
    <Container>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>
          Historical Benchmark Runs
        </h2>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#94a3b8' }}>
          Chronological record of swarm migration experiments and performance scorecards.
        </p>
      </div>

      <ScorecardWidget runs={runs} />

      {runs.length === 0 ? (
        <Card style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          <History size={32} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
          <p style={{ margin: 0 }}>No benchmark runs recorded in lab history yet.</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {runs.map((run) => (
            <Scorecard key={run.runId} result={run} />
          ))}
        </div>
      )}
    </Container>
  );
};
