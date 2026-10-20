export type ArchetypeCategory = 'frontend' | 'backend';

export interface ArchetypeInfo {
  id: string;
  name: string;
  category: ArchetypeCategory;
  path: string;
  description: string;
  sourceFramework: string;
  recommendedTargets: string[];
}

export interface BenchmarkRunRequest {
  archetypeId: string;
  targetFramework: string;
  metamorphVersion?: string;
  useMockLLM?: boolean;
}

export interface BenchmarkRunResult {
  runId: string;
  archetypeId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  totalTokens?: number;
  promptTokens?: number;
  completionTokens?: number;
  estimatedCostUsd?: number;
  buildSuccess?: boolean;
  filesModifiedCount?: number;
  error?: string;
}

export interface DiffFileEntry {
  path: string;
  status: 'added' | 'modified' | 'deleted';
  originalContent?: string | null;
  modifiedContent?: string | null;
}
