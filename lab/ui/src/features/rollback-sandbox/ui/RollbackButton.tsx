import React from 'react';
import { Button } from '@/shared/ui/Button';
import { RotateCcw } from 'lucide-react';

export interface RollbackButtonProps {
  onRollback: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const RollbackButton: React.FC<RollbackButtonProps> = ({
  onRollback,
  isLoading,
  disabled,
}) => {
  return (
    <Button
      variant="danger"
      size="sm"
      icon={<RotateCcw size={14} />}
      onClick={onRollback}
      disabled={disabled || isLoading}
    >
      {isLoading ? 'Purging...' : 'Reset Sandbox'}
    </Button>
  );
};
