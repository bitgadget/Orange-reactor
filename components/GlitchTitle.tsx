import React from 'react';
import { Theme } from '../types';

interface Props {
  text: string;
  theme: Theme;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const GlitchTitle: React.FC<Props> = ({ text, theme, size = 'xl' }) => {
  if (theme === 'MINIMAL') {
    return (
      <h1 className="text-4xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-100">
        {text.replace('_', ' ')}
      </h1>
    );
  }

  return (
    <div className="relative group cursor-default">
      {/* Main Text */}
      <h1 className="font-display font-black text-4xl md:text-6xl tracking-tighter text-white relative z-10">
        {text}
      </h1>
      
      {/* Glitch Layers (Visible on hover or intermittently) */}
      <div className="absolute top-0 left-0 w-full h-full text-4xl md:text-6xl font-display font-black tracking-tighter text-cyber-orange opacity-0 group-hover:opacity-100 group-hover:animate-glitch-skew z-0 pointer-events-none select-none">
        {text}
      </div>
      <div className="absolute top-0 left-[-2px] w-full h-full text-4xl md:text-6xl font-display font-black tracking-tighter text-cyan-500 opacity-0 group-hover:opacity-70 group-hover:translate-x-1 transition-all z-0 pointer-events-none select-none">
        {text}
      </div>
    </div>
  );
};

export default GlitchTitle;