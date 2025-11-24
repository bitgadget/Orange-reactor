import React from 'react';

const CyberParticles: React.FC = () => {
  // Generate a stable set of particles with more variance
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${3 + Math.random() * 7}s`,
    opacity: Math.random() * 0.4 + 0.1,
    size: Math.random() * 2 + 1,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bg-cyber-orange rounded-full animate-float"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDelay: p.animationDelay,
            animationDuration: p.animationDuration,
            boxShadow: `0 0 ${p.size * 3}px #ff6600`
          }}
        />
      ))}
    </div>
  );
};

export default CyberParticles;