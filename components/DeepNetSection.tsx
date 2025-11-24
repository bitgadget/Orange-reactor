
import React, { useState } from 'react';
import { NetworkStats, Theme, CoinData } from '../types';
import { Server, Shield, Zap, Database, Clock, Info, PieChart as PieChartIcon, Cpu, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

interface Props {
  stats: NetworkStats | null;
  coinData: CoinData | null;
  loading: boolean;
  theme: Theme;
}

const DeepNetSection: React.FC<Props> = ({ stats, coinData, loading, theme }) => {
  const isCyber = theme === 'CYBER';
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Helper for colors based on difficulty change
  const diffChange = stats?.difficultyChange || 0;
  const isDiffIncreasing = diffChange > 0;
  const diffColor = isDiffIncreasing ? (isCyber ? 'text-red-500' : 'text-red-600') : (isCyber ? 'text-green-500' : 'text-green-600');

  // --- MEMPOOL VISUALIZATION LOGIC ---
  const mempoolSizeMB = stats ? stats.mempool.vBytes / 1_000_000 : 0;
  const MEMPOOL_MAX_CAPACITY_MB = 100; // Defined capacity for visualization scaling
  
  // Define thresholds and styles
  let mempoolStatus = "FLOW_STABLE";
  let mempoolColorClass = isCyber ? "bg-cyan-500" : "bg-cyan-600";
  let mempoolTextClass = isCyber ? "text-cyan-500" : "text-cyan-600";
  let mempoolShadow = "shadow-[0_0_5px_cyan]";
  let mempoolBorderClass = isCyber ? "border-cyan-500/30" : "border-cyan-200";
  let mempoolBadgeGlow = isCyber ? "shadow-[0_0_10px_rgba(6,182,212,0.2)]" : "";

  if (mempoolSizeMB > 80) {
      mempoolStatus = "CRITICAL_SATURATION";
      mempoolColorClass = isCyber ? "bg-purple-500" : "bg-purple-600";
      mempoolTextClass = isCyber ? "text-purple-500" : "text-purple-600";
      mempoolShadow = "shadow-[0_0_10px_#a855f7]";
      mempoolBorderClass = isCyber ? "border-purple-500/50" : "border-purple-200";
      mempoolBadgeGlow = isCyber ? "shadow-[0_0_15px_rgba(168,85,247,0.4)]" : "";
  } else if (mempoolSizeMB > 30) {
      mempoolStatus = "CONGESTION_DETECTED";
      mempoolColorClass = isCyber ? "bg-red-500" : "bg-red-600";
      mempoolTextClass = isCyber ? "text-red-500" : "text-red-600";
      mempoolShadow = "shadow-[0_0_8px_red]";
      mempoolBorderClass = isCyber ? "border-red-500/50" : "border-red-200";
      mempoolBadgeGlow = isCyber ? "shadow-[0_0_12px_rgba(239,68,68,0.3)]" : "";
  } else if (mempoolSizeMB > 10) {
      mempoolStatus = "HIGH_TRAFFIC";
      mempoolColorClass = isCyber ? "bg-orange-500" : "bg-orange-600";
      mempoolTextClass = isCyber ? "text-orange-500" : "text-orange-600";
      mempoolShadow = "shadow-[0_0_5px_orange]";
      mempoolBorderClass = isCyber ? "border-orange-500/50" : "border-orange-200";
      mempoolBadgeGlow = isCyber ? "shadow-[0_0_10px_rgba(249,115,22,0.3)]" : "";
  }

  // Generate grid for visualization (24 blocks total representing the defined capacity)
  const totalBlocks = 24;
  const filledBlocks = Math.min(Math.ceil((mempoolSizeMB / MEMPOOL_MAX_CAPACITY_MB) * totalBlocks), totalBlocks);

  // Pool Colors (Cyberpunk Palette)
  const POOL_COLORS = [
    '#ff6600', // Cyber Orange
    '#00ffff', // Cyan
    '#ff00ff', // Magenta
    '#00ff00', // Matrix Green
    '#ffff00', // Yellow
    '#9d4edd', // Purple
    '#f72585', // Pink
    '#3a0ca3', // Deep Blue
  ];

  // Tooltip Component (Click-based)
  const Tooltip = ({ content }: { content: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative inline-block ml-1 z-50">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none cursor-pointer"
          >
              <Info 
                size={12} 
                className={`transition-colors ${
                    isOpen 
                    ? (isCyber ? 'text-cyber-orange' : 'text-zinc-900')
                    : (isCyber ? 'text-gray-600 hover:text-cyber-orange' : 'text-gray-400 hover:text-zinc-600')
                }`} 
              />
          </button>
          
          {isOpen && (
              <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 text-[10px] leading-relaxed border shadow-xl backdrop-blur-md rounded-sm animate-fade-in-up
                  ${isCyber 
                      ? 'bg-black/95 border-cyber-orange text-gray-300 shadow-[0_0_15px_rgba(255,102,0,0.2)]' 
                      : 'bg-white border-zinc-200 text-zinc-600 shadow-lg'}`}>
                  {content}
                  {/* Arrow */}
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent 
                      ${isCyber ? 'border-t-cyber-orange' : 'border-t-zinc-200'}`} />
              </div>
          )}
      </div>
    );
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-2 border backdrop-blur-md shadow-xl text-xs font-mono z-50
            ${isCyber ? 'bg-black/90 border-cyber-orange text-white shadow-[0_0_10px_rgba(255,102,0,0.3)]' : 'bg-white border-zinc-200 text-black'}`}>
          <div className="font-bold mb-1">{payload[0].name}</div>
          <div className="flex justify-between gap-4">
              <span className="text-gray-400">SHARE:</span>
              <span className={isCyber ? "text-cyber-orange" : "text-black"}>{payload[0].value.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between gap-4">
              <span className="text-gray-400">BLOCKS:</span>
              <span>{payload[0].payload.blockCount}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Helper to render performance cells
  const renderPerformanceCell = (label: string, pct: number | undefined) => {
      const val = pct || 0;
      const isPos = val >= 0;
      const currentPrice = coinData?.bitcoin.usd || 0;
      const absVal = Math.abs(currentPrice - (currentPrice / (1 + (val / 100))));
      
      return (
          <div className={`p-3 border flex flex-col justify-between h-24 transition-all duration-300 hover:scale-[1.05]
            ${isCyber ? 'bg-cyber-dark/40 border-gray-800 hover:border-cyber-orangeDim' : 'bg-zinc-100 border-zinc-300'}`}>
             <div className="flex justify-between items-start mb-2">
                 <span className="text-[9px] font-bold tracking-widest text-gray-500">{label}</span>
                 {isPos ? <TrendingUp size={12} className="text-green-500" /> : <TrendingDown size={12} className="text-red-500" />}
             </div>
             <div className={`text-lg font-bold font-mono ${isPos ? 'text-green-500' : 'text-red-500'}`}>
                 {isPos ? '+' : ''}{val.toFixed(2)}%
             </div>
             <div className={`text-[10px] font-mono ${isCyber ? 'text-gray-400' : 'text-zinc-600'}`}>
                 {isPos ? '+' : '-'}${absVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
             </div>
          </div>
      )
  };

  return (
    <div className={`relative w-full mt-6 rounded-xl border-t-2 transition-all duration-500 group
        ${isCyber ? 'border-cyber-orangeDim bg-black' : 'border-zinc-800 bg-zinc-950'}`}>
      
      {/* Heavy Cyber Overlay */}
      {isCyber && (
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none" />
      )}

      <div className="relative z-10 p-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 pb-4 border-b border-dashed border-gray-800">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-none border-2 ${isCyber ? 'bg-cyber-dark border-cyber-orange text-cyber-orange shadow-[0_0_10px_rgba(255,102,0,0.3)]' : 'bg-zinc-900 border-zinc-700 text-zinc-300'}`}>
                    <Server size={28} className={loading ? "animate-pulse" : ""} />
                </div>
                <div>
                    <h2 className={`text-2xl font-display font-black tracking-tighter uppercase ${isCyber ? 'text-white' : 'text-zinc-100'}`}>
                        DEEP_NET // <span className={isCyber ? "text-cyber-orange" : "text-zinc-500"}>INFRASTRUCTURE</span>
                    </h2>
                    <div className="flex items-center gap-4 text-[10px] font-mono mt-1">
                        <span className={`flex items-center gap-1 ${isCyber ? 'text-green-500' : 'text-green-600'}`}>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> NODES_ACTIVE
                        </span>
                        <span className={isCyber ? 'text-cyber-orangeDim' : 'text-zinc-500'}>
                            MEMPOOL_STREAM :: LIVE
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Halving Countdown Mini-Block */}
            <div className={`mt-4 md:mt-0 text-right ${isCyber ? 'text-cyber-text' : 'text-zinc-400'}`}>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">NEXT HALVING EVENT</div>
                
                {/* Segmented Progress Bar */}
                <div className="flex items-center justify-end gap-[2px]">
                    {Array.from({length: 20}).map((_, i) => {
                        const progress = stats?.halving.progress || 0;
                        const threshold = (i + 1) * 5; // 5%, 10%, ... 100%
                        const isFilled = progress >= threshold;
                        // Calculate "current" segment (the one currently filling)
                        const isCurrent = progress < threshold && progress >= (threshold - 5);
                        
                        return (
                            <div 
                                key={i}
                                className={`w-1.5 h-3 rounded-[1px] transition-all duration-300
                                    ${isFilled 
                                        ? (isCyber ? 'bg-cyan-500 shadow-[0_0_8px_cyan]' : 'bg-zinc-600') 
                                        : (isCyber ? 'bg-gray-900' : 'bg-zinc-200')}
                                    ${isCurrent && isCyber ? 'animate-pulse bg-cyan-500/40' : ''}
                                `}
                            />
                        )
                    })}
                </div>

                <div className="font-mono text-xl font-bold flex items-center justify-end gap-2 mt-1">
                    <Clock size={16} className={isCyber ? "text-cyan-500" : "text-zinc-500"} />
                    {stats ? stats.halving.blocksToGo.toLocaleString() : "---"} <span className="text-xs self-center text-gray-500">BLOCKS</span>
                </div>
                <div className={`text-[9px] font-mono tracking-wider ${isCyber ? 'text-cyan-500/70' : 'text-zinc-400'}`}>
                    PROGRESS: {stats?.halving.progress.toFixed(2)}%
                </div>
            </div>
        </div>

        {/* --- NEW SECTION: MARKET PERFORMANCE VECTORS --- */}
        <div className="mb-6">
            <div className={`text-[10px] font-bold mb-2 uppercase tracking-widest flex items-center gap-2 ${isCyber ? 'text-cyber-text' : 'text-zinc-500'}`}>
                <Activity size={12} /> MARKET_PERFORMANCE_VECTORS
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {renderPerformanceCell("1H DELTA", coinData?.bitcoin.change_1h)}
                {renderPerformanceCell("24H DELTA", coinData?.bitcoin.change_24h)}
                {renderPerformanceCell("7D DELTA", coinData?.bitcoin.change_7d)}
                {renderPerformanceCell("30D DELTA", coinData?.bitcoin.change_30d)}
                {renderPerformanceCell("60D DELTA", coinData?.bitcoin.change_60d)}
                {renderPerformanceCell("1Y DELTA", coinData?.bitcoin.change_1y)}
            </div>
        </div>


        {/* Dense Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            
            {/* 1. DIFFICULTY MODULE */}
            <div className={`p-4 border border-l-4 ${isCyber ? 'bg-cyber-dark/50 border-cyber-gray border-l-cyber-orange' : 'bg-zinc-900 border-zinc-800 border-l-zinc-500'}`}>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        {/* UPDATED LABEL to reflect this is the TOTAL difficulty, not just the adjustment */}
                        <span className="text-[10px] font-bold tracking-widest text-gray-500">NETWORK_DIFFICULTY</span>
                        <Tooltip content="Mining difficulty adjusts every 2016 blocks (~2 weeks) to ensure blocks are mined every 10 minutes." />
                    </div>
                    <Shield size={16} className="text-gray-600" />
                </div>
                <div className={`text-2xl font-bold font-display ${isCyber ? 'text-white' : 'text-zinc-200'}`}>
                    {stats ? `${stats.difficulty.toFixed(2)}T` : "---"}
                </div>
                
                {/* Adjustment Prediction */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-gray-500">FORECAST ({stats?.nextRetarget} BLOCKS)</span>
                        <span className={`text-xs font-bold ${diffColor}`}>
                            {diffChange > 0 ? '+' : ''}{diffChange.toFixed(2)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden flex">
                        <div className="w-1/2 bg-transparent border-r border-gray-700 h-full relative">
                             {/* Center marker */}
                        </div>
                        {/* This visualization assumes center is 0 change. Simplified for visual effect */}
                        <div 
                            className={`h-full ${diffChange > 0 ? 'bg-red-500' : 'bg-green-500'}`} 
                            style={{ 
                                width: `${Math.min(Math.abs(diffChange) * 10, 50)}%`, // Scale for visibility
                                marginLeft: diffChange > 0 ? '50%' : 'auto',
                                marginRight: diffChange < 0 ? '50%' : 'auto'
                            }} 
                        />
                    </div>
                </div>
            </div>

            {/* 2. HASHRATE MODULE */}
            <div className={`p-4 border border-l-4 ${isCyber ? 'bg-cyber-dark/50 border-cyber-gray border-l-cyber-orangeDim' : 'bg-zinc-900 border-zinc-800 border-l-zinc-500'}`}>
                 <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold tracking-widest text-gray-500">GLOBAL_HASHRATE</span>
                        <Tooltip content="Estimated total computational power securing the Bitcoin network. Higher values indicate stronger security." />
                    </div>
                    <Cpu size={16} className="text-gray-600" />
                </div>
                <div className={`text-2xl font-bold font-display ${isCyber ? 'text-white' : 'text-zinc-200'}`}>
                     {stats ? stats.hashrate.toFixed(1) : "---"} <span className="text-sm font-normal text-gray-500">EH/s</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="text-[10px] text-gray-500 mb-1">COMPUTATIONAL POWER</div>
                    {/* Visual noise bar */}
                    <div className="flex gap-0.5 h-2">
                         {Array.from({length: 20}).map((_, i) => (
                             <div 
                                key={i} 
                                className={`flex-1 ${Math.random() > 0.3 ? (isCyber ? 'bg-cyber-orange/40' : 'bg-zinc-600') : 'bg-transparent'}`} 
                             />
                         ))}
                    </div>
                </div>
            </div>

            {/* 3. MEMPOOL MODULE - ENHANCED VISUALIZATION */}
            <div className={`p-4 border border-l-4 ${isCyber ? `bg-cyber-dark/50 border-cyber-gray border-l-${mempoolColorClass.replace('bg-', '')}` : 'bg-zinc-900 border-zinc-800 border-l-zinc-500'}`}>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold tracking-widest text-gray-500">MEMPOOL_FLUX</span>
                        <Tooltip content="The queue of waiting transactions. High flux/size indicates network congestion and potentially rising fees." />
                    </div>
                    <Database size={16} className={mempoolTextClass} />
                </div>
                 <div className={`text-2xl font-bold font-display ${isCyber ? 'text-white' : 'text-zinc-200'}`}>
                     {stats ? stats.mempool.count.toLocaleString() : "---"} <span className="text-sm font-normal text-gray-500">TXs</span>
                </div>
                
                {/* Data Block Matrix */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="flex justify-between text-[10px] mb-2 font-mono items-center">
                        <span className={`px-2 py-0.5 rounded border transition-all duration-500 ${mempoolTextClass} ${mempoolBorderClass} ${mempoolBadgeGlow} ${isCyber ? 'bg-black' : 'bg-zinc-100'}`}>
                            {mempoolStatus}
                        </span>
                        <span className="text-gray-500">{mempoolSizeMB.toFixed(1)} / {MEMPOOL_MAX_CAPACITY_MB} MB</span>
                    </div>
                    
                    <div className="grid grid-cols-12 gap-1 h-8">
                        {Array.from({ length: totalBlocks }).map((_, i) => {
                            const isActive = i < filledBlocks;
                            // Random slight opacity fluctuation for active blocks to simulate shimmering data
                            const randomDelay = Math.random() * 2 + 's';
                            
                            return (
                                <div 
                                    key={i}
                                    className={`rounded-sm transition-all duration-300 relative overflow-hidden
                                        ${isActive ? mempoolColorClass : 'bg-gray-800'}
                                        ${isActive && isCyber ? mempoolShadow : ''}
                                    `}
                                >
                                    {isActive && (
                                        <div 
                                            className="absolute inset-0 bg-white/30 animate-pulse"
                                            style={{ animationDuration: '1.5s', animationDelay: randomDelay }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 4. FEES MODULE */}
            <div className={`p-4 border border-l-4 ${isCyber ? 'bg-cyber-dark/50 border-cyber-gray border-l-yellow-600' : 'bg-zinc-900 border-zinc-800 border-l-zinc-500'}`}>
                 <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold tracking-widest text-gray-500">BLOCK_REWARD / FEES</span>
                        <Tooltip content="Current cost (sat/vB) to prioritize a transaction in the next block. Rises when block space is scarce." />
                    </div>
                    <Zap size={16} className="text-gray-600" />
                </div>
                 <div className="flex items-baseline gap-2">
                     <span className={`text-2xl font-bold font-display ${isCyber ? 'text-yellow-500' : 'text-zinc-800 dark:text-zinc-200'}`}>
                        {stats ? stats.fees.fast : "-"}
                     </span>
                     <span className="text-xs text-gray-500">sat/vB</span>
                </div>
                
                 <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-2 gap-2 text-center">
                    <div className="bg-gray-900/50 p-1 rounded">
                        <div className="text-[9px] text-gray-500">LOW PRIO</div>
                        <div className="font-mono text-xs">{stats ? Math.floor(stats.fees.hour) : '-'}</div>
                    </div>
                    <div className="bg-gray-900/50 p-1 rounded">
                        <div className="text-[9px] text-gray-500">BLOCK TIP</div>
                        <div className="font-mono text-xs">{stats ? stats.height : '-'}</div>
                    </div>
                </div>
            </div>

        </div>

        {/* 5. MINING POOL DISTRIBUTION - CAKE CHART (ANIMATED) */}
        <div className={`w-full p-4 border border-l-4 mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6 relative overflow-hidden
             ${isCyber ? 'bg-cyber-dark/50 border-cyber-gray border-l-purple-500' : 'bg-zinc-900 border-zinc-800 border-l-zinc-500'}`}>
             
             {/* Background Tech Glow */}
             {isCyber && (
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/10 blur-3xl rounded-full pointer-events-none animate-pulse" />
             )}

             {/* Chart Side */}
             <div className="h-64 relative flex items-center justify-center">
                 <div className="absolute top-0 left-0 text-[10px] font-bold tracking-widest text-gray-500 flex items-center gap-2 z-10">
                    HASHRATE_DISTRIBUTION (3D) <PieChartIcon size={12}/>
                 </div>

                 {/* Animated Rotating Rings */}
                 {isCyber && (
                    <>
                        {/* Outer Ring */}
                        <div className="absolute w-[200px] h-[200px] border border-purple-500/20 rounded-full animate-[spin_12s_linear_infinite]" />
                        {/* Inner Dashed Ring */}
                        <div className="absolute w-[180px] h-[180px] border border-dashed border-purple-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                        {/* Core Pulse */}
                        <div className="absolute w-[100px] h-[100px] bg-purple-500/5 rounded-full animate-pulse" />
                    </>
                 )}

                 <ResponsiveContainer width="100%" height="100%" className="relative z-10">
                    <PieChart>
                        <Pie
                            data={(stats?.pools || []) as any[]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="share"
                            stroke="none"
                            isAnimationActive={true}
                            animationBegin={0}
                            animationDuration={1500}
                            animationEasing="ease-out"
                        >
                            {stats?.pools.map((entry, index) => {
                                const isActive = activeIndex === index;
                                return (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={POOL_COLORS[index % POOL_COLORS.length]} 
                                        fillOpacity={activeIndex === null || isActive ? 1 : 0.3}
                                        className="outline-none stroke-none transition-all duration-300"
                                    />
                                );
                            })}
                        </Pie>
                        <RechartsTooltip content={<CustomPieTooltip />} />
                    </PieChart>
                 </ResponsiveContainer>
                 
                 {/* Center Content for Donut */}
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
                     <span className={`text-2xl font-bold ${isCyber ? 'text-white' : 'text-zinc-200'}`}>
                         {stats?.pools.length || 0}
                     </span>
                     <span className="text-[8px] text-gray-500 tracking-widest">ACTIVE POOLS</span>
                 </div>
             </div>

             {/* Legend / List Side */}
             <div className="flex flex-col justify-center">
                 <div className={`text-xs font-bold mb-4 uppercase tracking-widest border-b pb-2 ${isCyber ? 'text-white border-gray-800' : 'text-zinc-800 border-zinc-200'}`}>
                     DOMINANT_MINING_ENTITIES
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                     {stats?.pools.slice(0, 8).map((pool, index) => {
                         const color = POOL_COLORS[index % POOL_COLORS.length];
                         return (
                             <div 
                                key={index} 
                                onMouseEnter={() => setActiveIndex(index)}
                                onMouseLeave={() => setActiveIndex(null)}
                                className={`flex flex-col text-xs group transition-transform duration-200 hover:translate-x-1 cursor-default p-1 rounded
                                    ${isCyber ? 'hover:bg-gray-900/50' : ''}`}
                             >
                                 <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <div 
                                            className="w-2 h-2 rounded-sm shadow-[0_0_5px_currentColor]" 
                                            style={{ backgroundColor: color, color: color }}
                                        />
                                        <span className={`${isCyber ? 'text-gray-300 group-hover:text-white' : 'text-zinc-600'} transition-colors font-bold`}>
                                            {pool.name}
                                        </span>
                                    </div>
                                    <div className="font-mono opacity-70 group-hover:opacity-100 group-hover:text-purple-400 transition-colors">
                                        {pool.share.toFixed(1)}%
                                    </div>
                                 </div>
                                 
                                 {/* Mini Data Bar */}
                                 <div className={`w-full h-0.5 rounded-full overflow-hidden ${isCyber ? 'bg-gray-800' : 'bg-zinc-200'}`}>
                                     <div 
                                        className={`h-full transition-all duration-1000 ease-out group-hover:brightness-125`}
                                        style={{ 
                                            width: `${pool.share}%`, 
                                            backgroundColor: color,
                                            boxShadow: isCyber ? `0 0 5px ${color}` : 'none'
                                        }} 
                                     />
                                 </div>
                             </div>
                         )
                     })}
                 </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default DeepNetSection;
