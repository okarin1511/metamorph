import type { MigrationCostSummary } from '@/entities/migration';
import { Coins, Cpu, Zap, Activity } from 'lucide-react';

interface CostTrackerProps {
  costSummary: MigrationCostSummary | null;
  totalFiles: number;
}

export const CostTracker = ({ costSummary, totalFiles }: CostTrackerProps) => {
  if (!costSummary || costSummary.totalTokens === 0) {
    return null;
  }

  const avgCostPerFile = totalFiles > 0 ? costSummary.totalCostUsd / totalFiles : 0;
  const promptPercent = costSummary.totalTokens > 0
    ? Math.round((costSummary.promptTokens / costSummary.totalTokens) * 100)
    : 0;
  const completionPercent = 100 - promptPercent;

  return (
    <section className="neo-card bg-neutral-900 text-white mb-8 border-2 border-black animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-neutral-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-400 text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-wider text-white">
              LLM Telemetry & Cost Accounting
            </h3>
            <p className="text-xs text-neutral-400 font-mono">
              Live Mozaik v4 Token Usage & Financial Estimation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {Object.keys(costSummary.byModel).map((model) => (
            <span
              key={model}
              className="text-xs font-mono font-bold px-3 py-1 bg-neutral-800 text-amber-400 border border-neutral-600 rounded-none shadow-[2px_2px_0px_0px_#000]"
            >
              {model}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-neutral-800 border-2 border-black shadow-[3px_3px_0px_0px_#000]">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1 font-mono">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>Estimated Cost</span>
          </div>
          <p className="text-3xl font-black text-amber-400 font-mono">
            ${costSummary.totalCostUsd.toFixed(4)}
            <span className="text-xs text-neutral-400 font-normal ml-1">USD</span>
          </p>
        </div>

        <div className="p-4 bg-neutral-800 border-2 border-black shadow-[3px_3px_0px_0px_#000]">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1 font-mono">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Total Tokens</span>
          </div>
          <p className="text-3xl font-black text-indigo-300 font-mono">
            {costSummary.totalTokens.toLocaleString()}
          </p>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            {promptPercent}% in / {completionPercent}% out
          </p>
        </div>

        <div className="p-4 bg-neutral-800 border-2 border-black shadow-[3px_3px_0px_0px_#000]">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1 font-mono">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Avg / File</span>
          </div>
          <p className="text-3xl font-black text-emerald-400 font-mono">
            ${avgCostPerFile.toFixed(4)}
          </p>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            Across {totalFiles} planned files
          </p>
        </div>

        <div className="p-4 bg-neutral-800 border-2 border-black shadow-[3px_3px_0px_0px_#000]">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1 font-mono">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Worker vs Reviewer</span>
          </div>
          <div className="space-y-1 font-mono text-xs mt-2">
            <div className="flex justify-between">
              <span className="text-neutral-400">Workers:</span>
              <span className="font-bold text-white">
                {costSummary.byAgentRole.worker?.tokens.toLocaleString() || 0} tokens
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Reviewers:</span>
              <span className="font-bold text-white">
                {costSummary.byAgentRole.reviewer?.tokens.toLocaleString() || 0} tokens
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Token Distribution Progress Bar */}
      <div className="w-full bg-neutral-800 border-2 border-black h-3 overflow-hidden flex">
        <div
          className="bg-indigo-500 h-full transition-all duration-300"
          style={{ width: `${promptPercent}%` }}
          title={`Prompt Tokens: ${costSummary.promptTokens.toLocaleString()}`}
        />
        <div
          className="bg-amber-400 h-full transition-all duration-300"
          style={{ width: `${completionPercent}%` }}
          title={`Completion Tokens: ${costSummary.completionTokens.toLocaleString()}`}
        />
      </div>
      <div className="flex justify-between text-[11px] text-neutral-400 font-mono mt-2">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 inline-block bg-indigo-500" /> Prompt Tokens ({costSummary.promptTokens.toLocaleString()})
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 inline-block bg-amber-400" /> Output Tokens ({costSummary.completionTokens.toLocaleString()})
        </span>
      </div>
    </section>
  );
};
