import React, { useEffect, useState } from 'react';
import { Radiation } from 'lucide-react';

const BOOT_SEQUENCE = [
  "SYSTEM_CHECK: OK",
  "REACTOR_CORE: IGNITION",
  "COOLING_SYSTEMS: ACTIVE",
  "ESTABLISHING KRAKEN UPLINK...",
  "SYNCING COINGECKO NODES...",
  "DECRYPTING PRICE FEED...",
  "ORANGE_REACTOR: ONLINE"
];

interface Props {
  onComplete: () => void;
}

const LoadingScreen: React.FC<Props> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentLogIndex = 0;
    
    const logInterval = setInterval(() => {
      if (currentLogIndex < BOOT_SEQUENCE.length) {
        setLogs(prev => [...prev, `> ${BOOT_SEQUENCE[currentLogIndex]}`]);
        currentLogIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 500);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 1.5;
      });
    }, 40);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-cyber-black flex flex-col items-center justify-center font-mono text-cyber-orange p-8 z-50">
      <div className="w-full max-w-md space-y-8 flex flex-col items-center">
        
        {/* NUCLEAR REACTOR ANIMATION */}
        <div className="relative w-40 h-40 flex items-center justify-center">
           {/* Outer Containment Field (Slow Rotate) */}
           <div className="absolute inset-0 border border-dashed border-cyber-orangeDim/40 rounded-full animate-[spin_10s_linear_infinite]"></div>
           
           {/* Magnetic Ring (Fast Reverse Rotate) */}
           <div className="absolute inset-4 border-t-2 border-l-2 border-cyber-orange rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
           
           {/* Heat Haze / Glow */}
           <div className="absolute inset-0 bg-cyber-orange/10 blur-2xl rounded-full animate-pulse"></div>

           {/* The Radiation Core Symbol */}
           <div className="relative z-10 animate-[spin_20s_linear_infinite]">
              <Radiation size={64} strokeWidth={1.5} className="text-cyber-orange drop-shadow-[0_0_15px_rgba(255,102,0,0.8)]" />
           </div>

           {/* Critical Mass Center (Blinking Core) */}
           <div className="absolute z-20 w-3 h-3 bg-white rounded-full shadow-[0_0_20px_white] animate-[ping_1s_cubic-bezier(0,0,0.2,1)_infinite]" />
           <div className="absolute z-20 w-2 h-2 bg-white rounded-full" />
        </div>

        <h1 className="text-4xl font-display font-black tracking-tighter text-center">
          ORANGE<span className="text-white">_REACTOR</span>
        </h1>
        
        <div className="w-full h-48 border border-cyber-gray bg-black p-4 overflow-hidden relative shadow-[0_0_15px_rgba(255,102,0,0.1)]">
           <div className="absolute top-0 left-0 w-full h-1 bg-cyber-orange/20 animate-scanline"></div>
          {logs.map((log, i) => (
            <div key={i} className="text-xs md:text-sm opacity-90 tracking-wide">{log}</div>
          ))}
          <div className="animate-pulse">_</div>
        </div>

        <div className="w-full h-1 bg-cyber-gray mt-4 relative overflow-hidden">
          <div 
            className="h-full bg-cyber-orange shadow-[0_0_10px_#ff6600]"
            style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
          />
        </div>
        <div className="w-full flex justify-between text-xs text-cyber-orangeDim font-bold">
          <span>INITIALIZING_CORE</span>
          <span>{Math.floor(progress)}%</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;