import React from 'react';
import { RunMetricCard } from '@/entities/run-result/ui/RunMetricCard';
import { Clock, Zap, DollarSign, CheckCircle2 } from 'lucide-react';
import type { BenchmarkRunResult } from '@/shared/types/index.js';

export interface ScorecardWidgetProps {
  runs: BenchmarkRunResult[];
}

export const ScorecardWidget: React.FC<ScorecardWidgetProps> = ({ runs }) => {
  const totalRuns = runs.length;
  const completedRuns = runs.filter((r) => r.status === 'completed');
  const successRate = totalRuns > 0 ? Math.round((completedRuns.length / totalRuns) * 100) : 0;

  const totalTokens = runs.reduce((acc, r) => acc + (r.totalTokens || 0), 0);
  const totalCost = runs.reduce((acc, r) => acc + (r.estimatedCostUsd || 0), 0);
  const avgDurationMs =
    completedRuns.length > 0
      ? Math.round(completedRuns.reduce((acc, r) => acc + (r.durationMs || 0), 0) / completedRuns.length)
      : 0;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}
    >
      <RunMetricCard
        label="Success Rate"
        value={`${successRate}%`}
        icon={<CheckCircle2 size={18} color="#34d399" />}
        hint={`${completedRuns.length} of ${totalRuns} runs completed`}
      />
      <RunMetricCard
        label="Avg. Duration"
        value={`${(avgDurationMs / 1000).toFixed(1)}s`}
        icon={<Clock size={18} color="#38bdf8" />}
        hint="Across successful runs"
      />
      <RunMetricCard
        label="Total Tokens"
        value={totalTokens.toLocaleString()}
        icon={<Zap size={18} color="#fbbf24" />}
        hint="All model inference"
      />
      <RunMetricCard
        label="Total Estimated Cost"
        value={`$${totalCost.toFixed(4)}`}
        icon={<DollarSign size={18} color="#a78bfa" />}
        hint="Simulated & API usage"
      />
    </div>
  );
};
