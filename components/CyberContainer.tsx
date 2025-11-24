import React from 'react';
import { Theme } from '../types';

interface Props {
  children: React.ReactNode;
  className?: string;
  title?: string;
  theme?: Theme;
  loading?: boolean;
}

const CyberContainer: React.FC<Props> = ({ children, className = '', title, theme = 'CYBER', loading = false }) => {
  const isCyber = theme === 'CYBER';

  return (
    <div 
      className={`relative p-6 transition-all duration-300 group flex flex-col
        ${isCyber 
          ? 'border border-cyber-orangeDim bg-cyber-dark/80 backdrop-blur-sm animate-pulse-glow hover:shadow-[0_0_25px_rgba(255,102,0,0.25)]' 
          : 'border border-zinc-800 bg-zinc-950 rounded-lg'} 
        ${className}`}
    >
      {/* Loading Overlay */}
      {loading && (
        <div className={`absolute inset-0 z-20 pointer-events-none overflow-hidden ${!isCyber ? 'rounded-lg' : ''}`}>
          {isCyber ? (
             <div className="w-full h-full bg-cyber-orange/5 flex flex-col justify-center">
                <div className="w-full h-1 bg-cyber-orange/30 shadow-[0_0_15px_#ff6600] animate-scan-fast" />
             </div>
          ) : (
             <div className="w-full h-full bg-zinc-100/5 animate-pulse" />
          )}
        </div>
      )}

      {/* Corner Accents - Only in Cyber Mode - Now with blinking animations */}
      {isCyber && (
        <>
          <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyber-orange transition-opacity duration-300 animate-[blink-random_3s_infinite] ${loading ? 'opacity-50' : 'opacity-100'}`} />
          <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyber-orange transition-opacity duration-300 animate-[blink-random_4s_infinite] ${loading ? 'opacity-50' : 'opacity-100'}`} />
          <div className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyber-orange transition-opacity duration-300 animate-[blink-random_5s_infinite] ${loading ? 'opacity-50' : 'opacity-100'}`} />
          <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyber-orange transition-opacity duration-300 animate-[blink-random_2s_infinite] ${loading ? 'opacity-50' : 'opacity-100'}`} />
        </>
      )}

      {/* Header Label */}
      {title && (
        <div 
          className={`absolute -top-3 left-4 px-2 text-xs font-mono font-bold tracking-widest uppercase border transition-colors duration-300 z-10
            ${isCyber 
              ? 'bg-cyber-black text-cyber-orange border-cyber-orangeDim group-hover:bg-cyber-orange group-hover:text-black group-hover:border-cyber-orange shadow-[0_0_10px_rgba(0,0,0,0.5)]' 
              : 'bg-zinc-950 text-zinc-400 border-zinc-800'}`}
        >
          {title}
        </div>
      )}

      {/* Content Wrapper - Enforces Flex Behavior */}
      <div className={`flex-1 w-full flex flex-col relative ${loading ? 'opacity-60 blur-[1px]' : 'opacity-100'} transition-opacity duration-300`}>
        {children}
      </div>
    </div>
  );
};

export default CyberContainer;