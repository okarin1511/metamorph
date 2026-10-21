import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { FlaskConical, GitCompare, History, Cpu } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';

export type WorkbenchView = 'workbench' | 'compare' | 'history';

export interface WorkbenchHeaderProps {
  currentView?: WorkbenchView;
  onViewChange?: (view: WorkbenchView) => void;
  activeRunsCount?: number;
}

export const WorkbenchHeader: React.FC<WorkbenchHeaderProps> = ({
  currentView: controlledView,
  onViewChange,
  activeRunsCount = 0,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveView = (): WorkbenchView => {
    if (controlledView) return controlledView;
    if (location.pathname.startsWith('/compare')) return 'compare';
    if (location.pathname.startsWith('/history')) return 'history';
    return 'workbench';
  };

  const activeView = getActiveView();

  const handleNav = (view: WorkbenchView, path: string) => {
    if (onViewChange) onViewChange(view);
    navigate(path);
  };

  return (
    <header
      style={{
        backgroundColor: '#090d16',
        borderBottom: '1px solid #1e293b',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '0.5rem',
            backgroundColor: '#1e3a8a',
            color: '#60a5fa',
          }}
        >
          <FlaskConical size={20} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
              Metamorph R&D Lab
            </h1>
            <Badge variant="purple" size="sm">
              <Cpu size={12} />
              Workbench
            </Badge>
          </div>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
            Autonomous Swarm Benchmarking & Regression Testing
          </p>
        </div>
      </div>

      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={() => handleNav('workbench', '/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.85rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            border: 'none',
            backgroundColor: activeView === 'workbench' ? '#1e293b' : 'transparent',
            color: activeView === 'workbench' ? '#38bdf8' : '#94a3b8',
          }}
        >
          <FlaskConical size={16} />
          Archetypes
        </button>

        <button
          onClick={() => handleNav('compare', '/compare')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.85rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            border: 'none',
            backgroundColor: activeView === 'compare' ? '#1e293b' : 'transparent',
            color: activeView === 'compare' ? '#38bdf8' : '#94a3b8',
          }}
        >
          <GitCompare size={16} />
          Compare & Diff
        </button>

        <button
          onClick={() => handleNav('history', '/history')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.85rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            border: 'none',
            backgroundColor: activeView === 'history' ? '#1e293b' : 'transparent',
            color: activeView === 'history' ? '#38bdf8' : '#94a3b8',
          }}
        >
          <History size={16} />
          History
          {activeRunsCount > 0 && (
            <Badge variant="yellow" size="sm">
              {activeRunsCount}
            </Badge>
          )}
        </button>
      </nav>
    </header>
  );
};
