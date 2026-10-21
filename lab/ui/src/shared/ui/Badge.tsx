import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'yellow' | 'purple' | 'slate' | 'red';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'md',
}) => {
  const variantStyles: Record<string, React.CSSProperties> = {
    blue: { backgroundColor: '#1e3a8a', color: '#93c5fd', borderColor: '#2563eb' },
    green: { backgroundColor: '#064e3b', color: '#6ee7b7', borderColor: '#059669' },
    yellow: { backgroundColor: '#713f12', color: '#fde047', borderColor: '#ca8a04' },
    purple: { backgroundColor: '#581c87', color: '#d8b4fe', borderColor: '#9333ea' },
    slate: { backgroundColor: '#1e293b', color: '#cbd5e1', borderColor: '#475569' },
    red: { backgroundColor: '#7f1d1d', color: '#fca5a5', borderColor: '#dc2626' },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '0.15rem 0.45rem', fontSize: '0.75rem' },
    md: { padding: '0.25rem 0.6rem', fontSize: '0.8rem' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        borderRadius: '9999px',
        fontWeight: 500,
        border: '1px solid',
        ...variantStyles[variant],
        ...sizeStyles[size],
      }}
    >
      {children}
    </span>
  );
};
