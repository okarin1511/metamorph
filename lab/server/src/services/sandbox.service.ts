import { existsSync, cpSync, rmSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

export class SandboxService {
  private readonly sandboxesRoot: string;

  constructor(customRoot?: string) {
    this.sandboxesRoot = customRoot || resolve(process.cwd(), '.lab-sandboxes');
    if (!existsSync(this.sandboxesRoot)) {
      mkdirSync(this.sandboxesRoot, { recursive: true });
    }
  }

  public createSandbox(runId: string, archetypePath: string): string {
    const targetDir = join(this.sandboxesRoot, runId);
    if (existsSync(targetDir)) {
      rmSync(targetDir, { recursive: true, force: true });
    }
    mkdirSync(targetDir, { recursive: true });
    cpSync(archetypePath, targetDir, { recursive: true });
    return targetDir;
  }

  public getSandboxPath(runId: string): string {
    return join(this.sandboxesRoot, runId);
  }

  public removeSandbox(runId: string): boolean {
    const targetDir = join(this.sandboxesRoot, runId);
    if (existsSync(targetDir)) {
      rmSync(targetDir, { recursive: true, force: true });
      return true;
    }
    return false;
  }
}
