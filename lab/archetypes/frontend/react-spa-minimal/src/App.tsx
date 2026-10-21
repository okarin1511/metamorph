import React, { useState } from 'react';

export function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', textAlign: 'center' }}>
      <h1>React SPA Minimal Archetype</h1>
      <p>Benchmark baseline sample for Metamorph swarm migrations.</p>
      <button onClick={() => setCount((c) => c + 1)}>
        Count is: {count}
      </button>
    </div>
  );
}
