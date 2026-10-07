import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import {
  adaptTypeScriptConfig,
  ensureBuildScript,
  sanitizeJsonContent,
} from './projectConfigAdapter';

describe('projectConfigAdapter', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'metamorph-config-adapter-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  });

  describe('sanitizeJsonContent', () => {
    it('strips single-line and multi-line comments and trailing commas', () => {
      const raw = `
        {
          // A single line comment
          "name": "test", /* inline comment */
          "compilerOptions": {
            "target": "es2020",
          },
        }
      `;
      const sanitized = sanitizeJsonContent(raw);
      const parsed = JSON.parse(sanitized);
      assert.strictEqual(parsed.name, 'test');
      assert.strictEqual(parsed.compilerOptions.target, 'es2020');
    });
  });

  describe('adaptTypeScriptConfig', () => {
    it('injects experimentalDecorators, emitDecoratorMetadata, and types for nestjs', () => {
      const tsConfigPath = path.join(tmpDir, 'tsconfig.json');
      fs.writeFileSync(
        tsConfigPath,
        JSON.stringify({
          compilerOptions: {
            target: 'ES2022',
            module: 'CommonJS',
          },
        }, null, 2)
      );

      const res = adaptTypeScriptConfig(tmpDir, 'nestjs');
      assert.strictEqual(res.modified, true);
      assert.strictEqual(res.created, false);

      const updated = JSON.parse(fs.readFileSync(tsConfigPath, 'utf-8'));
      assert.strictEqual(updated.compilerOptions.experimentalDecorators, true);
      assert.strictEqual(updated.compilerOptions.emitDecoratorMetadata, true);
      assert.deepStrictEqual(updated.compilerOptions.types, ['node']);
      assert.strictEqual(updated.compilerOptions.target, 'ES2022');
    });

    it('handles tsconfig with comments and appends node to existing types array', () => {
      const tsConfigPath = path.join(tmpDir, 'tsconfig.json');
      fs.writeFileSync(
        tsConfigPath,
        `{
          // Custom tsconfig
          "compilerOptions": {
            "types": ["jest"],
          },
        }`
      );

      const res = adaptTypeScriptConfig(tmpDir, 'nestjs');
      assert.strictEqual(res.modified, true);

      const updated = JSON.parse(fs.readFileSync(tsConfigPath, 'utf-8'));
      assert.deepStrictEqual(updated.compilerOptions.types, ['jest', 'node']);
      assert.strictEqual(updated.compilerOptions.experimentalDecorators, true);
    });

    it('scaffolds a default tsconfig.json if none exists for nestjs target', () => {
      const tsConfigPath = path.join(tmpDir, 'tsconfig.json');
      assert.strictEqual(fs.existsSync(tsConfigPath), false);

      const res = adaptTypeScriptConfig(tmpDir, 'nestjs');
      assert.strictEqual(res.created, true);
      assert.strictEqual(res.modified, true);
      assert.strictEqual(fs.existsSync(tsConfigPath), true);

      const created = JSON.parse(fs.readFileSync(tsConfigPath, 'utf-8'));
      assert.strictEqual(created.compilerOptions.experimentalDecorators, true);
      assert.strictEqual(created.compilerOptions.emitDecoratorMetadata, true);
    });

    it('does nothing when target framework does not require special compilerOptions', () => {
      const tsConfigPath = path.join(tmpDir, 'tsconfig.json');
      const original = { compilerOptions: { target: 'ES2020' } };
      fs.writeFileSync(tsConfigPath, JSON.stringify(original, null, 2));

      const res = adaptTypeScriptConfig(tmpDir, 'express');
      assert.strictEqual(res.modified, false);
      assert.strictEqual(res.created, false);

      const current = JSON.parse(fs.readFileSync(tsConfigPath, 'utf-8'));
      assert.strictEqual(current.compilerOptions.experimentalDecorators, undefined);
    });
  });

  describe('ensureBuildScript', () => {
    it('aliases build:ts to build when build is absent', () => {
      const pkg: { scripts: Record<string, string> } = { scripts: { 'build:ts': 'tsc -p .' } };
      const modified = ensureBuildScript(pkg, 'nestjs');
      assert.strictEqual(modified, true);
      assert.strictEqual(pkg.scripts.build, 'npm run build:ts');
    });

    it('aliases compile to build when build is absent', () => {
      const pkg: { scripts: Record<string, string> } = { scripts: { 'compile': 'tsc' } };
      const modified = ensureBuildScript(pkg, 'nestjs');
      assert.strictEqual(modified, true);
      assert.strictEqual(pkg.scripts.build, 'npm run compile');
    });

    it('defaults to tsc for backend targets when no build script exists', () => {
      const pkg: { scripts?: Record<string, string> } = { scripts: {} };
      const modified = ensureBuildScript(pkg, 'nestjs');
      assert.strictEqual(modified, true);
      assert.strictEqual(pkg.scripts?.build, 'tsc');
    });

    it('preserves existing build script unchanged', () => {
      const pkg = { scripts: { build: 'nest build' } };
      const modified = ensureBuildScript(pkg, 'nestjs');
      assert.strictEqual(modified, false);
      assert.strictEqual(pkg.scripts.build, 'nest build');
    });
  });
});
