import React from 'react';

export interface ContainerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Container: React.FC<ContainerProps> = ({ children, style }) => {
  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '1.5rem',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
