import React, { useEffect, useState } from 'react';
import { Theme } from '../types';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface Props {
  price: number;
  change: number;
  theme: Theme;
}

const LiveTicker: React.FC<Props> = ({ price, change, theme }) => {
  const [prevPrice, setPrevPrice] = useState(price);
  const [flash, setFlash] = useState<'UP' | 'DOWN' | null>(null);

  useEffect(() => {
    if (price > prevPrice) {
      setFlash('UP');
    } else if (price < prevPrice) {
      setFlash('DOWN');
    }
    setPrevPrice(price);

    const timer = setTimeout(() => setFlash(null), 1000);
    return () => clearTimeout(timer);
  }, [price, prevPrice]);

  const isCyber = theme === 'CYBER';
  const isUp = change >= 0;

  return (
    <div 
      className={`flex items-center gap-3 px-3 py-1 border-l-2 h-8 transition-all duration-300
        ${isCyber 
            ? 'border-cyber-orangeDim bg-cyber-dark/50' 
            : 'border-zinc-300 bg-zinc-100'}
        ${flash === 'UP' ? 'bg-green-500/20' : ''}
        ${flash === 'DOWN' ? 'bg-red-500/20' : ''}
      `}
    >
      <div className="flex items-center gap-2">
         <span className={`text-[10px] font-bold tracking-widest ${isCyber ? 'text-cyber-orangeDim' : 'text-zinc-500'}`}>
            LIVE
         </span>
         <div className={`w-1.5 h-1.5 rounded-full ${isCyber ? 'bg-red-500 animate-pulse' : 'bg-red-500'}`} />
      </div>

      <div className={`font-mono text-sm font-bold flex items-center gap-2 ${flash === 'UP' ? 'text-green-500' : flash === 'DOWN' ? 'text-red-500' : (isCyber ? 'text-white' : 'text-black')}`}>
        <span>${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      
      <div className={`text-xs font-mono flex items-center ${isUp ? 'text-green-500' : 'text-red-500'}`}>
         {isUp ? <TrendingUp size={12} className="mr-1"/> : <TrendingDown size={12} className="mr-1"/>}
         {Math.abs(change).toFixed(2)}%
      </div>
    </div>
  );
};

export default LiveTicker;