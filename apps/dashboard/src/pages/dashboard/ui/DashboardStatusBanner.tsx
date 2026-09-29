import type { MigrationPlan } from '@/entities/migration';

interface DashboardStatusBannerProps {
  latestPlan: MigrationPlan;
  isFinished: boolean;
  isApplied: boolean;
  isFailed: boolean;
  isIntegrating: boolean;
  latestStatusMessage: string | null;
  lastApplyBranch?: string;
}

export const DashboardStatusBanner = ({
  latestPlan,
  isFinished,
  isApplied,
  isFailed,
  isIntegrating,
  latestStatusMessage,
  lastApplyBranch,
}: DashboardStatusBannerProps) => {
  if (!isFinished) {
    return (
      <div className="mb-6 p-4 border-4 border-neo-border bg-yellow-300 text-black">
        <p className="font-black uppercase tracking-widest text-sm mb-1">
          {isIntegrating ? 'Not done — installing dependencies' : 'Swarm is still working'}
        </p>
        <p className="font-bold text-sm leading-relaxed">
          {isIntegrating
            ? (latestStatusMessage || 'IntegrationAgent is running npm install and npm run build in the shadow workspace. File counters can sit at 0. Wait for Apply Migration.')
            : (latestStatusMessage || 'Mapper, Worker, Reviewer, Integration, and Reporter are on the bus. Watch Live Swarm and the queue, not only the Completed count.')}
        </p>
      </div>
    );
  }

  if (isFinished && !isApplied) {
    return (
      <div className={`mb-6 p-4 border-4 border-neo-border text-black ${isFailed ? 'bg-red-400' : 'bg-green-400'}`}>
        <p className="font-black uppercase tracking-widest text-sm mb-1">
          {isFailed ? 'Build did not pass' : 'Ready to apply'}
        </p>
        <p className="font-bold text-sm leading-relaxed">
          {isFailed
            ? 'Shadow npm install / npm run build (or timeout) failed after repair rounds. Applying this migration is blocked to protect your repository from broken code. Discard this run or start a new migration.'
            : 'Apply copies the shadow result into your repo on a git branch (including MIGRATION.md). Discard deletes the shadow run. Apply is one-shot.'}
        </p>
      </div>
    );
  }

  if (isApplied) {
    const branchName = latestPlan.appliedBranch || lastApplyBranch;
    return (
      <div className="mb-6 p-4 border-4 border-neo-border bg-green-400 text-black">
        <p className="font-black uppercase tracking-widest text-sm mb-1">Applied</p>
        <p className="font-bold text-sm leading-relaxed">
          This run is already in your project{branchName ? ` on branch ${branchName}` : ''}. Applying again would redo the same git checkout. Start a new migration, or open Next steps for install commands.
        </p>
      </div>
    );
  }

  return null;
};
