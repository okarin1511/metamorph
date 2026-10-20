import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { FileCode, Layers } from 'lucide-react';
import type { ArchetypeInfo } from '../model/types.js';

export interface ArchetypeCardProps {
  archetype: ArchetypeInfo;
  action?: React.ReactNode;
}

export const ArchetypeCard: React.FC<ArchetypeCardProps> = ({ archetype, action }) => {
  return (
    <Card
      title={archetype.name}
      subtitle={`Source: ${archetype.sourceFramework}`}
      action={action}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <p style={{ fontSize: '0.875rem', color: '#cbd5e1', flexGrow: 1, margin: '0 0 1rem 0' }}>
        {archetype.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <Badge variant={archetype.category === 'frontend' ? 'purple' : 'blue'} size="sm">
          <Layers size={12} />
          {archetype.category}
        </Badge>
        <Badge variant="slate" size="sm">
          <FileCode size={12} />
          {archetype.id}
        </Badge>
      </div>

      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
        <strong>Target Options: </strong>
        {archetype.recommendedTargets.join(', ')}
      </div>
    </Card>
  );
};
