import React, { useState } from 'react';
import { Container } from '@/shared/ui/Container';
import { ArchetypeFilter } from '@/features/filter-archetypes/ui/ArchetypeFilter';
import { ArchetypeCard } from '@/entities/archetype/ui/ArchetypeCard';
import { RunBenchmarkButton } from '@/features/run-benchmark/ui/RunBenchmarkButton';
import { VersionSwitch } from '@/widgets/VersionSwitch/ui/VersionSwitch';
import type { ArchetypeInfo, BenchmarkRunResult } from '@/shared/types/index.js';

export interface WorkbenchPageProps {
  archetypes: ArchetypeInfo[];
  onTriggerBenchmark: (archetypeId: string, targetFramework: string, version: string) => Promise<BenchmarkRunResult>;
}

export const WorkbenchPage: React.FC<WorkbenchPageProps> = ({
  archetypes,
  onTriggerBenchmark,
}) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all' | 'frontend' | 'backend'>('all');
  const [selectedVersion, setSelectedVersion] = useState('develop');
  const [runningId, setRunningId] = useState<string | null>(null);

  const filteredArchetypes = archetypes.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.sourceFramework.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || a.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleRun = async (archetype: ArchetypeInfo) => {
    const target = archetype.recommendedTargets[0] || 'next';
    setRunningId(archetype.id);
    try {
      await onTriggerBenchmark(archetype.id, target, selectedVersion);
    } finally {
      setRunningId(null);
    }
  };

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
            Baseline Archetypes Catalog
          </h2>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#94a3b8' }}>
            Immutable reference projects used to benchmark swarm refactoring accuracy.
          </p>
        </div>
        <VersionSwitch selectedVersion={selectedVersion} onVersionChange={setSelectedVersion} />
      </div>

      <ArchetypeFilter
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {filteredArchetypes.map((archetype) => (
          <ArchetypeCard
            key={archetype.id}
            archetype={archetype}
            action={
              <RunBenchmarkButton
                onRun={() => handleRun(archetype)}
                isLoading={runningId === archetype.id}
              />
            }
          />
        ))}
      </div>
    </Container>
  );
};
