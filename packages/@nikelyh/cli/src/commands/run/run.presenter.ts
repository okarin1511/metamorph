import chalk from 'chalk';
import { MetamorphConfig, MOZAIK_BUNDLED_MODELS, isMozaikBundledModel } from '@nikelyh/domain';

export function logStartupContext(): void {
  const isDev = process.env.METAMORPH_DEV === '1';
  console.log(chalk.gray(`[Metamorph] CWD: ${process.cwd()}`));
  console.log(chalk.gray(`[Metamorph] Binary: ${import.meta.url}`));
  if (!isDev && import.meta.url.includes('/src/')) {
    console.log(chalk.yellow(`[Metamorph] Notice: Running directly from source without METAMORPH_DEV=1.`));
  }
}

export function presentMissingApiKey(): void {
  console.log(chalk.red(`\n❌ ERROR: No LLM API key detected.`));
  console.log(chalk.yellow(`Metamorph requires an API key (OPENAI_API_KEY or ANTHROPIC_API_KEY) to power the AI Worker agents.`));
  console.log(chalk.yellow(`Execution has been blocked to prevent agents from crashing during the migration.\n`));
  console.log(chalk.white(`To fix this, you can either:`));
  console.log(chalk.gray(`  1. Create a `) + chalk.cyan(`.env`) + chalk.gray(` file in your current directory with:`));
  console.log(chalk.green(`     OPENAI_API_KEY=sk-...`));
  console.log(chalk.gray(`  2. Or set it directly in your terminal:`));
  console.log(chalk.gray(`     Linux/macOS: `) + chalk.cyan(`export OPENAI_API_KEY="sk-..."`));
  console.log(chalk.gray(`     Windows: `) + chalk.cyan(`$env:OPENAI_API_KEY="sk-..."\n`));
}

export function presentModelWarning(model?: string): void {
  if (model && !isMozaikBundledModel(model)) {
    console.log(chalk.yellow(`\n⚠️  Notice: "${model}" is not an officially bundled Mozaik v4 model.`));
    console.log(chalk.gray(`Officially bundled models: ${MOZAIK_BUNDLED_MODELS.join(', ')}\n`));
  }
}

export function presentMigrationStart(params: {
  targetPath: string;
  from: string;
  to: string;
  config: MetamorphConfig;
}): void {
  const { targetPath, from, to, config } = params;
  console.log(chalk.blue(`\n🚀 Starting Metamorph Migration`));
  console.log(chalk.gray(`Target: ${targetPath} | ${from} -> ${to}`));
  console.log(
    chalk.gray(
      `Model: ${config.model} | Concurrency: ${config.concurrency} | Timeout: ${config.inferenceTimeoutMs / 1000}s | Retries: ${config.maxRetries}\n`
    )
  );
}

export function presentMigrationSuccess(result: { shadowPath: string; runId: string }, targetPath: string): void {
  console.log(chalk.green(`\n✅ Migration finished successfully in shadow workspace!`));
  console.log(chalk.white(`\nNext steps:`));
  console.log(chalk.gray(`  1. Review changes in shadow workspace: `) + chalk.cyan(result.shadowPath));
  console.log(
    chalk.gray(`  2. Apply changes to a dedicated Git branch: `) +
      chalk.cyan(`metamorph apply ${result.runId} ${targetPath}\n`)
  );
}

export function presentMigrationFailure(runId: string, targetPath: string): void {
  console.log(chalk.red(`\n❌ Migration failed in shadow workspace.`));
  console.log(chalk.yellow(`Check .metamorph/shadow/${runId}/MIGRATION.md or run 'metamorph ui' for failure details.`));
  console.log(chalk.gray(`Your original codebase in "${targetPath}" remains completely untouched.\n`));
}
