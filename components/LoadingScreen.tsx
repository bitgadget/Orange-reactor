import React, { useEffect, useState } from 'react';

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
        
        {/* Reactor Core Animation */}
        <div className="relative w-32 h-32 flex items-center justify-center">
           <div className="absolute inset-0 border-4 border-cyber-gray rounded-full opacity-20"></div>
           <div className="absolute inset-0 border-t-4 border-cyber-orange rounded-full animate-spin"></div>
           <div className="absolute inset-2 border-b-4 border-cyber-orangeDim rounded-full animate-spin-slow direction-reverse"></div>
           <div className="w-16 h-16 bg-cyber-orange/10 rounded-full animate-pulse flex items-center justify-center shadow-[0_0_30px_#ff6600]">
              <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
           </div>
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