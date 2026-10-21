import React from 'react';
import { Card } from '@/shared/ui/Card';

export interface RunMetricCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  hint?: string;
}

export const RunMetricCard: React.FC<RunMetricCardProps> = ({
  label,
  value,
  icon,
  hint,
}) => {
  return (
    <Card style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>{label}</span>
        <span style={{ color: '#38bdf8' }}>{icon}</span>
      </div>
      <div style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0.5rem 0 0.25rem 0' }}>
        {value}
      </div>
      {hint && <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{hint}</span>}
    </Card>
  );
};
