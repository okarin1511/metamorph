import React from 'react';
import { Button } from '@/shared/ui/Button';
import { Play } from 'lucide-react';

export interface RunBenchmarkButtonProps {
  onRun: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const RunBenchmarkButton: React.FC<RunBenchmarkButtonProps> = ({
  onRun,
  isLoading,
  disabled,
}) => {
  return (
    <Button
      variant="primary"
      size="sm"
      icon={<Play size={14} />}
      onClick={onRun}
      disabled={disabled || isLoading}
    >
      {isLoading ? 'Running...' : 'Run Benchmark'}
    </Button>
  );
};
