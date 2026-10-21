import { DatabaseSync } from 'node:sqlite';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import type { BenchmarkRunResult } from '../types/index.js';

export class MetricsService {
  private db: DatabaseSync;

  constructor(dbPath?: string) {
    const resolvedPath = dbPath || resolve(process.cwd(), 'lab/history/metrics.db');
    const parentDir = dirname(resolvedPath);
    if (!existsSync(parentDir)) {
      mkdirSync(parentDir, { recursive: true });
    }

    this.db = new DatabaseSync(resolvedPath);
    this.initSchema();
  }

  private initSchema(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS benchmark_runs (
        runId TEXT PRIMARY KEY,
        archetypeId TEXT NOT NULL,
        status TEXT NOT NULL,
        startedAt TEXT NOT NULL,
        completedAt TEXT,
        durationMs INTEGER,
        totalTokens INTEGER,
        promptTokens INTEGER,
        completionTokens INTEGER,
        estimatedCostUsd REAL,
        buildSuccess INTEGER,
        filesModifiedCount INTEGER,
        error TEXT
      );
    `);
  }

  public saveRun(result: BenchmarkRunResult): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO benchmark_runs (
        runId, archetypeId, status, startedAt, completedAt,
        durationMs, totalTokens, promptTokens, completionTokens,
        estimatedCostUsd, buildSuccess, filesModifiedCount, error
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      result.runId,
      result.archetypeId,
      result.status,
      result.startedAt,
      result.completedAt || null,
      result.durationMs || null,
      result.totalTokens || null,
      result.promptTokens || null,
      result.completionTokens || null,
      result.estimatedCostUsd || null,
      result.buildSuccess ? 1 : 0,
      result.filesModifiedCount || 0,
      result.error || null
    );
  }

  public getAllRuns(): BenchmarkRunResult[] {
    const stmt = this.db.prepare(`SELECT * FROM benchmark_runs ORDER BY startedAt DESC`);
    const rows = stmt.all() as Record<string, unknown>[];
    return rows.map((r) => ({
      runId: String(r.runId),
      archetypeId: String(r.archetypeId),
      status: r.status as BenchmarkRunResult['status'],
      startedAt: String(r.startedAt),
      completedAt: r.completedAt ? String(r.completedAt) : undefined,
      durationMs: typeof r.durationMs === 'number' ? r.durationMs : undefined,
      totalTokens: typeof r.totalTokens === 'number' ? r.totalTokens : undefined,
      promptTokens: typeof r.promptTokens === 'number' ? r.promptTokens : undefined,
      completionTokens: typeof r.completionTokens === 'number' ? r.completionTokens : undefined,
      estimatedCostUsd: typeof r.estimatedCostUsd === 'number' ? r.estimatedCostUsd : undefined,
      buildSuccess: Boolean(r.buildSuccess),
      filesModifiedCount: typeof r.filesModifiedCount === 'number' ? r.filesModifiedCount : undefined,
      error: r.error ? String(r.error) : undefined,
    }));
  }

  public getRunById(runId: string): BenchmarkRunResult | null {
    const stmt = this.db.prepare(`SELECT * FROM benchmark_runs WHERE runId = ?`);
    const row = stmt.get(runId) as Record<string, unknown> | undefined;
    if (!row) return null;
    return {
      runId: String(row.runId),
      archetypeId: String(row.archetypeId),
      status: row.status as BenchmarkRunResult['status'],
      startedAt: String(row.startedAt),
      completedAt: row.completedAt ? String(row.completedAt) : undefined,
      durationMs: typeof row.durationMs === 'number' ? row.durationMs : undefined,
      totalTokens: typeof row.totalTokens === 'number' ? row.totalTokens : undefined,
      promptTokens: typeof row.promptTokens === 'number' ? row.promptTokens : undefined,
      completionTokens: typeof row.completionTokens === 'number' ? row.completionTokens : undefined,
      estimatedCostUsd: typeof row.estimatedCostUsd === 'number' ? row.estimatedCostUsd : undefined,
      buildSuccess: Boolean(row.buildSuccess),
      filesModifiedCount: typeof row.filesModifiedCount === 'number' ? row.filesModifiedCount : undefined,
      error: row.error ? String(row.error) : undefined,
    };
  }
}
