import React, { useState } from 'react';
import { FileCode, FilePlus, FileDiff, FileX } from 'lucide-react';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import type { DiffFileEntry } from '@/shared/types/index.js';

export interface SplitDiffViewerProps {
  files: DiffFileEntry[];
}

export const SplitDiffViewer: React.FC<SplitDiffViewerProps> = ({ files }) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(
    files[0]?.path || null
  );

  const selectedFile = files.find((f) => f.path === selectedFilePath) || files[0];

  const getStatusIcon = (status: DiffFileEntry['status']) => {
    switch (status) {
      case 'added':
        return <FilePlus size={14} color="#34d399" />;
      case 'modified':
        return <FileDiff size={14} color="#38bdf8" />;
      case 'deleted':
        return <FileX size={14} color="#f87171" />;
    }
  };

  const getStatusBadge = (status: DiffFileEntry['status']) => {
    switch (status) {
      case 'added':
        return <Badge variant="green" size="sm">Added</Badge>;
      case 'modified':
        return <Badge variant="blue" size="sm">Modified</Badge>;
      case 'deleted':
        return <Badge variant="red" size="sm">Deleted</Badge>;
    }
  };

  if (files.length === 0) {
    return (
      <Card style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
        <FileCode size={32} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
        <p style={{ margin: 0 }}>No differences detected between baseline and migrated output.</p>
      </Card>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1rem', minHeight: '500px' }}>
      {/* File sidebar */}
      <Card title="Changed Files" subtitle={`${files.length} files affected`} style={{ padding: '0.75rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {files.map((file) => {
            const isSelected = file.path === selectedFile?.path;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFilePath(file.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  backgroundColor: isSelected ? '#1e293b' : 'transparent',
                  border: isSelected ? '1px solid #334155' : '1px solid transparent',
                  color: isSelected ? '#38bdf8' : '#cbd5e1',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {getStatusIcon(file.status)}
                  {file.path}
                </span>
                {getStatusBadge(file.status)}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Split diff viewer */}
      <Card
        title={selectedFile ? selectedFile.path : 'Select a file'}
        subtitle={selectedFile ? `Status: ${selectedFile.status}` : ''}
      >
        {selectedFile && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', height: '100%' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>
                Baseline Archetype (Original)
              </div>
              <pre
                style={{
                  backgroundColor: '#020617',
                  border: '1px solid #1e293b',
                  borderRadius: '0.375rem',
                  padding: '1rem',
                  fontSize: '0.75rem',
                  overflow: 'auto',
                  maxHeight: '450px',
                  color: '#94a3b8',
                  margin: 0,
                }}
              >
                {selectedFile.originalContent || '(File did not exist in baseline)'}
              </pre>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8', marginBottom: '0.5rem' }}>
                Migrated Output (Sandbox)
              </div>
              <pre
                style={{
                  backgroundColor: '#020617',
                  border: '1px solid #1e293b',
                  borderRadius: '0.375rem',
                  padding: '1rem',
                  fontSize: '0.75rem',
                  overflow: 'auto',
                  maxHeight: '450px',
                  color: '#34d399',
                  margin: 0,
                }}
              >
                {selectedFile.modifiedContent || '(File removed in sandbox)'}
              </pre>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
