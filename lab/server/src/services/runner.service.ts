import { SandboxService } from './sandbox.service.js';
import { MetricsService } from './metrics.service.js';
import type { BenchmarkRunRequest, BenchmarkRunResult } from '../types/index.js';

export class RunnerService {
  constructor(
    private readonly sandboxService: SandboxService,
    private readonly metricsService: MetricsService
  ) {}

  public async startBenchmark(req: BenchmarkRunRequest, archetypePath: string): Promise<BenchmarkRunResult> {
    const runId = `bench-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const startedAt = new Date().toISOString();

    // 1. Create isolated sandbox
    this.sandboxService.createSandbox(runId, archetypePath);

    // 2. Initial pending record
    const initialResult: BenchmarkRunResult = {
      runId,
      archetypeId: req.archetypeId,
      status: 'pending',
      startedAt,
    };
    this.metricsService.saveRun(initialResult);

    return initialResult;
  }

  public getRunStatus(runId: string): BenchmarkRunResult | null {
    return this.metricsService.getRunById(runId);
  }
}
