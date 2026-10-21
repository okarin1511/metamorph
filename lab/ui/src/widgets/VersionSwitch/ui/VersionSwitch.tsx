import React from 'react';
import { GitBranch } from 'lucide-react';
import { KNOWN_VERSIONS } from '@/entities/version/model/types';

export interface VersionSwitchProps {
  selectedVersion: string;
  onVersionChange: (version: string) => void;
}

export const VersionSwitch: React.FC<VersionSwitchProps> = ({
  selectedVersion,
  onVersionChange,
}) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#0f172a', padding: '0.25rem 0.5rem', borderRadius: '0.375rem', border: '1px solid #1e293b' }}>
      <GitBranch size={14} color="#94a3b8" />
      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Engine Version:</span>
      <select
        value={selectedVersion}
        onChange={(e) => onVersionChange(e.target.value)}
        style={{
          backgroundColor: '#1e293b',
          color: '#f8fafc',
          border: '1px solid #334155',
          borderRadius: '0.25rem',
          padding: '0.25rem 0.5rem',
          fontSize: '0.75rem',
          cursor: 'pointer',
        }}
      >
        {KNOWN_VERSIONS.map((v) => (
          <option key={v.id} value={v.id}>
            {v.label}
          </option>
        ))}
      </select>
    </div>
  );
};
