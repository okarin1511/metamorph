import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { DiffFileEntry } from '../types/index.js';

const IGNORED_ENTRIES = ['node_modules', '.git', '.metamorph', 'dist', 'build', '.turbo'];

export class DiffService {
  public compareDirectories(originalDir: string, sandboxDir: string): DiffFileEntry[] {
    const results: DiffFileEntry[] = [];
    if (!existsSync(originalDir) || !existsSync(sandboxDir)) {
      return results;
    }

    const originalFiles = this.collectFiles(originalDir, originalDir);
    const sandboxFiles = this.collectFiles(sandboxDir, sandboxDir);

    // Added or modified in sandbox
    for (const [relPath, fullSandboxPath] of sandboxFiles) {
      if (!originalFiles.has(relPath)) {
        results.push({
          path: relPath,
          status: 'added',
          modifiedContent: this.readSafe(fullSandboxPath),
        });
      } else {
        const fullOrigPath = originalFiles.get(relPath)!;
        const origContent = this.readSafe(fullOrigPath);
        const modContent = this.readSafe(fullSandboxPath);
        if (origContent !== modContent) {
          results.push({
            path: relPath,
            status: 'modified',
            originalContent: origContent,
            modifiedContent: modContent,
          });
        }
      }
    }

    // Deleted from sandbox
    for (const [relPath, fullOrigPath] of originalFiles) {
      if (!sandboxFiles.has(relPath)) {
        results.push({
          path: relPath,
          status: 'deleted',
          originalContent: this.readSafe(fullOrigPath),
        });
      }
    }

    return results;
  }

  private collectFiles(dir: string, base: string): Map<string, string> {
    const map = new Map<string, string>();
    if (!existsSync(dir)) return map;

    const entries = readdirSync(dir);
    for (const entry of entries) {
      if (IGNORED_ENTRIES.includes(entry)) continue;
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        const sub = this.collectFiles(full, base);
        for (const [k, v] of sub) map.set(k, v);
      } else {
        map.set(relative(base, full).replace(/\\/g, '/'), full);
      }
    }
    return map;
  }

  private readSafe(filePath: string): string | null {
    try {
      const MAX_SIZE = 2 * 1024 * 1024;
      const stat = statSync(filePath);
      if (stat.size > MAX_SIZE) return '[File exceeds 2MB limit]';
      return readFileSync(filePath, 'utf-8');
    } catch {
      return null;
    }
  }
}
