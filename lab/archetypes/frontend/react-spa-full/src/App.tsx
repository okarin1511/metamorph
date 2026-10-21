import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './routes/Home';
import { Dashboard } from './routes/Dashboard';
import { Settings } from './routes/Settings';

export function App() {
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}
