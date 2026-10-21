import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { CheckCircle2, XCircle, Clock, Zap, DollarSign } from 'lucide-react';
import type { BenchmarkRunResult } from '../model/types.js';

export interface ScorecardProps {
  result: BenchmarkRunResult;
}

export const Scorecard: React.FC<ScorecardProps> = ({ result }) => {
  const isCompleted = result.status === 'completed';
  const isFailed = result.status === 'failed';

  return (
    <Card
      title={`Run: ${result.runId}`}
      subtitle={`Archetype: ${result.archetypeId}`}
      action={
        <Badge
          variant={isCompleted ? 'green' : isFailed ? 'red' : 'yellow'}
          size="md"
        >
          {isCompleted ? <CheckCircle2 size={14} /> : isFailed ? <XCircle size={14} /> : <Clock size={14} />}
          {result.status.toUpperCase()}
        </Badge>
      }
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          marginTop: '0.5rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={12} /> Duration
          </span>
          <strong style={{ fontSize: '1rem' }}>
            {result.durationMs ? `${(result.durationMs / 1000).toFixed(1)}s` : 'Pending'}
          </strong>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Zap size={12} /> Total Tokens
          </span>
          <strong style={{ fontSize: '1rem' }}>
            {result.totalTokens?.toLocaleString() ?? 0}
          </strong>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <DollarSign size={12} /> Est. Cost
          </span>
          <strong style={{ fontSize: '1rem' }}>
            ${result.estimatedCostUsd ? result.estimatedCostUsd.toFixed(4) : '0.0000'}
          </strong>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Build Status</span>
          <br />
          <strong style={{ fontSize: '1rem', color: result.buildSuccess ? '#34d399' : '#f87171' }}>
            {result.buildSuccess ? 'Passed' : 'Pending / Failed'}
          </strong>
        </div>
      </div>

      {result.error && (
        <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#450a0a', border: '1px solid #7f1d1d', borderRadius: '0.375rem', color: '#fca5a5', fontSize: '0.85rem' }}>
          <strong>Error: </strong> {result.error}
        </div>
      )}
    </Card>
  );
};
