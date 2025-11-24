import React, { useState, useEffect } from 'react';
import { MarketAnalysis, Theme } from '../types';
import { Cpu, Activity, AlertTriangle, Terminal, Zap } from 'lucide-react';
import GlitchText from './GlitchText';

interface Props {
  analysis: MarketAnalysis | null;
  loading: boolean;
  onRefresh: () => void;
  theme?: Theme;
}

// Internal component for Matrix-style decryption text
const DecryptionLoader = ({ theme }: { theme: Theme }) => {
    const [text, setText] = useState('');
    const chars = "010101XYZ_Ωπ7A3B9C2";
    
    useEffect(() => {
        const interval = setInterval(() => {
            let result = '';
            for(let i=0; i<32; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
                if (i % 4 === 0) result += ' ';
            }
            setText(result);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const isCyber = theme === 'CYBER';

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4 animate-pulse">
            <Zap size={32} className={`${isCyber ? "text-cyber-orange" : "text-zinc-500"} animate-bounce`} />
            <div className={`font-mono text-xs text-center leading-relaxed max-w-[200px] break-all
                 ${isCyber ? "text-cyber-orangeDim" : "text-zinc-400"}`}>
                DECRYPTING_NEURAL_PATHWAYS...
                <br/>
                <span className="opacity-70">{text}</span>
            </div>
        </div>
    )
}

const AiTerminal: React.FC<Props> = ({ analysis, loading, onRefresh, theme = 'CYBER' }) => {
  const isCyber = theme === 'CYBER';

  return (
    <div className={`h-full flex flex-col font-mono text-sm relative overflow-hidden ${!isCyber ? 'text-zinc-300' : ''}`}>
      {isCyber && <div className="absolute inset-0 bg-cyber-orange/5 pointer-events-none" />}
      
      {/* Header */}
      <div className={`flex items-center justify-between border-b pb-2 mb-4 
        ${isCyber ? 'border-cyber-orangeDim' : 'border-zinc-800'}`}>
        <div className={`flex items-center gap-2 ${isCyber ? 'text-cyber-orange' : 'text-zinc-100'}`}>
          <Cpu size={16} className={loading ? "animate-spin" : ""} />
          <span className="font-bold tracking-widest">REACTOR AI CORE</span>
        </div>
        <button 
            onClick={onRefresh}
            disabled={loading}
            className={`text-xs border px-2 py-1 transition-colors disabled:opacity-50
                ${isCyber 
                    ? 'border-cyber-orangeDim hover:bg-cyber-orange hover:text-black' 
                    : 'border-zinc-700 hover:bg-zinc-800 text-zinc-400'}`}
        >
            {loading ? "PROCESSING..." : "RE-ANALYZE"}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between space-y-4">
        {loading ? (
            <DecryptionLoader theme={theme as Theme} />
        ) : analysis ? (
          <>
            <div className="space-y-1">
              <span className="text-gray-500 text-xs uppercase">Analysis Protocol</span>
              <p className={`leading-relaxed border-l-2 pl-3 py-1 
                ${isCyber ? 'text-cyber-text border-cyber-orange' : 'text-zinc-300 border-zinc-600'}`}>
                {analysis.analysis}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className={`p-3 border 
                    ${isCyber ? 'bg-cyber-black/50 border-cyber-gray' : 'bg-zinc-900 border-zinc-800'}`}>
                    <span className="text-gray-500 text-xs block mb-1">SENTIMENT</span>
                    <GlitchText 
                        theme={theme}
                        text={analysis.sentiment} 
                        className={`font-bold text-xl ${
                            analysis.sentiment === 'BULLISH' ? 'text-green-500' : 
                            analysis.sentiment === 'BEARISH' ? 'text-red-500' : 'text-yellow-500'
                        }`} 
                    />
                </div>
                <div className={`p-3 border
                    ${isCyber ? 'bg-cyber-black/50 border-cyber-gray' : 'bg-zinc-900 border-zinc-800'}`}>
                    <span className="text-gray-500 text-xs block mb-1">CONFIDENCE</span>
                    <div className="flex items-center gap-2">
                        <Activity size={16} className={isCyber ? "text-cyber-orange" : "text-zinc-400"} />
                        <span className={`text-xl font-bold ${isCyber ? 'text-white' : 'text-zinc-200'}`}>
                            {analysis.confidence}%
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-auto">
                <div className={`flex items-center gap-2 mb-2 ${isCyber ? 'text-cyber-orangeDim' : 'text-zinc-500'}`}>
                    <AlertTriangle size={14} />
                    <span className="text-xs">TACTICAL RECOMMENDATION</span>
                </div>
                <div className={`w-full font-black text-center py-2 tracking-[0.5em] text-lg transition-colors cursor-default
                    ${isCyber 
                        ? 'bg-cyber-orange text-black hover:bg-white' 
                        : 'bg-zinc-100 text-black hover:bg-white'}`}>
                    {analysis.recommendation}
                </div>
            </div>
          </>
        ) : (
          <div className={`flex-1 flex flex-col items-center justify-center opacity-50 gap-2
            ${isCyber ? 'text-cyber-orangeDim' : 'text-zinc-600'}`}>
            <Terminal size={32} />
            <span>AWAITING INPUT STREAM...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiTerminal;