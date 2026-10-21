import React from 'react';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
      <strong>Full SPA Archetype</strong>
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/settings">Settings</Link>
    </nav>
  );
}
