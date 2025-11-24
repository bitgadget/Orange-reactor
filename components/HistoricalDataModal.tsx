
import React, { useState } from 'react';
import { Theme, HistoricalData } from '../types';
import { X, Calendar, Search, Database, AlertTriangle } from 'lucide-react';
import { fetchHistoricalData } from '../services/cryptoService';
import CyberContainer from './CyberContainer';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
}

const HistoricalDataModal: React.FC<Props> = ({ isOpen, onClose, theme }) => {
  const [date, setDate] = useState<string>('');
  const [data, setData] = useState<HistoricalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCyber = theme === 'CYBER';

  const handleSearch = async () => {
    if (!date) return;
    setLoading(true);
    setError(null);
    setData(null);

    const result = await fetchHistoricalData(date);
    if (result) {
        setData(result);
    } else {
        setError("ARCHIVE_RETRIEVAL_FAILED: DATE_INVALID_OR_DATA_CORRUPTED");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className={`relative w-full max-w-lg animate-fade-in-up z-[210] shadow-2xl ${isCyber ? 'shadow-[0_0_50px_rgba(255,102,0,0.2)]' : ''}`}>
        <CyberContainer title="ARCHIVE_ACCESS" theme={theme} className="w-full">
            <div className="flex flex-col gap-6">
                
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h2 className={`text-xl font-display font-bold ${isCyber ? 'text-white' : 'text-black'}`}>
                            HISTORICAL_DATA_RETRIEVAL
                        </h2>
                        <p className="text-xs text-gray-500">QUERY_PROTOCOL: COINGECKO_ARCHIVES</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className={`p-1 border transition-colors ${
                            isCyber 
                                ? 'border-cyber-orangeDim text-cyber-orangeDim hover:text-cyber-orange hover:border-cyber-orange' 
                                : 'border-zinc-300 text-zinc-500 hover:text-black'
                        }`}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Search Input */}
                <div className="flex gap-2 items-end">
                    <div className="flex-1 space-y-1">
                        <label className={`text-[10px] tracking-widest font-bold ${isCyber ? 'text-cyber-orangeDim' : 'text-zinc-500'}`}>
                            TARGET_DATE
                        </label>
                        <div className={`flex items-center border px-3 py-2 ${
                            isCyber 
                                ? 'bg-cyber-black border-cyber-orangeDim focus-within:border-cyber-orange focus-within:shadow-[0_0_10px_rgba(255,102,0,0.3)]' 
                                : 'bg-white border-zinc-300'
                        }`}>
                            <Calendar size={16} className={`mr-2 ${isCyber ? 'text-cyber-orangeDim' : 'text-zinc-400'}`} />
                            <input 
                                type="date"
                                max={new Date().toISOString().split('T')[0]}
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className={`bg-transparent w-full outline-none font-mono text-sm ${isCyber ? 'text-white color-scheme-dark' : 'text-black'}`}
                                style={{colorScheme: isCyber ? 'dark' : 'light'}}
                            />
                        </div>
                    </div>
                    <button 
                        onClick={handleSearch}
                        disabled={loading || !date}
                        className={`h-[42px] px-4 border font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50
                            ${isCyber 
                                ? 'bg-cyber-orange text-black border-cyber-orange hover:bg-white' 
                                : 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-700'
                            }`}
                    >
                        {loading ? <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"/> : <Search size={18} />}
                        SEARCH
                    </button>
                </div>

                {/* Results Area */}
                <div className={`min-h-[200px] border flex flex-col items-center justify-center p-6 text-center relative overflow-hidden
                    ${isCyber ? 'bg-cyber-dark border-cyber-gray' : 'bg-zinc-50 border-zinc-200'}`}>
                    
                    {loading && (
                        <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
                            <div className={`font-mono text-sm animate-pulse ${isCyber ? 'text-cyber-orange' : 'text-zinc-500'}`}>
                                ACCESSING_NEURAL_ARCHIVE...
                            </div>
                        </div>
                    )}

                    {!data && !error && !loading && (
                        <div className={`opacity-40 flex flex-col items-center gap-2 ${isCyber ? 'text-cyber-orangeDim' : 'text-zinc-400'}`}>
                            <Database size={32} />
                            <span className="text-xs tracking-widest">AWAITING_QUERY_PARAMETERS</span>
                        </div>
                    )}

                    {error && (
                        <div className="text-red-500 flex flex-col items-center gap-2 animate-pulse">
                            <AlertTriangle size={32} />
                            <span className="font-bold">{error}</span>
                        </div>
                    )}

                    {data && (
                        <div className="w-full space-y-6 animate-fade-in-up">
                            <div className={`text-xs uppercase tracking-[0.3em] pb-2 border-b ${isCyber ? 'text-cyber-orange border-cyber-gray' : 'text-zinc-500 border-zinc-200'}`}>
                                DATA_SNAPSHOT: {data.date}
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <div className={`text-[10px] uppercase mb-1 ${isCyber ? 'text-gray-500' : 'text-zinc-400'}`}>Closing Price</div>
                                    <div className={`text-3xl font-display font-bold ${isCyber ? 'text-white' : 'text-zinc-900'}`}>
                                        ${data.price.toLocaleString()}
                                    </div>
                                </div>
                                
                                {/* High / Low Section */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`p-2 border ${isCyber ? 'border-green-900/50 bg-green-900/10' : 'border-green-200 bg-green-50'}`}>
                                        <div className={`text-[10px] uppercase mb-1 ${isCyber ? 'text-green-500' : 'text-green-700'}`}>Day High</div>
                                        <div className={`text-sm font-bold ${isCyber ? 'text-white' : 'text-zinc-900'}`}>
                                            {data.high ? `$${data.high.toLocaleString()}` : "N/A"}
                                        </div>
                                    </div>
                                    <div className={`p-2 border ${isCyber ? 'border-red-900/50 bg-red-900/10' : 'border-red-200 bg-red-50'}`}>
                                        <div className={`text-[10px] uppercase mb-1 ${isCyber ? 'text-red-500' : 'text-red-700'}`}>Day Low</div>
                                        <div className={`text-sm font-bold ${isCyber ? 'text-white' : 'text-zinc-900'}`}>
                                            {data.low ? `$${data.low.toLocaleString()}` : "N/A"}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                     <div>
                                        <div className={`text-[10px] uppercase mb-1 ${isCyber ? 'text-gray-500' : 'text-zinc-400'}`}>Market Cap</div>
                                        <div className={`text-lg font-mono ${isCyber ? 'text-cyber-orangeDim' : 'text-zinc-700'}`}>
                                            ${(data.market_cap / 1_000_000_000).toFixed(2)}B
                                        </div>
                                    </div>
                                    <div>
                                        <div className={`text-[10px] uppercase mb-1 ${isCyber ? 'text-gray-500' : 'text-zinc-400'}`}>Volume</div>
                                        <div className={`text-lg font-mono ${isCyber ? 'text-cyber-orangeDim' : 'text-zinc-700'}`}>
                                            ${(data.volume / 1_000_000_000).toFixed(2)}B
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </CyberContainer>
      </div>
    </div>
  );
};

export default HistoricalDataModal;