import { Request, Response } from 'express';
import { DiffService } from '../services/diff.service.js';
import { SandboxService } from '../services/sandbox.service.js';
import { ArchetypesController } from './archetypes.controller.js';

export class CompareController {
  constructor(
    private readonly diffService: DiffService,
    private readonly sandboxService: SandboxService,
    private readonly archetypesController: ArchetypesController
  ) {}

  public getDiff(req: Request, res: Response): void {
    const { runId, archetypeId } = req.query as { runId?: string; archetypeId?: string };
    if (!runId || !archetypeId) {
      res.status(400).json({ error: 'runId and archetypeId query parameters are required' });
      return;
    }

    const archetype = this.archetypesController.getStaticArchetype(archetypeId);
    if (!archetype) {
      res.status(404).json({ error: `Unknown archetype: ${archetypeId}` });
      return;
    }

    const sandboxPath = this.sandboxService.getSandboxPath(runId);
    const diffs = this.diffService.compareDirectories(archetype.path, sandboxPath);

    res.json({
      runId,
      archetypeId,
      files: diffs,
      totalChanges: diffs.length,
    });
  }
}
