import * as fs from 'fs';
import * as path from 'path';

export interface TsConfigAdapterResult {
  modified: boolean;
  created: boolean;
}

/**
 * Safely strips comments and trailing commas from JSON strings (such as tsconfig.json).
 */
export function sanitizeJsonContent(raw: string): string {
  return raw
    .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*/g, '$1')
    .replace(/,\s*([}\]])/g, '$1')
    .trim();
}

/**
 * Ensures compilerOptions required by the target framework are configured in tsconfig.json.
 * For NestJS, enables experimentalDecorators, emitDecoratorMetadata, and node types.
 */
export function adaptTypeScriptConfig(
  shadowDir: string,
  targetFramework: string,
): TsConfigAdapterResult {
  const tsConfigPath = path.join(shadowDir, 'tsconfig.json');
  const target = targetFramework.toLowerCase();

  // If tsconfig does not exist and target requires TypeScript configuration
  if (!fs.existsSync(tsConfigPath)) {
    if (target === 'nestjs') {
      const defaultNestTsConfig = {
        compilerOptions: {
          module: 'commonjs',
          declaration: true,
          removeComments: true,
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
          allowSyntheticDefaultImports: true,
          target: 'ES2021',
          sourceMap: true,
          outDir: './dist',
          baseUrl: './',
          incremental: true,
          skipLibCheck: true,
          strictNullChecks: false,
          noImplicitAny: false,
          types: ['node'],
        },
        include: ['src/**/*'],
      };
      fs.writeFileSync(tsConfigPath, JSON.stringify(defaultNestTsConfig, null, 2) + '\n', 'utf-8');
      return { modified: true, created: true };
    }
    return { modified: false, created: false };
  }

  try {
    const rawContent = fs.readFileSync(tsConfigPath, 'utf-8');
    const sanitized = sanitizeJsonContent(rawContent);
    const tsconfig = JSON.parse(sanitized);

    let modified = false;

    if (!tsconfig.compilerOptions) {
      tsconfig.compilerOptions = {};
      modified = true;
    }

    if (target === 'nestjs') {
      if (tsconfig.compilerOptions.experimentalDecorators !== true) {
        tsconfig.compilerOptions.experimentalDecorators = true;
        modified = true;
      }
      if (tsconfig.compilerOptions.emitDecoratorMetadata !== true) {
        tsconfig.compilerOptions.emitDecoratorMetadata = true;
        modified = true;
      }
      if (!tsconfig.compilerOptions.types) {
        tsconfig.compilerOptions.types = ['node'];
        modified = true;
      } else if (Array.isArray(tsconfig.compilerOptions.types) && !tsconfig.compilerOptions.types.includes('node')) {
        tsconfig.compilerOptions.types.push('node');
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(tsConfigPath, JSON.stringify(tsconfig, null, 2) + '\n', 'utf-8');
    }

    return { modified, created: false };
  } catch (err) {
    console.warn('[projectConfigAdapter] Warning: Could not parse or adapt tsconfig.json:', err);
    return { modified: false, created: false };
  }
}

/**
 * Ensures package.json has a valid 'build' script to satisfy the Integration runner.
 * Dynamically resolves existing script variants (e.g. build:ts, compile) or falls back
 * to standard compilation commands for the target framework.
 */
export function ensureBuildScript(
  pkg: { scripts?: Record<string, string> },
  targetFramework: string,
): boolean {
  if (!pkg.scripts) {
    pkg.scripts = {};
  }

  // If a build script already exists, preserve it
  if (pkg.scripts.build && pkg.scripts.build.trim().length > 0) {
    return false;
  }

  // Dynamically alias known build variants
  if (pkg.scripts['build:ts']) {
    pkg.scripts.build = 'npm run build:ts';
    return true;
  }

  if (pkg.scripts.compile) {
    pkg.scripts.build = 'npm run compile';
    return true;
  }

  const target = targetFramework.toLowerCase();
  if (target === 'nestjs' || target === 'express' || target === 'fastify') {
    pkg.scripts.build = 'tsc';
    return true;
  }

  return false;
}
