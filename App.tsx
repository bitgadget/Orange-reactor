
import React, { useState, useEffect, useCallback } from 'react';
import LoadingScreen from './components/LoadingScreen';
import CyberContainer from './components/CyberContainer';
import MarketChart from './components/MarketChart';
import AiTerminal from './components/AiTerminal';
import HistoricalDataModal from './components/HistoricalDataModal';
import CyberParticles from './components/CyberParticles';
import GlitchTitle from './components/GlitchTitle';
import CyberPlayer from './components/CyberPlayer';
import DeepNetSection from './components/DeepNetSection';
import { Bitcoin, Globe, Database, Zap, TrendingUp, TrendingDown, Sun, Moon, Atom, RefreshCw, Archive, Clock } from 'lucide-react';
import { fetchBitcoinData, fetchBitcoinChart, fetchCoinGeckoStats, fetchNetworkStats } from './services/cryptoService';
import { analyzeMarket } from './services/geminiService';
import { CoinData, ChartPoint, MarketAnalysis, TimeFrame, Theme, NetworkStats } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<'BOOT' | 'RUNNING'>('BOOT');
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [timeframe, setTimeframe] = useState<TimeFrame>('24H');
  const [theme, setTheme] = useState<Theme>('CYBER');
  const [showHistory, setShowHistory] = useState(false);

  const fetchData = useCallback(async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true);
    try {
      const [krakenData, geckoStats, chart, netStats] = await Promise.all([
        fetchBitcoinData(),
        fetchCoinGeckoStats(),
        fetchBitcoinChart(timeframe),
        fetchNetworkStats()
      ]);

      const mergedData: CoinData = {
        bitcoin: {
            ...krakenData.bitcoin,
            ...geckoStats,
            usd_market_cap: geckoStats?.usd_market_cap || krakenData.bitcoin.usd_market_cap,
            usd_24h_vol: geckoStats?.usd_24h_vol || krakenData.bitcoin.usd_24h_vol
        }
      };

      setCoinData(mergedData);
      setChartData(chart);
      setNetworkStats(netStats);
      setLastUpdated(new Date());
      
      if (showLoading) await new Promise(resolve => setTimeout(resolve, 600));

      // Return for immediate analysis usage
      return { data: mergedData, chart };
    } catch (e) {
      console.error(e);
      return null;
    } finally {
        if (showLoading) setIsRefreshing(false);
    }
  }, [timeframe]);

  const runAnalysis = useCallback(async (data: CoinData, chart: ChartPoint[]) => {
    setLoadingAnalysis(true);
    // Pass the selected timeframe to give context to the AI (e.g. "Analyze the last 7 days")
    const result = await analyzeMarket(data, chart, timeframe);
    setAnalysis(result);
    setLoadingAnalysis(false);
  }, [timeframe]);

  // Initial Fetch and Main Loop (60s)
  useEffect(() => {
    if (appState === 'RUNNING') {
      fetchData(false).then((result) => {
        if (result) runAnalysis(result.data, result.chart);
      });
      const interval = setInterval(() => {
          fetchData(false).then((result) => {
            if (result) runAnalysis(result.data, result.chart);
          });
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [appState, fetchData, runAnalysis]);

  // High Frequency Price Polling (5s)
  useEffect(() => {
    if (appState === 'RUNNING') {
        const interval = setInterval(async () => {
            try {
                // Fetch only lightweight ticker data
                const krakenData = await fetchBitcoinData();
                setCoinData(prev => {
                    if (!prev) return null; // Don't update if not initialized
                    return {
                        bitcoin: {
                            ...prev.bitcoin, // Keep existing full data (including gecko stats)
                            usd: krakenData.bitcoin.usd, // Update live price
                            usd_24h_change: krakenData.bitcoin.usd_24h_change // Update live change
                        }
                    };
                });
            } catch (e) {
                console.warn("Ticker update failed", e);
            }
        }, 5000);
        return () => clearInterval(interval);
    }
  }, [appState]);

  const handleRefresh = async () => {
      const result = await fetchData(true);
      if(result) await runAnalysis(result.data, result.chart);
  }

  const handleTimeframeChange = (tf: TimeFrame) => {
      setTimeframe(tf);
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'CYBER' ? 'MINIMAL' : 'CYBER');
  }

  const isCyber = theme === 'CYBER';

  if (appState === 'BOOT') {
    return <LoadingScreen onComplete={() => setAppState('RUNNING')} />;
  }

  return (
    <div className={`min-h-screen flex flex-col font-mono relative transition-colors duration-500 overflow-x-hidden
      ${isCyber 
        ? 'bg-cyber-black text-cyber-text selection:bg-cyber-orange selection:text-black' 
        : 'bg-zinc-950 text-zinc-300 selection:bg-zinc-500 selection:text-white'}`}>
      
      {/* Background Particles */}
      {isCyber && <CyberParticles />}

      {/* Modal */}
      <HistoricalDataModal isOpen={showHistory} onClose={() => setShowHistory(false)} theme={theme} />

      {/* Background Effects */}
      {isCyber && (
        <div className="perspective-container">
            <div className="cyber-grid perspective-grid opacity-20"></div>
        </div>
      )}

      {isCyber && (
        <>
            <div className="noise-overlay" />
            <div className="fixed inset-0 crt-overlay z-[100] pointer-events-none" />
            <div className="fixed inset-0 z-[90] pointer-events-none opacity-[0.03] bg-gradient-to-b from-transparent via-white to-transparent h-[10px] w-full animate-scanline" />
        </>
      )}

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8 relative z-10 h-full">
        
        {/* Header - Optimized Layout */}
        <header className={`flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-6 pb-4 border-b animate-fade-in-up
            ${isCyber ? 'border-cyber-orange/30' : 'border-zinc-800'}`}>
            
            {/* Left Side: Branding */}
            <div className="flex-1 min-w-0 w-full lg:w-auto">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                     <div className="flex items-center gap-3">
                        <Atom size={48} className={`${isCyber ? "text-cyber-orange animate-[spin_10s_linear_infinite]" : "text-zinc-500"}`} />
                        <GlitchTitle text="ORANGE_REACTOR" theme={theme} />
                     </div>
                </div>

                <div className={`flex flex-wrap items-center gap-4 text-xs ${isCyber ? 'text-cyber-orangeDim' : 'text-zinc-500'} mt-3`}>
                    <span className="flex items-center gap-1 animate-[breathe_4s_infinite]"><Globe size={12}/> ONLINE</span>
                    <span className="flex items-center gap-1"><Database size={12}/> SYNCED</span>
                    <span className="flex items-center gap-1"><Zap size={12}/> {isRefreshing ? "UPDATING" : "LIVE"}</span>
                    {coinData?.bitcoin.rank && (
                        <span className={`px-1 font-bold ${isCyber ? 'bg-cyber-orange text-black' : 'bg-zinc-200 text-black'}`}>
                            RANK #{coinData.bitcoin.rank}
                        </span>
                    )}
                </div>
            </div>
            
            {/* Right Side: Widgets & Controls */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full lg:w-auto">
                 
                 {/* Music Player Widget */}
                 <div className="w-full md:w-auto">
                    <CyberPlayer theme={theme} />
                 </div>

                 {/* Controls Group */}
                 <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                    <button 
                        onClick={toggleTheme}
                        className={`flex items-center justify-center gap-2 text-xs border px-3 py-2 h-10 transition-all flex-1 md:flex-none whitespace-nowrap
                            ${isCyber 
                                ? 'border-cyber-orange text-cyber-orange hover:bg-cyber-orange hover:text-black' 
                                : 'border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500'}`}
                    >
                        {isCyber ? <Sun size={14} /> : <Moon size={14} />}
                        {isCyber ? 'REACTOR_MODE' : 'SAFE_MODE'}
                    </button>

                    <div className="text-right hidden sm:block whitespace-nowrap">
                        <div className="text-[10px] text-gray-500 mb-0.5">LAST_IGNITION</div>
                        <div className={`font-bold font-mono text-base leading-none ${isCyber ? 'text-cyber-orange' : 'text-zinc-200'}`}>
                            {lastUpdated.toLocaleTimeString()}
                        </div>
                    </div>
                </div>
            </div>
        </header>

        {/* Adaptive Dashboard Grid */}
        <main className="flex-1 flex flex-col gap-6">
            
            {/* Top Section: Metrics, Chart, AI */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[600px] md:min-h-[70vh]">
                
                {/* Left Column: Metrics */}
                <div className="md:col-span-4 flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    
                    {/* Core Valuation */}
                    <CyberContainer 
                        title="CORE_VALUATION" 
                        theme={theme} 
                        loading={isRefreshing}
                        className="flex-[2] transform hover:scale-[1.02] transition-transform duration-300"
                    >
                        <div className="h-full flex flex-col justify-center items-center text-center py-6">
                            <div className={`flex items-center gap-3 mb-2 ${isCyber ? 'text-cyber-orangeDim' : 'text-zinc-500'}`}>
                                <Bitcoin className={isCyber ? "animate-pulse" : ""} size={20} />
                                <span className="text-sm tracking-widest">BITCOIN / USD</span>
                            </div>
                            <div className={`text-5xl lg:text-7xl font-display font-bold mb-4 tracking-tighter 
                                ${isCyber 
                                    ? 'text-white shadow-orange-500 drop-shadow-[0_0_15px_rgba(255,102,0,0.5)]' 
                                    : 'text-zinc-100'}`}>
                                {coinData ? `$${coinData.bitcoin.usd.toLocaleString()}` : "LOADING"}
                            </div>
                            <div className={`text-xl font-bold flex items-center gap-2 bg-opacity-10 px-3 py-1 rounded
                                ${coinData && coinData.bitcoin.usd_24h_change >= 0 
                                    ? 'text-green-500 bg-green-500/10' 
                                    : 'text-red-500 bg-red-500/10'}`}>
                                {coinData ? (
                                    <>
                                        {coinData.bitcoin.usd_24h_change >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                        {coinData.bitcoin.usd_24h_change.toFixed(2)}%
                                    </>
                                ) : "--"}
                            </div>
                        </div>
                    </CyberContainer>

                    {/* Secondary Stats Grid */}
                    <div className="flex-[1.5] grid grid-cols-2 gap-4">
                         <CyberContainer title="MKT_CAP" theme={theme} loading={isRefreshing} className="hover:scale-[1.02]">
                            <div className="h-full flex flex-col justify-center items-center">
                                <span className={`text-lg lg:text-2xl font-bold ${isCyber ? 'text-white' : 'text-zinc-200'}`}>
                                    {coinData ? `$${(coinData.bitcoin.usd_market_cap / 1_000_000_000).toFixed(1)}B` : "---"}
                                </span>
                            </div>
                        </CyberContainer>
                         <CyberContainer title="VOLUME_24H" theme={theme} loading={isRefreshing} className="hover:scale-[1.02]">
                            <div className="h-full flex flex-col justify-center items-center">
                                <span className={`text-lg lg:text-2xl font-bold ${isCyber ? 'text-white' : 'text-zinc-200'}`}>
                                    {coinData ? `$${(coinData.bitcoin.usd_24h_vol / 1_000_000_000).toFixed(1)}B` : "---"}
                                </span>
                            </div>
                        </CyberContainer>
                         <CyberContainer title="DAY_HIGH" theme={theme} loading={isRefreshing} className="hover:scale-[1.02]">
                            <div className="h-full flex flex-col justify-center items-center text-green-500 font-bold text-2xl lg:text-4xl tracking-tighter">
                                {coinData ? `$${coinData.bitcoin.high_24h?.toLocaleString()}` : "---"}
                            </div>
                        </CyberContainer>
                         <CyberContainer title="DAY_LOW" theme={theme} loading={isRefreshing} className="hover:scale-[1.02]">
                            <div className="h-full flex flex-col justify-center items-center text-red-500 font-bold text-2xl lg:text-4xl tracking-tighter">
                                 {coinData ? `$${coinData.bitcoin.low_24h?.toLocaleString()}` : "---"}
                            </div>
                        </CyberContainer>
                    </div>

                    {/* Supply Bar */}
                    <CyberContainer title="SUPPLY_DYNAMICS" theme={theme} loading={isRefreshing} className="flex-1 min-h-[120px] hover:scale-[1.02]">
                        <div className="h-full flex flex-col justify-center">
                             <div className="flex justify-between items-end mb-2">
                                 <div className="text-xs text-gray-500">CIRCULATING</div>
                                 <div className={`font-bold ${isCyber ? 'text-white' : 'text-zinc-200'}`}>
                                    {coinData ? `${(coinData.bitcoin.circulating_supply! / 1_000_000).toFixed(2)}M` : "--"}
                                 </div>
                             </div>
                             <div className={`w-full h-2 mb-4 ${isCyber ? 'bg-cyber-gray' : 'bg-zinc-800'}`}>
                                <div 
                                    className={`h-full relative ${isCyber ? 'bg-cyber-orange shadow-[0_0_10px_#ff6600]' : 'bg-zinc-500'}`} 
                                    style={{ width: coinData ? `${(coinData.bitcoin.circulating_supply! / 21000000) * 100}%` : '0%' }} 
                                >
                                    <div className={`absolute right-0 -top-1 w-1 h-4 ${isCyber ? 'bg-white' : 'bg-black'}`} />
                                </div>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-500 tracking-wider">
                                <span>MINED: {coinData ? ((coinData.bitcoin.circulating_supply! / 21000000) * 100).toFixed(1) : 0}%</span>
                                <span>MAX: 21M</span>
                            </div>
                        </div>
                    </CyberContainer>

                    {/* Buttons */}
                    <div className="h-16 flex gap-4">
                         <button 
                            onClick={() => setShowHistory(true)}
                            className={`flex-1 border font-bold tracking-[0.1em] transition-all duration-300 flex items-center justify-center gap-2 group
                                ${isCyber 
                                    ? 'bg-cyber-dark border-cyber-orangeDim text-cyber-orangeDim hover:bg-cyber-orangeDim hover:text-black' 
                                    : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white'}`}
                        >
                            <Archive size={18} />
                            ARCHIVES
                        </button>
                        <button 
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className={`flex-[1.5] border font-bold tracking-[0.1em] transition-all duration-300 flex items-center justify-center gap-2 group
                                ${isCyber 
                                    ? 'bg-cyber-dark border-cyber-orange text-cyber-orange hover:bg-cyber-orange hover:text-black hover:animate-pulse-glow disabled:opacity-50' 
                                    : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-50'}`}
                        >
                            <RefreshCw size={18} className={`transition-transform duration-700 ${isRefreshing ? "animate-spin" : "group-hover:rotate-180"}`} />
                            {isRefreshing ? "SYNCING..." : "FORCE_REFRESH"}
                        </button>
                    </div>
                </div>

                {/* Middle Column: Chart */}
                <div className="md:col-span-5 flex flex-col h-full animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <CyberContainer 
                        title="MARKET_DEPTH_VISUALIZER" 
                        theme={theme} 
                        loading={isRefreshing}
                        className="flex-1 h-full min-h-[450px]"
                    >
                        <div className="w-full flex justify-end gap-2 mb-2 z-10 relative">
                          {(['24H', '7D', '30D'] as TimeFrame[]).map((tf) => (
                            <button
                              key={tf}
                              onClick={() => handleTimeframeChange(tf)}
                              className={`text-[10px] px-2 py-1 border font-bold transition-all ${
                                isCyber
                                    ? timeframe === tf 
                                        ? 'bg-cyber-orange text-black border-cyber-orange' 
                                        : 'text-cyber-orange border-cyber-orangeDim hover:bg-cyber-orange/20'
                                    : timeframe === tf
                                        ? 'bg-zinc-200 text-black border-zinc-200'
                                        : 'text-zinc-500 border-zinc-700 hover:bg-zinc-800'
                              }`}
                            >
                              {tf}
                            </button>
                          ))}
                        </div>
                        <div className="flex-1 w-full min-h-0">
                            <MarketChart data={chartData} theme={theme} />
                        </div>
                    </CyberContainer>
                </div>

                {/* Right Column: AI */}
                <div className="md:col-span-3 flex flex-col h-full animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <CyberContainer title="AI_SENTIMENT_ENGINE" theme={theme} className="flex-1 h-full min-h-[450px]">
                        <AiTerminal 
                            analysis={analysis} 
                            loading={loadingAnalysis} 
                            onRefresh={() => coinData && runAnalysis(coinData, chartData)}
                            theme={theme}
                        />
                    </CyberContainer>
                </div>
            </div>

            {/* Bottom Section: Deep Net / Mining Stats - NOW INCLUDES TEMPORAL MATRIX INSIDE */}
            <div className="w-full animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <DeepNetSection stats={networkStats} coinData={coinData} loading={isRefreshing} theme={theme} />
            </div>

        </main>
        
        {/* Footer */}
        <footer className={`mt-8 border-t pt-4 text-center text-[10px] uppercase tracking-widest opacity-60
            ${isCyber ? 'border-cyber-gray text-cyber-text' : 'border-zinc-800 text-zinc-500'}`}>
             <p>SYSTEM: ORANGE REACTOR v3.0 // CONNECTED: KRAKEN (PRICE) + COINGECKO (META) + MEMPOOL (MINING)</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
