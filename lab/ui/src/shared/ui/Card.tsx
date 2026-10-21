import React from 'react';

export interface CardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  action,
  children,
  style,
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '0.5rem',
        padding: '1.25rem',
        color: '#f8fafc',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        ...style,
      }}
    >
      {(title || action) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            borderBottom: '1px solid #1e293b',
            paddingBottom: '0.75rem',
          }}
        >
          <div>
            {title && <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{title}</h3>}
            {subtitle && (
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.825rem', color: '#94a3b8' }}>
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
