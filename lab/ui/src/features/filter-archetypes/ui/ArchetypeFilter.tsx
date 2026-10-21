import React from 'react';
import { Search, Layers, Server } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export interface ArchetypeFilterProps {
  search: string;
  onSearchChange: (search: string) => void;
  category: 'all' | 'frontend' | 'backend';
  onCategoryChange: (cat: 'all' | 'frontend' | 'backend') => void;
}

export const ArchetypeFilter: React.FC<ArchetypeFilterProps> = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}
    >
      <div style={{ position: 'relative', minWidth: '240px', flex: '1 1 300px' }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#64748b',
          }}
        />
        <input
          type="text"
          placeholder="Filter archetypes by name or framework..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem 0.5rem 2.25rem',
            backgroundColor: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '0.375rem',
            color: '#f8fafc',
            fontSize: '0.875rem',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button
          variant={category === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange('all')}
        >
          All
        </Button>
        <Button
          variant={category === 'frontend' ? 'primary' : 'outline'}
          size="sm"
          icon={<Layers size={14} />}
          onClick={() => onCategoryChange('frontend')}
        >
          Frontend
        </Button>
        <Button
          variant={category === 'backend' ? 'primary' : 'outline'}
          size="sm"
          icon={<Server size={14} />}
          onClick={() => onCategoryChange('backend')}
        >
          Backend
        </Button>
      </div>
    </div>
  );
};
