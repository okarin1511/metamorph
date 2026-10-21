import type { ArchetypeInfo, BenchmarkRunRequest, BenchmarkRunResult, DiffFileEntry } from '../types/index.js';

const BASE_URL = import.meta.env.VITE_LAB_API_URL || 'http://localhost:4200/api';

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorBody.error || `HTTP error ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  async getArchetypes(): Promise<ArchetypeInfo[]> {
    const data = await fetchJson<{ archetypes: ArchetypeInfo[] }>('/archetypes');
    return data.archetypes;
  },

  async getArchetype(id: string): Promise<ArchetypeInfo> {
    return fetchJson<ArchetypeInfo>(`/archetypes/${id}`);
  },

  async startBenchmark(request: BenchmarkRunRequest): Promise<BenchmarkRunResult> {
    return fetchJson<BenchmarkRunResult>('/benchmark/run', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async getRuns(): Promise<BenchmarkRunResult[]> {
    const data = await fetchJson<{ runs: BenchmarkRunResult[] }>('/benchmark/runs');
    return data.runs;
  },

  async getRun(runId: string): Promise<BenchmarkRunResult> {
    return fetchJson<BenchmarkRunResult>(`/benchmark/runs/${runId}`);
  },

  async getDiff(runId: string, archetypeId: string): Promise<{ files: DiffFileEntry[]; totalChanges: number }> {
    return fetchJson<{ files: DiffFileEntry[]; totalChanges: number }>(
      `/compare?runId=${encodeURIComponent(runId)}&archetypeId=${encodeURIComponent(archetypeId)}`
    );
  },
};
