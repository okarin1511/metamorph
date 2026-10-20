import React, { useState } from 'react';

export function Settings() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Settings View</h2>
      <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={notifications}
          onChange={(e) => setNotifications(e.target.checked)}
        />
        Enable Notifications
      </label>
    </div>
  );
}
