import React, { useState } from 'react';

export function Dashboard() {
  const [metrics] = useState({ requests: 1240, uptime: '99.98%' });

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Dashboard View</h2>
      <p>Simulated analytics state:</p>
      <ul>
        <li>Requests: {metrics.requests}</li>
        <li>Uptime: {metrics.uptime}</li>
      </ul>
    </div>
  );
}
