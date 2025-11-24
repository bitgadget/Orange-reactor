import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartPoint, Theme } from '../types';

interface Props {
  data: ChartPoint[];
  theme?: Theme;
}

const CustomTooltip = ({ active, payload, label, theme }: any) => {
  if (active && payload && payload.length) {
    const isCyber = theme === 'CYBER';
    return (
      <div 
        className={`p-2 text-xs font-mono border
            ${isCyber 
                ? 'bg-cyber-black border-cyber-orange shadow-[0_0_10px_rgba(255,102,0,0.4)]' 
                : 'bg-zinc-900 border-zinc-700'}`}
      >
        <p className={isCyber ? "text-cyber-text" : "text-zinc-300"}>{label}</p>
        <p className={`font-bold ${isCyber ? "text-cyber-orange" : "text-white"}`}>
          ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

const MarketChart: React.FC<Props> = ({ data, theme = 'CYBER' }) => {
  const color = theme === 'CYBER' ? '#ff6600' : '#e4e4e7'; // Orange vs Zinc-200
  const gridColor = theme === 'CYBER' ? '#1f1f2e' : '#27272a'; // Dark vs Zinc-800
  
  // Generate a key based on the latest data point to force re-render of the animation
  const animationKey = data.length > 0 ? `${data[data.length - 1].date}-${data[0].price}` : 'init';

  return (
    <div className="w-full h-full min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#666" 
            tick={{fontSize: 10, fill: '#666'}} 
            tickMargin={10}
            minTickGap={30}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            orientation="right" 
            stroke="#666"
            tick={{fontSize: 10, fill: '#666'}}
            tickFormatter={(value) => `$${value/1000}k`}
          />
          <Tooltip content={(props) => <CustomTooltip {...props} theme={theme} />} />
          <Area 
            key={animationKey}
            type="monotone" 
            dataKey="price" 
            stroke={color}
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            animationDuration={2000}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketChart;